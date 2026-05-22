import { Resend } from 'resend';
import { BrandNewsletter } from '@/emails/BrandNewsletter';
import { render } from '@react-email/render';
import * as React from 'react';

const resend = new Resend(process.env.RESEND_API_KEY || 're_dummy');

export async function sendNewsletterEmail(email: string, subject: string, content: string, isPromo: boolean = false, discountCode?: string) {
  try {
    const htmlContent = await render(
      React.createElement(BrandNewsletter, {
        subject,
        content,
        isPromo,
        discountCode,
      })
    );

    const { error } = await resend.emails.send({
      from: 'Lamssé Luxe <newsletter@lamsseluxe.com>',
      to: [email],
      subject: subject,
      html: htmlContent,
    });
    
    if (error) {
      console.error("[Resend] API response error:", error);
      throw error;
    }
    
    console.log(`[Resend] Newsletter successfully sent to ${email}${isPromo ? ' (Promo Mode)' : ''}`);
  } catch (error) {
    console.error(`[Resend] Failed to send newsletter to ${email}:`, error);
    throw error;
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
    
    const { error } = await resend.emails.send({
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
    
    if (error) {
      console.error("[Resend] API response error:", error);
      throw error;
    }
    
    console.log(`[Resend] Order confirmation successfully sent to ${email}`);
  } catch (error) {
    console.error("[Resend] Failed to send order confirmation:", error);
    throw error;
  }
}

export async function sendShippingConfirmationEmail(
  email: string, 
  trackingNum?: string, 
  carrier?: string,
  orderDetails?: { orderId?: string; itemsSummary?: string }
) {
  try {
    const carrierName = carrier || 'Canada Post';
    const trackingNo = trackingNum || '';
    
    // Construct dynamic tracking URL based on carrier
    let trackingUrl = '';
    if (trackingNo) {
      const norm = carrierName.toLowerCase().replace(/\s+/g, '');
      if (norm.includes('canadapost')) {
        trackingUrl = `https://www.canadapost-postescanada.ca/track-reperage/en#/resultList?searchFor=${trackingNo}`;
      } else if (norm.includes('dhl')) {
        trackingUrl = `https://www.dhl.com/en/express/tracking.html?AWB=${trackingNo}`;
      } else if (norm.includes('fedex')) {
        trackingUrl = `https://www.fedex.com/apps/fedextrack/?tracknumbers=${trackingNo}`;
      } else if (norm.includes('ups')) {
        trackingUrl = `https://www.ups.com/track?tracknum=${trackingNo}`;
      } else {
        // Generic fallback or standard search
        trackingUrl = `https://www.google.com/search?q=${encodeURIComponent(carrierName + ' tracking ' + trackingNo)}`;
      }
    }

    const { error } = await resend.emails.send({
      from: 'Lamssé Luxe <shipping@lamsseluxe.com>',
      to: [email],
      subject: 'Your Lamssé Luxe Order has Shipped!',
      html: `
        <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background-color: #ffffff; color: #000000; border: 1px solid #e5e5e5;">
          
          <!-- Logo / Header -->
          <div style="text-align: center; margin-bottom: 40px; border-bottom: 2px solid #000000; padding-bottom: 20px;">
            <h1 style="text-transform: uppercase; letter-spacing: 6px; font-weight: 900; font-size: 28px; margin: 0; font-style: italic;">Lamssé Luxe</h1>
            <p style="text-transform: uppercase; letter-spacing: 2px; font-size: 9px; color: #a1a1aa; margin: 5px 0 0 0; font-weight: 700;">The Luxe Network</p>
          </div>
          
          <!-- Body Content -->
          <div style="padding: 10px 0;">
            <h2 style="margin-top: 0; font-weight: 900; text-transform: uppercase; letter-spacing: 1px; font-size: 20px; font-style: italic;">Your luxury drop has shipped.</h2>
            <p style="color: #4b5563; font-size: 14px; line-height: 1.7; font-weight: 500;">
               Great news! Your recent order has been hand-selected, meticulously packaged, and handed over to our courier partner. Your pieces are officially on their way to you.
            </p>
            
            ${orderDetails?.orderId ? `
            <div style="margin: 20px 0; border-top: 1px solid #f4f4f5; padding-top: 15px;">
              <p style="font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #71717a; margin: 0 0 5px 0; font-weight: 700;">Order Reference</p>
              <p style="font-size: 13px; font-weight: bold; margin: 0; font-family: monospace;">${orderDetails.orderId}</p>
            </div>
            ` : ''}

            ${orderDetails?.itemsSummary ? `
            <div style="margin: 15px 0; border-top: 1px solid #f4f4f5; padding-top: 15px;">
              <p style="font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #71717a; margin: 0 0 5px 0; font-weight: 700;">Items in Shipment</p>
              <p style="font-size: 13px; margin: 0; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">${orderDetails.itemsSummary}</p>
            </div>
            ` : ''}

            <!-- Shipment Tracking Details Card -->
            <div style="background-color: #fafafa; border: 1px solid #e5e5e5; padding: 25px; margin: 30px 0; border-left: 4px solid #000000;">
              <h3 style="margin-top: 0; margin-bottom: 15px; font-size: 12px; font-weight: 900; text-transform: uppercase; letter-spacing: 1.5px;">Fulfillment details</h3>
              
              <div style="margin-bottom: 15px;">
                <span style="font-size: 10px; text-transform: uppercase; letter-spacing: 1px; color: #71717a; display: block; font-weight: bold;">Courier Carrier</span>
                <span style="font-size: 14px; font-weight: 800; color: #000000; text-transform: uppercase;">${carrierName}</span>
              </div>

              ${trackingNo ? `
              <div style="margin-bottom: 25px;">
                <span style="font-size: 10px; text-transform: uppercase; letter-spacing: 1px; color: #71717a; display: block; font-weight: bold;">Tracking Reference</span>
                <span style="font-size: 14px; font-weight: 800; color: #000000; font-family: monospace;">${trackingNo}</span>
              </div>
              
              <div style="margin-top: 20px;">
                <a href="${trackingUrl}" target="_blank" style="background-color: #000000; color: #ffffff; text-decoration: none; padding: 15px 30px; font-size: 11px; font-weight: 900; text-transform: uppercase; letter-spacing: 2px; display: inline-block; transition: all 0.3s ease;">
                  Track My Shipment
                </a>
              </div>
              ` : `
              <div style="margin-top: 5px;">
                <span style="font-size: 13px; font-weight: 700; color: #71717a; font-style: italic;">Courier is currently preparing your package for active dispatch.</span>
              </div>
              `}
            </div>

            <p style="color: #71717a; font-size: 13px; line-height: 1.6; margin-top: 30px;">
              If you have any questions regarding your shipment or need specialized assistance, please reach out to us at <a href="mailto:contact@lamsseluxe.com" style="color: #000000; font-weight: bold; text-decoration: underline;">contact@lamsseluxe.com</a>.
            </p>
          </div>
          
          <!-- Footer -->
          <div style="text-align: center; margin-top: 50px; padding-top: 20px; border-top: 1px solid #f4f4f5; color: #a1a1aa; font-size: 10px; text-transform: uppercase; letter-spacing: 1.5px; font-weight: 600;">
            <p style="margin: 5px 0;">&copy; ${new Date().getFullYear()} Lamssé Luxe. All rights reserved.</p>
            <p style="margin: 5px 0; color: #d4d4d8;">St. John's, Newfoundland &amp; Labrador, Canada</p>
          </div>
        </div>
      `,
    });
    
    if (error) {
      console.error("[Resend] API response error:", error);
      throw error;
    }
    
    console.log(`[Resend] Shipping confirmation successfully sent to ${email} (Carrier: ${carrierName}, Tracking: ${trackingNo})`);
  } catch (error) {
    console.error("[Resend] Failed to send shipping confirmation:", error);
    throw error;
  }
}
export async function sendContactFormEmail(data: { name: string; email: string; subject: string; message: string }) {
  try {
    const { name, email, subject, message } = data;
    
    await resend.emails.send({
      from: 'Lamssé Luxe Contact <contact@lamsseluxe.com>',
      to: ['lamsseluxe@gmail.com'],
      replyTo: email,
      subject: `[Contact Form] ${subject}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; padding: 20px;">
          <h2 style="border-bottom: 2px solid #000; padding-bottom: 10px; text-transform: uppercase;">New Contact Message</h2>
          <p><strong>From:</strong> ${name} (${email})</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <div style="background: f9f9f9; padding: 15px; border-radius: 5px; margin-top: 20px;">
            <p style="white-space: pre-wrap;">${message}</p>
          </div>
          <p style="font-size: 12px; color: #666; margin-top: 30px; border-top: 1px solid #eee; pt: 10px;">
            This message was sent from the Lamssé Luxe contact form.
          </p>
        </div>
      `,
    });
    console.log(`[Resend] Contact form message from ${email} sent successfully.`);
  } catch (error) {
    console.error("[Resend] Failed to send contact form email:", error);
    throw error;
  }
}
