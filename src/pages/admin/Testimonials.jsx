import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Edit2, Trash2, Eye, X, CheckCircle, Loader2, Star } from 'lucide-react';
import { testimonialsApi } from '../../api';
import { PageLoader } from '../../components/ui/Spinner';
import { useToast } from '../../components/ui/Toast';

export default function AdminTestimonials() {
  const { toast } = useToast();
  const qc = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', review: '', location: '', loanType: '', rating: 5, published: true });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-testimonials'],
    queryFn: () => testimonialsApi.getAll({ limit: 100 }),
  });

  const testimonials = data?.data?.data || [];

  const createMutation = useMutation({
    mutationFn: testimonialsApi.create,
    onSuccess: () => { toast('Testimonial created', 'success'); setShowForm(false); setForm({ name: '', review: '', location: '', loanType: '', rating: 5, published: true }); qc.invalidateQueries(['admin-testimonials']); },
    onError: () => toast('Failed', 'error'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => testimonialsApi.update(id, data),
    onSuccess: () => { toast('Testimonial updated', 'success'); setShowForm(false); setEditing(null); setForm({ name: '', review: '', location: '', loanType: '', rating: 5, published: true }); qc.invalidateQueries(['admin-testimonials']); },
    onError: () => toast('Failed', 'error'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => testimonialsApi.delete(id),
    onSuccess: () => { toast('Testimonial deleted', 'success'); qc.invalidateQueries(['admin-testimonials']); },
    onError: () => toast('Failed', 'error'),
  });

  const handleSubmit = () => {
    if (!form.name.trim() || !form.review.trim()) { toast('Name and review required', 'error'); return; }
    setIsSubmitting(true);
    if (editing) updateMutation.mutate({ id: editing.id, data: form });
    else createMutation.mutate(form);
    setTimeout(() => setIsSubmitting(false), 500);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="text-2xl font-display font-bold text-neutral-900">Testimonials</h1><p className="text-sm text-neutral-400 mt-1">Manage customer reviews</p></div>
        <button onClick={() => { setEditing(null); setForm({ name: '', review: '', location: '', loanType: '', rating: 5, published: true }); setShowForm(true); }} className="btn-primary text-sm"><Plus className="w-4 h-4" /> Add Review</button>
      </div>

      {isLoading ? <PageLoader /> : (
        <div className="space-y-3">
          {testimonials.map(t => (
            <div key={t.id} className="card flex items-start gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-1 mb-2">
                  {[...Array(5)].map((_, i) => <Star key={i} className={`w-3.5 h-3.5 ${i < t.rating ? 'text-amber-400 fill-amber-400' : 'text-neutral-200'}`} />)}
                </div>
                <p className="text-sm text-neutral-700 line-clamp-2">"{t.review}"</p>
                <p className="text-xs text-neutral-400 mt-1">{t.name} · {t.location}{t.loanType ? ` · ${t.loanType}` : ''}</p>
                <span className={`badge mt-2 ${t.published ? 'badge-green' : 'badge-gray'}`}>{t.published ? 'Published' : 'Draft'}</span>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => { setEditing(t); setForm({ name: t.name, review: t.review, location: t.location, loanType: t.loanType, rating: t.rating, published: t.published }); setShowForm(true); }} className="p-1.5 rounded-lg hover:bg-brand-50 text-neutral-400 hover:text-brand-600 transition-colors"><Edit2 className="w-4 h-4" /></button>
                <button onClick={() => { if (window.confirm('Delete?')) deleteMutation.mutate(t.id); }} className="p-1.5 rounded-lg hover:bg-brand-50 text-neutral-400 hover:text-brand-600 transition-colors"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          ))}
          {testimonials.length === 0 && <div className="card text-center py-12 text-neutral-400">No testimonials found</div>}
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-display font-bold text-neutral-900">{editing ? 'Edit' : 'Create'} Testimonial</h2>
              <button onClick={() => setShowForm(false)} className="p-2 rounded-lg hover:bg-neutral-100 text-neutral-500 transition-colors"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div><label className="label">Name *</label><input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} className="input-field" /></div>
                <div><label className="label">Location</label><input value={form.location} onChange={e => setForm(p => ({ ...p, location: e.target.value }))} className="input-field" /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="label">Loan Type</label><input value={form.loanType} onChange={e => setForm(p => ({ ...p, loanType: e.target.value }))} className="input-field" placeholder="personal-loan" /></div>
                <div>
                  <label className="label">Rating</label>
                  <select value={form.rating} onChange={e => setForm(p => ({ ...p, rating: +e.target.value }))} className="input-field">
                    {[5,4,3,2,1].map(n => <option key={n} value={n}>{n} Star{n > 1 ? 's' : ''}</option>)}
                  </select>
                </div>
              </div>
              <div><label className="label">Review *</label><textarea rows={4} value={form.review} onChange={e => setForm(p => ({ ...p, review: e.target.value }))} className="input-field resize-none" /></div>
              <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={form.published} onChange={e => setForm(p => ({ ...p, published: e.target.checked }))} className="rounded border-neutral-300 text-brand-600 focus:ring-brand-500" /><span className="text-sm text-neutral-600">Published</span></label>
              <button onClick={handleSubmit} disabled={isSubmitting} className="btn-primary w-full">
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : editing ? <CheckCircle className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                {editing ? 'Update' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
