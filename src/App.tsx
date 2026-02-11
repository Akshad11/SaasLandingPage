
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from './context/AuthContext';
import ScrollToTop from './components/common/ScrollToTop';
import MainLayout from './layouts/MainLayout';

import Home from './pages/Home';
import About from './pages/About';



import Services from './pages/Services';
import ServiceDetail from './pages/ServiceDetail';
import StaffingSolutions from './pages/StaffingSolutions';
import StaffingDetail from './pages/StaffingDetail';



import Careers from './pages/Careers';
import JobDetail from './pages/JobDetail';


// const Home = () => <div className="pt-32 pb-20 container-custom text-white"><h1>Home Page</h1></div>;
// const About = () => <div className="pt-32 pb-20 container-custom text-white"><h1>About Page</h1></div>;
// const Services = () => <div className="pt-32 pb-20 container-custom text-white"><h1>Services Page</h1></div>;
// const Careers = () => <div className="pt-32 pb-20 container-custom text-white"><h1>Careers Page</h1></div>;

import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import Contact from './pages/Contact';

import Login from './pages/auth/Login';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import Setup from './pages/Setup';

import DashboardLayout from './layouts/DashboardLayout';
import SuperAdminDashboard from './pages/admin/SuperAdminDashboard';
import UserManagement from './pages/admin/UserManagement';
import ContentManagement from './pages/admin/ContentManagement';
import SiteSettings from './pages/admin/SiteSettings';
import AboutManagement from './pages/admin/AboutManagement';
import HRDashboard from './pages/admin/HRDashboard';
import HRJobs from './pages/admin/HRJobs';
import HRPostJob from './pages/admin/HRPostJob';
import HRContact from './pages/admin/HRContact';
import AnalyticsDashboard from './pages/admin/AnalyticsDashboard';

import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import NotFound from './pages/NotFound';

function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <Router>
          <ScrollToTop />
          <Routes>
            {/* Dashboard Routes (Admin/HR) - High Priority */}
            <Route element={<DashboardLayout />}>
              <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="/admin/dashboard" element={<SuperAdminDashboard />} />
              <Route path="/admin/analytics" element={<AnalyticsDashboard />} />
              <Route path="/admin/users" element={<UserManagement />} />
              <Route path="/admin/content" element={<ContentManagement />} />
              <Route path="/admin/about" element={<AboutManagement />} />
              <Route path="/admin/settings" element={<SiteSettings />} />
              <Route path="/admin/inbox" element={<SuperAdminDashboard />} />

              <Route path="/hr/dashboard" element={<HRDashboard />} />
              <Route path="/hr/jobs" element={<HRJobs />} />
              <Route path="/hr/jobs/new" element={<HRPostJob />} />
              <Route path="/hr/contact" element={<HRContact />} />
            </Route>

            {/* Public Pages Layout */}
            <Route element={<MainLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/services" element={<Services />} />
              <Route path="/services/:id" element={<ServiceDetail />} />
              <Route path="/staffing" element={<StaffingSolutions />} />
              <Route path="/staffing/:slug" element={<StaffingDetail />} />
              <Route path="/careers" element={<Careers />} />
              <Route path="/careers/:slug" element={<JobDetail />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:id" element={<BlogPost />} />
              <Route path="/contact" element={<Contact />} />

              {/* Auth Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/setup" element={<Setup />} />

              {/* Legal Routes */}
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/terms" element={<TermsOfService />} />

              {/* 404 Route - Low Priority */}
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
    </HelmetProvider>
  );
}

export default App;
