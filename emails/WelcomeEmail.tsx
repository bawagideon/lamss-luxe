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

interface WelcomeEmailProps {
  discountCode?: string;
}

export const WelcomeEmail = ({
  discountCode = "LUXE30",
}: WelcomeEmailProps) => (
  <Html>
    <Head />
    <Preview>Welcome to The Luxe Network — Your 30% discount is here.</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={header}>
          <Text style={brandLogo}>LAMSSÉ LUXE</Text>
        </Section>
        
        <Section style={content}>
          <Heading style={heading}>YOU&apos;RE IN, QUEEN.</Heading>
          <Text style={paragraph}>
            Welcome to the soft life. You are now part of an exclusive circle of 
            the Poise Woman—where every look is a moment and every moment is yours.
          </Text>
          
          <Section style={codeContainer}>
            <Text style={codeLabel}>YOUR FIRST VISIT REWARD</Text>
            <Heading style={codeText}>{discountCode}</Heading>
            <Text style={codeSubtext}>USE AT CHECKOUT FOR 30% OFF</Text>
          </Section>

          <Section style={buttonContainer}>
            <Link style={button} href="https://lamsseluxe.ca/shop">
              SHOP THE COLLECTION
            </Link>
          </Section>

          <Hr style={hr} />
          
          <Text style={footer}>
            Elevate Your Presence. Dress With Intention.<br />
            © 2026 Lamssé Luxe. All rights reserved.
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

export default WelcomeEmail;

const main = {
  backgroundColor: "#ffffff",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: "0 auto",
  padding: "40px 20px",
  maxWidth: "580px",
};

const header = {
  textAlign: "center" as const,
  padding: "30px 0",
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

const heading = {
  fontSize: "32px",
  fontWeight: "900",
  textAlign: "center" as const,
  letterSpacing: "-1px",
  margin: "0 0 20px",
  textTransform: "uppercase" as const,
  color: "#000000",
};

const paragraph = {
  fontSize: "16px",
  lineHeight: "26px",
  color: "#484848",
  textAlign: "center" as const,
  margin: "0 0 30px",
};

const codeContainer = {
  backgroundColor: "#f9f9f9",
  borderRadius: "12px",
  padding: "30px",
  textAlign: "center" as const,
  marginBottom: "30px",
  border: "1px solid #eeeeee",
};

const codeLabel = {
  fontSize: "10px",
  fontWeight: "900",
  letterSpacing: "2px",
  color: "#cc0000",
  margin: "0 0 10px",
  textTransform: "uppercase" as const,
};

const codeText = {
  fontSize: "40px",
  fontWeight: "900",
  letterSpacing: "4px",
  margin: "0",
  color: "#000000",
};

const codeSubtext = {
  fontSize: "10px",
  fontWeight: "700",
  color: "#888888",
  margin: "10px 0 0",
};

const buttonContainer = {
  textAlign: "center" as const,
  margin: "30px 0",
};

const button = {
  backgroundColor: "#000000",
  borderRadius: "50px",
  color: "#ffffff",
  fontSize: "12px",
  fontWeight: "900",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
  padding: "20px 40px",
  letterSpacing: "2px",
};

const hr = {
  borderColor: "#eeeeee",
  margin: "40px 0",
};

const footer = {
  color: "#8898aa",
  fontSize: "11px",
  fontWeight: "700",
  textAlign: "center" as const,
  textTransform: "uppercase" as const,
  letterSpacing: "1px",
};
