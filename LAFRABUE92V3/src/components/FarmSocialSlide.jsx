import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { getAll } from '../utils/api'

const FarmSocialSlide = ({ isOpen, onClose, onConfirm, productData, contentType = 'product' }) => {
  const [socials, setSocials] = useState([])
  const [selectedSocials, setSelectedSocials] = useState([])
  const [customMessage, setCustomMessage] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isOpen) {
      fetchSocials()
      // Message par défaut selon le type de contenu
      setCustomMessage(generateDefaultMessage(contentType, productData))
    }
  }, [isOpen, productData, contentType])

  const generateDefaultMessage = (type, data) => {
    switch (type) {
      case 'product':
        return `🛍️ Nouveau produit disponible !\n\n${data?.name || 'Produit'}\n${data?.description || ''}\n\nDécouvrez nos produits ! 🛒`
      case 'farm':
        return `🌾 Nouvelle ferme ajoutée !\n\n${data?.name || 'Ferme'}\n\nDécouvrez nos producteurs locaux ! 🚜`
      case 'category':
        return `📂 Nouvelle catégorie disponible !\n\n${data?.name || 'Catégorie'}\n${data?.description || ''}\n\nExplorez nos produits ! 🛍️`
      case 'social':
        return `📱 Nouveau réseau social ajouté !\n\n${data?.name || 'Réseau social'}\n${data?.description || ''}\n\nSuivez-nous ! 👥`
      default:
        return `✨ Nouveau contenu disponible !\n\n${data?.name || 'Contenu'}\n${data?.description || ''}\n\nDécouvrez plus ! 🎉`
    }
  }

  const fetchSocials = async () => {
    try {
      const data = await getAll('socials')
      setSocials(data)
    } catch (error) {
      console.error('Erreur lors du chargement des réseaux sociaux:', error)
    }
  }

  const toggleSocial = (socialId) => {
    setSelectedSocials(prev => 
      prev.includes(socialId) 
        ? prev.filter(id => id !== socialId)
        : [...prev, socialId]
    )
  }

  const handleConfirm = async () => {
    if (selectedSocials.length === 0) {
      alert('Veuillez sélectionner au moins un réseau social')
      return
    }

    setLoading(true)
    
    try {
      const selectedSocialsData = socials.filter(social => selectedSocials.includes(social.id))
      
      // Simuler le partage sur chaque réseau social
      for (const social of selectedSocialsData) {
        const message = generateSocialMessage(social)
        const shareUrl = social.url || '#'
        
        // Pour les réseaux sociaux qui supportent le partage direct
        if (social.name.toLowerCase().includes('whatsapp')) {
          const whatsappMessage = encodeURIComponent(message)
          window.open(`https://wa.me/?text=${whatsappMessage}`, '_blank')
        } else if (social.name.toLowerCase().includes('twitter') || social.name.toLowerCase().includes('x')) {
          const twitterMessage = encodeURIComponent(message)
          window.open(`https://twitter.com/intent/tweet?text=${twitterMessage}`, '_blank')
        } else if (social.name.toLowerCase().includes('facebook')) {
          const facebookMessage = encodeURIComponent(message)
          window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${facebookMessage}`, '_blank')
        } else if (social.name.toLowerCase().includes('instagram')) {
          // Pour Instagram, on copie le message dans le presse-papier
          await navigator.clipboard.writeText(message)
          alert('Message copié ! Collez-le dans votre story ou post Instagram 📱')
        }
        
        // Petite pause entre les partages
        await new Promise(resolve => setTimeout(resolve, 500))
      }
      
      onConfirm({
        socials: selectedSocialsData,
        message: customMessage,
        product: productData
      })
      
      alert(`✅ Produit partagé sur ${selectedSocialsData.length} réseau(x) social(aux) !`)
    } catch (error) {
      console.error('Erreur lors du partage:', error)
      alert('Erreur lors du partage. Veuillez réessayer.')
    } finally {
      setLoading(false)
      onClose()
    }
  }

  const generateSocialMessage = (social) => {
    const baseMessage = customMessage
    const socialName = social.name.toLowerCase()
    
    // Générer des hashtags selon le type de contenu
    const getHashtags = () => {
      switch (contentType) {
        case 'product':
          return '#NouveauProduit #Boutique #ProduitsFrais #Shopping #Découverte'
        case 'farm':
          return '#FermeLocale #ProduitsFrais #Agriculture #Bio #Local #FarmToTable #Ferme #AgricultureDurable'
        case 'category':
          return '#NouvelleCatégorie #Boutique #Produits #Shopping #Organisation'
        case 'social':
          return '#RéseauxSociaux #Contact #Communication #SuivezNous #Social'
        default:
          return '#NouveauContenu #Boutique #Découverte #Actualité'
      }
    }
    
    if (socialName.includes('instagram')) {
      return `${baseMessage}\n\n${getHashtags()}`
    } else if (socialName.includes('facebook')) {
      return `${baseMessage}\n\n${getHashtags()}`
    } else if (socialName.includes('twitter') || socialName.includes('x')) {
      return `${baseMessage}\n\n${getHashtags()}`
    } else if (socialName.includes('whatsapp')) {
      const shortMessage = contentType === 'product' 
        ? `🛍️ Nouveau produit disponible !\n\n${productData?.name || 'Produit'}\n\nCommandez maintenant ! 🛒`
        : contentType === 'farm'
        ? `🌾 Nouvelle ferme ajoutée !\n\n${productData?.name || 'Ferme'}\n\nDécouvrez nos producteurs ! 🚜`
        : contentType === 'category'
        ? `📂 Nouvelle catégorie !\n\n${productData?.name || 'Catégorie'}\n\nExplorez nos produits ! 🛍️`
        : `📱 Nouveau réseau social !\n\n${productData?.name || 'Réseau'}\n\nSuivez-nous ! 👥`
      return shortMessage
    }
    
    return baseMessage
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[10000] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="w-full max-w-md mx-auto bg-slate-900 rounded-2xl border-2 border-white/20 shadow-2xl max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-6 border-b border-gray-700/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-2xl">
                  🌾
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Partager sur les réseaux</h2>
                  <p className="text-gray-400 text-sm">
                    {contentType === 'product' && 'Promouvoir votre produit'}
                    {contentType === 'farm' && 'Promouvoir votre ferme'}
                    {contentType === 'category' && 'Promouvoir votre catégorie'}
                    {contentType === 'social' && 'Promouvoir votre réseau social'}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white text-2xl"
              >
                ×
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Content Preview */}
            <div className="bg-slate-800/50 rounded-xl p-4 border border-gray-700/30">
              <div className="flex items-center space-x-3">
                <div className="w-16 h-16 bg-slate-700 rounded-lg flex items-center justify-center text-2xl">
                  {contentType === 'product' && (productData?.photo ? (
                    <img 
                      src={productData.photo} 
                      alt={productData.name}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : '🛍️')}
                  {contentType === 'farm' && '🌾'}
                  {contentType === 'category' && (productData?.icon || '📂')}
                  {contentType === 'social' && (productData?.icon || '📱')}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-semibold truncate">{productData?.name || 'Contenu'}</h3>
                  <p className="text-gray-400 text-sm line-clamp-2">{productData?.description || ''}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      contentType === 'product' ? 'bg-blue-600/20 text-blue-400' :
                      contentType === 'farm' ? 'bg-green-600/20 text-green-400' :
                      contentType === 'category' ? 'bg-purple-600/20 text-purple-400' :
                      'bg-pink-600/20 text-pink-400'
                    }`}>
                      {contentType === 'product' && 'Produit'}
                      {contentType === 'farm' && 'Ferme'}
                      {contentType === 'category' && 'Catégorie'}
                      {contentType === 'social' && 'Réseau social'}
                    </span>
                    {contentType === 'product' && productData?.farm && (
                      <span className="px-2 py-1 bg-blue-600/20 text-blue-400 text-xs rounded-full">
                        {productData.farm}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Social Networks Selection */}
            <div>
              <h3 className="text-white font-semibold mb-3 flex items-center">
                <span className="text-2xl mr-2">📱</span>
                Choisir les réseaux sociaux
              </h3>
              <div className="space-y-2">
                {socials.map((social) => (
                  <motion.button
                    key={social.id}
                    onClick={() => toggleSocial(social.id)}
                    className={`w-full p-3 rounded-xl border-2 transition-all flex items-center space-x-3 ${
                      selectedSocials.includes(social.id)
                        ? 'border-white bg-white/10 text-white'
                        : 'border-gray-700 bg-slate-800/50 text-gray-300 hover:border-gray-600'
                    }`}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className="text-2xl">{social.icon}</span>
                    <div className="flex-1 text-left">
                      <div className="font-semibold">{social.name}</div>
                      <div className="text-sm opacity-75">{social.description}</div>
                    </div>
                    {selectedSocials.includes(social.id) && (
                      <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                        <span className="text-black text-sm">✓</span>
                      </div>
                    )}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Custom Message */}
            <div>
              <h3 className="text-white font-semibold mb-3 flex items-center">
                <span className="text-2xl mr-2">✍️</span>
                Message personnalisé
              </h3>
              <textarea
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                className="w-full h-32 p-3 bg-slate-800 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-white resize-none"
                placeholder="Votre message pour les réseaux sociaux..."
              />
              <div className="flex items-center justify-between mt-2">
                <p className="text-gray-400 text-xs">
                  Le message sera adapté automatiquement selon la plateforme
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setCustomMessage(generateDefaultMessage(contentType, productData))
                  }}
                  className="text-xs text-green-400 hover:text-green-300 underline"
                >
                  Réinitialiser
                </button>
              </div>
            </div>

            {/* Preview for selected socials */}
            {selectedSocials.length > 0 && (
              <div>
                <h3 className="text-white font-semibold mb-3 flex items-center">
                  <span className="text-2xl mr-2">👀</span>
                  Aperçu des messages
                </h3>
                <div className="space-y-3 max-h-48 overflow-y-auto">
                  {selectedSocials.map(socialId => {
                    const social = socials.find(s => s.id === socialId)
                    if (!social) return null
                    
                    return (
                      <motion.div 
                        key={socialId} 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-slate-800/50 rounded-xl p-3 border border-gray-700/30"
                      >
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="text-lg">{social.icon}</span>
                          <span className="text-white font-medium text-sm">{social.name}</span>
                          <span className="text-xs text-gray-400">
                            ({generateSocialMessage(social).length} caractères)
                          </span>
                        </div>
                        <div className="text-gray-300 text-sm whitespace-pre-line max-h-20 overflow-y-auto">
                          {generateSocialMessage(social)}
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-gray-700/30 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
            <button
              onClick={onClose}
              className="flex-1 py-3 bg-gray-700 text-white rounded-xl font-semibold hover:bg-gray-600 transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={handleConfirm}
              disabled={selectedSocials.length === 0 || loading}
              className="flex-1 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-semibold hover:from-green-600 hover:to-green-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Partage en cours...
                </>
              ) : (
                <>
                  <span className="mr-2">🚀</span>
                  Partager ({selectedSocials.length})
                </>
              )}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default FarmSocialSlide