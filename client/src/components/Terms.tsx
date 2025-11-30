import { Shield, AlertTriangle, FileText, CheckCircle } from "lucide-react";

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center">
              <Shield className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Terms of Service
          </h1>
          <p className="text-gray-600 text-lg">
            Last updated:{" "}
            {new Date().toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          {/* Important Notice */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
            <div className="flex items-start gap-4">
              <AlertTriangle className="h-6 w-6 text-yellow-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-yellow-800 mb-2">
                  Important Notice
                </h3>
                <p className="text-yellow-700">
                  By using BlogIt, you agree to these terms. Please read them
                  carefully as they affect your legal rights.
                </p>
              </div>
            </div>
          </div>

          {/* Terms Content */}
          <div className="prose prose-lg max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FileText className="h-6 w-6 text-green-600" />
                1. Acceptance of Terms
              </h2>
              <p className="text-gray-700 mb-4">
                By accessing or using BlogIt ("the Service"), you agree to be
                bound by these Terms of Service and all applicable laws and
                regulations. If you do not agree with any of these terms, you
                are prohibited from using or accessing this Service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                2. User Accounts
              </h2>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-1" />
                  <span>
                    You must be at least 13 years old to use this Service
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-1" />
                  <span>
                    You are responsible for maintaining the security of your
                    account
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-1" />
                  <span>
                    You must provide accurate and complete information during
                    registration
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-1" />
                  <span>
                    You are responsible for all activities that occur under your
                    account
                  </span>
                </li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                3. Content Guidelines
              </h2>
              <p className="text-gray-700 mb-4">
                Users are responsible for the content they post. We do not claim
                ownership of your content, but you grant us a license to display
                and distribute it on our platform.
              </p>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h4 className="font-semibold text-red-800 mb-2">
                  Prohibited Content:
                </h4>
                <ul className="text-red-700 list-disc list-inside space-y-1">
                  <li>Illegal or unlawful material</li>
                  <li>Hate speech, harassment, or threats</li>
                  <li>Spam, malware, or phishing content</li>
                  <li>Copyright-infringing material</li>
                  <li>Adult or explicit content without proper labeling</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                4. Intellectual Property
              </h2>
              <p className="text-gray-700">
                The BlogIt platform, including its original content, features,
                and functionality, is owned by BlogIt and is protected by
                international copyright, trademark, and other intellectual
                property laws.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                5. Termination
              </h2>
              <p className="text-gray-700">
                We may terminate or suspend your account immediately, without
                prior notice or liability, for any reason whatsoever, including
                without limitation if you breach the Terms.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                6. Limitation of Liability
              </h2>
              <p className="text-gray-700">
                In no event shall BlogIt, nor its directors, employees,
                partners, agents, suppliers, or affiliates, be liable for any
                indirect, incidental, special, consequential or punitive damages
                resulting from your use of the Service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                7. Changes to Terms
              </h2>
              <p className="text-gray-700">
                We reserve the right, at our sole discretion, to modify or
                replace these Terms at any time. We will provide notice of
                significant changes through our platform or via email.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                8. Contact Information
              </h2>
              <p className="text-gray-700">
                If you have any questions about these Terms, please contact us
                at:
                <br />
                <a
                  href="mailto:legal@blogit.com"
                  className="text-green-600 hover:text-green-700"
                >
                  legal@blogit.com
                </a>
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
