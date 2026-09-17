import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Edit2, Trash2, Eye, X, CheckCircle, Loader2, ArrowLeft, ArrowRight, GripVertical } from 'lucide-react';
import { formFieldApi } from '../../api';
import { PageLoader } from '../../components/ui/Spinner';
import { useToast } from '../../components/ui/Toast';

const FIELD_TYPES = [
  { value: 'text', label: 'Text', icon: 'Aa' },
  { value: 'number', label: 'Number', icon: '#' },
  { value: 'currency', label: 'Currency', icon: '₹' },
  { value: 'select', label: 'Select', icon: '▼' },
  { value: 'radio', label: 'Radio', icon: '◉' },
  { value: 'checkbox', label: 'Checkbox', icon: '☐' },
  { value: 'date', label: 'Date', icon: '📅' },
  { value: 'textarea', label: 'Textarea', icon: '⤢' },
];

export default function FormBuilder() {
  const { toast } = useToast();
  const qc = useQueryClient();
  const [fields, setFields] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [fieldForm, setFieldForm] = useState({ label: '', name: '', type: 'text', required: false, placeholder: '', options: '' });

  const { data, isLoading } = useQuery({
    queryKey: ['form-fields'],
    queryFn: () => formFieldApi.getAll({ limit: 100 }),
    onSuccess: (res) => {
      const loaded = (res.data?.data || []).map(f => ({
        ...f,
        options: f.options ? (Array.isArray(f.options) ? f.options : JSON.parse(f.options || '[]')) : [],
      }));
      setFields(loaded);
    },
  });

  const createMutation = useMutation({
    mutationFn: formFieldApi.create,
    onSuccess: () => { toast('Field created', 'success'); refresh(); },
    onError: () => toast('Failed', 'error'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => formFieldApi.update(id, data),
    onSuccess: () => { toast('Field updated', 'success'); refresh(); },
    onError: () => toast('Failed', 'error'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => formFieldApi.delete(id),
    onSuccess: () => { toast('Field deleted', 'success'); refresh(); },
    onError: () => toast('Failed', 'error'),
  });

  const refresh = () => {
    qc.invalidateQueries(['form-fields']);
    formFieldApi.getAll({ limit: 100 }).then(res => {
      const loaded = (res.data?.data || []).map(f => ({
        ...f,
        options: f.options ? (Array.isArray(f.options) ? f.options : JSON.parse(f.options || '[]')) : [],
      }));
      setFields(loaded);
    });
  };

  const openCreate = () => {
    setEditingIndex(null);
    setFieldForm({ label: '', name: '', type: 'text', required: false, placeholder: '', options: '' });
    setShowModal(true);
  };

  const openEdit = (f, i) => {
    setEditingIndex(i);
    setFieldForm({
      label: f.label, name: f.name, type: f.type, required: !!f.required,
      placeholder: f.placeholder || '', options: Array.isArray(f.options) ? f.options.join('\n') : '',
    });
    setShowModal(true);
  };

  const handleSubmit = () => {
    if (!fieldForm.label.trim() || !fieldForm.name.trim()) { toast('Label and name required', 'error'); return; }
    const data = {
      ...fieldForm,
      required: fieldForm.required,
      options: fieldForm.type === 'select' || fieldForm.type === 'radio' || fieldForm.type === 'checkbox'
        ? fieldForm.options.split('\n').filter(Boolean)
        : undefined,
    };
    if (editingIndex !== null) {
      updateMutation.mutate({ id: fields[editingIndex].id, data });
    } else {
      createMutation.mutate(data);
    }
    setShowModal(false);
  };

  const moveField = (index, dir) => {
    const newFields = [...fields];
    const [moved] = newFields.splice(index, 1);
    newFields.splice(index + dir, 0, moved);
    setFields(newFields);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="text-2xl font-display font-bold text-neutral-900">Form Builder</h1><p className="text-sm text-neutral-400 mt-1">Configure form fields for loan applications</p></div>
        <button onClick={openCreate} className="btn-primary text-sm"><Plus className="w-4 h-4" /> Add Field</button>
      </div>

      {isLoading ? <PageLoader /> : (
        <div className="space-y-2">
          {fields.map((f, i) => {
            const typeInfo = FIELD_TYPES.find(t => t.value === f.type);
            return (
              <div key={f.id} className="card flex items-center gap-4">
                <div className="flex flex-col gap-1">
                  <button onClick={() => moveField(i, -1)} disabled={i === 0} className="p-0.5 hover:bg-neutral-100 rounded disabled:opacity-30 transition-colors">
                    <ArrowUp className="w-3 h-3 text-neutral-400" />
                  </button>
                  <button onClick={() => moveField(i, 1)} disabled={i === fields.length - 1} className="p-0.5 hover:bg-neutral-100 rounded disabled:opacity-30 transition-colors">
                    <ArrowDown className="w-3 h-3 text-neutral-400" />
                  </button>
                </div>
                <GripVertical className="w-4 h-4 text-neutral-300" />
                <div className="w-10 h-10 bg-brand-50 rounded-xl flex items-center justify-center text-sm font-bold text-brand-600 flex-shrink-0">
                  {typeInfo?.icon || '?'}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-neutral-900 text-sm">{f.label}</h3>
                  <p className="text-xs text-neutral-400">{f.name} · {typeInfo?.label || f.type}{f.required ? ' · Required' : ''}</p>
                </div>
                <span className={`badge ${f.required ? 'badge-brand' : 'badge-gray'}`}>{f.required ? 'Required' : 'Optional'}</span>
                <div className="flex items-center gap-1">
                  <button onClick={() => openEdit(f, i)} className="p-1.5 rounded-lg hover:bg-brand-50 text-neutral-400 hover:text-brand-600 transition-colors">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => { if (window.confirm('Delete?')) deleteMutation.mutate(f.id); }} className="p-1.5 rounded-lg hover:bg-brand-50 text-neutral-400 hover:text-brand-600 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
          {fields.length === 0 && (
            <div className="card text-center py-16">
              <p className="text-neutral-500 mb-4">No fields configured yet</p>
              <button onClick={openCreate} className="btn-primary text-sm">Add your first field</button>
            </div>
          )}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-display font-bold text-neutral-900">{editingIndex !== null ? 'Edit' : 'Create'} Field</h2>
              <button onClick={() => setShowModal(false)} className="p-2 rounded-lg hover:bg-neutral-100 text-neutral-500 transition-colors"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div><label className="label">Label *</label><input value={fieldForm.label} onChange={e => setFieldForm(p => ({ ...p, label: e.target.value }))} className="input-field" /></div>
                <div><label className="label">Name *</label><input value={fieldForm.name} onChange={e => setFieldForm(p => ({ ...p, name: e.target.value }))} className="input-field" placeholder="e.g. full_name" /></div>
              </div>
              <div>
                <label className="label">Field Type *</label>
                <div className="grid grid-cols-4 gap-2">
                  {FIELD_TYPES.map(ft => (
                    <button key={ft.value} onClick={() => setFieldForm(p => ({ ...p, type: ft.value }))}
                      className={`p-3 rounded-xl border-2 text-center transition-all ${fieldForm.type === ft.value ? 'border-brand-500 bg-brand-50' : 'border-neutral-200 hover:border-neutral-300'}`}>
                      <div className="text-lg font-bold text-neutral-700">{ft.icon}</div>
                      <div className="text-[10px] text-neutral-500 mt-1">{ft.label}</div>
                    </button>
                  ))}
                </div>
              </div>
              <div><label className="label">Placeholder</label><input value={fieldForm.placeholder} onChange={e => setFieldForm(p => ({ ...p, placeholder: e.target.value }))} className="input-field" /></div>
              {['select', 'radio', 'checkbox'].includes(fieldForm.type) && (
                <div><label className="label">Options (one per line)</label><textarea rows={4} value={fieldForm.options} onChange={e => setFieldForm(p => ({ ...p, options: e.target.value }))} className="input-field resize-none" /></div>
              )}
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={fieldForm.required} onChange={e => setFieldForm(p => ({ ...p, required: e.target.checked }))} className="rounded border-neutral-300 text-brand-600 focus:ring-brand-500" />
                <span className="text-sm text-neutral-600">Required field</span>
              </label>
              <button onClick={handleSubmit} className="btn-primary w-full">{editingIndex !== null ? 'Update Field' : 'Create Field'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
