import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Edit2, Trash2, Eye, X, CheckCircle, Loader2, MessageSquare } from 'lucide-react';
import { faqsApi } from '../../api';
import { PageLoader } from '../../components/ui/Spinner';
import { useToast } from '../../components/ui/Toast';

export default function AdminFAQs() {
  const { toast } = useToast();
  const qc = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ question: '', answer: '', published: true });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-faqs'],
    queryFn: () => faqsApi.getAll({ limit: 100 }),
  });

  const faqs = data?.data?.data || [];

  const createMutation = useMutation({
    mutationFn: faqsApi.create,
    onSuccess: () => { toast('FAQ created', 'success'); setShowForm(false); setForm({ question: '', answer: '', published: true }); qc.invalidateQueries(['admin-faqs']); },
    onError: () => toast('Failed', 'error'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => faqsApi.update(id, data),
    onSuccess: () => { toast('FAQ updated', 'success'); setShowForm(false); setEditing(null); setForm({ question: '', answer: '', published: true }); qc.invalidateQueries(['admin-faqs']); },
    onError: () => toast('Failed', 'error'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => faqsApi.delete(id),
    onSuccess: () => { toast('FAQ deleted', 'success'); qc.invalidateQueries(['admin-faqs']); },
    onError: () => toast('Failed', 'error'),
  });

  const handleSubmit = () => {
    if (!form.question.trim() || !form.answer.trim()) { toast('Question and answer required', 'error'); return; }
    setIsSubmitting(true);
    if (editing) updateMutation.mutate({ id: editing.id, data: form });
    else createMutation.mutate(form);
    setTimeout(() => setIsSubmitting(false), 500);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="text-2xl font-display font-bold text-neutral-900">FAQs</h1><p className="text-sm text-neutral-400 mt-1">Manage frequently asked questions</p></div>
        <button onClick={() => { setEditing(null); setForm({ question: '', answer: '', published: true }); setShowForm(true); }} className="btn-primary text-sm"><Plus className="w-4 h-4" /> Add FAQ</button>
      </div>

      {isLoading ? <PageLoader /> : (
        <div className="space-y-3">
          {faqs.map(f => (
            <div key={f.id} className="card flex items-start gap-4">
              <div className="flex-1">
                <h3 className="font-semibold text-neutral-900 text-sm mb-1">{f.question}</h3>
                <p className="text-xs text-neutral-500 line-clamp-2">{f.answer}</p>
                <div className="flex items-center gap-3 mt-2">
                  <span className={`badge ${f.published ? 'badge-green' : 'badge-gray'}`}>{f.published ? 'Published' : 'Draft'}</span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => { setEditing(f); setForm({ question: f.question, answer: f.answer, published: f.published }); setShowForm(true); }} className="p-1.5 rounded-lg hover:bg-brand-50 text-neutral-400 hover:text-brand-600 transition-colors">
                  <Edit2 className="w-4 h-4" />
                </button>
                <button onClick={() => { if (window.confirm('Delete?')) deleteMutation.mutate(f.id); }} className="p-1.5 rounded-lg hover:bg-brand-50 text-neutral-400 hover:text-brand-600 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
          {faqs.length === 0 && <div className="card text-center py-12 text-neutral-400">No FAQs found</div>}
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-display font-bold text-neutral-900">{editing ? 'Edit' : 'Create'} FAQ</h2>
              <button onClick={() => setShowForm(false)} className="p-2 rounded-lg hover:bg-neutral-100 text-neutral-500 transition-colors"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-4">
              <div><label className="label">Question *</label><input value={form.question} onChange={e => setForm(p => ({ ...p, question: e.target.value }))} className="input-field" placeholder="Enter question" /></div>
              <div><label className="label">Answer *</label><textarea rows={5} value={form.answer} onChange={e => setForm(p => ({ ...p, answer: e.target.value }))} className="input-field resize-none" placeholder="Enter answer" /></div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.published} onChange={e => setForm(p => ({ ...p, published: e.target.checked }))} className="rounded border-neutral-300 text-brand-600 focus:ring-brand-500" />
                <span className="text-sm text-neutral-600">Published</span>
              </label>
              <button onClick={handleSubmit} disabled={isSubmitting} className="btn-primary w-full">
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : editing ? <CheckCircle className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                {editing ? 'Update FAQ' : 'Create FAQ'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
