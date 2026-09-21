import { useQuery } from '@tanstack/react-query';
import { settingsApi } from '../api';
import { COMPANY_EMAIL, COMPANY_PHONE, COMPANY_WHATSAPP } from '../constants';

export function useCompanySettings() {
  const { data, isLoading } = useQuery({
    queryKey: ['company-settings'],
    queryFn: settingsApi.getAll,
    staleTime: 300000,
  });

  const settings = data?.data?.data || {};

  return {
    companyName: settings.company_name || 'Good Debt',
    companyPhone: settings.company_phone || COMPANY_PHONE,
    companyEmail: settings.company_email || COMPANY_EMAIL,
    companyWhatsApp: settings.company_whatsapp || COMPANY_WHATSAPP,
    companyAddress: settings.company_address || 'Mumbai, Maharashtra, India',
    footerDisclaimer: settings.footer_disclaimer || '',
    isLoading,
  };
}
