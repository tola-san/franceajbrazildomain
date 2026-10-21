import {
  Html,
  Head,
  Font,
  Body,
  Container,
  Text,
  Heading,
  Section,
  Img,
} from '@react-email/components';
import { CartProduct } from '@/types/cart-types';
import { EmailForm } from '@/types/contact';

export interface Props {
  contact: EmailForm;
  products: CartProduct[];
}

export const QuotationResponseEmail = ({
  contact,
  products,
}: Props) => {
  const { name } = contact;
  const baseUrl = process.env.NEXT_PUBLIC_WEBSITE_URL
  const fontFamily = '"Bricolage Grotesque", sans-serif';

  return (
    <Html>
      <Head>
        <Font
          fontFamily="Bricolage Grotesque"
          fallbackFontFamily="sans-serif"
          webFont={{
            url: 'https://cdn.jsdelivr.net/gh/google/fonts/ofl/bricolagegrotesque/BricolageGrotesque-Regular.woff2',
            format: 'woff2',
          }}
        />
        <style
          dangerouslySetInnerHTML={{
            __html: `
              @font-face {
                font-family: 'Bricolage Grotesque';
                font-style: normal;
                font-weight: 400;
                src: url('https://cdn.jsdelivr.net/gh/google/fonts/ofl/bricolagegrotesque/BricolageGrotesque-Regular.woff2') format('woff2');
              }
            `,
          }}
        />
      </Head>

      <Body
        style={{
          backgroundColor: '#f1f3f6',
          padding: '50px',
          fontFamily,
        }}
      >
        <Container
          style={{
            backgroundColor: '#ffffff',
            padding: '30px',
            borderRadius: '15px',
            maxWidth: '900px',
            margin: '0 auto',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            fontFamily,
          }}
        >
          {/* Logo */}
          <Section style={{ textAlign: 'center', marginBottom: '20px' }}>
            <Img
              src={`${baseUrl}/images/logo/franceaj-logo.png`}
              alt="Company Logo"
              height="80"
              style={{ margin: '0 auto' }}
            />
          </Section>

          {/* Heading */}
          <Heading
            style={{
              color: '#000',
              fontSize: '24px',
              marginBottom: '30px',
              textAlign: 'center',
              fontWeight: 'bold',
              fontFamily,
            }}
          >
            FranceAJ Alimentaire Brazil Export & Import
          </Heading>

          {/* Thank You Message */}
          <Section
            style={{
              borderTop: '1px solid #e5e7eb',
              paddingTop: '20px',
              marginTop: '20px',
              fontFamily,
            }}
          >
            <Text
              style={{
                fontSize: '16px',
                color: '#0f172a',
                fontWeight: 'bold',
                marginBottom: '10px',
              }}
            >
              Thank you, {name}!
            </Text>
            <Text style={{ fontSize: '14px', color: '#475569' }}>
              We have received your quotation request and our team will respond
              to you shortly. Below is a summary of the products you requested.
            </Text>
          </Section>

          {/* Product List */}
          <Section
            style={{
              borderTop: '1px solid #e2e8f0',
              paddingTop: '20px',
              marginTop: '20px',
              fontFamily,
            }}
          >
            <Heading
              style={{
                color: '#0f172a',
                fontSize: '20px',
                marginBottom: '15px',
              }}
            >
              Your Products
            </Heading>

            <Section
              style={{
                margin: '16px 0',
                border: '1px solid #e5e7eb',
                padding: '16px',
                paddingTop: '0px',
                borderRadius: '8px',
              }}
            >
              <table
                style={{
                  width: '100%',
                  marginBottom: '16px',
                  borderCollapse: 'collapse',
                }}
              >
                <thead>
                  <tr>
                    <th
                      align="left"
                      colSpan={6}
                      style={{
                        borderBottom: '1px solid #e5e7eb',
                        padding: '8px',
                        color: '#6b7280',
                      }}
                    >
                      <Text style={{ fontWeight: 600 }}>Product Image</Text>
                    </th>
                    <th
                      align="center"
                      style={{
                        borderBottom: '1px solid #e5e7eb',
                        padding: '8px',
                        color: '#6b7280',
                      }}
                    >
                      <Text style={{ fontWeight: 600 }}>Name</Text>
                    </th>
                    <th
                      align="center"
                      style={{
                        borderBottom: '1px solid #e5e7eb',
                        padding: '8px',
                        color: '#6b7280',
                      }}
                    >
                      <Text style={{ fontWeight: 600 }}>Unit</Text>
                    </th>
                    <th
                      align="center"
                      style={{
                        borderBottom: '1px solid #e5e7eb',
                        padding: '8px',
                        color: '#6b7280',
                      }}
                    >
                      <Text style={{ fontWeight: 600 }}>Quantity</Text>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product, index) => {
                    const isLast = index === products.length - 1;
                    const cellStyle = {
                      borderBottom: isLast ? 'none' : '1px solid #e5e7eb',
                      padding: '8px',
                    };
                    return (
                      <tr key={index}>
                        <td style={cellStyle}>
                          <Img
                            alt={product.name}
                            src={`${baseUrl}${product.image}`}
                            height={110}
                            style={{
                              borderRadius: '8px',
                              objectFit: 'cover',
                              display: 'block',
                            }}
                          />
                        </td>
                        <td align="left" colSpan={6} style={cellStyle}>
                          <Text style={{ color: '#6b7280' }}>{product.name}</Text>
                        </td>
                        <td align="center" style={cellStyle}>
                          <Text style={{ color: '#6b7280' }}>
                            {product.variation?.summary || '27 MT / container'}
                          </Text>
                        </td>
                        <td align="center" style={cellStyle}>
                          <Text style={{ color: '#6b7280' }}>
                            x {product.quantity}
                          </Text>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </Section>
          </Section>

          {/* Footer */}
          <Text
            style={{
              fontSize: '12px',
              color: '#94a3b8',
              marginTop: '30px',
              textAlign: 'center',
            }}
          >
            FranceAJ Alimentaire Brazil Export & Import. All rights reserved.
          </Text>
        </Container>
      </Body>
    </Html>
  );
};
