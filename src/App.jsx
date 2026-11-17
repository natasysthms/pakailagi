import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout.jsx';

// Pages
import HomePage from './pages/Home/HomePage.jsx';
import PrelovedPage from './pages/Preloved/PrelovedPage.jsx';
import ProductDetailPage from './pages/ProductDetail/ProductDetailPage.jsx';
import DonationPage from './pages/Donation/DonationPage.jsx';
import CareGuidePage from './pages/CareGuide/CareGuidePage.jsx';
import RepairPage from './pages/Repair/RepairPage.jsx';
import ImpactPage from './pages/Impact/ImpactPage.jsx';
import AuthPage from './pages/Auth/AuthPage.jsx';
import ProfilePage from './pages/Profile/ProfilePage.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="jelajahi-preloved" element={<PrelovedPage />} />
          <Route path="produk/:id" element={<ProductDetailPage />} />
          <Route path="donasi-pakaian" element={<DonationPage />} />
          <Route path="panduan-perawatan" element={<CareGuidePage />} />
          <Route path="layanan-reparasi" element={<RepairPage />} />
          <Route path="dampak-dan-emisi" element={<ImpactPage />} />
          <Route path="profil-saya" element={<ProfilePage />} />
        </Route>
        {/* Auth page with its own standalone layout */}
        <Route path="masuk" element={<AuthPage defaultTab="login" />} />
        <Route path="daftar" element={<AuthPage defaultTab="register" />} />
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
