import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/layout/Logo";

export default function Privacy() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-primary/95 to-secondary">
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <Button
          variant="ghost"
          className="text-white/80 hover:text-white hover:bg-white/10 mb-6"
          onClick={() => navigate("/")}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to home
        </Button>

        <div className="bg-white rounded-lg shadow-xl p-8">
          <div className="flex justify-center mb-6">
            <Logo size="lg" />
          </div>

          <h1 className="text-3xl font-bold text-center mb-8">Privacy Policy</h1>

          <div className="prose prose-sm max-w-none">
            <p className="text-muted-foreground mb-6">
              Last updated: February 12, 2026
            </p>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">1. Introduction</h2>
              <p>
                AFAQ ESG Navigator ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our Service. We comply with UAE data protection laws and international best practices.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">2. Information We Collect</h2>

              <h3 className="text-lg font-semibold mt-4 mb-2">2.1 Account Information</h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>Full name and email address</li>
                <li>Company name and details</li>
                <li>Job title and role</li>
                <li>Account credentials (passwords are encrypted)</li>
              </ul>

              <h3 className="text-lg font-semibold mt-4 mb-2">2.2 Company Data</h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>Company profile (industry, size, location)</li>
                <li>ESG data and metrics</li>
                <li>Questionnaire responses</li>
                <li>Uploaded documents and evidence</li>
                <li>Assessment results and gap analysis</li>
              </ul>

              <h3 className="text-lg font-semibold mt-4 mb-2">2.3 Usage Information</h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>Log data (IP address, browser type, access times)</li>
                <li>Device information</li>
                <li>Feature usage and interaction data</li>
                <li>Error logs and diagnostic data</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">3. How We Use Your Information</h2>
              <p className="mb-2">We use the collected information for:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Providing and maintaining the Service</li>
                <li>Generating ESG assessments and disclosure reports</li>
                <li>Personalizing your experience</li>
                <li>Communicating with you about the Service</li>
                <li>Improving our algorithms and methodologies</li>
                <li>Detecting and preventing fraud or security issues</li>
                <li>Complying with legal obligations</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">4. Data Storage and Security</h2>

              <h3 className="text-lg font-semibold mt-4 mb-2">4.1 Data Isolation</h3>
              <p>
                Your company data is isolated using Row Level Security (RLS) policies. Only authenticated users from your organization can access your data. We implement strict access controls to prevent unauthorized access.
              </p>

              <h3 className="text-lg font-semibold mt-4 mb-2">4.2 Encryption</h3>
              <p>
                All data is encrypted in transit using TLS/SSL and at rest using AES-256 encryption. Passwords are hashed using industry-standard algorithms.
              </p>

              <h3 className="text-lg font-semibold mt-4 mb-2">4.3 Data Location</h3>
              <p>
                Your data is stored on secure servers hosted by Supabase (PostgreSQL database) with data centers in [specify region]. We comply with data residency requirements for GCC companies.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">5. Data Sharing and Disclosure</h2>

              <h3 className="text-lg font-semibold mt-4 mb-2">5.1 Third-Party Services</h3>
              <p className="mb-2">We share limited data with trusted service providers:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Supabase (database hosting and authentication)</li>
                <li>Vercel (application hosting)</li>
                <li>Stripe (payment processing)</li>
                <li>OpenRouter/Anthropic (AI-powered disclosure generation)</li>
              </ul>
              <p className="mt-2">
                These providers are contractually obligated to protect your data and use it only for providing their services to us.
              </p>

              <h3 className="text-lg font-semibold mt-4 mb-2">5.2 Legal Requirements</h3>
              <p>
                We may disclose your information if required by law, court order, or government request, or to protect our rights, property, or safety.
              </p>

              <h3 className="text-lg font-semibold mt-4 mb-2">5.3 No Selling of Data</h3>
              <p className="text-primary font-semibold">
                We do NOT sell, rent, or trade your personal information or company data to third parties for marketing purposes.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">6. Your Data Rights</h2>
              <p className="mb-2">You have the right to:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li><strong>Access:</strong> Request a copy of your data</li>
                <li><strong>Correction:</strong> Update or correct inaccurate data</li>
                <li><strong>Deletion:</strong> Request deletion of your data (subject to legal retention requirements)</li>
                <li><strong>Portability:</strong> Export your data in machine-readable format</li>
                <li><strong>Objection:</strong> Object to processing for specific purposes</li>
                <li><strong>Restriction:</strong> Request restriction of processing</li>
              </ul>
              <p className="mt-4">
                To exercise these rights, contact us at privacy@afaq-esg.com
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">7. Data Retention</h2>
              <p>
                We retain your data for as long as your account is active or as needed to provide services. After account termination, we may retain certain data for:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Legal and regulatory compliance (typically 7 years)</li>
                <li>Dispute resolution and fraud prevention</li>
                <li>Aggregated analytics (anonymized data only)</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">8. Cookies and Tracking</h2>
              <p>
                We use essential cookies for authentication and session management. We do not use third-party advertising cookies. You can control cookie preferences through your browser settings.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">9. Children's Privacy</h2>
              <p>
                Our Service is not directed to individuals under 18 years of age. We do not knowingly collect personal information from children.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">10. International Data Transfers</h2>
              <p>
                If you access our Service from outside the UAE, your data may be transferred to and processed in countries with different data protection laws. We ensure appropriate safeguards are in place for such transfers.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">11. Changes to This Privacy Policy</h2>
              <p>
                We may update this Privacy Policy periodically. We will notify you of material changes via email or through the Service. The "Last updated" date at the top indicates when changes were made.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">12. Contact Us</h2>
              <p>
                For privacy-related questions or concerns, contact us at:
              </p>
              <p className="mt-2">
                Email: privacy@afaq-esg.com<br />
                Data Protection Officer: [Name - To Be Added]<br />
                Address: [Company Address - To Be Added]
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
