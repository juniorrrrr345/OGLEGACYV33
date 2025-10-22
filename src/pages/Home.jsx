import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ShoppingBag, Star, Truck, Shield, ArrowRight } from 'lucide-react'

const Home = () => {
  const [settings, setSettings] = useState({})
  const [featuredProducts, setFeaturedProducts] = useState([])

  useEffect(() => {
    fetchSettings()
    fetchFeaturedProducts()
  }, [])

  const fetchSettings = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/settings`)
      if (response.ok) {
        const data = await response.json()
        setSettings(data)
      }
    } catch (error) {
      console.error('Erreur lors du chargement des paramètres:', error)
    }
  }

  const fetchFeaturedProducts = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/products`)
      if (response.ok) {
        const data = await response.json()
        setFeaturedProducts(data.slice(0, 6)) // Prendre les 6 premiers produits
      }
    } catch (error) {
      console.error('Erreur lors du chargement des produits:', error)
    }
  }

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"></div>
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="neon-text animate-glow">
                {settings.storeName || 'E-Commerce Store'}
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto">
              {settings.storeDescription || 'Découvrez notre sélection de produits premium'}
            </p>
            <Link
              to="/products"
              className="inline-flex items-center space-x-2 btn-primary text-lg px-8 py-4"
            >
              <ShoppingBag className="w-6 h-6" />
              <span>Voir nos produits</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4 neon-text">Pourquoi nous choisir ?</h2>
            <p className="text-gray-400 text-lg">Des avantages qui font la différence</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Star className="w-12 h-12 text-yellow-400" />,
                title: "Qualité Premium",
                description: "Produits sélectionnés avec soin pour garantir la meilleure qualité"
              },
              {
                icon: <Truck className="w-12 h-12 text-green-400" />,
                title: "Livraison Rapide",
                description: "Expédition sous 24h partout en France"
              },
              {
                icon: <Shield className="w-12 h-12 text-blue-400" />,
                title: "Garantie Satisfait",
                description: "30 jours pour changer d'avis, remboursement garanti"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center p-8 glass-effect rounded-2xl hover:neon-border transition-all duration-300"
              >
                <div className="flex justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-4 text-white">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold mb-4 neon-text">Produits Vedettes</h2>
              <p className="text-gray-400 text-lg">Découvrez notre sélection du moment</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="glass-effect rounded-2xl overflow-hidden hover:neon-border transition-all duration-300 group"
                >
                  <div className="aspect-square bg-slate-800 relative overflow-hidden">
                    {product.image && (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2 text-white">{product.name}</h3>
                    <p className="text-gray-400 mb-4 line-clamp-2">{product.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold neon-text">{product.price}€</span>
                      <Link
                        to={`/product/${product.id}`}
                        className="btn-primary"
                      >
                        Voir détails
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link
                to="/products"
                className="btn-secondary inline-flex items-center space-x-2"
              >
                <span>Voir tous les produits</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}

export default Home