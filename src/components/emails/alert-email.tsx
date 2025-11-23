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
  Tailwind,
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

  return (
    <Html>
      <Preview>🚨 Alert: {monitorName} has stopped responding</Preview>
      <Tailwind>
        <Body className="bg-white my-auto mx-auto font-sans">
          <Container className="border border-solid border-[#eaeaea] rounded my-10 mx-auto p-5 w-[465px]">
            <Section className="mt-8">
              <div className="w-10 h-10 bg-red-500 rounded-full mx-auto flex items-center justify-center mb-4">
                 {/* Simple text icon since SVGs can be tricky in email clients */}
                 <span className="text-white text-2xl font-bold">!</span>
              </div>
            </Section>
            
            <Heading className="text-black text-[24px] font-normal text-center p-0 my-[30px] mx-0">
              <strong>{monitorName}</strong> is DOWN
            </Heading>
            
            <Text className="text-black text-[14px] leading-6">
              Hello,
            </Text>
            
            <Text className="text-black text-[14px] leading-6">
              Your monitor <strong>{monitorName}</strong> failed to check in within the expected interval. 
              The last successful signal was received at:
            </Text>
            
            <Section className="text-center mt-4 mb-8">
                <Text className="text-zinc-500 text-[20px] font-mono bg-zinc-100 p-4 rounded">
                    {lastPing ? lastPing.toLocaleString() : 'Never'}
                </Text>
            </Section>

            <Section className="text-center">
              <Button
                className="bg-[#000000] rounded text-white text-[12px] font-semibold no-underline text-center px-5 py-3"
                href={`${baseUrl}/dashboard`}
              >
                View Dashboard
              </Button>
            </Section>
            
            <Text className="text-zinc-500 text-[12px] leading-6 mt-8 text-center">
                This alert was sent by SilentFail because your script stopped pinging us.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}