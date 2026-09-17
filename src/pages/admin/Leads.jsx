import { useState, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Search, Filter, Eye, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';
import { leadsApi, usersApi } from '../../api';
import { LEAD_STATUS_LABELS, PRIORITY_LABELS, LOAN_TYPES } from '../../constants';
import { formatDate, formatCurrency, debounce, getLoanTypeLabel } from '../../utils';
import { PageLoader } from '../../components/ui/Spinner';
import Badge from '../../components/ui/Badge';

const STATUS_OPTIONS = Object.entries(LEAD_STATUS_LABELS).map(([v, { label }]) => ({ value: v, label }));

export default function Leads() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [filters, setFilters] = useState({ status: '', loanType: '', priority: '' });
  const [showFilters, setShowFilters] = useState(false);
  const debounceTimer = useRef(null);

  const handleSearch = (e) => {
    setSearch(e.target.value);
    clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      setDebouncedSearch(e.target.value);
      setPage(1);
    }, 400);
  };

  const handleFilter = (k, v) => { setFilters(p => ({ ...p, [k]: v })); setPage(1); };

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['leads', page, debouncedSearch, filters],
    queryFn: () => leadsApi.getAll({ page, limit: 20, search: debouncedSearch, ...filters }),
    keepPreviousData: true,
  });

  const leads = data?.data?.data || [];
  const pagination = data?.data?.pagination || {};

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-3">
        <div>
          <h1 className="text-2xl font-display font-bold text-neutral-900">Leads</h1>
          <p className="text-sm text-neutral-400 mt-1">{pagination.total || 0} total leads</p>
        </div>
        <button onClick={() => refetch()} className="p-2 rounded-lg hover:bg-neutral-100 text-neutral-500 transition-colors">
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Search & Filters */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-4 mb-5 shadow-sm">
        <div className="flex gap-3 mb-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input type="text" placeholder="Search by name, mobile, email, lead ID..." value={search} onChange={handleSearch}
              className="input-field pl-9 py-2.5 text-sm" />
          </div>
          <button onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-colors ${showFilters ? 'bg-brand-50 border-brand-200 text-brand-700' : 'border-neutral-200 text-neutral-600 hover:bg-neutral-50'}`}>
            <Filter className="w-4 h-4" /> Filters
          </button>
        </div>
        {showFilters && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-3 border-t border-neutral-100">
            <select value={filters.status} onChange={e => handleFilter('status', e.target.value)} className="input-field py-2 text-sm">
              <option value="">All Statuses</option>
              {STATUS_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            <select value={filters.loanType} onChange={e => handleFilter('loanType', e.target.value)} className="input-field py-2 text-sm">
              <option value="">All Loan Types</option>
              {LOAN_TYPES.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
            </select>
            <select value={filters.priority} onChange={e => handleFilter('priority', e.target.value)} className="input-field py-2 text-sm">
              <option value="">All Priorities</option>
              {Object.entries(PRIORITY_LABELS).map(([v, { label }]) => <option key={v} value={v}>{label}</option>)}
            </select>
          </div>
        )}
      </div>

      {/* Desktop Table */}
      {isLoading ? <PageLoader /> : (
        <>
          <div className="hidden md:block bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-neutral-100 bg-neutral-50">
                    {['Lead ID', 'Customer', 'Loan Type', 'Amount', 'City', 'Status', 'Priority', 'Assigned To', 'Created', 'Actions'].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-50">
                  {leads.length === 0 ? (
                    <tr><td colSpan={10} className="text-center py-12 text-neutral-400 text-sm">No leads found</td></tr>
                  ) : leads.map(lead => (
                    <tr key={lead.id} className="hover:bg-neutral-50/80 transition-colors">
                      <td className="px-4 py-3 text-xs font-mono font-medium text-brand-600">{lead.leadNumber}</td>
                      <td className="px-4 py-3">
                        <p className="text-sm font-medium text-neutral-900">{lead.fullName}</p>
                        <p className="text-xs text-neutral-400">{lead.mobile}</p>
                      </td>
                      <td className="px-4 py-3 text-xs text-neutral-600 whitespace-nowrap">{getLoanTypeLabel(lead.loanType)}</td>
                      <td className="px-4 py-3 text-xs text-neutral-600 whitespace-nowrap">{formatCurrency(lead.loanAmount)}</td>
                      <td className="px-4 py-3 text-xs text-neutral-600">{lead.city || '—'}</td>
                      <td className="px-4 py-3">
                        {(() => {
                          const s = LEAD_STATUS_LABELS[lead.status];
                          return s ? <span className={`badge ${s.color}`}>{s.label}</span> : <span className="badge bg-neutral-100 text-neutral-600">{lead.status}</span>;
                        })()}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`badge ${PRIORITY_LABELS[lead.priority]?.color || 'bg-neutral-100 text-neutral-600'}`}>
                          {PRIORITY_LABELS[lead.priority]?.label || lead.priority}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-neutral-600">{lead.assignedEmployee?.name || '—'}</td>
                      <td className="px-4 py-3 text-xs text-neutral-400 whitespace-nowrap">{formatDate(lead.createdAt)}</td>
                      <td className="px-4 py-3">
                        <Link to={`/admin/leads/${lead.id}`} className="p-1.5 rounded-lg hover:bg-brand-50 text-neutral-400 hover:text-brand-600 transition-colors inline-flex">
                          <Eye className="w-4 h-4" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-3">
            {leads.length === 0 ? (
              <div className="text-center py-12 text-neutral-400 text-sm bg-white rounded-2xl border border-neutral-100">No leads found</div>
            ) : leads.map(lead => (
              <div key={lead.id} className="bg-white rounded-2xl border border-neutral-100 p-4 shadow-sm">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="text-xs font-mono text-brand-600 font-medium">{lead.leadNumber}</p>
                    <p className="font-semibold text-neutral-900 text-sm">{lead.fullName}</p>
                    <p className="text-xs text-neutral-400">{lead.mobile}</p>
                  </div>
                  {(() => {
                    const s = LEAD_STATUS_LABELS[lead.status];
                    return s ? <span className={`badge ${s.color}`}>{s.label}</span> : null;
                  })()}
                </div>
                <div className="flex items-center justify-between mt-3">
                  <div>
                    <p className="text-xs text-neutral-500">{getLoanTypeLabel(lead.loanType)} · {formatCurrency(lead.loanAmount)}</p>
                    <p className="text-xs text-neutral-400">{formatDate(lead.createdAt)}</p>
                  </div>
                  <Link to={`/admin/leads/${lead.id}`} className="flex items-center gap-1 px-3 py-1.5 bg-brand-50 text-brand-600 text-xs font-medium rounded-lg hover:bg-brand-100 transition-colors">
                    <Eye className="w-3 h-3" /> View
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="flex items-center justify-between mt-5 bg-white rounded-2xl border border-neutral-100 px-4 py-3 shadow-sm">
              <p className="text-xs text-neutral-500">Page {pagination.page} of {pagination.pages} · {pagination.total} results</p>
              <div className="flex gap-2">
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                  className="p-2 rounded-lg hover:bg-neutral-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button onClick={() => setPage(p => Math.min(pagination.pages, p + 1))} disabled={page === pagination.pages}
                  className="p-2 rounded-lg hover:bg-neutral-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
