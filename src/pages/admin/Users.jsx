import { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Edit2, Trash2, Eye, X, CheckCircle, Loader2 } from 'lucide-react';
import { usersApi } from '../../api';
import { PageLoader } from '../../components/ui/Spinner';
import { useToast } from '../../components/ui/Toast';
import Badge from '../../components/ui/Badge';

export default function Users() {
  const { toast } = useToast();
  const qc = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'SALES_EXECUTIVE', phone: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: usersApi.getAll,
  });

  const users = data?.data?.data || [];

  const createMutation = useMutation({
    mutationFn: usersApi.create,
    onSuccess: () => { toast('User created', 'success'); setShowForm(false); setForm({ name: '', email: '', password: '', role: 'SALES_EXECUTIVE', phone: '' }); qc.invalidateQueries(['admin-users']); },
    onError: () => toast('Failed', 'error'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => usersApi.update(id, data),
    onSuccess: () => { toast('User updated', 'success'); setShowForm(false); setEditing(null); setForm({ name: '', email: '', password: '', role: 'SALES_EXECUTIVE', phone: '' }); qc.invalidateQueries(['admin-users']); },
    onError: () => toast('Failed', 'error'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => usersApi.delete(id),
    onSuccess: () => { toast('User deleted', 'success'); qc.invalidateQueries(['admin-users']); },
    onError: () => toast('Failed', 'error'),
  });

  const handleSubmit = () => {
    if (!form.name.trim() || !form.email.trim()) { toast('Name and email required', 'error'); return; }
    setIsSubmitting(true);
    if (editing) {
      updateMutation.mutate({ id: editing.id, data: { ...form, phone: form.phone || '' } });
    } else {
      createMutation.mutate({ ...form, phone: form.phone || '' });
    }
    setTimeout(() => setIsSubmitting(false), 500);
  };

  const openEdit = (u) => {
    setEditing(u);
    setForm({ name: u.name, email: u.email, password: '', role: u.role, phone: u.phone || '' });
    setShowForm(true);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-display font-bold text-neutral-900">Users</h1>
          <p className="text-sm text-neutral-400 mt-1">Manage admin and sales users</p>
        </div>
        <button onClick={() => { setEditing(null); setForm({ name: '', email: '', password: '', role: 'SALES_EXECUTIVE', phone: '' }); setShowForm(true); }} className="btn-primary text-sm">
          <Plus className="w-4 h-4" /> Add User
        </button>
      </div>

      {isLoading ? <PageLoader /> : (
        <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-100 bg-neutral-50">
                  {['Name', 'Email', 'Role', 'Phone', 'Created', 'Actions'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-50">
                {users.map(u => (
                  <tr key={u.id} className="hover:bg-neutral-50/80 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-brand-50 rounded-full flex items-center justify-center text-brand-600 text-sm font-bold">{u.name?.[0]}</div>
                        <span className="text-sm font-medium text-neutral-900">{u.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-neutral-600">{u.email}</td>
                    <td className="px-4 py-3"><Badge badge-brand>{u.role?.replace('_', ' ')}</Badge></td>
                    <td className="px-4 py-3 text-sm text-neutral-600">{u.phone || '—'}</td>
                    <td className="px-4 py-3 text-xs text-neutral-400">{new Date(u.createdAt).toLocaleDateString()}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button onClick={() => openEdit(u)} className="p-1.5 rounded-lg hover:bg-brand-50 text-neutral-400 hover:text-brand-600 transition-colors">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => { if (window.confirm('Delete this user?')) deleteMutation.mutate(u.id); }}
                          className="p-1.5 rounded-lg hover:bg-brand-50 text-neutral-400 hover:text-brand-600 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr><td colSpan={6} className="text-center py-12 text-neutral-400 text-sm">No users found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-display font-bold text-neutral-900">{editing ? 'Edit' : 'Create'} User</h2>
              <button onClick={() => setShowForm(false)} className="p-2 rounded-lg hover:bg-neutral-100 text-neutral-500 transition-colors"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="label">Full Name *</label>
                <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} className="input-field" placeholder="John Doe" />
              </div>
              <div>
                <label className="label">Email *</label>
                <input type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} className="input-field" placeholder="john@example.com" />
              </div>
              {!editing && (
                <div>
                  <label className="label">Password *</label>
                  <input type="password" value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} className="input-field" placeholder="Min 8 characters" />
                </div>
              )}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label">Role</label>
                  <select value={form.role} onChange={e => setForm(p => ({ ...p, role: e.target.value }))} className="input-field">
                    <option value="SALES_EXECUTIVE">Sales Executive</option>
                    <option value="SALES_MANAGER">Sales Manager</option>
                    <option value="ADMIN">Admin</option>
                    <option value="SUPER_ADMIN">Super Admin</option>
                  </select>
                </div>
                <div>
                  <label className="label">Phone</label>
                  <input value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} className="input-field" placeholder="+91 99999 99999" />
                </div>
              </div>
              <motion.button whileTap={{ scale: 0.97 }} onClick={handleSubmit} disabled={isSubmitting} className="btn-primary w-full">
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : editing ? <CheckCircle className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                {editing ? 'Update User' : 'Create User'}
              </motion.button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
