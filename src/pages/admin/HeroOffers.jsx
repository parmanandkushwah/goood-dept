import { useRef, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ImagePlus, Loader2, Trash2, Upload, Eye, EyeOff } from 'lucide-react';
import { getAssetUrl, heroOffersApi } from '../../api';
import { useToast } from '../../components/ui/Toast';
import { PageLoader } from '../../components/ui/Spinner';

const initialForm = { title: '', displayOrder: 0, published: true, image: null };

export default function HeroOffers() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const fileRef = useRef(null);
  const [form, setForm] = useState(initialForm);
  const [preview, setPreview] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['hero-offers-admin'],
    queryFn: () => heroOffersApi.getAll(),
  });
  const offers = data?.data?.data || [];

  const createMutation = useMutation({
    mutationFn: heroOffersApi.create,
    onSuccess: () => {
      toast('Offer uploaded', 'success');
      queryClient.invalidateQueries({ queryKey: ['hero-offers-admin'] });
      setForm(initialForm);
      setPreview('');
      if (fileRef.current) fileRef.current.value = '';
    },
    onError: (error) => toast(error.response?.data?.message || 'Upload failed', 'error'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data: offer }) => heroOffersApi.update(id, offer),
    onSuccess: () => {
      toast('Offer status updated', 'success');
      queryClient.invalidateQueries({ queryKey: ['hero-offers-admin'] });
    },
    onError: () => toast('Update failed', 'error'),
  });

  const deleteMutation = useMutation({
    mutationFn: heroOffersApi.delete,
    onSuccess: () => {
      toast('Offer deleted', 'success');
      queryClient.invalidateQueries({ queryKey: ['hero-offers-admin'] });
    },
    onError: () => toast('Delete failed', 'error'),
  });

  const handleFileChange = (event) => {
    const image = event.target.files?.[0];
    if (!image) return;
    setForm(current => ({ ...current, image }));
    setPreview(URL.createObjectURL(image));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!form.image) {
      toast('Please select an offer image', 'error');
      return;
    }
    const payload = new FormData();
    payload.append('image', form.image);
    payload.append('title', form.title || 'Bank Offer');
    payload.append('displayOrder', String(form.displayOrder || 0));
    payload.append('published', String(form.published));
    createMutation.mutate(payload);
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-display font-bold text-neutral-900">Hero Offers</h1>
        <p className="mt-1 text-sm text-neutral-400">Upload square bank offers for the homepage hero carousel</p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,380px)_1fr]">
        <form onSubmit={handleSubmit} className="card space-y-4">
          <div className="flex items-center gap-3 border-b border-neutral-100 pb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50"><ImagePlus className="h-5 w-5 text-brand-600" /></div>
            <div><h2 className="font-display font-bold text-neutral-900">Upload Offer</h2><p className="text-xs text-neutral-400">JPG, PNG or WebP up to 5 MB</p></div>
          </div>

          <button type="button" onClick={() => fileRef.current?.click()} className="flex aspect-square w-full items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-neutral-200 bg-neutral-50 hover:border-brand-300 hover:bg-brand-50/30">
            {preview ? <img src={preview} alt="Selected offer preview" className="h-full w-full object-cover" /> : <span className="flex flex-col items-center gap-2 text-sm text-neutral-400"><Upload className="h-6 w-6" />Choose image</span>}
          </button>
          <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" onChange={handleFileChange} className="hidden" />

          <div><label className="label">Offer title</label><input value={form.title} onChange={e => setForm(current => ({ ...current, title: e.target.value }))} className="input-field" placeholder="HDFC Bank Personal Loan Offer" /></div>
          <div><label className="label">Display order</label><input type="number" min="0" value={form.displayOrder} onChange={e => setForm(current => ({ ...current, displayOrder: e.target.value }))} className="input-field" /></div>
          <label className="flex cursor-pointer items-center gap-2"><input type="checkbox" checked={form.published} onChange={e => setForm(current => ({ ...current, published: e.target.checked }))} className="rounded border-neutral-300 text-brand-600 focus:ring-brand-500" /><span className="text-sm text-neutral-600">Publish immediately</span></label>
          <button type="submit" disabled={createMutation.isPending} className="btn-primary w-full">{createMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}{createMutation.isPending ? 'Uploading...' : 'Upload Offer'}</button>
        </form>

        <div className="space-y-3">
          {isLoading ? <PageLoader /> : offers.map(offer => (
            <div key={offer.id} className="card flex items-center gap-4">
              <img src={getAssetUrl(offer.imageUrl)} alt={offer.title} className="h-20 w-20 flex-shrink-0 rounded-lg object-cover" />
              <div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold text-neutral-900">{offer.title}</p><p className="mt-1 text-xs text-neutral-400">Order: {offer.displayOrder}</p><span className={`badge mt-2 ${offer.published ? 'badge-green' : 'badge-gray'}`}>{offer.published ? 'Published' : 'Draft'}</span></div>
              <div className="flex items-center gap-1">
                <button type="button" title={offer.published ? 'Unpublish' : 'Publish'} onClick={() => updateMutation.mutate({ id: offer.id, data: { published: !offer.published } })} className="rounded-lg p-2 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-brand-600">{offer.published ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button>
                <button type="button" title="Delete offer" onClick={() => window.confirm('Delete this offer?') && deleteMutation.mutate(offer.id)} className="rounded-lg p-2 text-neutral-400 transition-colors hover:bg-brand-50 hover:text-brand-600"><Trash2 className="h-4 w-4" /></button>
              </div>
            </div>
          ))}
          {!isLoading && offers.length === 0 && <div className="card py-12 text-center text-sm text-neutral-400">No offers uploaded yet</div>}
        </div>
      </div>
    </div>
  );
}
