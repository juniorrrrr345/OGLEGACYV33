import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus, Edit, Trash2, Search, Share2, ExternalLink, X } from 'lucide-react'
import AdminLayout from '../../components/AdminLayout'

const Socials = () => {
  const [socials, setSocials] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingSocial, setEditingSocial] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    icon: '',
    description: '',
    url: ''
  })

  useEffect(() => {
    fetchSocials()
  }, [])

  const fetchSocials = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/socials`)
      if (response.ok) {
        const data = await response.json()
        setSocials(data)
      }
    } catch (error) {
      console.error('Erreur lors du chargement des réseaux sociaux:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredSocials = socials.filter(social =>
    social.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    social.description?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const url = editingSocial
        ? `${import.meta.env.VITE_API_URL}/api/socials/${editingSocial.id}`
        : `${import.meta.env.VITE_API_URL}/api/socials`

      const method = editingSocial ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        await fetchSocials()
        handleCloseModal()
      } else {
        alert('Erreur lors de la sauvegarde')
      }
    } catch (error) {
      console.error('Erreur:', error)
      alert('Erreur lors de la sauvegarde')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (social) => {
    setEditingSocial(social)
    setFormData({
      name: social.name || '',
      icon: social.icon || '',
      description: social.description || '',
      url: social.url || ''
    })
    setShowModal(true)
  }

  const handleDelete = async (socialId) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce réseau social ?')) return

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/socials/${socialId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        await fetchSocials()
      } else {
        alert('Erreur lors de la suppression')
      }
    } catch (error) {
      console.error('Erreur:', error)
      alert('Erreur lors de la suppression')
    }
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingSocial(null)
    setFormData({
      name: '',
      icon: '',
      description: '',
      url: ''
    })
  }

  if (loading && socials.length === 0) {
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
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Réseaux Sociaux</h1>
            <p className="text-gray-400">Gérez vos liens vers les réseaux sociaux</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="btn-primary flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Ajouter un réseau</span>
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Rechercher un réseau social..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none"
          />
        </div>

        {/* Socials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSocials.map((social, index) => (
            <motion.div
              key={social.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass-effect rounded-2xl p-6 hover:neon-border transition-all duration-300 group"
            >
              {/* Icon & Name */}
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  {social.icon ? (
                    <span className="text-2xl">{social.icon}</span>
                  ) : (
                    <Share2 className="w-6 h-6 text-gray-400" />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white group-hover:text-cyan-400 transition-colors">
                    {social.name}
                  </h3>
                  {social.url && (
                    <a
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-cyan-400 hover:text-cyan-300 text-sm flex items-center space-x-1"
                    >
                      <span>Visiter</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>

              {/* Description */}
              {social.description && (
                <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                  {social.description}
                </p>
              )}

              {/* URL */}
              {social.url && (
                <div className="mb-4 p-2 bg-slate-800/50 rounded-lg">
                  <p className="text-xs text-gray-400 truncate">{social.url}</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => handleEdit(social)}
                  className="p-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
                  title="Modifier"
                >
                  <Edit className="w-4 h-4 text-cyan-400" />
                </button>
                <button
                  onClick={() => handleDelete(social.id)}
                  className="p-2 bg-slate-700 hover:bg-red-600 rounded-lg transition-colors"
                  title="Supprimer"
                >
                  <Trash2 className="w-4 h-4 text-red-400" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredSocials.length === 0 && (
          <div className="text-center py-16">
            <Share2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-xl text-gray-400">Aucun réseau social trouvé</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <motion.div 
          className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[9999] overflow-y-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="min-h-screen px-4 pt-20 flex items-start justify-center">
            <motion.div 
              className="neon-border rounded-2xl p-8 bg-slate-900 max-w-md w-full"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">
                  {editingSocial ? 'Modifier le réseau social' : 'Nouveau réseau social'}
                </h2>
                <button
                  onClick={handleCloseModal}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Nom du réseau social *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-800 border border-gray-600 rounded-lg text-white focus:border-cyan-400 focus:outline-none"
                    placeholder="Facebook, Instagram, Twitter..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Icône (emoji)
                  </label>
                  <input
                    type="text"
                    value={formData.icon}
                    onChange={(e) => setFormData({...formData, icon: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-800 border border-gray-600 rounded-lg text-white focus:border-cyan-400 focus:outline-none"
                    placeholder="📘 📷 🐦"
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    Utilisez un emoji pour représenter ce réseau social
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    URL du profil *
                  </label>
                  <input
                    type="url"
                    value={formData.url}
                    onChange={(e) => setFormData({...formData, url: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-800 border border-gray-600 rounded-lg text-white focus:border-cyan-400 focus:outline-none"
                    placeholder="https://facebook.com/votre-page"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-800 border border-gray-600 rounded-lg text-white focus:border-cyan-400 focus:outline-none"
                    rows="3"
                    placeholder="Description du contenu de ce réseau social..."
                  />
                </div>

                <div className="flex space-x-4 pt-6">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="flex-1 btn-secondary"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 btn-primary disabled:opacity-50"
                  >
                    {loading ? 'Sauvegarde...' : 'Sauvegarder'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AdminLayout>
  )
}

export default Socials