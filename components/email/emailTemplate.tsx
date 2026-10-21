import { Html, Head, Body, Container, Text, Heading, Section, Img } from '@react-email/components';

export interface ContactFormEmailProps {
  companyName: string;
  name: string;
  email: string;
  phonePrefix: string;
  phoneNumber: string;
  region: string;
  position: string;
  subject: string;
  message: string;
}

export const ContactFormEmail = ({
  companyName,
  name,
  email,
  phonePrefix,
  phoneNumber,
  region,
  position,
  subject,
  message,
}: ContactFormEmailProps) => {
  const baseUrl = process.env.NEXT_PUBLIC_WEBSITE_URL
  return (
    <Html>
      <Head />
      <Body style={{ backgroundColor: '#f8f9fa', fontFamily: 'Arial, sans-serif', padding: '20px' }}>
        <Container style={{ backgroundColor: '#ffffff', padding: '30px', borderRadius: '8px', maxWidth: '600px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
          {/* Company Logo */}
          <Section style={{ textAlign: 'center', marginBottom: '20px' }}>
            <Img
              src={`${baseUrl}/images/logo/franceaj-logo.png`}
              alt="Company Logo"
              width="auto"
              height="80"
              style={{ margin: '0 auto' }}
            />
          </Section>

          {/* Heading */}
          <Heading style={{ color: '#0f172a', fontSize: '24px', marginBottom: '20px', textAlign: 'center' }}>
            New Contact Form France AJ Alimentaire And Food LTDA Brazil Export & Import
          </Heading>

          {/* Contact Details */}
          <Section style={{ borderTop: '1px solid #e2e8f0', paddingTop: '20px', marginTop: '20px' }}>
            <Text style={{ fontSize: '14px', color: '#475569', margin: '6px 0' }}><strong>Company:</strong> {companyName}</Text>
            <Text style={{ fontSize: '14px', color: '#475569', margin: '6px 0' }}><strong>Name:</strong> {name}</Text>
            <Text style={{ fontSize: '14px', color: '#475569', margin: '6px 0' }}><strong>Email:</strong> {email}</Text>
            <Text style={{ fontSize: '14px', color: '#475569', margin: '6px 0' }}><strong>Phone:</strong> {phonePrefix} {phoneNumber}</Text>
            <Text style={{ fontSize: '14px', color: '#475569', margin: '6px 0' }}><strong>Region:</strong> {region}</Text>
            <Text style={{ fontSize: '14px', color: '#475569', margin: '6px 0' }}><strong>Position:</strong> {position}</Text>
            <Text style={{ fontSize: '14px', color: '#475569', margin: '6px 0' }}><strong>Subject:</strong> {subject}</Text>
          </Section>

          {/* Message Section */}
          <Section style={{ borderTop: '1px solid #e2e8f0', paddingTop: '20px', marginTop: '20px' }}>
            <Text style={{ fontSize: '14px', color: '#0f172a', marginBottom: '8px', fontWeight: 'bold' }}>Message:</Text>
            <Text style={{ backgroundColor: '#f1f5f9', padding: '12px', borderRadius: '6px', fontSize: '14px', color: '#475569', whiteSpace: 'pre-wrap' }}>
              {message}
            </Text>
          </Section>

          {/* Footer */}
          <Text style={{ fontSize: '12px', color: '#94a3b8', marginTop: '30px', textAlign: 'center' }}>
            &copy; {new Date().getFullYear()} FranceAJ Alimentaire Brazil Export & Import. All rights reserved.
          </Text>
        </Container>
      </Body>
    </Html>
  );
};
