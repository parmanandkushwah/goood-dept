import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, MessageCircle, ChevronRight } from 'lucide-react';
import { COMPANY_PHONE, COMPANY_EMAIL, COMPANY_WHATSAPP } from '../../constants';
import logo from '../../assets/logo.png';

const loanLinks = [
  { to: '/loans/personal-loan', label: 'Personal Loan' },
  { to: '/loans/business-loan', label: 'Business Loan' },
  { to: '/loans/home-loan', label: 'Home Loan' },
  { to: '/loans/loan-against-property', label: 'Loan Against Property' },
  { to: '/loans/car-loan', label: 'Car Loan' },
  { to: '/loans/education-loan', label: 'Education Loan' },
  { to: '/loans/gold-loan', label: 'Gold Loan' },
  { to: '/loans/debt-consolidation', label: 'Debt Consolidation' },
];

const partnerLogos = [
  'HDFC Bank', 'SBI', 'ICICI Bank', 'Axis Bank', 'Kotak Mahindra',
  'Bajaj Finance', 'Tata Capital', 'Muthoot Capital', 'Reliance Capital',
  'L&T Finance', 'Mahindra Finance', 'Chola MS',
];

export default function Footer() {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <footer className="bg-neutral-900 text-neutral-300">
      {/* Partners Marquee */}
      <div className="border-b border-neutral-800 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <p className="text-center text-[10px] sm:text-xs font-medium text-neutral-500 uppercase tracking-wider mb-3 sm:mb-4">
            Trusted by leading lending partners
          </p>
          <div className="relative overflow-hidden">
            <div className="flex animate-marquee items-center gap-6 sm:gap-10 whitespace-nowrap [animation-duration:5s] sm:[animation-duration:30s]">
              {[...partnerLogos, ...partnerLogos].map((name, i) => (
                <span key={i} className="text-xs sm:text-sm font-semibold text-neutral-600 hover:text-neutral-400 transition-colors cursor-default flex-shrink-0">
                  {name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6 lg:gap-8">
          {/* Brand */}
          <div className="col-span-2 lg:col-span-2">
            <Link to="/" onClick={scrollToTop} className="mb-4 flex h-12 w-40 items-center sm:mb-5 sm:w-48">
              <img src={logo} alt="GoodDebt" className="h-full w-full object-contain object-left" />
            </Link>
            <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed mb-3 sm:mb-4 max-w-sm">
              Good Debt assists customers in exploring loan options and connecting with suitable lending partners. Get personalized guidance for your financial needs.
            </p>
            <div className="grid grid-cols-2 gap-2 sm:block sm:space-y-2">
              <a href={`tel:${COMPANY_PHONE}`} className="flex items-center gap-2 text-xs sm:text-sm text-neutral-400 hover:text-white transition-colors group">
                <div className="w-6 h-6 sm:w-7 sm:h-7 bg-neutral-800 group-hover:bg-brand-900 rounded-lg flex items-center justify-center transition-colors">
                  <Phone className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-brand-400" />
                </div>
                <span className="truncate">{COMPANY_PHONE}</span>
              </a>
              <a href={`mailto:${COMPANY_EMAIL}`} className="flex items-center gap-2 text-xs sm:text-sm text-neutral-400 hover:text-white transition-colors group">
                <div className="w-6 h-6 sm:w-7 sm:h-7 bg-neutral-800 group-hover:bg-brand-900 rounded-lg flex items-center justify-center transition-colors">
                  <Mail className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-brand-400" />
                </div>
                <span className="truncate">{COMPANY_EMAIL}</span>
              </a>
              <a href={`https://wa.me/${COMPANY_WHATSAPP.replace('+', '')}`} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 text-xs sm:text-sm text-neutral-400 hover:text-white transition-colors group">
                <div className="w-6 h-6 sm:w-7 sm:h-7 bg-neutral-800 group-hover:bg-green-900/40 rounded-lg flex items-center justify-center transition-colors">
                  <MessageCircle className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-green-400" />
                </div>
                <span>WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Loan Products */}
          <div>
            <h3 className="text-[11px] sm:text-xs font-semibold text-white uppercase tracking-wider mb-2 sm:mb-3">Loan Products</h3>
            <ul className="space-y-1.5 sm:space-y-2">
              {loanLinks.map(l => (
                <li key={l.to}>
                  <Link to={l.to} className="text-xs sm:text-sm text-neutral-400 hover:text-brand-400 hover:translate-x-1 transition-all inline-flex items-center gap-1 leading-snug">
                    {l.label} <ChevronRight className="w-3 h-3 opacity-0 -ml-3 group-hover:opacity-100" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-[11px] sm:text-xs font-semibold text-white uppercase tracking-wider mb-2 sm:mb-3">Company</h3>
            <ul className="space-y-1.5 sm:space-y-2">
              {[
                { to: '/about', label: 'About Us' },
                { to: '/contact', label: 'Contact' },
                { to: '/faq', label: 'FAQ' },
                { to: '/emi-calculator', label: 'EMI Calculator' },
                { to: '/eligibility', label: 'Eligibility Check' },
              ].map(l => (
                <li key={l.to}><Link to={l.to} className="text-xs sm:text-sm text-neutral-400 hover:text-brand-400 transition-colors leading-snug">{l.label}</Link></li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-[11px] sm:text-xs font-semibold text-white uppercase tracking-wider mb-2 sm:mb-3">Legal</h3>
            <ul className="space-y-1.5 sm:space-y-2">
              {[
                { to: '/privacy-policy', label: 'Privacy Policy' },
                { to: '/terms', label: 'Terms of Service' },
                { to: '/disclaimer', label: 'Disclaimer' },
              ].map(l => (
                <li key={l.to}><Link to={l.to} className="text-xs sm:text-sm text-neutral-400 hover:text-brand-400 transition-colors leading-snug">{l.label}</Link></li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-6 sm:mt-8 lg:mt-10 pt-4 sm:pt-5 lg:pt-6 border-t border-neutral-800">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 lg:gap-4">
            <p className="text-xs text-neutral-500 leading-relaxed max-w-3xl">
              <strong className="text-neutral-400">Disclaimer:</strong> Good Debt is a loan assistance service (DSA). We assist customers in exploring loan options and connecting with suitable lending partners. Loan approval, interest rates, tenure and final terms are subject to the respective lender's eligibility criteria, policies and approval. Good Debt does not guarantee loan approval.
            </p>
            <p className="text-xs text-neutral-600 whitespace-nowrap">© {new Date().getFullYear()} Good Debt. All rights reserved.</p>
          </div>
          <div className="flex items-center gap-4 mt-3 sm:mt-4">
            <Link to="/privacy-policy" className="text-xs text-neutral-500 hover:text-neutral-300 transition-colors">Privacy</Link>
            <Link to="/terms" className="text-xs text-neutral-500 hover:text-neutral-300 transition-colors">Terms</Link>
            <Link to="/disclaimer" className="text-xs text-neutral-500 hover:text-neutral-300 transition-colors">Disclaimer</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
