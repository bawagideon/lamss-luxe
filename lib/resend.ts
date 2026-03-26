import { Resend } from 'resend';
import { BrandNewsletter } from '@/emails/BrandNewsletter';
import * as React from 'react';

const resend = new Resend(process.env.RESEND_API_KEY || 're_dummy');

export async function sendNewsletterEmail(email: string, subject: string, content: string) {
  try {
    await resend.emails.send({
      from: 'Lamssé Luxe <newsletter@lamsseluxe.com>',
      to: [email],
      subject: subject,
      react: BrandNewsletter({ subject, content }) as React.ReactElement,
    });
    console.log(`[Resend] Newsletter successfully sent to ${email}`);
  } catch (error) {
    console.error(`[Resend] Failed to send newsletter to ${email}:`, error);
  }
}

interface OrderDetails {
  amount: string | number;
  size?: string;
  color?: string;
}

export async function sendOrderConfirmationEmail(email: string, orderDetails: OrderDetails) {
  try {
    const { amount, size, color } = orderDetails;
    
    await resend.emails.send({
      from: 'Lamssé Luxe <orders@lamsseluxe.com>',
      to: [email],
      subject: 'Order Confirmed! Your Lamssé Luxe Drop is Secured.',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9; color: #111;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="text-transform: uppercase; letter-spacing: 2px; font-weight: 900;">Lamssé Luxe</h1>
          </div>
          <div style="background-color: #fff; padding: 30px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
            <h2 style="margin-top: 0; font-weight: 800;">Order Confirmed!</h2>
            <p style="color: #666; line-height: 1.6;">Hi there,<br><br>Thank you for shopping with Lamssé Luxe! We've received your order and our team is already getting it ready for shipment.</p>
            
            <div style="margin: 30px 0; border-top: 1px solid #eee; border-bottom: 1px solid #eee; padding: 20px 0;">
              <h3 style="font-weight: bold; margin-bottom: 15px; font-size: 14px; text-transform: uppercase;">Order Details</h3>
              <p style="margin: 5px 0;"><strong>Order Total:</strong> $${amount}</p>
              ${size ? `<p style="margin: 5px 0;"><strong>Size Selected:</strong> ${size}</p>` : ''}
              ${color ? `<p style="margin: 5px 0;"><strong>Color Selected:</strong> ${color}</p>` : ''}
            </div>
            
            <p style="color: #666; font-size: 14px;">You will receive another email with tracking details the moment your package drops.</p>
          </div>
          <div style="text-align: center; margin-top: 30px; color: #999; font-size: 12px;">
            <p>&copy; ${new Date().getFullYear()} Lamssé Luxe. All rights reserved.</p>
          </div>
        </div>
      `,
    });
    console.log(`[Resend] Order confirmation successfully sent to ${email}`);
  } catch (error) {
    console.error("[Resend] Failed to send order confirmation:", error);
  }
}

export async function sendShippingConfirmationEmail(email: string) {
  try {
    // Order processing notification
    
    await resend.emails.send({
      from: 'Lamssé Luxe <shipping@lamsseluxe.com>',
      to: [email],
      subject: 'Your Lamssé Luxe Order has Shipped!',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9; color: #111;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="text-transform: uppercase; letter-spacing: 2px; font-weight: 900;">Lamssé Luxe</h1>
          </div>
          <div style="background-color: #fff; padding: 30px; border-radius: 8px; border-left: 4px solid #000;">
            <h2 style="margin-top: 0; font-weight: 800;">It's on the way!</h2>
            <p style="color: #666; line-height: 1.6;">Great news! Your recent order has been packaged and handed over to our courier partners.</p>
            
            <p style="color: #666; font-size: 14px; margin-top: 30px;">Get ready to slay. We can't wait to see how you style it.</p>
          </div>
          <div style="text-align: center; margin-top: 30px; color: #999; font-size: 12px;">
            <p>&copy; ${new Date().getFullYear()} Lamssé Luxe. All rights reserved.</p>
          </div>
        </div>
      `,
    });
    console.log(`[Resend] Shipping confirmation successfully sent to ${email}`);
  } catch (error) {
    console.error("[Resend] Failed to send shipping confirmation:", error);
  }
}
