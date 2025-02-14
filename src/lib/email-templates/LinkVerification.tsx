import {
  Body,
  Button,
  Container,
  Column,
  Head,
  Heading,
  Html,
  Img,
  Preview,
  Row,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

interface EmailVerificationProps {
  userFirstName: string;
  verificationLink: string;
}

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "https://nexgencourierservice.in";

export const LinkVerification = ({
  userFirstName,
  verificationLink,
}: EmailVerificationProps) => {
  return (
    <Html>
      <Head />
      <Preview>Verify your email address</Preview>
      <Body style={main}>
        <Container>
          <Section style={content}>
            <Row>
              <Img style={image} width={340} src={`${baseUrl}/logo.png`} />
            </Row>

            <Row style={{ ...boxInfos, paddingBottom: "0" }}>
              <Column>
                <Heading
                  style={{
                    fontSize: 32,
                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                >
                  Welcome {userFirstName}!
                </Heading>
                <Heading
                  as="h2"
                  style={{
                    fontSize: 26,
                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                >
                  Verify Your Email Address
                </Heading>

                <Text style={paragraph}>
                  Thanks for signing up! We&apos;re excited to have you on
                  board. To get started, please verify your email address by
                  clicking the button below.
                </Text>

                <Text style={paragraph}>
                  This verification link will expire in 24 hours. If you did not
                  create an account, you can safely ignore this email.
                </Text>
              </Column>
            </Row>
            <Row style={{ ...boxInfos, paddingTop: "0" }}>
              <Column style={containerButton} colSpan={2}>
                <Button href={verificationLink} style={button}>
                  Verify Email Address
                </Button>
              </Column>
            </Row>

            <Row style={boxInfos}>
              <Column>
                <Text style={smallText}>
                  If the button above doesn&apos;t work, copy and paste this
                  link into your browser:
                </Text>
                <Text style={linkText}>{verificationLink}</Text>
              </Column>
            </Row>
          </Section>

          <Section style={containerImageFooter}>
            <Img style={image} width={620} src={`${baseUrl}/logo.png`} />
          </Section>

          <Text style={footer}>
            © 2024 | Kishan Kumar Sah | nexgencourierservice.in
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

LinkVerification.PreviewProps = {
  userFirstName: "Alan",
  verificationLink: "https://nexgencourierservice.in/verify?token=abc123",
} as EmailVerificationProps;

export default LinkVerification;

const main = {
  backgroundColor: "#fff",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const paragraph = {
  fontSize: 16,
  lineHeight: "24px",
  color: "#333",
};

const logo = {
  padding: "30px 20px",
};

const containerButton = {
  display: "flex",
  justifyContent: "center",
  width: "100%",
};

const button = {
  backgroundColor: "#e00707",
  borderRadius: 3,
  color: "#FFF",
  fontWeight: "bold",
  border: "1px solid rgb(0,0,0, 0.1)",
  cursor: "pointer",
  padding: "12px 30px",
  textDecoration: "none",
};

const content = {
  border: "1px solid rgb(0,0,0, 0.1)",
  borderRadius: "3px",
  overflow: "hidden",
};

const image = {
  maxWidth: "200px",
  margin: "0 auto",
};

const boxInfos = {
  padding: "20px",
};

const containerImageFooter = {
  padding: "45px 0 0 0",
};

const smallText = {
  fontSize: 14,
  color: "#666",
  marginBottom: 10,
};

const linkText: React.CSSProperties = {
  fontSize: 14,
  color: "#0066cc",
  wordBreak: "break-all",
};

const footer: React.CSSProperties = {
  textAlign: "center",
  fontSize: 12,
  color: "rgb(0,0,0, 0.7)",
};
