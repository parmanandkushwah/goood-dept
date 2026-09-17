import { motion } from 'framer-motion';
import { fadeInUp, viewportConfig } from '../../animations/variants';
import SectionHeader from '../../components/ui/SectionHeader';

export default function PrivacyPolicy() {
  return (
    <div className="pt-16">
      <section className="bg-gradient-to-br from-neutral-50 to-white py-10 sm:py-14 lg:py-20">
        <div className="container-xl">
          <motion.div variants={fadeInUp} initial="hidden" animate="visible" className="text-center max-w-2xl mx-auto">
            <span className="eyebrow mb-4">Legal</span>
            <h1 className="heading-xl mb-5">Privacy Policy</h1>
            <p className="body-md">How we collect, use, and protect your personal information.</p>
          </motion.div>
        </div>
      </section>
      <section className="section bg-white">
        <div className="container-md">
          <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={viewportConfig} className="card p-5 sm:p-6 space-y-5 sm:space-y-6">
            <div>
              <h2 className="font-display font-bold text-neutral-900 text-lg mb-2">1. Information We Collect</h2>
              <p className="text-sm text-neutral-600 leading-relaxed">We collect information you provide when you submit a loan enquiry, including your name, contact details, financial information, and loan requirements.</p>
            </div>
            <div>
              <h2 className="font-display font-bold text-neutral-900 text-lg mb-2">2. How We Use Your Information</h2>
              <p className="text-sm text-neutral-600 leading-relaxed">We use your information to process your enquiry, connect you with suitable lending partners, and provide you with personalized loan guidance.</p>
            </div>
            <div>
              <h2 className="font-display font-bold text-neutral-900 text-lg mb-2">3. Data Sharing</h2>
              <p className="text-sm text-neutral-600 leading-relaxed">We may share your information with lending partners and service providers who assist in processing your loan enquiry. We do not sell your data.</p>
            </div>
            <div>
              <h2 className="font-display font-bold text-neutral-900 text-lg mb-2">4. Data Security</h2>
              <p className="text-sm text-neutral-600 leading-relaxed">We implement industry-standard security measures to protect your personal information. However, no method of transmission over the internet is 100% secure.</p>
            </div>
            <div>
              <h2 className="font-display font-bold text-neutral-900 text-lg mb-2">5. Your Rights</h2>
              <p className="text-sm text-neutral-600 leading-relaxed">You have the right to access, correct, or delete your personal information. Contact us to exercise these rights.</p>
            </div>
            <div>
              <h2 className="font-display font-bold text-neutral-900 text-lg mb-2">6. Contact Us</h2>
              <p className="text-sm text-neutral-600 leading-relaxed">For any privacy-related queries, please contact us at info@gooddebt.in.</p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
