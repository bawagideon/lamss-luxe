import {
  Heading,
  Section,
  Text,
  Link,
} from "@react-email/components";
import * as React from "react";
import { LuxeEmailLayout } from "./LuxeEmailLayout";

interface CustomAdminEmailProps {
  title: string;
  message: string;
  buttonText?: string;
  buttonUrl?: string;
  firstName?: string;
}

export const CustomAdminEmail = ({
  title,
  message,
  buttonText,
  buttonUrl,
  firstName,
}: CustomAdminEmailProps) => (
  <LuxeEmailLayout previewText={title}>
    <Heading style={heading}>{title}</Heading>
    {firstName && <Text style={greetingText}>Hi {firstName},</Text>}
    <Text style={paragraph}>{message}</Text>
    
    {buttonText && buttonUrl && (
      <Section style={buttonContainer}>
        <Link style={button} href={buttonUrl}>
          {buttonText}
        </Link>
      </Section>
    )}
  </LuxeEmailLayout>
);

export default CustomAdminEmail;

const heading = {
  fontSize: "28px",
  fontWeight: "900",
  textAlign: "center" as const,
  letterSpacing: "-0.5px",
  margin: "0 0 20px",
  textTransform: "uppercase" as const,
  color: "#000000",
  lineHeight: "1.1",
};

const paragraph = {
  fontSize: "16px",
  lineHeight: "28px",
  color: "#333333",
  margin: "0 0 20px",
  textAlign: "center" as const,
};

const greetingText = {
  ...paragraph,
  fontWeight: "bold",
  margin: "0 0 10px",
  textAlign: "left" as const,
};

const buttonContainer = {
  textAlign: "center" as const,
  margin: "40px 0",
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
  textTransform: "uppercase" as const,
};
