import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Search, Eye, RefreshCw, ChevronLeft, ChevronRight, CheckCircle, Clock } from 'lucide-react';
import { leadsApi, followUpsApi } from '../../api';
import { LEAD_STATUS_LABELS, PRIORITY_LABELS } from '../../constants';
import { formatDate, formatDateTime, debounce } from '../../utils';
import { PageLoader } from '../../components/ui/Spinner';

export default function FollowUps() {
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const debounceTimer = useRef(null);

  useEffect(() => {
    debounceTimer.current = setTimeout(() => {
      setDebouncedSearch(search);
    }, 400);
    return () => clearTimeout(debounceTimer.current);
  }, [search]);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['followups', debouncedSearch],
    queryFn: () => followUpsApi.getAll({ limit: 50, search: debouncedSearch }),
    staleTime: 30000,
  });

  const followUps = data?.data?.data || [];

  const getStatusBadge = (status) => {
    const s = LEAD_STATUS_LABELS[status];
    return s ? <span className={`badge ${s.color}`}>{s.label}</span> : <span className="badge bg-neutral-100 text-neutral-600">{status}</span>;
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-display font-bold text-neutral-900">Follow-ups</h1>
          <p className="text-sm text-neutral-400 mt-1">{followUps.length} scheduled follow-ups</p>
        </div>
        <button onClick={() => refetch()} className="p-2 rounded-lg hover:bg-neutral-100 text-neutral-500 transition-colors">
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-neutral-200 p-4 mb-5 shadow-sm">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input type="text" placeholder="Search by customer name, lead ID..." value={search} onChange={e => setSearch(e.target.value)}
            className="input-field pl-9 py-2.5 text-sm" />
        </div>
      </div>

      {isLoading ? <PageLoader /> : (
        <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-100 bg-neutral-50">
                  {['Follow-up ID', 'Customer', 'Lead ID', 'Loan Type', 'Scheduled For', 'Status', 'Created'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-50">
                {followUps.length === 0 ? (
                  <tr><td colSpan={7} className="text-center py-12 text-neutral-400 text-sm">No follow-ups found</td></tr>
                ) : followUps.map(f => (
                  <tr key={f.id} className="hover:bg-neutral-50/80 transition-colors">
                    <td className="px-4 py-3 text-xs font-mono text-brand-600">{f.id}</td>
                    <td className="px-4 py-3">
                      <p className="text-sm font-medium text-neutral-900">{f.lead?.fullName || '—'}</p>
                      <p className="text-xs text-neutral-400">{f.lead?.mobile || '—'}</p>
                    </td>
                    <td className="px-4 py-3 text-xs text-neutral-600">{f.lead?.leadNumber || '—'}</td>
                    <td className="px-4 py-3 text-xs text-neutral-600">{f.lead?.loanType ? f.lead.loanType.replace(/-/g, ' ') : '—'}</td>
                    <td className="px-4 py-3 text-xs text-neutral-600 whitespace-nowrap">{formatDateTime(f.scheduledAt)}</td>
                    <td className="px-4 py-3">
                      {f.isCompleted ? (
                        <span className="badge bg-green-100 text-green-700"><CheckCircle className="w-3 h-3" /> Completed</span>
                      ) : (
                        <span className="badge bg-amber-100 text-amber-700"><Clock className="w-3 h-3" /> Pending</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-xs text-neutral-400 whitespace-nowrap">{formatDate(f.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
