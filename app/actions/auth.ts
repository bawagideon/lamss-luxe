'use server';

import { unstable_noStore as noStore } from 'next/cache';
import { createClient as createSupabaseAdmin } from '@supabase/supabase-js';
import { Resend } from 'resend';

const getAdminSupabase = () => createSupabaseAdmin(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: { persistSession: false }
  }
);

// Emergency Whitelist of administrator/developer emails for robust recovery
const EMERGENCY_WHITELIST = [
  "lamsseluxe@gmail.com",
  "anifowosheolamidee@gmail.com",
  "bawagideon98@gmail.com",
  "olayemmenzo@gmail.com"
];

/**
 * Initiates the passwordless magic link authentication flow.
 * Checks the requested email against a master whitelist and the staff database table.
 */
export async function requestAdminMagicLink(email: string) {
  noStore();

  const cleanEmail = email.toLowerCase().trim();

  // 1. Verify email against emergency whitelist or admin_staff table
  const isWhitelisted = EMERGENCY_WHITELIST.includes(cleanEmail);
  let staffName = "Admin";

  if (!isWhitelisted) {
    const supabase = getAdminSupabase();
    const { data: staff, error } = await supabase
      .from('admin_staff')
      .select('name')
      .eq('email', cleanEmail)
      .single();

    if (error || !staff) {
      return { error: "Access Denied: Email is not authorized for administrative access." };
    }
    staffName = staff.name;
  } else {
    // If whitelisted, attempt to find name in DB, fallback to Admin
    const supabase = getAdminSupabase();
    const { data: staff } = await supabase
      .from('admin_staff')
      .select('name')
      .eq('email', cleanEmail)
      .single();
    if (staff) staffName = staff.name;
  }

  // 2. Generate authorization link via Supabase admin API
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const supabase = getAdminSupabase();
  const { data: linkData, error: linkError } = await supabase.auth.admin.generateLink({
    type: 'magiclink',
    email: cleanEmail,
    options: {
      redirectTo: `${siteUrl}/api/auth/confirm?next=/admin`
    }
  });

  if (linkError || !linkData?.properties) {
    return { error: linkError?.message || "Failed to generate security token." };
  }

  const { hashed_token, verification_type } = linkData.properties;
  const loginUrl = `${siteUrl}/api/auth/confirm?token_hash=${hashed_token}&type=${verification_type}&next=/admin`;

  // 3. Send authorization link via Resend
  const resend = new Resend(process.env.RESEND_API_KEY);
  try {
    await resend.emails.send({
      from: 'Lamssé Luxe <welcome@lamsseluxe.ca>',
      to: cleanEmail,
      subject: 'Authorize Entry | Admin Dashboard',
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; color: #111; padding: 40px 20px; background-color: #fafafa;">
          <div style="background-color: #000; padding: 30px; text-align: center; border-radius: 12px 12px 0 0;">
            <h1 style="color: #fff; margin: 0; font-size: 20px; font-weight: 900; letter-spacing: 4px; text-transform: uppercase;">LAMSSÉ LUXE</h1>
          </div>
          <div style="padding: 40px; background: #fff; border: 1px solid #eaeaea; border-top: none; border-radius: 0 0 12px 12px;">
            <h2 style="font-size: 18px; font-weight: 800; text-transform: uppercase; margin-top: 0; margin-bottom: 20px; letter-spacing: 1px;">Admin Entry Authorization</h2>
            <p style="font-size: 14px; line-height: 1.6; color: #444; margin-bottom: 30px;">
              Hello ${staffName},<br/><br/>
              A request has been made to access the Lamssé Luxe Administrative Dashboard. Click the button below to authorize this entry.
            </p>
            <div style="text-align: center; margin: 35px 0;">
              <a href="${loginUrl}" style="background-color: #000; color: #fff; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; text-transform: uppercase; font-size: 12px; letter-spacing: 2px; display: inline-block;">Authorize Entry</a>
            </div>
            <p style="font-size: 11px; line-height: 1.5; color: #888; margin-top: 40px; border-top: 1px solid #eaeaea; padding-top: 20px;">
              If the button above does not work, copy and paste this link in your browser:<br/>
              <a href="${loginUrl}" style="color: #0066cc; word-break: break-all;">${loginUrl}</a>
            </p>
            <p style="font-size: 11px; color: #999; margin-top: 20px;">
              This link is valid for 1 hour. If you did not request this entry, you can safely ignore this email.
            </p>
          </div>
        </div>
      `
    });
    return { success: true };
  } catch (emailError) {
    console.error("Resend admin login email failed:", emailError);
    return { error: "Failed to dispatch magic link. Please contact developer." };
  }
}

