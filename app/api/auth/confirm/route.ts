import { createClient } from "@/lib/supabase/server";
import { type EmailOtpType } from "@supabase/supabase-js";
import { type NextRequest, NextResponse } from "next/server";

/**
 * Handles Supabase email verification from custom Resend links.
 * GET /api/auth/confirm?token_hash=...&type=...
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const next = searchParams.get("next") ?? "/account";

  if (token_hash && type) {
    const supabase = createClient();

    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    });

    if (!error) {
      // Revalidate all data for the user
      const redirectUrl = new URL(next, request.nextUrl.origin);
      return NextResponse.redirect(redirectUrl);
    }
    
    // In case of error, redirect to generic error page
    const errorUrl = new URL("/auth/auth-code-error", request.nextUrl.origin);
    return NextResponse.redirect(errorUrl);
  }

  // Fallback to error if no token/type
  return NextResponse.redirect(new URL("/auth/auth-code-error", request.nextUrl.origin));
}
