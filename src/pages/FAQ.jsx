import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { faqsApi } from '../api';
import { fadeInUp, staggerContainer, viewportConfig } from '../animations/variants';
import SectionHeader from '../components/ui/SectionHeader';
import { PageLoader } from '../components/ui/Spinner';

export default function FAQ() {
  const [open, setOpen] = useState(null);
  const { data, isLoading } = useQuery({ queryKey: ['faqs-all'], queryFn: () => faqsApi.getAll({ published: 'true' }), staleTime: 300000 });
  const faqs = data?.data?.data || [];

  if (isLoading) return <PageLoader />;

  return (
    <div className="pt-16">
      <section className="bg-gradient-to-br from-neutral-50 to-white py-10 sm:py-14 lg:py-20">
        <div className="container-xl">
          <motion.div variants={fadeInUp} initial="hidden" animate="visible" className="text-center max-w-2xl mx-auto">
            <span className="eyebrow mb-4">FAQ</span>
            <h1 className="heading-xl mb-5">Frequently Asked Questions</h1>
            <p className="body-md">Find answers to common questions about our loan assistance service.</p>
          </motion.div>
        </div>
      </section>

      <section className="section bg-white">
        <div className="container-md">
          {faqs.length === 0 ? (
            <p className="text-center text-neutral-500">No FAQs available at the moment.</p>
          ) : (
            <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={viewportConfig} className="space-y-2 sm:space-y-3">
              {faqs.map((faq, i) => (
                <motion.div key={faq.id} variants={fadeInUp}
                  className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <button onClick={() => setOpen(open === i ? null : i)}
                    className="w-full flex items-center justify-between px-4 py-3.5 sm:px-5 sm:py-4 text-left gap-4">
                    <span className="font-medium text-neutral-900 text-sm">{faq.question}</span>
                    <motion.div animate={{ rotate: open === i ? 180 : 0 }} transition={{ duration: 0.2 }}>
                      <ChevronDown className="w-4 h-4 text-neutral-400 flex-shrink-0" />
                    </motion.div>
                  </button>
                  <AnimatePresence>
                    {open === i && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
                        <p className="px-4 pb-4 sm:px-5 sm:pb-5 text-sm text-neutral-500 leading-relaxed">{faq.answer}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
}
