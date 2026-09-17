import { motion } from 'framer-motion';
import { fadeInUp, viewportConfig } from '../../animations/variants';
import SectionHeader from '../../components/ui/SectionHeader';

export default function Disclaimer() {
  return (
    <div className="pt-16">
      <section className="bg-gradient-to-br from-neutral-50 to-white py-10 sm:py-14 lg:py-20">
        <div className="container-xl">
          <motion.div variants={fadeInUp} initial="hidden" animate="visible" className="text-center max-w-2xl mx-auto">
            <span className="eyebrow mb-4">Legal</span>
            <h1 className="heading-xl mb-5">Disclaimer</h1>
            <p className="body-md">Important legal information about our services.</p>
          </motion.div>
        </div>
      </section>
      <section className="section bg-white">
        <div className="container-md">
          <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={viewportConfig} className="card p-5 sm:p-6 space-y-5 sm:space-y-6 border-l-4 border-l-brand-500">
            <div>
              <h2 className="font-display font-bold text-neutral-900 text-lg mb-2">General Disclaimer</h2>
              <p className="text-sm text-neutral-600 leading-relaxed">Good Debt is a Direct Selling Agent (DSA) and loan assistance service. We assist customers in exploring loan options and connecting with suitable lending partners.</p>
            </div>
            <div>
              <h2 className="font-display font-bold text-neutral-900 text-lg mb-2">No Guarantee of Approval</h2>
              <p className="text-sm text-neutral-600 leading-relaxed">Loan approval, interest rates, tenure, and final terms are subject to the respective lender's eligibility criteria, policies, and approval. Good Debt does not guarantee loan approval, credit approval, or any specific loan terms.</p>
            </div>
            <div>
              <h2 className="font-display font-bold text-neutral-900 text-lg mb-2">Information Accuracy</h2>
              <p className="text-sm text-neutral-600 leading-relaxed">All information provided on this platform is for informational purposes only. Interest rates, loan amounts, and other product details are indicative and subject to change without notice.</p>
            </div>
            <div>
              <h2 className="font-display font-bold text-neutral-900 text-lg mb-2">Not a Financial Advisor</h2>
              <p className="text-sm text-neutral-600 leading-relaxed">Good Debt does not provide financial advice. We are not a bank, NBFC, or registered financial advisor. Consult a qualified financial advisor for personalized advice.</p>
            </div>
            <div>
              <h2 className="font-display font-bold text-neutral-900 text-lg mb-2">Contact</h2>
              <p className="text-sm text-neutral-600 leading-relaxed">For any queries regarding this disclaimer, contact us at info@gooddebt.in.</p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
