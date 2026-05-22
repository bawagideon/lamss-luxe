'use server';

import { Resend } from 'resend';
import { CustomAdminEmail } from '@/emails/CustomAdminEmail';
import { unstable_noStore as noStore } from 'next/cache';
import { render } from '@react-email/render';
import * as React from 'react';

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
    // Compile / Render React Component to HTML using @react-email/components
    const htmlContent = await render(
      React.createElement(CustomAdminEmail, {
        title,
        message,
        buttonText,
        buttonUrl,
      })
    );

    const { data, error } = await resend.emails.send({
      from: 'Lamssé Luxe <concierge@lamsseluxe.com>',
      to: Array.isArray(to) ? to : [to],
      subject: subject,
      html: htmlContent,
    });

    if (error) {
      console.error("Resend API Error object:", error);
      throw error;
    }
    return { success: true, id: data?.id };
  } catch (error) {
    console.error("Admin Email Error:", error);
    
    let errorMessage = "Failed to send email. Please try again.";
    if (error && typeof error === 'object') {
      const err = error as { message?: string; error?: { message?: string } };
      if (err.message) {
        errorMessage = err.message;
      } else if (err.error && typeof err.error === 'object' && err.error.message) {
        errorMessage = err.error.message;
      } else {
        errorMessage = JSON.stringify(error);
      }
    } else if (typeof error === 'string') {
      errorMessage = error;
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }
    
    return { error: errorMessage };
  }
}
