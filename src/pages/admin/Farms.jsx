import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus, Edit, Trash2, Search, Building2, Upload, X } from 'lucide-react'
import AdminLayout from '../../components/AdminLayout'

const Farms = () => {
  const [farms, setFarms] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingFarm, setEditingFarm] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    image: '',
    description: ''
  })
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    fetchFarms()
  }, [])

  const fetchFarms = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/farms`)
      if (response.ok) {
        const data = await response.json()
        setFarms(data)
      }
    } catch (error) {
      console.error('Erreur lors du chargement des fermes:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredFarms = farms.filter(farm =>
    farm.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    farm.description?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const url = editingFarm
        ? `${import.meta.env.VITE_API_URL}/api/farms/${editingFarm.id}`
        : `${import.meta.env.VITE_API_URL}/api/farms`

      const method = editingFarm ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        await fetchFarms()
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

  const handleEdit = (farm) => {
    setEditingFarm(farm)
    setFormData({
      name: farm.name || '',
      image: farm.image || '',
      description: farm.description || ''
    })
    setShowModal(true)
  }

  const handleDelete = async (farmId) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette ferme ?')) return

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/farms/${farmId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        await fetchFarms()
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
    setEditingFarm(null)
    setFormData({
      name: '',
      image: '',
      description: ''
    })
  }

  const handleFileUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    setUploading(true)
    try {
      const formDataUpload = new FormData()
      formDataUpload.append('file', file)

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/upload`, {
        method: 'POST',
        body: formDataUpload,
      })

      if (response.ok) {
        const data = await response.json()
        setFormData(prev => ({ ...prev, image: data.url }))
      } else {
        alert('Erreur lors de l\'upload')
      }
    } catch (error) {
      console.error('Erreur upload:', error)
      alert('Erreur lors de l\'upload')
    } finally {
      setUploading(false)
    }
  }

  if (loading && farms.length === 0) {
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
            <h1 className="text-3xl font-bold text-white">Fermes</h1>
            <p className="text-gray-400">Gérez vos partenaires producteurs</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="btn-primary flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Ajouter une ferme</span>
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Rechercher une ferme..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none"
          />
        </div>

        {/* Farms Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFarms.map((farm, index) => (
            <motion.div
              key={farm.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass-effect rounded-2xl overflow-hidden hover:neon-border transition-all duration-300 group"
            >
              {/* Image */}
              <div className="aspect-video bg-slate-800 relative overflow-hidden">
                {farm.image ? (
                  <img
                    src={farm.image}
                    alt={farm.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <Building2 className="w-12 h-12" />
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-3 text-white group-hover:text-cyan-400 transition-colors">
                  {farm.name}
                </h3>
                
                {farm.description && (
                  <p className="text-gray-400 mb-4 line-clamp-3">
                    {farm.description}
                  </p>
                )}

                {/* Actions */}
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => handleEdit(farm)}
                    className="p-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
                    title="Modifier"
                  >
                    <Edit className="w-4 h-4 text-cyan-400" />
                  </button>
                  <button
                    onClick={() => handleDelete(farm.id)}
                    className="p-2 bg-slate-700 hover:bg-red-600 rounded-lg transition-colors"
                    title="Supprimer"
                  >
                    <Trash2 className="w-4 h-4 text-red-400" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredFarms.length === 0 && (
          <div className="text-center py-16">
            <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-xl text-gray-400">Aucune ferme trouvée</p>
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
                  {editingFarm ? 'Modifier la ferme' : 'Nouvelle ferme'}
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
                    Nom de la ferme *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-800 border border-gray-600 rounded-lg text-white focus:border-cyan-400 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Image de la ferme
                  </label>
                  <div className="space-y-2">
                    <input
                      type="url"
                      value={formData.image}
                      onChange={(e) => setFormData({...formData, image: e.target.value})}
                      className="w-full px-3 py-2 bg-slate-800 border border-gray-600 rounded-lg text-white focus:border-cyan-400 focus:outline-none"
                      placeholder="URL de l'image"
                    />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="w-full px-3 py-2 bg-slate-800 border border-gray-600 rounded-lg text-white focus:border-cyan-400 focus:outline-none"
                      disabled={uploading}
                    />
                  </div>
                  {formData.image && (
                    <div className="mt-2">
                      <img
                        src={formData.image}
                        alt="Aperçu"
                        className="w-full h-32 object-cover rounded-lg"
                      />
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-800 border border-gray-600 rounded-lg text-white focus:border-cyan-400 focus:outline-none"
                    rows="4"
                    placeholder="Description de la ferme, ses pratiques, sa localisation..."
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
                    disabled={loading || uploading}
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

export default Farms