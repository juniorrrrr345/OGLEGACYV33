import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, ShoppingCart, Share2, Heart, Star } from 'lucide-react'

const ProductDetail = () => {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [category, setCategory] = useState(null)
  const [farm, setFarm] = useState(null)
  const [settings, setSettings] = useState({})
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)

  useEffect(() => {
    fetchProductDetail()
  }, [id])

  const fetchProductDetail = async () => {
    try {
      const [productRes, settingsRes] = await Promise.all([
        fetch(`${import.meta.env.VITE_API_URL}/api/products/${id}`),
        fetch(`${import.meta.env.VITE_API_URL}/api/settings`)
      ])

      if (productRes.ok) {
        const productData = await productRes.json()
        setProduct(productData)

        // Fetch category and farm details
        if (productData.category) {
          const categoryRes = await fetch(`${import.meta.env.VITE_API_URL}/api/categories/${productData.category}`)
          if (categoryRes.ok) {
            const categoryData = await categoryRes.json()
            setCategory(categoryData)
          }
        }

        if (productData.farm) {
          const farmRes = await fetch(`${import.meta.env.VITE_API_URL}/api/farms/${productData.farm}`)
          if (farmRes.ok) {
            const farmData = await farmRes.json()
            setFarm(farmData)
          }
        }
      }

      if (settingsRes.ok) {
        const settingsData = await settingsRes.json()
        setSettings(settingsData)
      }
    } catch (error) {
      console.error('Erreur lors du chargement du produit:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleOrder = () => {
    if (settings.orderLink && product) {
      const message = `Bonjour, je suis intéressé(e) par le produit: ${product.name} - ${product.price}€`
      const encodedMessage = encodeURIComponent(message)
      const orderUrl = settings.orderLink.includes('?') 
        ? `${settings.orderLink}&text=${encodedMessage}`
        : `${settings.orderLink}?text=${encodedMessage}`
      window.open(orderUrl, '_blank')
    }
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: product.description,
        url: window.location.href
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      alert('Lien copié dans le presse-papiers!')
    }
  }

  if (loading) {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-cyan-400"></div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Produit non trouvé</h2>
          <Link to="/products" className="btn-primary">
            Retour aux produits
          </Link>
        </div>
      </div>
    )
  }

  const images = []
  if (product.image) images.push(product.image)
  if (product.photo) images.push(product.photo)
  if (product.medias) {
    try {
      const medias = JSON.parse(product.medias)
      images.push(...medias)
    } catch (e) {
      // Ignore parsing errors
    }
  }

  return (
    <div className="pt-16 min-h-screen bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8"
        >
          <Link
            to="/products"
            className="inline-flex items-center space-x-2 text-gray-400 hover:text-cyan-400 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Retour aux produits</span>
          </Link>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Images */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            {images.length > 0 ? (
              <div className="space-y-4">
                {/* Main Image */}
                <div className="aspect-square bg-slate-800 rounded-2xl overflow-hidden">
                  <img
                    src={images[selectedImage]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Thumbnail Images */}
                {images.length > 1 && (
                  <div className="grid grid-cols-4 gap-2">
                    {images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImage(index)}
                        className={`aspect-square bg-slate-800 rounded-lg overflow-hidden border-2 transition-colors ${
                          selectedImage === index ? 'border-cyan-400' : 'border-transparent'
                        }`}
                      >
                        <img
                          src={image}
                          alt={`${product.name} ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="aspect-square bg-slate-800 rounded-2xl flex items-center justify-center">
                <ShoppingCart className="w-24 h-24 text-gray-400" />
              </div>
            )}
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-6"
          >
            {/* Title & Price */}
            <div>
              <h1 className="text-4xl font-bold text-white mb-4">{product.name}</h1>
              <div className="flex items-center space-x-4 mb-4">
                <span className="text-3xl font-bold neon-text">{product.price}€</span>
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                  <span className="text-gray-400 ml-2">(4.8)</span>
                </div>
              </div>
            </div>

            {/* Category & Farm */}
            <div className="flex flex-wrap gap-3">
              {category && (
                <span className="px-4 py-2 bg-slate-800 rounded-full text-cyan-400 border border-cyan-400/30">
                  {category.icon} {category.name}
                </span>
              )}
              {farm && (
                <span className="px-4 py-2 bg-slate-800 rounded-full text-green-400 border border-green-400/30">
                  🏭 {farm.name}
                </span>
              )}
            </div>

            {/* Description */}
            {product.description && (
              <div className="prose prose-invert">
                <h3 className="text-xl font-semibold text-white mb-3">Description</h3>
                <p className="text-gray-300 leading-relaxed">{product.description}</p>
              </div>
            )}

            {/* Farm Description */}
            {farm && farm.description && (
              <div className="prose prose-invert">
                <h3 className="text-xl font-semibold text-white mb-3">À propos de la ferme</h3>
                <p className="text-gray-300 leading-relaxed">{farm.description}</p>
              </div>
            )}

            {/* Variants */}
            {product.variants && (
              <div>
                <h3 className="text-xl font-semibold text-white mb-3">Variantes disponibles</h3>
                <div className="space-y-2">
                  {JSON.parse(product.variants).map((variant, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-slate-800 rounded-lg">
                      <span className="text-white">{variant.name}</span>
                      <span className="text-cyan-400 font-semibold">{variant.price}€</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex space-x-4 pt-6">
              {settings.orderLink && (
                <button
                  onClick={handleOrder}
                  className="flex-1 btn-primary text-lg py-4 flex items-center justify-center space-x-2"
                >
                  <ShoppingCart className="w-6 h-6" />
                  <span>{settings.orderButtonText || 'Commander maintenant'}</span>
                </button>
              )}
              
              <button
                onClick={handleShare}
                className="btn-secondary p-4"
                title="Partager"
              >
                <Share2 className="w-6 h-6" />
              </button>
              
              <button
                className="btn-secondary p-4"
                title="Ajouter aux favoris"
              >
                <Heart className="w-6 h-6" />
              </button>
            </div>

            {/* Video */}
            {product.video && (
              <div className="mt-8">
                <h3 className="text-xl font-semibold text-white mb-3">Vidéo du produit</h3>
                <div className="aspect-video bg-slate-800 rounded-2xl overflow-hidden">
                  <video
                    src={product.video}
                    controls
                    className="w-full h-full"
                    poster={product.image}
                  >
                    Votre navigateur ne supporte pas la lecture vidéo.
                  </video>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetail