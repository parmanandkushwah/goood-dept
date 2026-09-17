import { motion } from 'framer-motion';
import { fadeInUp, viewportConfig } from '../../animations/variants';
import SectionHeader from '../../components/ui/SectionHeader';

export default function Terms() {
  return (
    <div className="pt-16">
      <section className="bg-gradient-to-br from-neutral-50 to-white py-10 sm:py-14 lg:py-20">
        <div className="container-xl">
          <motion.div variants={fadeInUp} initial="hidden" animate="visible" className="text-center max-w-2xl mx-auto">
            <span className="eyebrow mb-4">Legal</span>
            <h1 className="heading-xl mb-5">Terms of Service</h1>
            <p className="body-md">Terms and conditions for using Good Debt services.</p>
          </motion.div>
        </div>
      </section>
      <section className="section bg-white">
        <div className="container-md">
          <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={viewportConfig} className="card p-5 sm:p-6 space-y-5 sm:space-y-6">
            <div>
              <h2 className="font-display font-bold text-neutral-900 text-lg mb-2">1. Acceptance of Terms</h2>
              <p className="text-sm text-neutral-600 leading-relaxed">By using Good Debt services, you agree to be bound by these terms and conditions. If you do not agree, please do not use our services.</p>
            </div>
            <div>
              <h2 className="font-display font-bold text-neutral-900 text-lg mb-2">2. Services Provided</h2>
              <p className="text-sm text-neutral-600 leading-relaxed">Good Debt is a loan assistance and lead generation platform. We do not provide loans directly. We connect borrowers with lending partners.</p>
            </div>
            <div>
              <h2 className="font-display font-bold text-neutral-900 text-lg mb-2">3. Eligibility</h2>
              <p className="text-sm text-neutral-600 leading-relaxed">You must be at least 18 years old and a resident of India to use our services. All loan products are subject to lender eligibility criteria.</p>
            </div>
            <div>
              <h2 className="font-display font-bold text-neutral-900 text-lg mb-2">4. Disclaimer</h2>
              <p className="text-sm text-neutral-600 leading-relaxed">Good Debt does not guarantee loan approval, interest rates, or loan terms. All loan details are subject to the respective lender's policies.</p>
            </div>
            <div>
              <h2 className="font-display font-bold text-neutral-900 text-lg mb-2">5. Limitation of Liability</h2>
              <p className="text-sm text-neutral-600 leading-relaxed">Good Debt is not liable for any decisions made by lenders or outcomes of loan applications. We act only as an intermediary.</p>
            </div>
            <div>
              <h2 className="font-display font-bold text-neutral-900 text-lg mb-2">6. Modifications</h2>
              <p className="text-sm text-neutral-600 leading-relaxed">We reserve the right to modify these terms at any time. Continued use of services constitutes acceptance of modified terms.</p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
