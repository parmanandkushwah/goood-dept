import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, User, Phone, Mail, MapPin, Briefcase, DollarSign, Tag, Clock, Plus, UserCheck } from 'lucide-react';
import { leadsApi, usersApi } from '../../api';
import { LEAD_STATUS_LABELS, PRIORITY_LABELS } from '../../constants';
import { formatDate, formatDateTime, formatCurrency, getLoanTypeLabel } from '../../utils';
import { useToast } from '../../components/ui/Toast';
import { useAuth } from '../../context/AuthContext';
import { PageLoader } from '../../components/ui/Spinner';

export default function LeadDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const qc = useQueryClient();
  const [noteText, setNoteText] = useState('');
  const [followUpDate, setFollowUpDate] = useState('');
  const [followUpNote, setFollowUpNote] = useState('');
  const [newStatus, setNewStatus] = useState('');
  const [assignTo, setAssignTo] = useState('');

  const { data, isLoading } = useQuery({ queryKey: ['lead', id], queryFn: () => leadsApi.getById(id), enabled: !!id });
  const { data: usersData } = useQuery({ queryKey: ['users'], queryFn: usersApi.getAll });

  const lead = data?.data?.data;
  const users = usersData?.data?.data || [];
  const salesUsers = users.filter(u => ['SALES_EXECUTIVE', 'SALES_MANAGER'].includes(u.role));

  const invalidate = () => qc.invalidateQueries(['lead', id]);

  const statusMutation = useMutation({
    mutationFn: (data) => leadsApi.updateStatus(id, data),
    onSuccess: () => { toast('Status updated', 'success'); invalidate(); setNewStatus(''); },
    onError: () => toast('Failed to update status', 'error'),
  });

  const noteMutation = useMutation({
    mutationFn: (data) => leadsApi.addNote(id, data),
    onSuccess: () => { toast('Note added', 'success'); invalidate(); setNoteText(''); },
    onError: () => toast('Failed to add note', 'error'),
  });

  const followUpMutation = useMutation({
    mutationFn: (data) => leadsApi.addFollowUp(id, data),
    onSuccess: () => { toast('Follow-up scheduled', 'success'); invalidate(); setFollowUpDate(''); setFollowUpNote(''); },
    onError: () => toast('Failed to schedule follow-up', 'error'),
  });

  const assignMutation = useMutation({
    mutationFn: (data) => leadsApi.assign(id, data),
    onSuccess: () => { toast('Lead assigned', 'success'); invalidate(); setAssignTo(''); },
    onError: () => toast('Failed to assign lead', 'error'),
  });

  if (isLoading) return <PageLoader />;
  if (!lead) return <div className="text-center py-20 text-neutral-500">Lead not found</div>;

  const statusInfo = LEAD_STATUS_LABELS[lead.status];
  const allStatuses = Object.entries(LEAD_STATUS_LABELS);

  const timeline = [
    ...(lead.statusHistory || []).map(h => ({ type: 'status', date: h.createdAt, text: `Status changed to ${LEAD_STATUS_LABELS[h.toStatus]?.label || h.toStatus}`, by: h.changedByUser?.name })),
    ...(lead.notes || []).map(n => ({ type: 'note', date: n.createdAt, text: n.note, by: n.author?.name })),
    ...(lead.assignments || []).map(a => ({ type: 'assign', date: a.createdAt, text: `Assigned to ${a.assignee?.name || 'Unknown'}`, by: a.assigner?.name })),
  ].sort((a, b) => new Date(a.date) - new Date(b.date));

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate('/admin/leads')} className="p-2 rounded-lg hover:bg-neutral-100 text-neutral-500">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-xl font-display font-bold text-neutral-900">{lead.leadNumber}</h1>
          <p className="text-sm text-neutral-400">{lead.fullName} · {getLoanTypeLabel(lead.loanType)}</p>
        </div>
        <div className="ml-auto">
          {statusInfo && <span className={`badge ${statusInfo.color}`}>{statusInfo.label}</span>}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        {/* Left - Details */}
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-white rounded-2xl border border-neutral-200 p-5">
            <h3 className="font-semibold text-neutral-900 mb-4 text-sm">Customer Information</h3>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: User, label: 'Full Name', value: lead.fullName },
                { icon: Phone, label: 'Mobile', value: lead.mobile },
                { icon: Mail, label: 'Email', value: lead.email || '—' },
                { icon: MapPin, label: 'Location', value: lead.city ? `${lead.city}, ${lead.state}` : '—' },
                { icon: Briefcase, label: 'Employment', value: lead.employmentType || '—' },
                { icon: DollarSign, label: 'Monthly Income', value: formatCurrency(lead.monthlyIncome) },
                { icon: DollarSign, label: 'Existing EMI', value: formatCurrency(lead.existingEmi) },
                { icon: Tag, label: 'CIBIL Score', value: lead.cibilScore || '—' },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-start gap-3">
                  <div className="w-7 h-7 bg-neutral-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Icon className="w-3.5 h-3.5 text-neutral-500" />
                  </div>
                  <div>
                    <p className="text-xs text-neutral-400">{label}</p>
                    <p className="text-sm font-medium text-neutral-900">{value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-neutral-200 p-5">
            <h3 className="font-semibold text-neutral-900 mb-4 text-sm">Loan Requirement</h3>
            <div className="grid grid-cols-2 gap-4">
              <div><p className="text-xs text-neutral-400">Loan Type</p><p className="text-sm font-medium text-neutral-900">{getLoanTypeLabel(lead.loanType)}</p></div>
              <div><p className="text-xs text-neutral-400">Loan Amount</p><p className="text-sm font-medium text-neutral-900">{formatCurrency(lead.loanAmount)}</p></div>
              <div><p className="text-xs text-neutral-400">Source</p><p className="text-sm font-medium text-neutral-900 capitalize">{lead.source?.replace('_', ' ') || '—'}</p></div>
              <div><p className="text-xs text-neutral-400">Priority</p>
                <span className={`badge ${PRIORITY_LABELS[lead.priority]?.color}`}>{PRIORITY_LABELS[lead.priority]?.label}</span>
              </div>
              {lead.utmSource && <div><p className="text-xs text-neutral-400">UTM Source</p><p className="text-sm font-medium text-neutral-900">{lead.utmSource}</p></div>}
              {lead.utmCampaign && <div><p className="text-xs text-neutral-400">Campaign</p><p className="text-sm font-medium text-neutral-900">{lead.utmCampaign}</p></div>}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-neutral-200 p-5">
            <h3 className="font-semibold text-neutral-900 mb-4 text-sm">Activity Timeline</h3>
            {timeline.length === 0 ? (
              <p className="text-sm text-neutral-400">No activity yet</p>
            ) : (
              <div className="space-y-4">
                {timeline.map((item, i) => (
                  <div key={i} className="flex gap-3">
                    <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${item.type === 'status' ? 'bg-brand-500' : item.type === 'note' ? 'bg-green-500' : 'bg-orange-500'}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-neutral-700">{item.text}</p>
                      <p className="text-xs text-neutral-400 mt-0.5">{formatDateTime(item.date)}{item.by ? ` · ${item.by}` : ''}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right - Actions */}
        <div className="space-y-5">
          <div className="bg-white rounded-2xl border border-neutral-200 p-5">
            <h3 className="font-semibold text-neutral-900 mb-3 text-sm">Update Status</h3>
            <select value={newStatus} onChange={e => setNewStatus(e.target.value)} className="input-field text-sm mb-3">
              <option value="">Select new status</option>
              {allStatuses.map(([v, { label }]) => <option key={v} value={v}>{label}</option>)}
            </select>
            <button onClick={() => newStatus && statusMutation.mutate({ status: newStatus })}
              disabled={!newStatus || statusMutation.isLoading}
              className="btn-primary w-full text-sm py-2.5 disabled:opacity-40">Update Status</button>
          </div>

          <div className="bg-white rounded-2xl border border-neutral-200 p-5">
            <h3 className="font-semibold text-neutral-900 mb-3 text-sm">Assign Lead</h3>
            <p className="text-xs text-neutral-500 mb-2">Currently: {lead.assignedEmployee?.name || 'Unassigned'}</p>
            <select value={assignTo} onChange={e => setAssignTo(e.target.value)} className="input-field text-sm mb-3">
              <option value="">Select employee</option>
              {salesUsers.map(u => <option key={u.id} value={u.id}>{u.name} ({u.role.replace('_', ' ')})</option>)}
            </select>
            <button onClick={() => assignTo && assignMutation.mutate({ assignedTo: assignTo })}
              disabled={!assignTo || assignMutation.isLoading}
              className="btn-primary w-full text-sm py-2.5 disabled:opacity-40">
              <UserCheck className="w-4 h-4" /> Assign
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-neutral-200 p-5">
            <h3 className="font-semibold text-neutral-900 mb-3 text-sm">Add Note</h3>
            <textarea rows={3} value={noteText} onChange={e => setNoteText(e.target.value)}
              placeholder="Add a note about this lead..." className="input-field text-sm resize-none mb-3" />
            <button onClick={() => noteText.trim() && noteMutation.mutate({ note: noteText })}
              disabled={!noteText.trim() || noteMutation.isLoading}
              className="btn-primary w-full text-sm py-2.5 disabled:opacity-40">
              <Plus className="w-4 h-4" /> Add Note
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-neutral-200 p-5">
            <h3 className="font-semibold text-neutral-900 mb-3 text-sm">Schedule Follow-up</h3>
            <input type="datetime-local" value={followUpDate} onChange={e => setFollowUpDate(e.target.value)} className="input-field text-sm mb-3" />
            <textarea rows={2} value={followUpNote} onChange={e => setFollowUpNote(e.target.value)}
              placeholder="Follow-up notes..." className="input-field text-sm resize-none mb-3" />
            <button onClick={() => followUpDate && followUpMutation.mutate({ scheduledAt: followUpDate, notes: followUpNote })}
              disabled={!followUpDate || followUpMutation.isLoading}
              className="btn-primary w-full text-sm py-2.5 disabled:opacity-40">
              <Clock className="w-4 h-4" /> Schedule
            </button>
          </div>

          {lead.followUps?.length > 0 && (
            <div className="bg-white rounded-2xl border border-neutral-200 p-5">
              <h3 className="font-semibold text-neutral-900 mb-3 text-sm">Follow-ups</h3>
              <div className="space-y-3">
                {lead.followUps.map(f => (
                  <div key={f.id} className={`p-3 rounded-xl text-xs ${f.isCompleted ? 'bg-green-50 border border-green-100' : 'bg-neutral-50 border border-neutral-100'}`}>
                    <p className="font-medium text-neutral-900">{formatDateTime(f.scheduledAt)}</p>
                    {f.notes && <p className="text-neutral-500 mt-0.5">{f.notes}</p>}
                    <p className="text-neutral-400 mt-0.5">{f.isCompleted ? 'Completed' : 'Pending'}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
