import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, Mail, MessageCircle, MapPin, Send, ChevronRight, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { COMPANY_PHONE, COMPANY_EMAIL, COMPANY_WHATSAPP } from '../constants';
import { fadeInUp, viewportConfig } from '../animations/variants';
import SectionHeader from '../components/ui/SectionHeader';
import { useToast } from '../components/ui/Toast';

export default function Contact() {
  const [form, setForm] = useState({ name: '', mobile: '', email: '', message: '' });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.mobile || !form.message) return toast('Please fill all required fields', 'error');
    setLoading(true);
    try {
      setTimeout(() => {
        toast('Message sent! We will get back to you shortly.', 'success');
        setForm({ name: '', mobile: '', email: '', message: '' });
        setLoading(false);
      }, 1000);
    } catch {
      toast('Something went wrong. Please try again.', 'error');
      setLoading(false);
    }
  };

  return (
    <div className="pt-16">
      {/* Hero */}
      <section className="bg-gradient-to-br from-neutral-50 to-white py-8 sm:py-10 lg:py-16">
        <div className="container-xl">
          <motion.div variants={fadeInUp} initial="hidden" animate="visible" className="text-center max-w-2xl mx-auto">
            <span className="eyebrow mb-3">Contact Us</span>
            <h1 className="heading-xl mb-3">Get In Touch</h1>
            <p className="body-md">Have questions? Our team is here to help. Reach out through any channel below.</p>
          </motion.div>
        </div>
      </section>

      <section className="bg-white py-8 sm:py-10 lg:py-14">
        <div className="container-xl">
          <div className="grid items-start gap-6 lg:grid-cols-2 lg:gap-10">
            <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={viewportConfig}>
              <h2 className="heading-md mb-4">Contact Information</h2>
              <div className="mb-5 grid grid-cols-2 gap-2 sm:gap-3 lg:mb-6">
                {[
                  { icon: Phone, label: 'Phone', value: COMPANY_PHONE, href: `tel:${COMPANY_PHONE}` },
                  { icon: Mail, label: 'Email', value: COMPANY_EMAIL, href: `mailto:${COMPANY_EMAIL}` },
                  { icon: MessageCircle, label: 'WhatsApp', value: 'Chat with us on WhatsApp', href: `https://wa.me/${COMPANY_WHATSAPP.replace('+', '')}` },
                  { icon: MapPin, label: 'Location', value: 'Mumbai, Maharashtra, India', href: null },
                ].map(({ icon: Icon, label, value, href }) => (
                  <div key={label} className="flex min-w-0 flex-col gap-2 rounded-xl p-3 hover:bg-neutral-50 transition-colors sm:flex-row sm:items-start sm:gap-3 sm:p-3.5">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 bg-brand-50 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-brand-600" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-neutral-400 mb-0.5 font-medium uppercase tracking-wider">{label}</p>
                      {href ? (
                        <a href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer"
                          className="break-words text-xs sm:text-sm font-semibold text-neutral-900 hover:text-brand-600 transition-colors">{value}</a>
                      ) : (
                        <p className="text-xs sm:text-sm font-semibold text-neutral-900">{value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div className="rounded-2xl border border-brand-100 bg-brand-50 p-3.5 sm:p-4">
                <p className="mb-1 text-sm font-semibold text-brand-700">Business Hours</p>
                <p className="text-xs text-brand-600 sm:text-sm">Monday – Saturday: 9:00 AM – 7:00 PM</p>
                <p className="text-xs text-brand-600 sm:text-sm">Sunday: 10:00 AM – 4:00 PM</p>
              </div>
            </motion.div>

            <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={viewportConfig} className="card p-4 sm:p-5">
              <h3 className="mb-4 font-display text-lg font-bold text-neutral-900 sm:text-xl">Send a Message</h3>
              <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                  <label className="label">Full Name *</label>
                  <input type="text" placeholder="Your name" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} className="input-field" required />
                </div>
                <div>
                  <label className="label">Mobile Number *</label>
                  <input type="tel" placeholder="10-digit mobile number" value={form.mobile} onChange={e => setForm(p => ({ ...p, mobile: e.target.value }))} maxLength={10} className="input-field" required />
                </div>
                <div>
                  <label className="label">Email</label>
                  <input type="email" placeholder="your@email.com" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} className="input-field" />
                </div>
                <div>
                  <label className="label">Message *</label>
                  <textarea rows={4} placeholder="How can we help you?" value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))} className="input-field resize-none" required />
                </div>
                <motion.button type="submit" whileTap={{ scale: 0.97 }} disabled={loading} className="btn-primary w-full">
                  {loading ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Send className="w-4 h-4" />}
                  Send Message
                </motion.button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
