import React, { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Footer from '../components/Footer'

const Products = () => {
  const [searchParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [allProducts, setAllProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [farms, setFarms] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedFarm, setSelectedFarm] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [previewProduct, setPreviewProduct] = useState(null)

  useEffect(() => {
    fetchData()
  }, [])

  // Lire les paramètres d'URL au chargement
  useEffect(() => {
    const categoryParam = searchParams.get('category')
    const farmParam = searchParams.get('farm')
    
    if (categoryParam) {
      setSelectedCategory(categoryParam)
    }
    if (farmParam) {
      setSelectedFarm(farmParam)
    }
  }, [searchParams])

  useEffect(() => {
    filterProducts()
  }, [searchTerm, selectedCategory, selectedFarm, allProducts])

  const fetchData = async () => {
    try {
      const { getAll } = await import('../utils/api')
      
      const productsData = await getAll('products')
      const categoriesData = await getAll('categories')
      const farmsData = await getAll('farms')
      
      setAllProducts(productsData)
      setProducts(productsData)
      setCategories(categoriesData)
      setFarms(farmsData)
    } catch (error) {
      console.error('Erreur lors du chargement des produits:', error)
      setProducts([])
    }
  }

  const filterProducts = () => {
    let filtered = [...allProducts]

    // Filtre par recherche
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filtre par catégorie
    if (selectedCategory) {
      filtered = filtered.filter(product => String(product.category) === String(selectedCategory))
    }

    // Filtre par farm
    if (selectedFarm) {
      filtered = filtered.filter(product => String(product.farm) === String(selectedFarm))
    }

    setProducts(filtered)
  }

  const clearFilters = () => {
    setSearchTerm('')
    setSelectedCategory('')
    setSelectedFarm('')
  }


  return (
    <div className="min-h-screen cosmic-bg">
      <div className="pt-20 pb-24 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12 flex flex-col items-center"
          >
            <div className="inline-block bg-black/90 backdrop-blur-xl rounded-full px-16 py-10 border-2 border-white/30 shadow-[0_0_40px_rgba(0,0,0,0.8)] mb-8">
              <h1 className="text-5xl md:text-7xl font-bold mb-3 text-white">
                Notre Boutique
              </h1>
              <p className="text-lg text-gray-300">
                Découvrez notre sélection de produits choisis avec amour
              </p>
            </div>

            {/* Barre de recherche */}
            <div className="max-w-3xl mx-auto w-full">
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Rechercher un produit..."
                  className="w-full px-6 py-4 pr-24 bg-slate-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-gray-500 transition-colors"
                />
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 bg-white text-black rounded-lg hover:bg-gray-200 transition-colors flex items-center space-x-2"
                >
                  <span>🔍</span>
                  <span className="hidden md:inline">Filtres</span>
                </button>
              </div>

              {/* Filtres déroulants */}
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 p-4 bg-slate-900/50 border border-gray-700 rounded-xl"
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Filtre catégorie */}
                    <div>
                      <label className="block text-gray-400 text-sm mb-2">Catégorie</label>
                      <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="w-full px-4 py-2 bg-black border border-gray-700 rounded-lg text-white focus:outline-none focus:border-gray-500"
                      >
                        <option value="">Toutes les catégories</option>
                        {Array.isArray(categories) && categories.map((cat) => (
                          <option key={cat.id} value={cat.id}>
                            {cat.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Filtre farm */}
                    <div>
                      <label className="block text-gray-400 text-sm mb-2">Farm</label>
                      <select
                        value={selectedFarm}
                        onChange={(e) => setSelectedFarm(e.target.value)}
                        className="w-full px-4 py-2 bg-black border border-gray-700 rounded-lg text-white focus:outline-none focus:border-gray-500"
                      >
                        <option value="">Toutes les farms</option>
                        {Array.isArray(farms) && farms.map((farm) => (
                          <option key={farm.id} value={farm.id}>
                            {farm.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Bouton réinitialiser */}
                    <div className="flex items-end">
                      <button
                        onClick={clearFilters}
                        className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                      >
                        Réinitialiser
                      </button>
                    </div>
                  </div>

                  {/* Résumé des filtres */}
                  {(searchTerm || selectedCategory || selectedFarm) && (
                    <div className="mt-3 text-sm text-gray-400">
                      {products.length} produit(s) trouvé(s)
                      {searchTerm && ` pour "${searchTerm}"`}
                      {selectedCategory && ` dans ${selectedCategory}`}
                      {selectedFarm && ` de ${selectedFarm}`}
                    </div>
                  )}
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* Products Grid */}
          {products.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-400 text-xl">Aucun produit disponible pour le moment</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 md:gap-6 lg:gap-8 mb-20">
              {Array.isArray(products) && products.map((product, index) => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  index={index}
                  categories={categories}
                  farms={farms}
                  onPreview={() => setPreviewProduct(product)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal Aperçu */}
      <AnimatePresence>
        {previewProduct && (
          <ProductPreview 
            product={previewProduct} 
            categories={categories}
            farms={farms}
            onClose={() => setPreviewProduct(null)} 
          />
        )}
      </AnimatePresence>

      <Footer />
    </div>
  )
}

const ProductCard = ({ product, index, onPreview, categories, farms }) => {
  // Trouver les noms de catégorie et farm (convertir en string pour la comparaison)
  const categoryName = (Array.isArray(categories) && categories.find(c => String(c.id) === String(product.category))?.name) || product.category
  const farmName = (Array.isArray(farms) && farms.find(f => String(f.id) === String(product.farm))?.name) || product.farm
  
  // Construire le tableau de médias - PHOTO EN PREMIER pour affichage carte
  const allMedias = []
  if (product.photo && product.photo.trim()) allMedias.push(product.photo)
  if (product.image && product.image.trim()) allMedias.push(product.image)
  if (product.video && product.video.trim()) allMedias.push(product.video)
  
  // Vérifier aussi dans medias si c'est un tableau
  if (product.medias && Array.isArray(product.medias)) {
    product.medias.forEach(media => {
      if (media && media.trim() && !allMedias.includes(media)) {
        allMedias.push(media)
      }
    })
  }
  
  // Afficher le premier média disponible (photo en priorité)
  const displayImage = allMedias[0] || product.photo || product.image || product.video
  // Prix par défaut pour l'affichage des cartes
  const getDisplayPrice = (product) => {
    if (product.variants && product.variants.length > 0) {
      const firstVariant = product.variants[0]
      if (firstVariant.meetupPrice && firstVariant.livraisonPrice) {
        return `${firstVariant.meetupPrice}€ / ${firstVariant.livraisonPrice}€`
      }
    }
    return '5g 40€ / 50€'
  }
  
  const basePrice = getDisplayPrice(product)
  
  // Fonction pour détecter si c'est une vidéo
  const isVideo = (url) => {
    if (!url) return false
    const videoExtensions = ['.mp4', '.webm', '.mov', '.MOV', '.avi', '.mkv']
    return videoExtensions.some(ext => url.toLowerCase().includes(ext)) || url.startsWith('data:video')
  }
  
  // Fonction pour détecter si c'est un iframe Cloudflare Stream
  const isCloudflareStreamIframe = (url) => {
    if (!url) return false
    return url.includes('cloudflarestream.com') && url.includes('iframe')
  }
  
  console.log('ProductCard:', product.name, 'AllMedias:', allMedias, 'DisplayImage:', displayImage, 'IsVideo:', isVideo(displayImage))
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ scale: 1.05 }}
      className="border border-white/30 rounded-2xl overflow-hidden bg-slate-900/50 backdrop-blur-sm group cursor-pointer"
    >
      {/* Image ou Vidéo */}
      <div className="relative h-32 sm:h-48 md:h-64 lg:h-72 overflow-hidden bg-slate-800" onClick={onPreview}>
        {displayImage ? (
          isCloudflareStreamIframe(displayImage) ? (
            <iframe
              src={displayImage}
              className="w-full h-full"
              allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
              allowFullScreen
              style={{ border: 'none' }}
            />
          ) : isVideo(displayImage) ? (
            <video
              src={displayImage}
              className="w-full h-full object-cover"
              muted
              loop
              autoPlay
              playsInline
              onError={(e) => console.error('Erreur vidéo:', displayImage, e)}
              onLoadStart={() => console.log('Chargement vidéo:', displayImage)}
            />
          ) : (
            <img
              src={displayImage}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              onError={(e) => console.error('Erreur image:', displayImage, e)}
              onLoad={() => console.log('Image chargée:', displayImage)}
            />
          )
        ) : (
          <div className="w-full h-full flex items-center justify-center text-6xl">
            🎁
          </div>
        )}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <span className="text-theme-heading text-lg font-bold">👁️ Aperçu rapide</span>
        </div>
      </div>

      {/* Info */}
      <div className="p-3 sm:p-4 lg:p-6">
        <h3 className="text-sm sm:text-base lg:text-xl font-bold text-theme-heading mb-1 sm:mb-2 group-hover:text-gradient transition-all line-clamp-2">
          {product.name}
        </h3>
        <p className="text-theme-secondary text-xs sm:text-sm mb-2 sm:mb-4 line-clamp-2">
          {product.description}
        </p>
        
        {/* Catégorie et Farm */}
        <div className="flex flex-wrap gap-1 sm:gap-2 mb-2 sm:mb-4">
          {categoryName && (
            <span className="px-1 sm:px-2 py-0.5 sm:py-1 bg-gray-700/30 border border-gray-600/50 rounded-full text-theme-secondary text-xs">
              🏷️ {categoryName.length > 8 ? categoryName.substring(0, 8) + '...' : categoryName}
            </span>
          )}
          {farmName && (
            <span className="px-1 sm:px-2 py-0.5 sm:py-1 bg-gray-700/30 border border-gray-600/50 rounded-full text-theme-secondary text-xs">
              🌾 {farmName.length > 8 ? farmName.substring(0, 8) + '...' : farmName}
            </span>
          )}
        </div>
        
        {/* Prix affiché directement */}
        <div className="mb-3">
          <div className="text-lg font-bold text-white mb-1">{basePrice}</div>
          <div className="text-sm text-gray-300">Meet up / Livraison</div>
        </div>
        
        <div className="flex items-center justify-between gap-1 sm:gap-2">
          <Link to={`/products/${product.id}`} className="ml-auto">
            <button className="px-2 sm:px-3 lg:px-4 py-1 sm:py-2 bg-gradient-to-r from-white to-gray-200 rounded-lg text-black font-semibold hover:from-gray-200 hover:to-gray-400 transition-all text-xs sm:text-sm">
              Voir
            </button>
          </Link>
        </div>
      </div>
    </motion.div>
  )
}

const ProductPreview = ({ product, onClose, categories, farms }) => {
  const [selectedQuantity, setSelectedQuantity] = useState('')
  const [selectedDelivery, setSelectedDelivery] = useState('meetup')
  
  // Construire le pricing à partir des variants du produit
  const pricing = {}
  const quantities = []
  
  if (product.variants && product.variants.length > 0) {
    product.variants.forEach(variant => {
      if (variant.name && variant.meetupPrice && variant.livraisonPrice) {
        pricing[variant.name] = {
          meetup: parseInt(variant.meetupPrice) || 0,
          livraison: parseInt(variant.livraisonPrice) || 0
        }
        quantities.push(variant.name)
      }
    })
  }

  // Fallback si pas de variants
  if (quantities.length === 0) {
    const defaultPricing = {
      '5g': { meetup: 40, livraison: 50 },
      '10g': { meetup: 70, livraison: 90 },
      '25g': { meetup: 110, livraison: 140 },
      '50g': { meetup: 220, livraison: 250 },
      '100g': { meetup: 440, livraison: 470 }
    }
    Object.assign(pricing, defaultPricing)
    quantities.push(...Object.keys(defaultPricing))
  }

  // Initialiser la première quantité sélectionnée
  React.useEffect(() => {
    if (quantities.length > 0 && !selectedQuantity) {
      setSelectedQuantity(quantities[0])
    }
  }, [quantities, selectedQuantity])
  
  const deliveryOptions = [
    { value: 'meetup', label: 'Meet up', icon: '🤝' },
    { value: 'livraison', label: 'Livraison', icon: '🚚' }
  ]
  
  const currentPrice = pricing[selectedQuantity]?.[selectedDelivery] || 0
  
  // Trouver les noms de catégorie et farm (convertir en string pour la comparaison)
  const categoryName = categories?.find(c => String(c.id) === String(product.category))?.name || product.category
  const farmName = farms?.find(f => String(f.id) === String(product.farm))?.name || product.farm
  
  // Afficher la photo en priorité dans l'aperçu
  const displayMedia = product.photo || product.image || product.video
  
  // Fonction pour détecter si c'est une vidéo
  const isVideo = (url) => {
    if (!url) return false
    const videoExtensions = ['.mp4', '.webm', '.mov', '.MOV', '.avi', '.mkv']
    return videoExtensions.some(ext => url.toLowerCase().includes(ext)) || url.startsWith('data:video')
  }
  
  // Fonction pour détecter si c'est un iframe Cloudflare Stream
  const isCloudflareStreamIframe = (url) => {
    if (!url) return false
    return url.includes('cloudflarestream.com') && url.includes('iframe')
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="border border-white/30 rounded-2xl p-0 bg-slate-900 max-w-4xl w-full max-h-[95vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 max-h-[95vh]">
          {/* Média */}
          <div className="relative h-[250px] sm:h-[300px] md:h-full bg-slate-800">
            {displayMedia ? (
              isCloudflareStreamIframe(displayMedia) ? (
                <iframe
                  src={displayMedia}
                  className="w-full h-full"
                  allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
                  allowFullScreen
                  style={{ border: 'none' }}
                />
              ) : isVideo(displayMedia) ? (
                <video
                  src={displayMedia}
                  className="w-full h-full object-cover"
                  controls
                  autoPlay
                  loop
                  muted
                  onError={(e) => console.error('Erreur vidéo preview:', displayMedia, e)}
                  onLoadStart={() => console.log('Chargement vidéo preview:', displayMedia)}
                />
              ) : (
                <img
                  src={displayMedia}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  onError={(e) => console.error('Erreur image preview:', displayMedia, e)}
                  onLoad={() => console.log('Image preview chargée:', displayMedia)}
                />
              )
            ) : (
              <div className="w-full h-full flex items-center justify-center text-6xl sm:text-9xl">
                🎁
              </div>
            )}
          </div>

          {/* Info */}
          <div className="p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-6 overflow-y-auto max-h-[calc(95vh-250px)] sm:max-h-[calc(95vh-300px)] md:max-h-[500px]">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-theme-heading mb-2">{product.name}</h2>
                <div className="flex flex-wrap gap-2">
                  {categoryName && (
                    <span className="inline-block px-2 sm:px-3 py-1 bg-gray-700/30 border border-gray-600/50 rounded-full text-gray-300 text-xs sm:text-sm">
                      🏷️ {categoryName}
                    </span>
                  )}
                  {farmName && (
                    <span className="inline-block px-2 sm:px-3 py-1 bg-gray-700/30 border border-gray-600/50 rounded-full text-gray-300 text-xs sm:text-sm">
                      🌾 {farmName}
                    </span>
                  )}
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white text-xl sm:text-2xl flex-shrink-0"
              >
                ✕
              </button>
            </div>

            <p className="text-theme leading-relaxed text-sm sm:text-base">{product.description}</p>

            {/* Sélection quantité */}
            <div className="space-y-2 sm:space-y-3">
              <h3 className="text-base sm:text-lg font-bold text-theme-heading">💰 Quantité</h3>
              <div className="grid grid-cols-2 gap-2">
                {quantities.map((quantity) => (
                  <button
                    key={quantity}
                    onClick={() => setSelectedQuantity(quantity)}
                    className={`p-2 rounded-lg border-2 transition-all text-center ${
                      selectedQuantity === quantity
                        ? 'border-white bg-white/10 text-white'
                        : 'border-gray-700/30 bg-slate-800/50 text-gray-300 hover:border-white/50'
                    }`}
                  >
                    <div className="text-sm font-bold">{quantity}</div>
                    <div className="text-xs text-gray-400">
                      {pricing[quantity]?.meetup}€ / {pricing[quantity]?.livraison}€
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Sélection livraison */}
            <div className="space-y-2 sm:space-y-3">
              <h3 className="text-base sm:text-lg font-bold text-theme-heading">🚚 Livraison</h3>
              <div className="grid grid-cols-2 gap-2">
                {deliveryOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setSelectedDelivery(option.value)}
                    className={`p-2 rounded-lg border-2 transition-all flex items-center justify-center space-x-1 ${
                      selectedDelivery === option.value
                        ? 'border-white bg-white/10 text-white'
                        : 'border-gray-700/30 bg-slate-800/50 text-gray-300 hover:border-white/50'
                    }`}
                  >
                    <span>{option.icon}</span>
                    <span className="text-sm font-semibold">{option.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Prix final */}
            <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-lg p-3">
              <div className="text-center">
                <div className="text-sm text-gray-300 mb-1">
                  {selectedQuantity} - {deliveryOptions.find(opt => opt.value === selectedDelivery)?.label}
                </div>
                <div className="text-2xl font-bold text-white">
                  {currentPrice}€
                </div>
              </div>
            </div>

            <Link to={`/products/${product.id}`}>
              <button className="w-full py-3 sm:py-4 bg-gradient-to-r from-white to-gray-200 rounded-lg text-black font-bold text-base sm:text-lg hover:from-gray-200 hover:to-gray-400 transition-all">
                Voir détails complets
              </button>
            </Link>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default Products
