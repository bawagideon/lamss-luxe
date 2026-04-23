'use server';

import { Resend } from 'resend';
import { CustomAdminEmail } from '@/emails/CustomAdminEmail';
import { unstable_noStore as noStore } from 'next/cache';

const resend = new Resend(process.env.RESEND_API_KEY);

interface SendEmailParams {
  to: string | string[];
  subject: string;
  title: string;
  message: string;
  buttonText?: string;
  buttonUrl?: string;
}

export async function sendAdminEmail({
  to,
  subject,
  title,
  message,
  buttonText,
  buttonUrl,
}: SendEmailParams) {
  noStore();
  
  if (!process.env.RESEND_API_KEY) {
    return { error: "Email service not configured." };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: 'Lamssé Luxe <concierge@lamsseluxe.ca>',
      to: Array.isArray(to) ? to : [to],
      subject: subject,
      react: CustomAdminEmail({
        title,
        message,
        buttonText,
        buttonUrl,
      }),
    });

    if (error) throw error;
    return { success: true, id: data?.id };
  } catch (error) {
    console.error("Admin Email Error:", error);
    return { error: "Failed to send email. Please try again." };
  }
}
