export function formatCurrency(amount) {
  if (!amount && amount !== 0) return '—';
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
}

export function formatNumber(num) {
  if (!num) return '0';
  return new Intl.NumberFormat('en-IN').format(num);
}

export function formatDate(date) {
  if (!date) return '—';
  return new Intl.DateTimeFormat('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(date));
}

export function formatDateTime(date) {
  if (!date) return '—';
  return new Intl.DateTimeFormat('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(date));
}

export function calculateEMI(principal, annualRate, tenureMonths) {
  if (!principal || !annualRate || !tenureMonths) return 0;
  const r = annualRate / 12 / 100;
  const n = tenureMonths;
  if (r === 0) return principal / n;
  return (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
}

export function getUTMParams() {
  const params = new URLSearchParams(window.location.search);
  return {
    utmSource: params.get('utm_source') || '',
    utmMedium: params.get('utm_medium') || '',
    utmCampaign: params.get('utm_campaign') || '',
    utmTerm: params.get('utm_term') || '',
    utmContent: params.get('utm_content') || '',
    referrer: document.referrer || '',
    landingPage: window.location.href,
  };
}

export function getLoanTypeLabel(slug) {
  const map = {
    'personal-loan': 'Personal Loan', 'business-loan': 'Business Loan', 'home-loan': 'Home Loan',
    'loan-against-property': 'Loan Against Property', 'car-loan': 'Car Loan',
    'education-loan': 'Education Loan', 'gold-loan': 'Gold Loan', 'debt-consolidation': 'Debt Consolidation', 'other': 'Other'
  };
  return map[slug] || slug;
}

export function debounce(fn, delay) {
  let timer;
  return (...args) => { clearTimeout(timer); timer = setTimeout(() => fn(...args), delay); };
}

export function truncate(str, n) {
  return str?.length > n ? str.slice(0, n) + '...' : str;
}
