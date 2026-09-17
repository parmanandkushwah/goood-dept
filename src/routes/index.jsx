import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import PublicLayout from '../layouts/PublicLayout';
import AdminLayout from '../layouts/AdminLayout';
import { ProtectedRoute, GuestRoute } from './ProtectedRoute';
import { PageLoader } from '../components/ui/Spinner';

// Public
const Home = lazy(() => import('../pages/Home'));
const AllLoans = lazy(() => import('../pages/AllLoans'));
const LoanPage = lazy(() => import('../pages/loans/LoanPage'));
const EMICalculator = lazy(() => import('../pages/EMICalculator'));
const Eligibility = lazy(() => import('../pages/Eligibility'));
const About = lazy(() => import('../pages/About'));
const Contact = lazy(() => import('../pages/Contact'));
const FAQ = lazy(() => import('../pages/FAQ'));
const PrivacyPolicy = lazy(() => import('../pages/legal/PrivacyPolicy'));
const Terms = lazy(() => import('../pages/legal/Terms'));
const Disclaimer = lazy(() => import('../pages/legal/Disclaimer'));
const ThankYou = lazy(() => import('../pages/ThankYou'));
const NotFound = lazy(() => import('../pages/NotFound'));

// Admin
const AdminLogin = lazy(() => import('../pages/admin/Login'));
const AdminDashboard = lazy(() => import('../pages/admin/Dashboard'));
const AdminLeads = lazy(() => import('../pages/admin/Leads'));
const AdminLeadDetail = lazy(() => import('../pages/admin/LeadDetail'));
const AdminFollowUps = lazy(() => import('../pages/admin/FollowUps'));
const AdminLoanProducts = lazy(() => import('../pages/admin/LoanProducts'));
const AdminFormBuilder = lazy(() => import('../pages/admin/FormBuilder'));
const AdminReports = lazy(() => import('../pages/admin/Reports'));
const AdminUsers = lazy(() => import('../pages/admin/Users'));
const AdminFAQs = lazy(() => import('../pages/admin/FAQs'));
const AdminTestimonials = lazy(() => import('../pages/admin/Testimonials'));
const AdminSettings = lazy(() => import('../pages/admin/AdminSettings'));

export default function AppRoutes() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Public */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/loans" element={<AllLoans />} />
          <Route path="/loans/:slug" element={<LoanPage />} />
          <Route path="/emi-calculator" element={<EMICalculator />} />
          <Route path="/eligibility" element={<Eligibility />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/disclaimer" element={<Disclaimer />} />
          <Route path="/thank-you" element={<ThankYou />} />
        </Route>

        {/* Admin */}
        <Route path="/admin/login" element={<GuestRoute><AdminLogin /></GuestRoute>} />
        <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="leads" element={<AdminLeads />} />
          <Route path="leads/:id" element={<AdminLeadDetail />} />
          <Route path="follow-ups" element={<AdminFollowUps />} />
          <Route path="loan-products" element={<AdminLoanProducts />} />
          <Route path="form-builder" element={<AdminFormBuilder />} />
          <Route path="reports" element={<AdminReports />} />
          <Route path="users" element={<ProtectedRoute roles={['SUPER_ADMIN','ADMIN']}><AdminUsers /></ProtectedRoute>} />
          <Route path="faqs" element={<AdminFAQs />} />
          <Route path="testimonials" element={<AdminTestimonials />} />
          <Route path="settings" element={<ProtectedRoute roles={['SUPER_ADMIN','ADMIN']}><AdminSettings /></ProtectedRoute>} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}
