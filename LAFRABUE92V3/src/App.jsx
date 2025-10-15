import React, { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Categories from './pages/Categories'
import Products from './pages/Products'
import ProductDetail from './pages/ProductDetail'
import Contact from './pages/Contact'
import AdminLogin from './pages/admin/Login'
import AdminDashboard from './pages/admin/Dashboard'
import AdminProducts from './pages/admin/Products'
import AdminCategories from './pages/admin/Categories'
import AdminSocials from './pages/admin/Socials'
import AdminSettings from './pages/admin/Settings'
import AdminFarms from './pages/admin/Farms'
import AdminTypography from './pages/admin/Typography'
import AdminOrderSettings from './pages/admin/OrderSettings'
import AdminUsers from './pages/admin/AdminUsers'
import AdminMaintenance from './pages/admin/Maintenance'
import AdminLayout from './components/admin/AdminLayout'
import DynamicBackground from './components/DynamicBackground'
import MaintenanceMode from './components/MaintenanceMode'
import LoadingPage from './components/LoadingPage'
import { ThemeProvider } from './components/ThemeProvider'
import { LoadingProvider, useLoading } from './contexts/LoadingContext'

const AppContent = () => {
  const { isLoading } = useLoading()

  // Charger le nom de la boutique pour le titre du navigateur
  useEffect(() => {
    const updateTitle = async () => {
      try {
        const { getById } = await import('./utils/api')
        const settings = await getById('settings', 'general')
        if (settings && settings.shopName) {
          document.title = settings.shopName
        } else {
          // Titre par défaut si pas de nom configuré
          document.title = 'Boutique'
        }
      } catch (error) {
        console.error('Error loading shop name:', error)
        document.title = 'Boutique'
      }
    }
    // Charger immédiatement sans délai
    updateTitle()
  }, [])

  // Police par défaut
  useEffect(() => {
    document.documentElement.style.setProperty('--title-font', "'Playfair Display'")
  }, [])

  if (isLoading) {
    return <LoadingPage />
  }

  return (
    <Router>
      <DynamicBackground />
      <MaintenanceMode>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/contact" element={<Contact />} />
          
          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="categories" element={<AdminCategories />} />
            <Route path="socials" element={<AdminSocials />} />
            <Route path="farms" element={<AdminFarms />} />
            <Route path="typography" element={<AdminTypography />} />
            <Route path="order-settings" element={<AdminOrderSettings />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="maintenance" element={<AdminMaintenance />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>
        </Routes>
      </MaintenanceMode>
    </Router>
  )
}

function App() {
  return (
    <LoadingProvider>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </LoadingProvider>
  )
}

export default App
