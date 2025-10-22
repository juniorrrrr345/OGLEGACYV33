import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Search, Filter, Grid, List, ShoppingCart, ExternalLink } from 'lucide-react'

const Products = () => {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [farms, setFarms] = useState([])
  const [settings, setSettings] = useState({})
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedFarm, setSelectedFarm] = useState('')
  const [viewMode, setViewMode] = useState('grid')

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [productsRes, categoriesRes, farmsRes, settingsRes] = await Promise.all([
        fetch(`${import.meta.env.VITE_API_URL}/api/products`),
        fetch(`${import.meta.env.VITE_API_URL}/api/categories`),
        fetch(`${import.meta.env.VITE_API_URL}/api/farms`),
        fetch(`${import.meta.env.VITE_API_URL}/api/settings`)
      ])

      if (productsRes.ok) {
        const productsData = await productsRes.json()
        setProducts(productsData)
      }

      if (categoriesRes.ok) {
        const categoriesData = await categoriesRes.json()
        setCategories(categoriesData)
      }

      if (farmsRes.ok) {
        const farmsData = await farmsRes.json()
        setFarms(farmsData)
      }

      if (settingsRes.ok) {
        const settingsData = await settingsRes.json()
        setSettings(settingsData)
      }
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = !selectedCategory || product.category === selectedCategory
    const matchesFarm = !selectedFarm || product.farm === selectedFarm
    
    return matchesSearch && matchesCategory && matchesFarm
  })

  const handleOrder = (product) => {
    if (settings.orderLink) {
      const message = `Bonjour, je suis intéressé(e) par le produit: ${product.name} - ${product.price}€`
      const encodedMessage = encodeURIComponent(message)
      const orderUrl = settings.orderLink.includes('?') 
        ? `${settings.orderLink}&text=${encodedMessage}`
        : `${settings.orderLink}?text=${encodedMessage}`
      window.open(orderUrl, '_blank')
    }
  }

  if (loading) {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-cyan-400"></div>
      </div>
    )
  }

  return (
    <div className="pt-16 min-h-screen bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-4 neon-text animate-glow">
            Nos Produits
          </h1>
          <p className="text-xl text-gray-400">
            Découvrez notre gamme complète de produits premium
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8 space-y-4"
        >
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Rechercher un produit..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none"
            />
          </div>

          {/* Filters Row */}
          <div className="flex flex-wrap gap-4 items-center">
            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-slate-800 border border-slate-600 rounded-lg px-4 py-2 text-white focus:border-cyan-400 focus:outline-none"
            >
              <option value="">Toutes les catégories</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>

            {/* Farm Filter */}
            <select
              value={selectedFarm}
              onChange={(e) => setSelectedFarm(e.target.value)}
              className="bg-slate-800 border border-slate-600 rounded-lg px-4 py-2 text-white focus:border-cyan-400 focus:outline-none"
            >
              <option value="">Toutes les fermes</option>
              {farms.map(farm => (
                <option key={farm.id} value={farm.id}>
                  {farm.name}
                </option>
              ))}
            </select>

            {/* View Mode */}
            <div className="flex items-center space-x-2 ml-auto">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-cyan-500 text-white' : 'bg-slate-800 text-gray-400'}`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-cyan-500 text-white' : 'bg-slate-800 text-gray-400'}`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Products Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {filteredProducts.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-xl text-gray-400">Aucun produit trouvé</p>
            </div>
          ) : (
            <div className={`grid gap-6 ${
              viewMode === 'grid' 
                ? 'grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                : 'grid-cols-1'
            }`}>
              {filteredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`glass-effect rounded-2xl overflow-hidden hover:neon-border transition-all duration-300 group ${
                    viewMode === 'list' ? 'flex' : ''
                  }`}
                >
                  {/* Image */}
                  <div className={`bg-slate-800 relative overflow-hidden ${
                    viewMode === 'list' ? 'w-48 h-48' : 'aspect-square'
                  }`}>
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <ShoppingCart className="w-12 h-12" />
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className={`p-6 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                    <h3 className="text-lg font-semibold mb-2 text-white group-hover:text-cyan-400 transition-colors">
                      {product.name}
                    </h3>
                    
                    {product.description && (
                      <p className="text-gray-400 mb-4 text-sm line-clamp-2">
                        {product.description}
                      </p>
                    )}

                    {/* Category & Farm */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {product.category && (
                        <span className="px-2 py-1 bg-slate-700 text-xs rounded-full text-gray-300">
                          {categories.find(c => c.id === product.category)?.name || product.category}
                        </span>
                      )}
                      {product.farm && (
                        <span className="px-2 py-1 bg-slate-700 text-xs rounded-full text-gray-300">
                          {farms.find(f => f.id === product.farm)?.name || product.farm}
                        </span>
                      )}
                    </div>

                    {/* Price & Actions */}
                    <div className={`flex items-center justify-between ${viewMode === 'list' ? 'mt-auto' : ''}`}>
                      <span className="text-xl font-bold neon-text">
                        {product.price}€
                      </span>
                      <div className="flex space-x-2">
                        <Link
                          to={`/product/${product.id}`}
                          className="btn-secondary text-sm px-3 py-1 flex items-center space-x-1"
                        >
                          <ExternalLink className="w-4 h-4" />
                          <span>Détails</span>
                        </Link>
                        {settings.orderLink && (
                          <button
                            onClick={() => handleOrder(product)}
                            className="btn-primary text-sm px-3 py-1 flex items-center space-x-1"
                          >
                            <ShoppingCart className="w-4 h-4" />
                            <span>{settings.orderButtonText || 'Commander'}</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}

export default Products