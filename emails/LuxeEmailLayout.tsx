import {
  Body,
  Container,
  Head,
  Html,
  Preview,
  Section,
  Text,
  Hr,
  Link,
} from "@react-email/components";
import * as React from "react";

interface LuxeEmailLayoutProps {
  previewText: string;
  children: React.ReactNode;
}

export const LuxeEmailLayout = ({
  previewText,
  children,
}: LuxeEmailLayoutProps) => (
  <Html>
    <Head />
    <Preview>{previewText}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={header}>
          <Text style={brandLogo}>LAMSSÉ LUXE</Text>
        </Section>
        
        <Section style={content}>
          {children}
        </Section>

        <Hr style={hr} />
        
        <Text style={footer}>
          Elevate Your Presence. Dress With Intention.<br />
          © 2026 Lamssé Luxe. All rights reserved.<br />
          <Link href="https://lamsseluxe.ca" style={footerLink}>lamsseluxe.ca</Link>
        </Text>
      </Container>
    </Body>
  </Html>
);

const main = {
  backgroundColor: "#ffffff",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: "0 auto",
  padding: "40px 20px",
  maxWidth: "600px",
};

const header = {
  textAlign: "center" as const,
  padding: "20px 0",
};

const brandLogo = {
  fontSize: "24px",
  fontWeight: "900",
  letterSpacing: "4px",
  color: "#000000",
  margin: "0",
  textTransform: "uppercase" as const,
};

const content = {
  padding: "20px 0",
};

const hr = {
  borderColor: "#f0f0f0",
  margin: "40px 0",
};

const footer = {
  color: "#a0a0a0",
  fontSize: "11px",
  fontWeight: "700",
  textAlign: "center" as const,
  textTransform: "uppercase" as const,
  letterSpacing: "1px",
  lineHeight: "18px",
};

const footerLink = {
  color: "#000000",
  textDecoration: "underline",
  marginTop: "10px",
  display: "inline-block",
};
