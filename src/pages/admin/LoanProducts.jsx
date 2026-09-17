import { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Edit2, Trash2, Eye, X, CheckCircle, Loader2 } from 'lucide-react';
import { loanProductsApi } from '../../api';
import { PageLoader } from '../../components/ui/Spinner';
import { useToast } from '../../components/ui/Toast';

const EMPTY_PRODUCT = { name: '', slug: '', description: '', benefits: '', eligibility: '', documents: '', amount: '', tenure: '', interestInfo: '', status: 'active', displayOrder: 0 };

export default function LoanProducts() {
  const { toast } = useToast();
  const qc = useQueryClient();
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_PRODUCT);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['loan-products'],
    queryFn: () => loanProductsApi.getAll({ limit: 100 }),
    onSuccess: (res) => setProducts(res.data?.data || []),
  });

  const createMutation = useMutation({
    mutationFn: (data) => loanProductsApi.create(data),
    onSuccess: () => {
      toast('Loan product created', 'success');
      setShowForm(false);
      setForm(EMPTY_PRODUCT);
      qc.invalidateQueries(['loan-products']);
    },
    onError: () => toast('Failed to create product', 'error'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => loanProductsApi.update(id, data),
    onSuccess: () => {
      toast('Loan product updated', 'success');
      setShowForm(false);
      setEditing(null);
      setForm(EMPTY_PRODUCT);
      qc.invalidateQueries(['loan-products']);
    },
    onError: () => toast('Failed to update product', 'error'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => loanProductsApi.delete(id),
    onSuccess: () => {
      toast('Loan product deleted', 'success');
      qc.invalidateQueries(['loan-products']);
    },
    onError: () => toast('Failed to delete product', 'error'),
  });

  const handleSubmit = () => {
    if (!form.name.trim() || !form.slug.trim() || !form.description.trim()) {
      toast('Name, Slug, and Description are required', 'error');
      return;
    }
    setIsSubmitting(true);
    if (editing) {
      updateMutation.mutate({ id: editing.id, data: { ...form, displayOrder: Number(form.displayOrder) || 0 } });
    } else {
      createMutation.mutate(form);
    }
    setTimeout(() => setIsSubmitting(false), 500);
  };

  const openEdit = (p) => {
    setEditing(p);
    setForm({ ...p, displayOrder: p.displayOrder || 0 });
    setShowForm(true);
  };

  const openCreate = () => {
    setEditing(null);
    setForm(EMPTY_PRODUCT);
    setShowForm(true);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-display font-bold text-neutral-900">Loan Products</h1>
          <p className="text-sm text-neutral-400 mt-1">Manage your loan product catalog</p>
        </div>
        <button onClick={openCreate} className="btn-primary text-sm">
          <Plus className="w-4 h-4" /> Add Product
        </button>
      </div>

      {/* Table */}
      {isLoading ? <PageLoader /> : (
        <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-100 bg-neutral-50">
                  {['#', 'Name', 'Slug', 'Status', 'Amount', 'Tenure', 'Order', 'Actions'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-50">
                {products.map((p, i) => (
                  <tr key={p.id} className="hover:bg-neutral-50/80 transition-colors">
                    <td className="px-4 py-3 text-sm text-neutral-500">{i + 1}</td>
                    <td className="px-4 py-3">
                      <p className="text-sm font-semibold text-neutral-900">{p.name}</p>
                      <p className="text-xs text-neutral-400 line-clamp-1">{p.description}</p>
                    </td>
                    <td className="px-4 py-3 text-xs text-neutral-600 font-mono">{p.slug}</td>
                    <td className="px-4 py-3">
                      {p.status === 'active'
                        ? <span className="badge bg-green-100 text-green-700">Active</span>
                        : <span className="badge bg-neutral-100 text-neutral-600">Inactive</span>}
                    </td>
                    <td className="px-4 py-3 text-xs text-neutral-600">{p.amount || '—'}</td>
                    <td className="px-4 py-3 text-xs text-neutral-600">{p.tenure || '—'}</td>
                    <td className="px-4 py-3">
                      <span className="text-sm font-medium text-neutral-700">{p.displayOrder || 0}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button onClick={() => openEdit(p)} className="p-1.5 rounded-lg hover:bg-brand-50 text-neutral-400 hover:text-brand-600 transition-colors">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => { if (window.confirm('Delete this product?')) deleteMutation.mutate(p.id); }}
                          className="p-1.5 rounded-lg hover:bg-brand-50 text-neutral-400 hover:text-brand-600 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {products.length === 0 && (
                  <tr><td colSpan={8} className="text-center py-12 text-neutral-400 text-sm">No loan products found. Add your first product.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create/Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-display font-bold text-neutral-900">{editing ? 'Edit' : 'Create'} Loan Product</h2>
              <button onClick={() => setShowForm(false)} className="p-2 rounded-lg hover:bg-neutral-100 text-neutral-500 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label">Name *</label>
                  <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} className="input-field" placeholder="e.g. Personal Loan" />
                </div>
                <div>
                  <label className="label">Slug *</label>
                  <input value={form.slug} onChange={e => setForm(p => ({ ...p, slug: e.target.value }))} className="input-field" placeholder="e.g. personal-loan" />
                </div>
              </div>
              <div>
                <label className="label">Description *</label>
                <textarea rows={2} value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} className="input-field resize-none" placeholder="Product description" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label">Amount</label>
                  <input value={form.amount} onChange={e => setForm(p => ({ ...p, amount: e.target.value }))} className="input-field" placeholder="e.g. Up to ₹5 Lakh" />
                </div>
                <div>
                  <label className="label">Tenure</label>
                  <input value={form.tenure} onChange={e => setForm(p => ({ ...p, tenure: e.target.value }))} className="input-field" placeholder="e.g. 12 - 60 months" />
                </div>
              </div>
              <div>
                <label className="label">Interest Info</label>
                <input value={form.interestInfo} onChange={e => setForm(p => ({ ...p, interestInfo: e.target.value }))} className="input-field" placeholder="e.g. 10.5% - 15% p.a." />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label">Benefits</label>
                  <textarea rows={2} value={form.benefits} onChange={e => setForm(p => ({ ...p, benefits: e.target.value }))} className="input-field resize-none" placeholder="One per line" />
                </div>
                <div>
                  <label className="label">Eligibility</label>
                  <textarea rows={2} value={form.eligibility} onChange={e => setForm(p => ({ ...p, eligibility: e.target.value }))} className="input-field resize-none" placeholder="One per line" />
                </div>
              </div>
              <div>
                <label className="label">Documents Required</label>
                <textarea rows={2} value={form.documents} onChange={e => setForm(p => ({ ...p, documents: e.target.value }))} className="input-field resize-none" placeholder="One per line" />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="label">Status</label>
                  <select value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))} className="input-field">
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
                <div>
                  <label className="label">Display Order</label>
                  <input type="number" value={form.displayOrder} onChange={e => setForm(p => ({ ...p, displayOrder: e.target.value }))} className="input-field" min={0} />
                </div>
              </div>
              <motion.button whileTap={{ scale: 0.97 }} onClick={handleSubmit} disabled={isSubmitting} className="btn-primary w-full">
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : editing ? <CheckCircle className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                {editing ? 'Update Product' : 'Create Product'}
              </motion.button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
