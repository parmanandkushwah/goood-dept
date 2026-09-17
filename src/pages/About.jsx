import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { fadeInUp, staggerContainer, viewportConfig } from '../animations/variants';
import SectionHeader from '../components/ui/SectionHeader';

export default function About() {
  return (
    <div className="pt-16">
      {/* Hero */}
      <section className="bg-gradient-to-br from-neutral-50 to-white py-8 sm:py-10 lg:py-16">
        <div className="container-xl">
          <motion.div variants={fadeInUp} initial="hidden" animate="visible" className="text-center max-w-2xl mx-auto">
            <span className="eyebrow mb-3">About Us</span>
            <h1 className="heading-xl mb-3">About Good Debt</h1>
            <p className="body-md">Your trusted loan assistance partner, helping you navigate the loan landscape with confidence.</p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="bg-white py-8 sm:py-10 lg:py-14">
        <div className="container-xl">
          <div className="grid items-center gap-6 lg:grid-cols-2 lg:gap-10">
            <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={viewportConfig}>
              <span className="eyebrow mb-3">Who We Are</span>
              <h2 className="heading-md mb-4">A Trusted DSA & Loan Assistance Service</h2>
              <p className="mb-3 text-neutral-600 leading-relaxed">
                Good Debt is a Direct Selling Agent (DSA) and loan assistance service that helps individuals and businesses explore suitable loan options from various lending partners.
              </p>
              <p className="mb-3 text-neutral-600 leading-relaxed">
                We understand that navigating the loan landscape can be complex and overwhelming. Our mission is to simplify this process by providing expert guidance, helping you understand your options, and connecting you with appropriate lending partners.
              </p>
              <p className="text-neutral-600 leading-relaxed">
                We do not directly lend money. Instead, we act as a bridge between borrowers and lenders, ensuring you get the right guidance for your financial needs.
              </p>
            </motion.div>

            <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={viewportConfig}
              className="grid grid-cols-2 gap-3 sm:gap-4">
              {[
                { title: 'Trustworthy', desc: 'Transparent and honest guidance throughout your loan journey' },
                { title: 'Customer First', desc: 'Your financial wellbeing is our primary concern' },
                { title: 'Goal Oriented', desc: 'We focus on finding the right solution for your specific needs' },
                { title: 'Dedicated', desc: 'Committed to providing the best possible assistance' },
              ].map(({ title, desc }) => (
                <motion.div key={title} variants={fadeInUp} className="card p-3 text-center sm:p-4">
                  <h3 className="mb-1.5 font-display text-sm font-bold text-neutral-900">{title}</h3>
                  <p className="text-xs text-neutral-500 leading-relaxed">{desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Why Choose */}
      <section className="bg-neutral-50 py-8 sm:py-10 lg:py-14">
        <div className="container-xl">
          <SectionHeader badge="Why Good Debt" title="Why People Choose Us" subtitle="We simplify the loan exploration process and connect you with the right lending solutions." />
          <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={viewportConfig}
            className="grid grid-cols-2 gap-2.5 sm:gap-4 lg:grid-cols-3">
            {[
              { title: 'Multiple Loan Solutions', desc: 'Access a wide range of loan products from personal to business loans, all in one place.', color: 'bg-brand-50 text-brand-600' },
              { title: 'Expert Assistance', desc: 'Our team provides personalized guidance throughout your loan enquiry journey.', color: 'bg-emerald-50 text-emerald-600' },
              { title: 'Simple Process', desc: 'Submit your loan requirement in minutes with our easy multi-step enquiry form.', color: 'bg-violet-50 text-violet-600' },
              { title: 'Personalized Guidance', desc: 'Get tailored advice based on your specific financial situation and requirements.', color: 'bg-orange-50 text-orange-600' },
              { title: 'Transparent Communication', desc: 'We keep you informed at every step and provide clear, honest guidance.', color: 'bg-teal-50 text-teal-600' },
              { title: 'Responsive Support', desc: 'Our support team is available to answer your questions and assist you promptly.', color: 'bg-indigo-50 text-indigo-600' },
            ].map((item, i) => (
              <motion.div key={i} variants={fadeInUp} className="card group p-3 sm:p-5 hover:border-brand-200 transition-all duration-300">
                <div className={`mb-2 flex h-8 w-8 items-center justify-center rounded-xl text-sm font-bold sm:mb-3 sm:h-10 sm:w-10 sm:text-lg ${item.color}`}>
                  {String(i + 1).padStart(2, '0')}
                </div>
                <h3 className="font-display font-bold text-neutral-900 mb-1.5 sm:mb-2 text-sm sm:text-base leading-snug">{item.title}</h3>
                <p className="text-xs sm:text-sm text-neutral-500 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="bg-white py-8 sm:py-10 lg:py-14">
        <div className="container-lg">
          <SectionHeader badge="Important" title="Important Information" />
          <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={viewportConfig}
            className="card border-l-4 border-l-brand-500">
            <p className="text-neutral-600 text-sm leading-relaxed">
              Good Debt assists customers in exploring loan options and connecting with suitable lending partners. Loan approval, interest rates, tenure and final terms are subject to the respective lender's eligibility criteria, policies and approval. Good Debt is not a bank or NBFC and does not directly provide loans. All loan products mentioned are offered by respective lending institutions.
            </p>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-neutral-50 py-8 sm:py-10 lg:py-14">
        <div className="container-lg text-center">
          <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={viewportConfig}>
            <h2 className="heading-md mb-4">Ready to Get Started?</h2>
            <p className="text-neutral-500 mb-6">Submit your loan enquiry and let our experts guide you.</p>
            <Link to="/eligibility" className="btn-primary">Check Your Eligibility</Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
