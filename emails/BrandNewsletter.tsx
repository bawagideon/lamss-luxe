import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

interface BrandNewsletterProps {
  subject: string;
  content: string;
}

export const BrandNewsletter = ({
  subject = "The Latest from Lamssé Luxe",
  content = "Welcome to the Soft Life.",
}: BrandNewsletterProps) => (
  <Html>
    <Head />
    <Preview>{subject}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={header}>
          <Img
            src={`${process.env.NEXT_PUBLIC_SITE_URL || 'https://lamss-luxe.vercel.app'}/Logo.jpeg`}
            width="100"
            height="auto"
            alt="Lamssé Luxe"
            style={logo}
          />
        </Section>
        <Section style={contentSection}>
          <Heading style={h1}>{subject}</Heading>
          <Text style={text}>
            {content.split('\n').map((line, i) => (
              <React.Fragment key={i}>
                {line}
                <br />
              </React.Fragment>
            ))}
          </Text>
          <Text style={signature}>
            Warmly,<br />
            <strong>The Lamssé Luxe Team</strong>
          </Text>
        </Section>
        <Hr style={hr} />
        <Section style={footer}>
          <Text style={footerText}>
            Follow the Soft Life Revolution on <Link href="https://instagram.com/lamsseluxe" style={link}>Instagram</Link> and <Link href="https://tiktok.com/@lamsseluxe" style={link}>TikTok</Link>.
          </Text>
          <Text style={footerSubtext}>
            You are receiving this because you signed up for the Lamssé Luxe community.
            <br />
            <Link href="#" style={link}>Unsubscribe</Link>
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

const main = {
  backgroundColor: "#f6f9fc",
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "40px 0 64px",
  marginBottom: "64px",
};

const header = {
  padding: "32px 0",
  textAlign: "center" as const,
};

const logo = {
  margin: "0 auto",
};

const contentSection = {
  padding: "0 48px",
};

const h1 = {
  color: "#1a1a1a",
  fontSize: "24px",
  fontWeight: "900",
  lineHeight: "1.1",
  margin: "0 0 24px",
  textTransform: "uppercase" as const,
  letterSpacing: "-0.02em",
  textAlign: "center" as const,
};

const text = {
  color: "#333",
  fontSize: "16px",
  lineHeight: "24px",
  textAlign: "left" as const,
};

const signature = {
  color: "#1a1a1a",
  fontSize: "16px",
  lineHeight: "24px",
  marginTop: "32px",
};

const hr = {
  borderColor: "#e6ebf1",
  margin: "20px 0",
};

const footer = {
  padding: "0 48px",
  textAlign: "center" as const,
};

const footerText = {
  color: "#8898aa",
  fontSize: "12px",
  lineHeight: "16px",
  fontWeight: "700",
  textTransform: "uppercase" as const,
  letterSpacing: "0.1em",
};

const footerSubtext = {
  color: "#8898aa",
  fontSize: "11px",
  lineHeight: "16px",
  marginTop: "12px",
};

const link = {
  color: "#000",
  textDecoration: "underline",
  fontWeight: "bold",
};
