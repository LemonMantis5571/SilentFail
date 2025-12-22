import {
  Html,
  Body,
  Container,
  Text,
  Link,
  Preview,
  Section,
  Heading,
  Button,
  Hr,
  Img,
  Row,
  Column,
} from "@react-email/components";
import * as React from "react";

interface AlertEmailProps {
  monitorName: string;
  monitorId: string;
  lastPing: Date | null;
}

export default function AlertEmail({
  monitorName = "Database Backup",
  monitorId = "123",
  lastPing = new Date(),
}: AlertEmailProps) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const formattedTime = lastPing
    ? new Intl.DateTimeFormat('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short'
    }).format(lastPing)
    : 'Never received';

  return (
    <Html>
      <Preview>� {monitorName} stopped responding - SilentFail Alert</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <table width="100%" cellPadding="0" cellSpacing="0">
              <tr>
                <td align="center">
                  <div style={logoContainer}>
                    <div style={logoIcon}>🔕</div>
                    <span style={logoText}>SilentFail</span>
                  </div>
                </td>
              </tr>
            </table>
          </Section>

          {/* Alert Banner */}
          <Section style={alertBanner}>
            <div style={statusDot} />
            <Text style={alertTitle}>MONITOR DOWN</Text>
          </Section>

          {/* Monitor Info Card */}
          <Section style={card}>
            <Text style={monitorLabel}>AFFECTED MONITOR</Text>
            <Heading style={monitorNameStyle}>{monitorName}</Heading>

            <Hr style={divider} />

            <table width="100%" cellPadding="0" cellSpacing="0">
              <tr>
                <td style={infoCell}>
                  <Text style={infoLabel}>Status</Text>
                  <Text style={infoValueRed}>● Offline</Text>
                </td>
                <td style={infoCell}>
                  <Text style={infoLabel}>Last Signal</Text>
                  <Text style={infoValue}>{formattedTime}</Text>
                </td>
              </tr>
            </table>
          </Section>

          {/* Message */}
          <Section style={messageSection}>
            <Text style={messageText}>
              Your monitor failed to check in within the expected interval.
              This could indicate that your scheduled task, cron job, or
              background script has stopped running.
            </Text>
          </Section>

          {/* CTA Button */}
          <Section style={ctaSection}>
            <Button style={ctaButton} href={`${baseUrl}/monitors/${monitorId}`}>
              Investigate Now →
            </Button>
          </Section>

          {/* Quick Actions */}
          <Section style={quickActions}>
            <Text style={quickActionsTitle}>Quick Actions</Text>
            <table width="100%" cellPadding="0" cellSpacing="0">
              <tr>
                <td align="center">
                  <Link href={`${baseUrl}/dashboard`} style={quickLink}>
                    View Dashboard
                  </Link>
                  <span style={linkSeparator}>•</span>
                  <Link href={`${baseUrl}/monitors/${monitorId}`} style={quickLink}>
                    Monitor Details
                  </Link>
                  <span style={linkSeparator}>•</span>
                  <Link href={`${baseUrl}/settings`} style={quickLink}>
                    Alert Settings
                  </Link>
                </td>
              </tr>
            </table>
          </Section>

          <Hr style={footerDivider} />

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              This alert was triggered because your script stopped pinging SilentFail.
            </Text>
            <Text style={footerMuted}>
              Dead Man's Switch Monitoring • {new Date().getFullYear()} SilentFail
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

// Styles
const main = {
  backgroundColor: "#0a0a0a",
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Ubuntu, sans-serif',
};

const container = {
  backgroundColor: "#0a0a0a",
  margin: "0 auto",
  padding: "40px 20px",
  maxWidth: "560px",
};

const header = {
  padding: "20px 0 30px",
};

const logoContainer = {
  display: "inline-flex" as const,
  alignItems: "center" as const,
  gap: "8px",
};

const logoIcon = {
  fontSize: "24px",
};

const logoText = {
  color: "#ffffff",
  fontSize: "20px",
  fontWeight: "700" as const,
  letterSpacing: "-0.5px",
};

const alertBanner = {
  backgroundColor: "#1c1917",
  borderRadius: "12px",
  border: "1px solid #ef4444",
  padding: "16px 24px",
  textAlign: "center" as const,
  marginBottom: "24px",
};

const statusDot = {
  width: "12px",
  height: "12px",
  backgroundColor: "#ef4444",
  borderRadius: "50%",
  display: "inline-block" as const,
  marginRight: "10px",
  boxShadow: "0 0 12px rgba(239, 68, 68, 0.6)",
  animation: "pulse 2s infinite",
};

const alertTitle = {
  color: "#ef4444",
  fontSize: "14px",
  fontWeight: "700" as const,
  letterSpacing: "2px",
  margin: "0",
  display: "inline" as const,
  verticalAlign: "middle" as const,
};

const card = {
  backgroundColor: "#18181b",
  borderRadius: "12px",
  border: "1px solid #27272a",
  padding: "24px",
  marginBottom: "24px",
};

const monitorLabel = {
  color: "#71717a",
  fontSize: "11px",
  fontWeight: "600" as const,
  letterSpacing: "1px",
  margin: "0 0 8px",
};

const monitorNameStyle = {
  color: "#ffffff",
  fontSize: "24px",
  fontWeight: "600" as const,
  margin: "0",
  lineHeight: "1.3",
};

const divider = {
  borderColor: "#27272a",
  margin: "20px 0",
};

const infoCell = {
  width: "50%",
  padding: "8px 0",
};

const infoLabel = {
  color: "#71717a",
  fontSize: "12px",
  fontWeight: "500" as const,
  margin: "0 0 4px",
};

const infoValue = {
  color: "#a1a1aa",
  fontSize: "14px",
  fontWeight: "500" as const,
  margin: "0",
  fontFamily: '"JetBrains Mono", "SF Mono", monospace',
};

const infoValueRed = {
  color: "#ef4444",
  fontSize: "14px",
  fontWeight: "600" as const,
  margin: "0",
};

const messageSection = {
  padding: "0 4px",
  marginBottom: "24px",
};

const messageText = {
  color: "#a1a1aa",
  fontSize: "15px",
  lineHeight: "1.6",
  margin: "0",
};

const ctaSection = {
  textAlign: "center" as const,
  marginBottom: "32px",
};

const ctaButton = {
  backgroundColor: "#3b82f6",
  borderRadius: "8px",
  color: "#ffffff",
  fontSize: "14px",
  fontWeight: "600" as const,
  textDecoration: "none",
  padding: "14px 28px",
  display: "inline-block" as const,
  boxShadow: "0 4px 14px rgba(59, 130, 246, 0.4)",
};

const quickActions = {
  textAlign: "center" as const,
  marginBottom: "32px",
};

const quickActionsTitle = {
  color: "#52525b",
  fontSize: "11px",
  fontWeight: "600" as const,
  letterSpacing: "1px",
  margin: "0 0 12px",
  textTransform: "uppercase" as const,
};

const quickLink = {
  color: "#71717a",
  fontSize: "13px",
  textDecoration: "none",
};

const linkSeparator = {
  color: "#3f3f46",
  margin: "0 12px",
};

const footerDivider = {
  borderColor: "#27272a",
  margin: "0 0 24px",
};

const footer = {
  textAlign: "center" as const,
};

const footerText = {
  color: "#52525b",
  fontSize: "13px",
  lineHeight: "1.5",
  margin: "0 0 8px",
};

const footerMuted = {
  color: "#3f3f46",
  fontSize: "12px",
  margin: "0",
};