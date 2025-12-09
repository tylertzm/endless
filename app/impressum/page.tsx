"use client";

import Link from 'next/link';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="container mx-auto px-4 py-8 sm:py-12 max-w-4xl">
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">Privacy Policy</h1>
          <p className="text-gray-300 text-sm sm:text-base">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>

        <div className="space-y-6 sm:space-y-8">
          <section className="bg-white/5 rounded-lg p-4 sm:p-6">
            <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-orange-400">1. Introduction</h2>
            <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
              This Privacy Policy explains how we collect, use, store, and protect your personal information when you use our business card creation and sharing service. We are committed to protecting your privacy and ensuring transparency about our data practices.
            </p>
          </section>

          <section className="bg-white/5 rounded-lg p-4 sm:p-6">
            <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-orange-400">2. Information We Collect</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-lg sm:text-xl font-semibold mb-2 text-gray-200">Account Information</h3>
                <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
                  When you create an account using Stack Auth, we collect your email address and basic authentication information. This data is managed by Stack Auth and stored securely in accordance with their privacy practices.
                </p>
              </div>

              <div>
                <h3 className="text-lg sm:text-xl font-semibold mb-2 text-gray-200">Business Card Data</h3>
                <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
                  We collect and store the business card information you create, including:
                </p>
                <ul className="list-disc list-inside text-gray-300 mt-2 ml-4 space-y-1 text-sm sm:text-base">
                  <li>Name, email address, phone number</li>
                  <li>Business address and company information</li>
                  <li>Social media links and professional profiles</li>
                  <li>Any additional contact information you provide</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg sm:text-xl font-semibold mb-2 text-gray-200">Usage Data</h3>
                <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
                  We collect anonymous usage data through Vercel Analytics, including:
                </p>
                <ul className="list-disc list-inside text-gray-300 mt-2 ml-4 space-y-1 text-sm sm:text-base">
                  <li>Page views and navigation patterns</li>
                  <li>Device information (browser type, operating system)</li>
                  <li>Geographic location (country and city, anonymized)</li>
                  <li>Time and date of access</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg sm:text-xl font-semibold mb-2 text-gray-200">Cookie Preferences</h3>
                <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
                  We store your cookie consent preferences locally in your browser to remember your choices regarding analytics tracking.
                </p>
              </div>
            </div>
          </section>

          <section className="bg-white/5 rounded-lg p-4 sm:p-6">
            <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-orange-400">3. How We Use Your Information</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-lg sm:text-xl font-semibold mb-2 text-gray-200">Service Provision</h3>
                <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
                  We use your business card data to create, store, and display your digital business cards, and to generate shareable links for others to view your contact information.
                </p>
              </div>

              <div>
                <h3 className="text-lg sm:text-xl font-semibold mb-2 text-gray-200">Account Management</h3>
                <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
                  Your account information is used to authenticate you, manage your access to the service, and provide account-related communications.
                </p>
              </div>

              <div>
                <h3 className="text-lg sm:text-xl font-semibold mb-2 text-gray-200">Analytics and Improvement</h3>
                <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
                  Anonymous usage data helps us understand how our service is used and identify areas for improvement.
                </p>
              </div>
            </div>
          </section>

          <section className="bg-white/5 rounded-lg p-4 sm:p-6">
            <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-orange-400">4. Data Storage and Security</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-lg sm:text-xl font-semibold mb-2 text-gray-200">Database Storage</h3>
                <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
                  Your business card data is stored in a PostgreSQL database hosted by Neon. We implement industry-standard security measures including encryption in transit and at rest, regular security updates, and access controls to protect your data.
                </p>
              </div>

              <div>
                <h3 className="text-lg sm:text-xl font-semibold mb-2 text-gray-200">Authentication Security</h3>
                <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
                  User authentication is handled by Stack Auth, which provides secure authentication services with industry-standard security practices.
                </p>
              </div>

              <div>
                <h3 className="text-lg sm:text-xl font-semibold mb-2 text-gray-200">Data Retention</h3>
                <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
                  We retain your business card data for as long as your account is active. You can delete your data at any time through your account settings or by contacting us. Anonymous analytics data is retained for up to 12 months for service improvement purposes.
                </p>
              </div>
            </div>
          </section>

          <section className="bg-white/5 rounded-lg p-4 sm:p-6">
            <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-orange-400">5. Data Sharing and Third Parties</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-lg sm:text-xl font-semibold mb-2 text-gray-200">Service Providers</h3>
                <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
                  We use the following third-party services to provide our service:
                </p>
                <ul className="list-disc list-inside text-gray-300 mt-2 ml-4 space-y-1 text-sm sm:text-base">
                  <li><strong>Stack Auth:</strong> For user authentication and account management</li>
                  <li><strong>Neon:</strong> For PostgreSQL database hosting</li>
                  <li><strong>Vercel:</strong> For website hosting and analytics</li>
                </ul>
                <p className="text-sm sm:text-base text-gray-300 mt-2 leading-relaxed">
                  These providers have their own privacy policies and data processing practices. We only share the minimum data necessary for them to provide their services.
                </p>
              </div>

              <div>
                <h3 className="text-lg sm:text-xl font-semibold mb-2 text-gray-200">Business Card Sharing</h3>
                <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
                  When you share a business card link, the data is encoded in the URL and becomes accessible to anyone with the link. We do not share your data with third parties for marketing purposes.
                </p>
              </div>

              <div>
                <h3 className="text-lg sm:text-xl font-semibold mb-2 text-gray-200">Legal Requirements</h3>
                <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
                  We may disclose your information if required by law or to protect our rights and safety, or the rights and safety of others.
                </p>
              </div>
            </div>
          </section>

          <section className="bg-white/5 rounded-lg p-4 sm:p-6">
            <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-orange-400">6. Your Rights</h2>
            
            <div className="space-y-4">
              <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
                You have the following rights regarding your personal data:
              </p>
              
              <ul className="list-disc list-inside text-gray-300 mt-2 ml-4 space-y-1 text-sm sm:text-base">
                <li><strong>Access:</strong> Request a copy of the personal data we hold about you</li>
                <li><strong>Rectification:</strong> Request correction of inaccurate or incomplete data</li>
                <li><strong>Erasure:</strong> Request deletion of your personal data</li>
                <li><strong>Portability:</strong> Request transfer of your data in a structured format</li>
                <li><strong>Restriction:</strong> Request limitation of how we process your data</li>
                <li><strong>Objection:</strong> Object to our processing of your data</li>
                <li><strong>Withdraw Consent:</strong> Withdraw consent for data processing where applicable</li>
              </ul>

              <p className="text-sm sm:text-base text-gray-300 mt-4 leading-relaxed">
                To exercise these rights, please contact us using the information provided below.
              </p>
            </div>
          </section>

          <section className="bg-white/5 rounded-lg p-4 sm:p-6">
            <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-orange-400">7. Cookies and Local Storage</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-lg sm:text-xl font-semibold mb-2 text-gray-200">Cookie Consent</h3>
                <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
                  We use a cookie banner to obtain your consent for analytics tracking. Your consent preference is stored locally in your browser.
                </p>
              </div>

              <div>
                <h3 className="text-lg sm:text-xl font-semibold mb-2 text-gray-200">Analytics Cookies</h3>
                <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
                  Vercel Analytics uses cookies and similar technologies to collect usage data. You can withdraw your consent at any time by clearing your browser data or adjusting your cookie settings.
                </p>
              </div>
            </div>
          </section>

          <section className="bg-white/5 rounded-lg p-4 sm:p-6">
            <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-orange-400">8. International Data Transfers</h2>
            <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
              Our service is hosted on Vercel&apos;s global infrastructure, and your data may be processed in different countries. We ensure that appropriate safeguards are in place to protect your data during international transfers.
            </p>
          </section>

          <section className="bg-white/5 rounded-lg p-4 sm:p-6">
            <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-orange-400">9. Children&apos;s Privacy</h2>
            <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
              Our service is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13.
            </p>
          </section>

          <section className="bg-white/5 rounded-lg p-4 sm:p-6">
            <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-orange-400">10. Changes to This Privacy Policy</h2>
            <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
              We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new policy on this page and updating the &quot;Last updated&quot; date.
            </p>
          </section>

          <section className="bg-white/5 rounded-lg p-4 sm:p-6">
            <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-orange-400">11. Contact Us</h2>
            <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
              If you have any questions about this Privacy Policy or our data practices, please contact us through our website or email us at:
            </p>
            <p className="text-sm sm:text-base text-orange-400 mt-2">
              privacy@[yourdomain].com
            </p>
            <p className="text-sm sm:text-base text-gray-300 mt-2 leading-relaxed">
              We will respond to your inquiries within 30 days.
            </p>
          </section>
        </div>

        <div className="mt-8 sm:mt-12 text-center">
          <Link 
            href="/" 
            className="inline-block bg-white/10 hover:bg-white/20 px-6 py-3 rounded-lg transition-colors text-sm sm:text-base"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
