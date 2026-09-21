import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Building2, UserRound, LockKeyhole, Save, Loader2, Eye, EyeOff } from 'lucide-react';
import { authApi, settingsApi } from '../../api';
import { PageLoader } from '../../components/ui/Spinner';
import { useToast } from '../../components/ui/Toast';
import { useAuth } from '../../context/AuthContext';

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
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState('company');
  const [form, setForm] = useState(null);
  const [profileForm, setProfileForm] = useState({ name: '', email: '', phone: '' });
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [showPasswords, setShowPasswords] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['settings'],
    queryFn: settingsApi.getAll,
  });

  useEffect(() => {
    if (data?.data?.data) {
      const settings = data.data.data;
      setForm({
        companyName: settings.company_name || '',
        companyPhone: settings.company_phone || '',
        companyEmail: settings.company_email || '',
        companyWhatsApp: settings.company_whatsapp || '',
        companyAddress: settings.company_address || '',
        currencySymbol: settings.currency_symbol || '₹',
      });
    }
  }, [data]);

  useEffect(() => {
    if (user) setProfileForm({ name: user.name || '', email: user.email || '', phone: user.phone || '' });
  }, [user]);

  const updateMutation = useMutation({
    mutationFn: settingsApi.update,
    onSuccess: () => {
      toast('Settings saved', 'success');
      qc.invalidateQueries({ queryKey: ['settings'] });
      qc.invalidateQueries({ queryKey: ['company-settings'] });
    },
    onError: () => toast('Failed to save', 'error'),
  });

  const profileMutation = useMutation({
    mutationFn: authApi.updateProfile,
    onSuccess: (response) => { updateUser(response.data.user); toast('Profile updated', 'success'); },
    onError: (error) => toast(error.response?.data?.message || 'Failed to update profile', 'error'),
  });

  const passwordMutation = useMutation({
    mutationFn: authApi.changePassword,
    onSuccess: () => {
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      toast('Password changed successfully', 'success');
    },
    onError: (error) => toast(error.response?.data?.message || 'Failed to change password', 'error'),
  });

  const handleSave = () => {
    if (!form) return;
    updateMutation.mutate({
      company_name: form.companyName,
      company_phone: form.companyPhone,
      company_email: form.companyEmail,
      company_whatsapp: form.companyWhatsApp,
      company_address: form.companyAddress,
      currency_symbol: form.currencySymbol,
    });
  };

  const handleProfileSave = () => {
    if (!profileForm.name.trim() || !profileForm.email.trim()) {
      toast('Name and email are required', 'error');
      return;
    }
    profileMutation.mutate(profileForm);
  };

  const handlePasswordSave = () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast('New passwords do not match', 'error');
      return;
    }
    passwordMutation.mutate({ currentPassword: passwordForm.currentPassword, newPassword: passwordForm.newPassword });
  };

  if (isLoading || !form) return <PageLoader />;

  return (
    <div>
      <div className="mb-6"><h1 className="text-2xl font-display font-bold text-neutral-900">Settings</h1><p className="text-sm text-neutral-400 mt-1">Manage company and admin account settings</p></div>

      <div className="max-w-3xl">
        <div className="flex gap-1 overflow-x-auto border-b border-neutral-200 mb-6">
          {[['company', Building2, 'Company Detail'], ['profile', UserRound, 'Profile'], ['password', LockKeyhole, 'Change Password']].map(([id, Icon, label]) => (
            <button key={id} onClick={() => setActiveTab(id)} className={`flex items-center gap-2 whitespace-nowrap px-4 py-3 text-sm font-semibold border-b-2 transition-colors ${activeTab === id ? 'border-brand-600 text-brand-600' : 'border-transparent text-neutral-500 hover:text-neutral-800'}`}>
              <Icon className="w-4 h-4" /> {label}
            </button>
          ))}
        </div>

        {activeTab === 'company' && <div className="card space-y-5">
          <div><h3 className="font-display font-bold text-neutral-900">Company Detail</h3><p className="text-xs text-neutral-400 mt-1">Update the information shown across the platform</p></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Company Name" value={form.companyName} onChange={e => setForm(p => ({ ...p, companyName: e.target.value }))} placeholder="Good Debt" />
            <Field label="Company Phone" value={form.companyPhone} onChange={e => setForm(p => ({ ...p, companyPhone: e.target.value }))} placeholder="+91 99999 99999" />
            <Field label="Company Email" value={form.companyEmail} onChange={e => setForm(p => ({ ...p, companyEmail: e.target.value }))} placeholder="info@gooddebt.in" />
            <Field label="WhatsApp" value={form.companyWhatsApp} onChange={e => setForm(p => ({ ...p, companyWhatsApp: e.target.value }))} placeholder="+91 99999 99999" />
            <Field label="Company Address" value={form.companyAddress} onChange={e => setForm(p => ({ ...p, companyAddress: e.target.value }))} placeholder="Mumbai, India" />
            <Field label="Currency Symbol" value={form.currencySymbol} onChange={e => setForm(p => ({ ...p, currencySymbol: e.target.value }))} placeholder="₹" />
          </div>
          <div className="flex justify-end pt-4 border-t border-neutral-100"><button onClick={handleSave} disabled={updateMutation.isPending} className="btn-primary text-sm">{updateMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}{updateMutation.isPending ? 'Saving...' : 'Save Changes'}</button></div>
        </div>}

        {activeTab === 'profile' && <div className="card space-y-5">
          <div><h3 className="font-display font-bold text-neutral-900">Admin Profile</h3><p className="text-xs text-neutral-400 mt-1">Update your name and contact details</p></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Full Name" value={profileForm.name} onChange={e => setProfileForm(p => ({ ...p, name: e.target.value }))} placeholder="Admin name" />
            <Field label="Email" type="email" value={profileForm.email} onChange={e => setProfileForm(p => ({ ...p, email: e.target.value }))} placeholder="admin@gooddebt.in" />
            <Field label="Phone" value={profileForm.phone} onChange={e => setProfileForm(p => ({ ...p, phone: e.target.value }))} placeholder="+91 99999 99999" />
          </div>
          <div className="flex justify-end pt-4 border-t border-neutral-100"><button onClick={handleProfileSave} disabled={profileMutation.isPending} className="btn-primary text-sm">{profileMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}{profileMutation.isPending ? 'Saving...' : 'Save Profile'}</button></div>
        </div>}

        {activeTab === 'password' && <div className="card space-y-5">
          <div><h3 className="font-display font-bold text-neutral-900">Change Password</h3><p className="text-xs text-neutral-400 mt-1">Use at least 8 characters for your new password</p></div>
          <div className="space-y-4 max-w-md">
            {[['currentPassword', 'Current Password'], ['newPassword', 'New Password'], ['confirmPassword', 'Confirm New Password']].map(([key, label]) => <div key={key}><label className="label">{label}</label><div className="relative"><input type={showPasswords ? 'text' : 'password'} value={passwordForm[key]} onChange={e => setPasswordForm(p => ({ ...p, [key]: e.target.value }))} className="input-field pr-10" autoComplete={key === 'currentPassword' ? 'current-password' : 'new-password'} /><button type="button" onClick={() => setShowPasswords(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400">{showPasswords ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button></div></div>)}
          </div>
          <div className="flex justify-end pt-4 border-t border-neutral-100"><button onClick={handlePasswordSave} disabled={passwordMutation.isPending} className="btn-primary text-sm">{passwordMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <LockKeyhole className="w-4 h-4" />}{passwordMutation.isPending ? 'Updating...' : 'Change Password'}</button></div>
        </div>}
      </div>
    </div>
  );
}
