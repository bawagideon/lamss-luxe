'use server';

import { unstable_noStore as noStore } from 'next/cache';
import { sendContactFormEmail } from '@/lib/resend';

export async function sendContactMessage(formData: FormData) {
  noStore();
  
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const subject = formData.get('subject') as string;
  const message = formData.get('message') as string;

  if (!name || !email || !subject || !message) {
    return { error: 'Please fill in all fields.' };
  }

  try {
    await sendContactFormEmail({ name, email, subject, message });
    return { success: true };
  } catch (error) {
    console.error('Contact Action Error:', error);
    return { error: 'Failed to send your message. Please try again later.' };
  }
}
