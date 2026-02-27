import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { FeaturedCakes } from './components/FeaturedCakes';
import { CustomOrderForm } from './components/CustomOrderForm';
import { WhyChooseUs } from './components/WhyChooseUs';
import { About } from './components/About';
import { OrderingProcess } from './components/OrderingProcess';
import { Testimonials } from './components/Testimonials';
import { Footer } from './components/Footer';
import ComingSoon from './components/ComingSoon';
import LoginPage from './components/LoginPage';
import AdminDashboard from './components/admin/AdminDashboard';
import { Overview } from './components/admin/Overview';
import { Orders } from './components/admin/Orders';
import CakesPage from './components/CakesPage';
import { Products } from './components/admin/Products';
import { Categories } from './components/admin/Categories';
import ProtectedRoute from './components/admin/ProtectedRoute'; // 🔥 Added
import { Toaster } from 'react-hot-toast';

function AppContent() {
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith('/admin');
// testing vercel deployment
  return (
    <div className="min-h-screen flex flex-col bg-[#0A0A0A] text-gray-100">
      <Toaster position="top-right" reverseOrder={false} />

      {!isAdminPath && <Navbar />}

      <main className="flex-1">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<><Hero /><FeaturedCakes /><WhyChooseUs /><CustomOrderForm /><OrderingProcess /><About /><Testimonials /></>} />
          <Route path="/cakes" element={<CakesPage />} />
          <Route path="/admin/login" element={<LoginPage />} />

          {/* 🔥 Protected Admin Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/admin" element={<AdminDashboard />}>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<Overview />} />
              <Route path="orders" element={<Orders />} />
              <Route path="products" element={<Products />} />
              <Route path="categories" element={<Categories />} />
              <Route path="customers" element={<div className="p-8 text-gray-400">Customer Database...</div>} />
              <Route path="settings" element={<div className="p-8 text-gray-400">Settings...</div>} />
            </Route>
          </Route>

          {/* Fallback */}
          <Route path="*" element={<ComingSoon />} />
        </Routes>
      </main>

      {!isAdminPath && <Footer />}
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}