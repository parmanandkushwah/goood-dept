import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp, Users, FileText, CreditCard, Clock, DollarSign,
  CheckCircle, XCircle, RefreshCw, ArrowUpRight, Activity
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import { useQuery } from '@tanstack/react-query';
import { dashboardApi, leadsApi } from '../../api';
import { formatDate, formatCurrency } from '../../utils';
import { staggerContainer, fadeInUp, viewportConfig } from '../../animations/variants';
import { PageLoader } from '../../components/ui/Spinner';

const COLORS = ['#9E1E27', '#E5E7EB', '#B52A34', '#F59E0B', '#16A34A', '#667085'];

function StatCard({ icon: Icon, label, value, sub, color, loading }) {
  const colorMap = {
    brand: 'bg-brand-50 text-brand-600',
    green: 'bg-green-50 text-green-600',
    orange: 'bg-orange-50 text-orange-600',
    blue: 'bg-sky-50 text-sky-600',
    purple: 'bg-violet-50 text-violet-600',
    teal: 'bg-teal-50 text-teal-600',
    yellow: 'bg-amber-50 text-amber-600',
  };
  return (
    <motion.div variants={fadeInUp} className="bg-white rounded-2xl border border-neutral-200 p-5 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${colorMap[color] || colorMap.brand}`}>
          <Icon className="w-5 h-5" />
        </div>
        <span className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400">{sub}</span>
      </div>
      {loading ? (
        <div className="h-8 bg-neutral-100 rounded animate-pulse mb-1 w-20" />
      ) : (
        <p className="text-2xl font-display font-bold text-neutral-900">{value ?? 0}</p>
      )}
      <p className="text-xs text-neutral-400 mt-1">{label}</p>
    </motion.div>
  );
}

export default function Dashboard() {
  const { data: statsData, isLoading: statsLoading } = useQuery({ queryKey: ['dashboard-stats'], queryFn: dashboardApi.getStats, staleTime: 60000 });
  const { data: trendsData } = useQuery({ queryKey: ['lead-trends'], queryFn: () => dashboardApi.getLeadTrends({ days: 30 }), staleTime: 60000 });
  const { data: distData } = useQuery({ queryKey: ['loan-distribution'], queryFn: dashboardApi.getLoanDistribution, staleTime: 60000 });
  const { data: statusData } = useQuery({ queryKey: ['status-distribution'], queryFn: dashboardApi.getStatusDistribution, staleTime: 60000 });
  const { data: funnelData } = useQuery({ queryKey: ['conversion'], queryFn: dashboardApi.getConversion, staleTime: 60000 });
  const { data: recentLeads } = useQuery({ queryKey: ['recent-leads'], queryFn: () => leadsApi.getAll({ page: 1, limit: 5 }), staleTime: 60000 });

  const stats = statsData?.data?.data || {};
  const trends = (trendsData?.data?.data || []).map(t => ({ date: formatDate(t.date), count: parseInt(t.count) }));
  const dist = (distData?.data?.data || []).map(d => ({ name: d.loanType?.replace(/-/g, ' ') || 'Unknown', value: parseInt(d.count) }));
  const statusDist = (statusData?.data?.data || []).map(s => ({ name: s.status, value: parseInt(s.count) }));
  const funnel = funnelData?.data?.data || [];
  const recent = recentLeads?.data?.data || [];

  const recentColors = ['bg-brand-50 text-brand-600', 'bg-green-50 text-green-600', 'bg-violet-50 text-violet-600', 'bg-orange-50 text-orange-600', 'bg-teal-50 text-teal-600'];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-display font-bold text-neutral-900">Dashboard</h1>
        <p className="text-sm text-neutral-400 mt-1">Overview of your loan lead pipeline</p>
      </div>

      {/* Stats */}
      <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <StatCard icon={FileText} label="Total Leads" value={stats.total} sub="All Time" color="brand" loading={statsLoading} />
        <StatCard icon={Activity} label="New Today" value={stats.today} sub="Today" color="green" loading={statsLoading} />
        <StatCard icon={TrendingUp} label="This Week" value={stats.thisWeek} sub="7 Days" color="orange" loading={statsLoading} />
        <StatCard icon={Users} label="Qualified" value={stats.qualified} sub="Qualified" color="purple" loading={statsLoading} />
        <StatCard icon={CheckCircle} label="Approved" value={stats.approved} sub="Approved" color="teal" loading={statsLoading} />
        <StatCard icon={DollarSign} label="Disbursed" value={stats.disbursed} sub="Paid" color="yellow" loading={statsLoading} />
        <StatCard icon={Clock} label="Pending" value={stats.pending || 0} sub="Follow Up" color="orange" loading={statsLoading} />
        <StatCard icon={RefreshCw} label="Contacted" value={stats.contacted || 0} sub="Recent" color="blue" loading={statsLoading} />
      </motion.div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-5 mb-5">
        <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={viewportConfig} className="bg-white rounded-2xl border border-neutral-200 p-5">
          <h3 className="font-semibold text-neutral-900 mb-4 text-sm">Lead Trend (Last 30 Days)</h3>
          {trends.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={trends}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" tick={{ fontSize: 10 }} tickLine={false} />
                <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #E5E7EB', fontSize: 12 }} />
                <Line type="monotone" dataKey="count" stroke="#9E1E27" strokeWidth={2.5} dot={{ r: 3, fill: '#9E1E27' }} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-48 flex items-center justify-center text-neutral-400 text-sm">No data yet</div>
          )}
        </motion.div>

        <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={viewportConfig} className="bg-white rounded-2xl border border-neutral-200 p-5">
          <h3 className="font-semibold text-neutral-900 mb-4 text-sm">Loan Type Distribution</h3>
          {dist.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={dist} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, percent }) => `${name?.slice(0, 8)} ${(percent * 100).toFixed(0)}%`} labelLine={false} fontSize={10}>
                  {dist.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #E5E7EB', fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-48 flex items-center justify-center text-neutral-400 text-sm">No data yet</div>
          )}
        </motion.div>
      </div>

      {/* Bottom Row */}
      <div className="grid lg:grid-cols-3 gap-5">
        <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={viewportConfig} className="lg:col-span-2 bg-white rounded-2xl border border-neutral-200 p-5">
          <h3 className="font-semibold text-neutral-900 mb-4 text-sm">Lead Status Distribution</h3>
          {statusDist.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={statusDist} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 10 }} tickLine={false} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 10 }} tickLine={false} width={100} />
                <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #E5E7EB', fontSize: 12 }} />
                <Bar dataKey="value" fill="#9E1E27" radius={[0, 6, 6, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-48 flex items-center justify-center text-neutral-400 text-sm">No data yet</div>
          )}
        </motion.div>

        <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={viewportConfig} className="bg-white rounded-2xl border border-neutral-200 p-5">
          <h3 className="font-semibold text-neutral-900 mb-4 text-sm">Recent Leads</h3>
          <div className="space-y-3">
            {recent.slice(0, 5).map((lead, i) => (
              <div key={lead.id} className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full ${recentColors[i % 5]} flex items-center justify-center text-xs font-bold flex-shrink-0`}>
                  {lead.fullName?.[0] || '?'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-neutral-900 truncate">{lead.fullName}</p>
                  <p className="text-[10px] text-neutral-400">{lead.leadNumber}</p>
                </div>
                <span className="text-xs text-neutral-500 whitespace-nowrap">{formatDate(lead.createdAt)}</span>
              </div>
            ))}
            {recent.length === 0 && <p className="text-sm text-neutral-400 text-center py-8">No leads yet</p>}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
