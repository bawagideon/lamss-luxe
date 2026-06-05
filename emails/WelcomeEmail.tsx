import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

interface WelcomeEmailProps {
  discountCode?: string;
}

export const WelcomeEmail = ({
  discountCode = "LUXELAUNCH20",
}: WelcomeEmailProps) => {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://lamss-luxe.vercel.app';

  return (
    <Html>
      <Head>
        <style dangerouslySetInnerHTML={{ __html: `
          @import url('https://fonts.googleapis.com/css2?family=Italiana&family=Montserrat:wght@300;400;500;600;700;800&family=Playball&display=swap');
        `}} />
      </Head>
      <Preview>YOUR 20% OFF + FREE DELIVERY IS HERE</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Logo Header */}
          <Section style={header}>
            <Text style={brandLogo}>LAMSSÉ LUXE</Text>
            <Text style={brandSubtitle}>The Luxe Network</Text>
          </Section>

          {/* Email Title */}
          <Heading style={heading}>YOUR 20% OFF + FREE DELIVERY IS HERE</Heading>

          {/* Email Body */}
          <Section style={content}>
            <Text style={paragraph}>
              Hi Luxe Queen 💜✨
            </Text>

            <Text style={paragraph}>
              It&apos;s official. <strong>Lamssé Luxe is LIVE 🥺</strong>
            </Text>

            <Text style={paragraph}>
              First of all, thank you for being here from the beginning. Whether you joined for the fashion, the Luxe Network community, or just because you believed in the vision, I genuinely appreciate you.
            </Text>

            <Text style={paragraph}>
              To celebrate our launch, you&apos;re getting:
            </Text>

            {/* Premium Code / Perk Box */}
            <Section style={promoCard}>
              <Text style={promoLabel}>YOUR EXCLUSIVE LAUNCH REWARD</Text>
              <Heading style={promoCode}>{discountCode}</Heading>
              <div style={promoDivider} />
              <div style={perkItem}>
                <span style={perkEmoji}>✨</span>
                <span style={perkText}><strong>20% OFF</strong> your first order</span>
              </div>
              <div style={perkItem}>
                <span style={perkEmoji}>🚚</span>
                <span style={perkText}><strong>FREE delivery</strong> on your first purchase</span>
              </div>
            </Section>

            <Text style={paragraphItalic}>
              Because day ones deserve perks 🤭
            </Text>

            <Text style={paragraph}>
              We&apos;ve added beautiful, trendy, ready to wear pieces that are perfect for everyday moments, dinner plans, girls nights, and those last minute &quot;I have nothing to wear&quot; situations 😭
            </Text>

            <Text style={paragraph}>
              Shop with the link before your favourites disappear:
            </Text>

            {/* Shop CTA Button */}
            <Section style={buttonContainer}>
              <Link style={button} href={`${siteUrl}/shop`}>
                SHOP THE LAUNCH DROP
              </Link>
            </Section>

            <Text style={paragraphSemibold}>
              And because fashion is only part of the vision...
            </Text>

            <Text style={paragraph}>
              The Luxe Network 1.0 is officially cooking behind the scenes 👀 We&apos;re working on creating experiences where women can connect, have meaningful conversations, build confidence, and just enjoy being in community together. More details soon, but trust me, you&apos;ll want to be there.
            </Text>

            <Text style={paragraphPurple}>
              For now? Go secure your faves before somebody else does 😭💜
            </Text>

            {/* Signature Block */}
            <Section style={signatureSection}>
              <Text style={signatureText}>With love,</Text>
              <Text style={signatureName}>Lamss</Text>
              <Text style={signatureTitle}>Founder, Lamssé Luxe</Text>
            </Section>

            <Hr style={hr} />

            {/* Footer */}
            <Text style={footer}>
              Elevate Your Presence. Dress With Intention.<br />
              © 2026 Lamssé Luxe. All rights reserved.<br />
              <Link href={siteUrl} style={footerLink}>lamsseluxe.ca</Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default WelcomeEmail;

// --- Premium Style Definitions ---

const main = {
  backgroundColor: "#fcfaf8",
  fontFamily: "'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  padding: "40px 0",
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "40px 30px",
  maxWidth: "580px",
  border: "1px solid #f1eae4",
};

const header = {
  textAlign: "center" as const,
  padding: "10px 0 30px 0",
};

const brandLogo = {
  fontFamily: "'Italiana', 'Playfair Display', Georgia, serif",
  fontSize: "26px",
  fontWeight: "400",
  letterSpacing: "6px",
  color: "#000000",
  textAlign: "center" as const,
  margin: "0 0 5px 0",
  textTransform: "uppercase" as const,
};

const brandSubtitle = {
  fontFamily: "'Montserrat', sans-serif",
  fontSize: "9px",
  fontWeight: "700",
  letterSpacing: "3px",
  color: "#a39081",
  textAlign: "center" as const,
  margin: "0",
  textTransform: "uppercase" as const,
};

const heading = {
  fontFamily: "'Italiana', 'Playfair Display', Georgia, serif",
  fontSize: "24px",
  fontWeight: "400",
  lineHeight: "34px",
  letterSpacing: "2px",
  textAlign: "center" as const,
  color: "#000000",
  margin: "0 0 30px 0",
  textTransform: "uppercase" as const,
};

const content = {
  padding: "0",
};

const paragraph = {
  fontSize: "15px",
  lineHeight: "28px",
  color: "#2c2c2c",
  textAlign: "center" as const,
  margin: "0 0 24px 0",
  fontWeight: "400",
};

const paragraphItalic = {
  ...paragraph,
  fontStyle: "italic",
  color: "#6b6259",
  fontSize: "14px",
  margin: "-10px 0 24px 0",
};

const paragraphSemibold = {
  ...paragraph,
  fontWeight: "600",
  color: "#1a1a1a",
};

const paragraphPurple = {
  ...paragraph,
  fontWeight: "600",
  color: "#834ebd",
};

const promoCard = {
  background: "linear-gradient(135deg, #fdfbfa 0%, #f7f0eb 100%)",
  border: "1px solid #ebdcd0",
  padding: "30px 20px",
  textAlign: "center" as const,
  margin: "30px 0",
};

const promoLabel = {
  fontSize: "10px",
  fontWeight: "700",
  letterSpacing: "3px",
  color: "#998372",
  margin: "0 0 12px 0",
  textTransform: "uppercase" as const,
};

const promoCode = {
  fontFamily: "'Italiana', 'Playfair Display', Georgia, serif",
  fontSize: "40px",
  fontWeight: "400",
  letterSpacing: "4px",
  margin: "0 0 15px 0",
  color: "#000000",
  textTransform: "uppercase" as const,
};

const promoDivider = {
  height: "1px",
  backgroundColor: "#ebdcd0",
  width: "80px",
  margin: "0 auto 15px auto",
};

const perkItem = {
  display: "inline-block",
  margin: "5px 15px",
  textAlign: "left" as const,
};

const perkEmoji = {
  marginRight: "8px",
  fontSize: "16px",
  verticalAlign: "middle",
};

const perkText = {
  fontSize: "13px",
  color: "#4a423a",
  fontFamily: "'Montserrat', sans-serif",
  textTransform: "uppercase" as const,
  letterSpacing: "0.5px",
  verticalAlign: "middle",
};

const buttonContainer = {
  textAlign: "center" as const,
  margin: "25px 0 35px 0",
};

const button = {
  backgroundColor: "#000000",
  color: "#ffffff",
  fontFamily: "'Montserrat', sans-serif",
  fontSize: "12px",
  fontWeight: "700",
  letterSpacing: "3px",
  textDecoration: "none",
  textTransform: "uppercase" as const,
  textAlign: "center" as const,
  display: "inline-block",
  padding: "18px 36px",
};

const signatureSection = {
  textAlign: "center" as const,
  margin: "40px 0 20px 0",
};

const signatureText = {
  fontSize: "15px",
  fontStyle: "italic",
  color: "#2c2c2c",
  margin: "0 0 5px 0",
};

const signatureName = {
  fontFamily: "'Playball', 'Brush Script MT', 'Great Vibes', cursive",
  fontSize: "36px",
  color: "#000000",
  margin: "0 0 5px 0",
  lineHeight: "40px",
};

const signatureTitle = {
  fontSize: "10px",
  fontWeight: "700",
  letterSpacing: "2.5px",
  color: "#a39081",
  textTransform: "uppercase" as const,
  margin: "0",
};

const hr = {
  borderColor: "#ebdcd0",
  margin: "40px 0 30px 0",
};

const footer = {
  color: "#a39081",
  fontSize: "10px",
  fontWeight: "700",
  textAlign: "center" as const,
  textTransform: "uppercase" as const,
  letterSpacing: "2px",
  lineHeight: "20px",
};

const footerLink = {
  color: "#000000",
  textDecoration: "underline",
  marginTop: "10px",
  display: "inline-block",
};
