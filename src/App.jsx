import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { motion } from 'framer-motion'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Products from './pages/Products'
import ProductDetail from './pages/ProductDetail'
import AdminLogin from './pages/admin/AdminLogin'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminProducts from './pages/admin/Products'
import AdminCategories from './pages/admin/Categories'
import AdminFarms from './pages/admin/Farms'
import AdminSocials from './pages/admin/Socials'
import AdminUsers from './pages/admin/AdminUsers'
import AdminSettings from './pages/admin/Settings'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-950">
        <Routes>
          {/* Routes publiques */}
          <Route path="/" element={
            <>
              <Navbar />
              <Home />
            </>
          } />
          <Route path="/products" element={
            <>
              <Navbar />
              <Products />
            </>
          } />
          <Route path="/product/:id" element={
            <>
              <Navbar />
              <ProductDetail />
            </>
          } />
          
          {/* Routes admin */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/products" element={<AdminProducts />} />
          <Route path="/admin/categories" element={<AdminCategories />} />
          <Route path="/admin/farms" element={<AdminFarms />} />
          <Route path="/admin/socials" element={<AdminSocials />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/settings" element={<AdminSettings />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App