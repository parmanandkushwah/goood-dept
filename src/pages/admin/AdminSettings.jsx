import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Settings as SettingsIcon, Save, Loader2, CheckCircle } from 'lucide-react';
import { settingsApi } from '../../api';
import { PageLoader } from '../../components/ui/Spinner';
import { useToast } from '../../components/ui/Toast';

function Field({ label, value, onChange, type = 'text', placeholder = '' }) {
  return (
    <div>
      <label className="label">{label}</label>
      <input type={type} value={value || ''} onChange={onChange}
        className="input-field" placeholder={placeholder} />
    </div>
  );
}

export default function AdminSettings() {
  const { toast } = useToast();
  const qc = useQueryClient();
  const [form, setForm] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['settings'],
    queryFn: settingsApi.getAll,
  });

  useEffect(() => {
    if (data?.data?.data) setForm(data.data.data);
  }, [data]);

  const updateMutation = useMutation({
    mutationFn: settingsApi.update,
    onSuccess: () => { toast('Settings saved', 'success'); },
    onError: () => toast('Failed to save', 'error'),
  });

  const handleSave = () => {
    if (!form) return;
    setIsSaving(true);
    updateMutation.mutate(form, {
      onSuccess: () => setIsSaving(false),
      onError: () => setIsSaving(false),
    });
  };

  if (isLoading || !form) return <PageLoader />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="text-2xl font-display font-bold text-neutral-900">Settings</h1><p className="text-sm text-neutral-400 mt-1">Configure platform settings</p></div>
      </div>

      <div className="card max-w-2xl space-y-5">
        <div className="flex items-center gap-3 pb-4 border-b border-neutral-100">
          <div className="w-10 h-10 bg-brand-50 rounded-xl flex items-center justify-center"><SettingsIcon className="w-5 h-5 text-brand-600" /></div>
          <div><h3 className="font-display font-bold text-neutral-900">General Settings</h3><p className="text-xs text-neutral-400">Update company information</p></div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Company Name" value={form.companyName} onChange={e => setForm(p => ({ ...p, companyName: e.target.value }))} placeholder="Good Debt" />
          <Field label="Company Phone" value={form.companyPhone} onChange={e => setForm(p => ({ ...p, companyPhone: e.target.value }))} placeholder="+91 99999 99999" />
          <Field label="Company Email" value={form.companyEmail} onChange={e => setForm(p => ({ ...p, companyEmail: e.target.value }))} placeholder="info@gooddebt.in" />
          <Field label="WhatsApp" value={form.companyWhatsApp} onChange={e => setForm(p => ({ ...p, companyWhatsApp: e.target.value }))} placeholder="+91 99999 99999" />
          <Field label="Company Address" value={form.companyAddress} onChange={e => setForm(p => ({ ...p, companyAddress: e.target.value }))} placeholder="Mumbai, India" />
          <div>
            <label className="label">Currency Symbol</label>
            <input value={form.currencySymbol || '₹'} onChange={e => setForm(p => ({ ...p, currencySymbol: e.target.value }))} className="input-field" />
          </div>
        </div>
        <div className="flex items-center justify-between pt-4 border-t border-neutral-100">
          <div>
            <p className="text-sm font-medium text-neutral-900">Save Changes</p>
            <p className="text-xs text-neutral-400">Update platform configuration</p>
          </div>
          <button onClick={handleSave} disabled={isSaving} className="btn-primary text-sm">
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {isSaving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
}
