import { useState } from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { calculateEMI, formatCurrency } from '../utils';
import { fadeInUp, viewportConfig } from '../animations/variants';
import SectionHeader from '../components/ui/SectionHeader';
import { useToast } from '../components/ui/Toast';

export default function EMICalculator() {
  const [principal, setPrincipal] = useState(500000);
  const [rate, setRate] = useState(12);
  const [tenure, setTenure] = useState(36);
  const { toast } = useToast();

  const emi = calculateEMI(principal, rate, tenure);
  const totalAmount = emi * tenure;
  const totalInterest = totalAmount - principal;

  const chartData = [
    { name: 'Principal', value: Math.round(principal) },
    { name: 'Interest', value: Math.round(totalInterest) },
  ];
  const COLORS = ['#9E1E27', '#E5E7EB'];

  return (
    <div className="pt-16">
      {/* Hero */}
      <section className="bg-gradient-to-br from-neutral-50 to-white py-10 sm:py-14 lg:py-28">
        <div className="container-xl">
          <motion.div variants={fadeInUp} initial="hidden" animate="visible" className="text-center max-w-2xl mx-auto">
            <span className="eyebrow mb-4">EMI Calculator</span>
            <h1 className="heading-xl mb-5">Plan Your Repayment</h1>
            <p className="body-md">Calculate your estimated monthly loan repayment. Plan your finances before applying.</p>
          </motion.div>
        </div>
      </section>

      <section className="section bg-white">
        <div className="container-xl">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16">
            {/* Inputs */}
            <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={viewportConfig} className="card p-5 sm:p-6">
              <h2 className="font-display font-bold text-neutral-900 text-lg sm:text-xl mb-5 sm:mb-6">Loan Details</h2>
              <div className="space-y-5 sm:space-y-6">
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="label mb-0">Loan Amount</label>
                    <span className="text-sm font-bold text-brand-600">{formatCurrency(principal)}</span>
                  </div>
                  <input type="range" min="50000" max="10000000" step="50000" value={principal}
                    onChange={e => setPrincipal(+e.target.value)} className="w-full h-2 bg-neutral-200 rounded-full appearance-none cursor-pointer accent-brand-600" />
                  <div className="flex justify-between text-xs text-neutral-400 mt-1">
                    <span>₹50K</span><span>₹1 Cr</span>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="label mb-0">Annual Interest Rate</label>
                    <span className="text-sm font-bold text-brand-600">{rate}% p.a.</span>
                  </div>
                  <input type="range" min="6" max="30" step="0.5" value={rate}
                    onChange={e => setRate(+e.target.value)} className="w-full h-2 bg-neutral-200 rounded-full appearance-none cursor-pointer accent-brand-600" />
                  <div className="flex justify-between text-xs text-neutral-400 mt-1">
                    <span>6%</span><span>30%</span>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="label mb-0">Loan Tenure</label>
                    <span className="text-sm font-bold text-brand-600">{tenure} months ({(tenure / 12).toFixed(1)} yrs)</span>
                  </div>
                  <input type="range" min="6" max="360" step="6" value={tenure}
                    onChange={e => setTenure(+e.target.value)} className="w-full h-2 bg-neutral-200 rounded-full appearance-none cursor-pointer accent-brand-600" />
                  <div className="flex justify-between text-xs text-neutral-400 mt-1">
                    <span>6 mo</span><span>30 yrs</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 sm:gap-3 mt-5 sm:mt-6 pt-5 sm:pt-6 border-t border-neutral-100">
                <div>
                  <label className="label text-xs">Amount (₹)</label>
                  <input type="number" value={principal} onChange={e => setPrincipal(+e.target.value)} className="input-field text-sm py-2" />
                </div>
                <div>
                  <label className="label text-xs">Rate (%)</label>
                  <input type="number" value={rate} step="0.1" onChange={e => setRate(+e.target.value)} className="input-field text-sm py-2" />
                </div>
                <div>
                  <label className="label text-xs">Months</label>
                  <input type="number" value={tenure} onChange={e => setTenure(+e.target.value)} className="input-field text-sm py-2" />
                </div>
              </div>
            </motion.div>

            {/* Results */}
            <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={viewportConfig} className="space-y-5">
              <div className="card bg-gradient-to-br from-brand-600 to-brand-700 text-white border-0">
                <p className="text-brand-200 text-sm mb-1">Monthly EMI</p>
                <p className="text-3xl sm:text-4xl font-display font-bold">{formatCurrency(emi)}</p>
                <p className="text-brand-200 text-xs mt-1">* Indicative only. Actual EMI may vary.</p>
              </div>
              <div className="card">
                <div className="space-y-3">
                  {[
                    { label: 'Principal Amount', value: formatCurrency(principal), color: 'text-brand-600' },
                    { label: 'Total Interest', value: formatCurrency(totalInterest), color: 'text-neutral-700' },
                    { label: 'Total Amount Payable', value: formatCurrency(totalAmount), color: 'text-neutral-900', bold: true },
                  ].map(item => (
                    <div key={item.label} className={`flex justify-between items-center py-2 ${item.bold ? 'border-t border-neutral-100 pt-3' : ''}`}>
                      <span className="text-sm text-neutral-600">{item.label}</span>
                      <span className={`text-sm font-semibold ${item.color} ${item.bold ? 'text-base' : ''}`}>{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="card">
                <h3 className="font-semibold text-neutral-900 mb-4 text-sm">Breakup</h3>
                <ResponsiveContainer width="100%" height={180}>
                  <PieChart>
                    <Pie data={chartData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                      {chartData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                    </Pie>
                    <Tooltip formatter={(v) => formatCurrency(v)} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex justify-center gap-6 mt-2">
                  {chartData.map((d, i) => (
                    <div key={d.name} className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ background: COLORS[i] }} />
                      <span className="text-xs text-neutral-600">{d.name}</span>
                    </div>
                  ))}
                </div>
              </div>
              <button onClick={() => toast('Use our eligibility checker for a personalized assessment', 'info')}
                className="btn-secondary w-full">
                Check Loan Eligibility
              </button>
            </motion.div>
          </div>

          <div className="mt-6 sm:mt-8 p-4 bg-amber-50 border border-amber-200 rounded-xl">
            <p className="text-xs text-amber-700 leading-relaxed">
              <strong>Disclaimer:</strong> This EMI calculator provides indicative figures for planning purposes only. Actual EMI, interest rate, and loan terms are determined by the respective lender based on their policies and your eligibility. Good Debt does not guarantee any specific loan terms.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
