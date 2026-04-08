import { Route, Routes, useLocation } from 'react-router-dom'
import { Toaster } from 'sonner'
import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { WhatsAppFloat } from './components/WhatsAppFloat'
import { AboutPage } from './pages/AboutPage'
import { AreasPage } from './pages/AreasPage'
import { ContactPage } from './pages/ContactPage'
import { GalleryPage } from './pages/GalleryPage'
import { HomePage } from './pages/HomePage'
import {
  AdminBookingsPage,
  AdminCustomersPage,
  AdminDashboardPage,
  AdminGalleryPage,
  AdminQuotesPage,
  AdminSettingsPage,
  CustomerBookingsPage,
  CustomerDashboardPage,
  CustomerQuotesPage,
  CustomerSettingsPage,
  LoginPage,
  PortalLandingPage,
  RegisterPage,
} from './pages/PortalPages'
import { ReviewsPage } from './pages/ReviewsPage'
import { ServicesPage } from './pages/ServicesPage'

function App() {
  const location = useLocation()
  const isPortalRoute =
    location.pathname.startsWith('/portal') || location.pathname.startsWith('/admin') || location.pathname.startsWith('/customer')

  return (
    <div className="bg-brand-slate text-slate-900">
      {!isPortalRoute ? <Header /> : null}
      <main className={isPortalRoute ? 'w-full min-w-0' : undefined}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/areas" element={<AreasPage />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/reviews" element={<ReviewsPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/portal" element={<PortalLandingPage />} />
          <Route path="/portal/login" element={<LoginPage />} />
          <Route path="/portal/register" element={<RegisterPage />} />
          <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
          <Route path="/admin/customers" element={<AdminCustomersPage />} />
          <Route path="/admin/bookings" element={<AdminBookingsPage />} />
          <Route path="/admin/quotes" element={<AdminQuotesPage />} />
          <Route path="/admin/gallery" element={<AdminGalleryPage />} />
          <Route path="/admin/settings" element={<AdminSettingsPage />} />
          <Route path="/customer/dashboard" element={<CustomerDashboardPage />} />
          <Route path="/customer/bookings" element={<CustomerBookingsPage />} />
          <Route path="/customer/quotes" element={<CustomerQuotesPage />} />
          <Route path="/customer/settings" element={<CustomerSettingsPage />} />
        </Routes>
      </main>
      {!isPortalRoute ? <Footer /> : null}
      {!isPortalRoute ? <WhatsAppFloat /> : null}
      <Toaster position="top-right" richColors closeButton />
    </div>
  )
}

export default App
