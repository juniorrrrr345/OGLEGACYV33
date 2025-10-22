import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Package, Grid3x3, Building2, Users, TrendingUp, Eye, ShoppingCart, Star } from 'lucide-react'
import AdminLayout from '../../components/AdminLayout'

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    products: 0,
    categories: 0,
    farms: 0,
    users: 0
  })
  const [recentProducts, setRecentProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const [productsRes, categoriesRes, farmsRes, usersRes] = await Promise.all([
        fetch(`${import.meta.env.VITE_API_URL}/api/products`),
        fetch(`${import.meta.env.VITE_API_URL}/api/categories`),
        fetch(`${import.meta.env.VITE_API_URL}/api/farms`),
        fetch(`${import.meta.env.VITE_API_URL}/api/users`)
      ])

      const [products, categories, farms, users] = await Promise.all([
        productsRes.ok ? productsRes.json() : [],
        categoriesRes.ok ? categoriesRes.json() : [],
        farmsRes.ok ? farmsRes.json() : [],
        usersRes.ok ? usersRes.json() : []
      ])

      setStats({
        products: products.length,
        categories: categories.length,
        farms: farms.length,
        users: users.length
      })

      setRecentProducts(products.slice(0, 5))
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error)
    } finally {
      setLoading(false)
    }
  }

  const statCards = [
    {
      title: 'Produits',
      value: stats.products,
      icon: Package,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/20'
    },
    {
      title: 'Catégories',
      value: stats.categories,
      icon: Grid3x3,
      color: 'text-green-400',
      bgColor: 'bg-green-500/10',
      borderColor: 'border-green-500/20'
    },
    {
      title: 'Fermes',
      value: stats.farms,
      icon: Building2,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/10',
      borderColor: 'border-yellow-500/20'
    },
    {
      title: 'Utilisateurs',
      value: stats.users,
      icon: Users,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/20'
    }
  ]

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-cyan-400"></div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
          <p className="text-gray-400">Vue d'ensemble de votre boutique e-commerce</p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {statCards.map((card, index) => {
            const Icon = card.icon
            return (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.05 }}
                className={`${card.bgColor} ${card.borderColor} border rounded-2xl p-6 hover:scale-105 transition-transform duration-200`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm font-medium">{card.title}</p>
                    <p className="text-3xl font-bold text-white mt-2">{card.value}</p>
                  </div>
                  <div className={`${card.color} ${card.bgColor} p-3 rounded-xl`}>
                    <Icon className="w-6 h-6" />
                  </div>
                </div>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        >
          {/* Recent Products */}
          <div className="glass-effect rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">Produits Récents</h2>
              <TrendingUp className="w-5 h-5 text-cyan-400" />
            </div>
            
            <div className="space-y-4">
              {recentProducts.length > 0 ? (
                recentProducts.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className="flex items-center space-x-4 p-3 bg-slate-800/50 rounded-lg hover:bg-slate-800 transition-colors"
                  >
                    <div className="w-12 h-12 bg-slate-700 rounded-lg flex items-center justify-center">
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <Package className="w-6 h-6 text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-white font-medium">{product.name}</p>
                      <p className="text-gray-400 text-sm">{product.price}€</p>
                    </div>
                    <div className="flex items-center space-x-1 text-yellow-400">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="text-sm">4.8</span>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-8">
                  <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-400">Aucun produit trouvé</p>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="glass-effect rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">Actions Rapides</h2>
              <ShoppingCart className="w-5 h-5 text-cyan-400" />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <motion.a
                href="/admin/products"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
                className="flex flex-col items-center p-4 bg-slate-800/50 rounded-lg hover:bg-slate-800 transition-colors group"
              >
                <Package className="w-8 h-8 text-blue-400 mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-white text-sm font-medium">Ajouter Produit</span>
              </motion.a>
              
              <motion.a
                href="/admin/categories"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.45 }}
                className="flex flex-col items-center p-4 bg-slate-800/50 rounded-lg hover:bg-slate-800 transition-colors group"
              >
                <Grid3x3 className="w-8 h-8 text-green-400 mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-white text-sm font-medium">Gérer Catégories</span>
              </motion.a>
              
              <motion.a
                href="/admin/farms"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
                className="flex flex-col items-center p-4 bg-slate-800/50 rounded-lg hover:bg-slate-800 transition-colors group"
              >
                <Building2 className="w-8 h-8 text-yellow-400 mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-white text-sm font-medium">Gérer Fermes</span>
              </motion.a>
              
              <motion.a
                href="/admin/settings"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.55 }}
                className="flex flex-col items-center p-4 bg-slate-800/50 rounded-lg hover:bg-slate-800 transition-colors group"
              >
                <Settings className="w-8 h-8 text-purple-400 mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-white text-sm font-medium">Paramètres</span>
              </motion.a>
            </div>
          </div>
        </motion.div>

        {/* Performance Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-effect rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">Aperçu des Performances</h2>
            <Eye className="w-5 h-5 text-cyan-400" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-cyan-400 mb-2">98.5%</p>
              <p className="text-gray-400 text-sm">Disponibilité</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-green-400 mb-2">1.2s</p>
              <p className="text-gray-400 text-sm">Temps de chargement</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-yellow-400 mb-2">4.8/5</p>
              <p className="text-gray-400 text-sm">Satisfaction client</p>
            </div>
          </div>
        </motion.div>
      </div>
    </AdminLayout>
  )
}

export default AdminDashboard