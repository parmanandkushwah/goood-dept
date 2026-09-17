import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { dashboardApi } from '../../api';
import { formatDate } from '../../utils';
import { fadeInUp, viewportConfig } from '../../animations/variants';

const COLORS = ['#9E1E27', '#E5E7EB', '#B52A34', '#F59E0B', '#16A34A', '#667085', '#8B5CF6', '#06B6D4'];

export default function Reports() {
  const [period, setPeriod] = useState(30);

  const { data: trendsData } = useQuery({ queryKey: ['report-trends', period], queryFn: () => dashboardApi.getLeadTrends({ days: period }), staleTime: 60000 });
  const { data: distData } = useQuery({ queryKey: ['report-dist'], queryFn: dashboardApi.getLoanDistribution, staleTime: 60000 });
  const { data: statusData } = useQuery({ queryKey: ['report-status'], queryFn: dashboardApi.getStatusDistribution, staleTime: 60000 });
  const { data: funnelData } = useQuery({ queryKey: ['report-funnel'], queryFn: dashboardApi.getConversion, staleTime: 60000 });
  const { data: empData } = useQuery({ queryKey: ['report-emp'], queryFn: dashboardApi.getEmployeePerformance, staleTime: 60000 });
  const { data: sourceData } = useQuery({ queryKey: ['report-sources'], queryFn: dashboardApi.getSourcePerformance, staleTime: 60000 });

  const trends = (trendsData?.data?.data || []).map(t => ({ date: formatDate(t.date), count: parseInt(t.count) }));
  const dist = (distData?.data?.data || []).map(d => ({ name: d.loanType?.replace(/-/g, ' ') || 'Unknown', value: parseInt(d.count) }));
  const statusDist = (statusData?.data?.data || []).map(s => ({ name: s.status, value: parseInt(s.count) }));
  const funnel = funnelData?.data?.data || [];
  const emp = empData?.data?.data || [];
  const sources = sourceData?.data?.data || [];

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-3">
        <div>
          <h1 className="text-2xl font-display font-bold text-neutral-900">Reports</h1>
          <p className="text-sm text-neutral-400 mt-1">Analytics and performance insights</p>
        </div>
        <div className="flex gap-1 bg-neutral-100 rounded-xl p-1">
          {[7, 14, 30, 90].map(d => (
            <button key={d} onClick={() => setPeriod(d)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${period === d ? 'bg-white text-brand-600 shadow-sm' : 'text-neutral-500 hover:text-neutral-700'}`}>
              {d}d
            </button>
          ))}
        </div>
      </div>

      {/* Funnel */}
      {funnel.length > 0 && (
        <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={viewportConfig} className="card mb-5">
          <h3 className="font-semibold text-neutral-900 mb-4 text-sm">Conversion Funnel</h3>
          <div className="space-y-2">
            {funnel.map((item, i) => {
              const max = funnel[0]?.count || 1;
              const pct = Math.round((item.count / max) * 100);
              return (
                <div key={item.status} className="flex items-center gap-3">
                  <span className="text-xs text-neutral-500 w-28 flex-shrink-0 truncate">{item.status.replace(/_/g, ' ')}</span>
                  <div className="flex-1 bg-neutral-100 rounded-full h-3 overflow-hidden">
                    <motion.div initial={{ width: 0 }} whileInView={{ width: `${pct}%` }} viewport={viewportConfig} transition={{ duration: 0.8, delay: i * 0.1 }} className="h-3 rounded-full bg-brand-500" />
                  </div>
                  <span className="text-xs font-semibold text-neutral-700 w-8 text-right">{item.count}</span>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}

      <div className="grid lg:grid-cols-2 gap-5 mb-5">
        <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={viewportConfig} className="card">
          <h3 className="font-semibold text-neutral-900 mb-4 text-sm">Lead Trend</h3>
          {trends.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={trends}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" tick={{ fontSize: 10 }} tickLine={false} />
                <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #E5E7EB', fontSize: 12 }} />
                <Line type="monotone" dataKey="count" stroke="#9E1E27" strokeWidth={2.5} dot={{ r: 3, fill: '#9E1E27' }} />
              </LineChart>
            </ResponsiveContainer>
          ) : <div className="h-52 flex items-center justify-center text-neutral-400 text-sm">No data yet</div>}
        </motion.div>

        <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={viewportConfig} className="card">
          <h3 className="font-semibold text-neutral-900 mb-4 text-sm">Loan Type Distribution</h3>
          {dist.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={dist} cx="50%" cy="50%" outerRadius={90} dataKey="value" label={({ name, percent }) => `${name?.slice(0, 8)} ${(percent * 100).toFixed(0)}%`} labelLine={false} fontSize={10}>
                  {dist.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #E5E7EB', fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          ) : <div className="h-52 flex items-center justify-center text-neutral-400 text-sm">No data yet</div>}
        </motion.div>
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={viewportConfig} className="card">
          <h3 className="font-semibold text-neutral-900 mb-4 text-sm">Lead Sources</h3>
          {sources.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={sources} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 10 }} tickLine={false} />
                <YAxis dataKey="source" type="category" tick={{ fontSize: 10 }} tickLine={false} width={100} />
                <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #E5E7EB', fontSize: 12 }} />
                <Bar dataKey="count" fill="#9E1E27" radius={[0, 6, 6, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          ) : <div className="h-48 flex items-center justify-center text-neutral-400 text-sm">No data yet</div>}
        </motion.div>

        <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={viewportConfig} className="card">
          <h3 className="font-semibold text-neutral-900 mb-4 text-sm">Employee Performance</h3>
          {emp.length > 0 ? (
            <div className="space-y-3">
              {emp.map((e, i) => {
                const max = Math.max(...emp.map(x => x.count || 0), 1);
                const pct = Math.round(((e.count || 0) / max) * 100);
                return (
                  <div key={i}>
                    <div className="flex justify-between mb-1">
                      <span className="text-xs text-neutral-700 font-medium">{e.name || 'Unknown'}</span>
                      <span className="text-xs text-neutral-400">{e.count || 0}</span>
                    </div>
                    <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
                      <div className="h-2 rounded-full bg-brand-500" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : <div className="h-48 flex items-center justify-center text-neutral-400 text-sm">No data yet</div>}
        </motion.div>
      </div>
    </div>
  );
}
