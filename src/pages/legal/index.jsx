import { motion } from 'framer-motion';
import { fadeInUp } from '../../animations/variants';
import { useCompanySettings } from '../../hooks/useCompanySettings';

function LegalPage({ title, children }) {
  return (
    <div className="pt-16">
      <section className="bg-gradient-to-br from-slate-900 via-brand-950 to-slate-900 py-10 sm:py-12 lg:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={fadeInUp} initial="hidden" animate="visible">
            <h1 className="text-3xl lg:text-4xl font-display font-bold text-white">{title}</h1>
            <p className="text-neutral-400 text-sm mt-2">Last updated: January 2026</p>
          </motion.div>
        </div>
      </section>
      <section className="py-10 sm:py-12 lg:py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 prose prose-neutral max-w-none">
          {children}
        </div>
      </section>
    </div>
  );
}

export function PrivacyPolicy() {
  const { companyEmail } = useCompanySettings();

  return (
    <LegalPage title="Privacy Policy">
      <div className="space-y-5 sm:space-y-6 text-neutral-600 text-sm leading-relaxed">
        <div><h2 className="text-lg font-bold text-neutral-900 mb-2">1. Information We Collect</h2><p>We collect personal information that you voluntarily provide when submitting a loan enquiry, including your name, mobile number, email address, financial information, and loan requirements. We also automatically collect certain technical information such as IP address, browser type, and pages visited.</p></div>
        <div><h2 className="text-lg font-bold text-neutral-900 mb-2">2. How We Use Your Information</h2><p>Your information is used to: process your loan enquiry, connect you with suitable lending partners, contact you regarding your enquiry, improve our services, and comply with legal obligations. We do not sell your personal information to third parties.</p></div>
        <div><h2 className="text-lg font-bold text-neutral-900 mb-2">3. Information Sharing</h2><p>We may share your information with lending partners and financial institutions for the purpose of processing your loan enquiry. We ensure that such partners maintain appropriate data protection standards.</p></div>
        <div><h2 className="text-lg font-bold text-neutral-900 mb-2">4. Data Security</h2><p>We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.</p></div>
        <div><h2 className="text-lg font-bold text-neutral-900 mb-2">5. Your Rights</h2><p>You have the right to access, correct, or request deletion of your personal information. To exercise these rights, please contact us at {companyEmail}.</p></div>
        <div><h2 className="text-lg font-bold text-neutral-900 mb-2">6. Contact Us</h2><p>For privacy-related queries, contact us at {companyEmail}.</p></div>
      </div>
    </LegalPage>
  );
}

export function Terms() {
  return (
    <LegalPage title="Terms of Service">
      <div className="space-y-5 sm:space-y-6 text-neutral-600 text-sm leading-relaxed">
        <div><h2 className="text-lg font-bold text-neutral-900 mb-2">1. Nature of Service</h2><p>Good Debt is a loan assistance service (DSA). We assist customers in exploring loan options and connecting with suitable lending partners. We do not directly provide loans, and we are not a bank or NBFC.</p></div>
        <div><h2 className="text-lg font-bold text-neutral-900 mb-2">2. No Guarantee of Approval</h2><p>Submitting an enquiry through Good Debt does not guarantee loan approval. Final approval, loan amount, interest rate, and terms are determined solely by the respective lender based on their eligibility criteria and policies.</p></div>
        <div><h2 className="text-lg font-bold text-neutral-900 mb-2">3. Accuracy of Information</h2><p>You agree to provide accurate and complete information in your loan enquiry. Providing false or misleading information may result in rejection of your enquiry.</p></div>
        <div><h2 className="text-lg font-bold text-neutral-900 mb-2">4. Consent to Contact</h2><p>By submitting a loan enquiry, you consent to being contacted by Good Debt and its lending partners via phone, email, SMS, or WhatsApp regarding your enquiry.</p></div>
        <div><h2 className="text-lg font-bold text-neutral-900 mb-2">5. Limitation of Liability</h2><p>Good Debt shall not be liable for any loan decisions made by lenders, interest rates offered, or any financial outcomes resulting from loans obtained through our assistance.</p></div>
        <div><h2 className="text-lg font-bold text-neutral-900 mb-2">6. Changes to Terms</h2><p>We reserve the right to modify these terms at any time. Continued use of our services constitutes acceptance of the updated terms.</p></div>
      </div>
    </LegalPage>
  );
}

export function Disclaimer() {
  const { companyEmail } = useCompanySettings();

  return (
    <LegalPage title="Disclaimer">
      <div className="space-y-5 sm:space-y-6 text-neutral-600 text-sm leading-relaxed">
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
          <p className="text-amber-800 font-medium">Important: Please read this disclaimer carefully before using our services.</p>
        </div>
        <div><h2 className="text-lg font-bold text-neutral-900 mb-2">Loan Assistance Service</h2><p>Good Debt is a Direct Selling Agent (DSA) and loan assistance service. We facilitate connections between borrowers and lenders. We do not directly lend money and are not a bank, NBFC, or financial institution.</p></div>
        <div><h2 className="text-lg font-bold text-neutral-900 mb-2">No Guarantee of Approval</h2><p>Good Debt does not guarantee loan approval, specific interest rates, loan amounts, or terms. All loan decisions are made exclusively by the respective lending institution based on their internal policies and credit assessment.</p></div>
        <div><h2 className="text-lg font-bold text-neutral-900 mb-2">Indicative Information</h2><p>Interest rates, EMI calculations, eligibility estimates, and other financial information provided on this website are indicative only and for planning purposes. Actual figures may vary significantly based on lender policies and individual circumstances.</p></div>
        <div><h2 className="text-lg font-bold text-neutral-900 mb-2">Independent Decision</h2><p>Loan decisions should be made after careful consideration of your financial situation. We recommend consulting with a qualified financial advisor before taking any loan.</p></div>
        <div><h2 className="text-lg font-bold text-neutral-900 mb-2">Regulatory Compliance</h2><p>All lending activities are conducted by RBI-regulated banks and NBFCs. Good Debt operates as a DSA in compliance with applicable regulations.</p></div>
      </div>
    </LegalPage>
  );
}
