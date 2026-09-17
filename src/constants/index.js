export const USER_ROLES = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  ADMIN: 'ADMIN',
  SALES_MANAGER: 'SALES_MANAGER',
  SALES_EXECUTIVE: 'SALES_EXECUTIVE',
};

export const LOAN_TYPES = [
  { value: 'personal-loan', label: 'Personal Loan', icon: 'User', color: 'blue', description: 'For personal expenses, medical, travel & more', benefit: 'Quick processing' },
  { value: 'business-loan', label: 'Business Loan', icon: 'Briefcase', color: 'green', description: 'Working capital, expansion & equipment', benefit: 'High loan amounts' },
  { value: 'home-loan', label: 'Home Loan', icon: 'Home', color: 'purple', description: 'Purchase, construction & balance transfer', benefit: 'Long tenure options' },
  { value: 'loan-against-property', label: 'Loan Against Property', icon: 'Building2', color: 'orange', description: 'Unlock value from your property', benefit: 'Lower interest rates' },
  { value: 'car-loan', label: 'Car Loan', icon: 'Car', color: 'red', description: 'New and used vehicle financing', benefit: 'Flexible tenure' },
  { value: 'education-loan', label: 'Education Loan', icon: 'GraduationCap', color: 'teal', description: 'Domestic and international studies', benefit: 'Moratorium period' },
  { value: 'gold-loan', label: 'Gold Loan', icon: 'Gem', color: 'yellow', description: 'Quick funds against gold assets', benefit: 'Minimal documentation' },
  { value: 'debt-consolidation', label: 'Debt Consolidation', icon: 'RefreshCw', color: 'indigo', description: 'Simplify multiple loan payments', benefit: 'Single EMI' },
];

export const LOAN_AMOUNTS = [
  { value: '50000', label: '₹50,000' },
  { value: '100000', label: '₹1 Lakh' },
  { value: '200000', label: '₹2 Lakh' },
  { value: '500000', label: '₹5 Lakh' },
  { value: '1000000', label: '₹10 Lakh' },
  { value: '2500000', label: '₹25 Lakh' },
  { value: '5000000', label: '₹50 Lakh+' },
  { value: 'custom', label: 'Custom Amount' },
];

export const EMPLOYMENT_TYPES = [
  { value: 'salaried', label: 'Salaried' },
  { value: 'self-employed', label: 'Self Employed' },
  { value: 'business-owner', label: 'Business Owner' },
  { value: 'professional', label: 'Professional' },
  { value: 'student', label: 'Student' },
  { value: 'other', label: 'Other' },
];

export const CIBIL_OPTIONS = [
  { value: 'dont-know', label: "Don't Know" },
  { value: 'below-550', label: 'Below 550' },
  { value: '550-650', label: '550 – 650' },
  { value: '650-700', label: '650 – 700' },
  { value: '700-750', label: '700 – 750' },
  { value: '750-plus', label: '750+' },
];

export const LEAD_STATUS_LABELS = {
  NEW: { label: 'New', color: 'bg-sky-100 text-sky-700' },
  CONTACTED: { label: 'Contacted', color: 'bg-yellow-100 text-yellow-700' },
  QUALIFIED: { label: 'Qualified', color: 'bg-green-100 text-green-700' },
  DOCUMENTS_PENDING: { label: 'Docs Pending', color: 'bg-orange-100 text-orange-700' },
  APPLICATION_STARTED: { label: 'App Started', color: 'bg-purple-100 text-purple-700' },
  SUBMITTED_TO_LENDER: { label: 'Submitted', color: 'bg-indigo-100 text-indigo-700' },
  UNDER_REVIEW: { label: 'Under Review', color: 'bg-cyan-100 text-cyan-700' },
  APPROVED: { label: 'Approved', color: 'bg-emerald-100 text-emerald-700' },
  REJECTED: { label: 'Rejected', color: 'bg-brand-100 text-brand-700' },
  DISBURSED: { label: 'Disbursed', color: 'bg-teal-100 text-teal-700' },
  CLOSED: { label: 'Closed', color: 'bg-neutral-100 text-neutral-700' },
  NOT_INTERESTED: { label: 'Not Interested', color: 'bg-slate-100 text-slate-700' },
};

export const PRIORITY_LABELS = {
  LOW: { label: 'Low', color: 'bg-neutral-100 text-neutral-600' },
  MEDIUM: { label: 'Medium', color: 'bg-sky-100 text-sky-600' },
  HIGH: { label: 'High', color: 'bg-orange-100 text-orange-600' },
  URGENT: { label: 'Urgent', color: 'bg-brand-100 text-brand-600' },
};

export const INDIAN_STATES = [
  'Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat','Haryana',
  'Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh','Maharashtra','Manipur',
  'Meghalaya','Mizoram','Nagaland','Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana',
  'Tripura','Uttar Pradesh','Uttarakhand','West Bengal','Delhi','Jammu & Kashmir','Ladakh',
  'Chandigarh','Puducherry','Andaman & Nicobar','Dadra & Nagar Haveli','Lakshadweep'
];

export const API_BASE = '/api';
export const COMPANY_PHONE = '+919999999999';
export const COMPANY_WHATSAPP = '+919999999999';
export const COMPANY_EMAIL = 'info@gooddebt.in';
