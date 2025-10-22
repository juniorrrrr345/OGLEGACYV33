import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Save, Settings as SettingsIcon, Store, Phone, Mail, Globe, ShoppingCart } from 'lucide-react'
import AdminLayout from '../../components/AdminLayout'

const Settings = () => {
  const [settings, setSettings] = useState({
    storeName: '',
    storeDescription: '',
    storeEmail: '',
    storePhone: '',
    orderLink: '',
    orderButtonText: '',
    currency: 'EUR',
    language: 'fr'
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/settings`)
      if (response.ok) {
        const data = await response.json()
        setSettings(prev => ({ ...prev, ...data }))
      }
    } catch (error) {
      console.error('Erreur lors du chargement des paramètres:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/settings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      })

      if (response.ok) {
        alert('Paramètres sauvegardés avec succès!')
      } else {
        alert('Erreur lors de la sauvegarde')
      }
    } catch (error) {
      console.error('Erreur:', error)
      alert('Erreur lors de la sauvegarde')
    } finally {
      setSaving(false)
    }
  }

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
          <div className="flex items-center space-x-3 mb-2">
            <SettingsIcon className="w-8 h-8 text-cyan-400" />
            <h1 className="text-3xl font-bold text-white">Paramètres</h1>
          </div>
          <p className="text-gray-400">Configurez votre boutique e-commerce</p>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Informations générales */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-effect rounded-2xl p-6"
          >
            <div className="flex items-center space-x-3 mb-6">
              <Store className="w-6 h-6 text-cyan-400" />
              <h2 className="text-xl font-semibold text-white">Informations de la boutique</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Nom de la boutique
                </label>
                <input
                  type="text"
                  value={settings.storeName}
                  onChange={(e) => setSettings({...settings, storeName: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-800 border border-gray-600 rounded-lg text-white focus:border-cyan-400 focus:outline-none"
                  placeholder="Ma Boutique E-commerce"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Devise
                </label>
                <select
                  value={settings.currency}
                  onChange={(e) => setSettings({...settings, currency: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-800 border border-gray-600 rounded-lg text-white focus:border-cyan-400 focus:outline-none"
                >
                  <option value="EUR">Euro (€)</option>
                  <option value="USD">Dollar ($)</option>
                  <option value="GBP">Livre (£)</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Description de la boutique
                </label>
                <textarea
                  value={settings.storeDescription}
                  onChange={(e) => setSettings({...settings, storeDescription: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-800 border border-gray-600 rounded-lg text-white focus:border-cyan-400 focus:outline-none"
                  rows="3"
                  placeholder="Votre boutique en ligne premium pour des produits de qualité..."
                />
              </div>
            </div>
          </motion.div>

          {/* Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-effect rounded-2xl p-6"
          >
            <div className="flex items-center space-x-3 mb-6">
              <Phone className="w-6 h-6 text-cyan-400" />
              <h2 className="text-xl font-semibold text-white">Informations de contact</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email de contact
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="email"
                    value={settings.storeEmail}
                    onChange={(e) => setSettings({...settings, storeEmail: e.target.value})}
                    className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-gray-600 rounded-lg text-white focus:border-cyan-400 focus:outline-none"
                    placeholder="contact@boutique.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Téléphone
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="tel"
                    value={settings.storePhone}
                    onChange={(e) => setSettings({...settings, storePhone: e.target.value})}
                    className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-gray-600 rounded-lg text-white focus:border-cyan-400 focus:outline-none"
                    placeholder="+33 1 23 45 67 89"
                  />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Commandes */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-effect rounded-2xl p-6"
          >
            <div className="flex items-center space-x-3 mb-6">
              <ShoppingCart className="w-6 h-6 text-cyan-400" />
              <h2 className="text-xl font-semibold text-white">Configuration des commandes</h2>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Lien de commande (WhatsApp, Telegram, etc.)
                </label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="url"
                    value={settings.orderLink}
                    onChange={(e) => setSettings({...settings, orderLink: e.target.value})}
                    className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-gray-600 rounded-lg text-white focus:border-cyan-400 focus:outline-none"
                    placeholder="https://wa.me/33123456789"
                  />
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  Lien vers votre WhatsApp, Telegram ou système de commande
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Texte du bouton de commande
                </label>
                <input
                  type="text"
                  value={settings.orderButtonText}
                  onChange={(e) => setSettings({...settings, orderButtonText: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-800 border border-gray-600 rounded-lg text-white focus:border-cyan-400 focus:outline-none"
                  placeholder="Commander maintenant"
                />
              </div>
            </div>
          </motion.div>

          {/* Localisation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-effect rounded-2xl p-6"
          >
            <div className="flex items-center space-x-3 mb-6">
              <Globe className="w-6 h-6 text-cyan-400" />
              <h2 className="text-xl font-semibold text-white">Localisation</h2>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Langue
              </label>
              <select
                value={settings.language}
                onChange={(e) => setSettings({...settings, language: e.target.value})}
                className="w-full px-3 py-2 bg-slate-800 border border-gray-600 rounded-lg text-white focus:border-cyan-400 focus:outline-none"
              >
                <option value="fr">Français</option>
                <option value="en">English</option>
                <option value="es">Español</option>
              </select>
            </div>
          </motion.div>

          {/* Bouton de sauvegarde */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex justify-end"
          >
            <button
              type="submit"
              disabled={saving}
              className="btn-primary flex items-center space-x-2 px-8 py-3 disabled:opacity-50"
            >
              <Save className="w-5 h-5" />
              <span>{saving ? 'Sauvegarde...' : 'Sauvegarder les paramètres'}</span>
            </button>
          </motion.div>
        </form>
      </div>
    </AdminLayout>
  )
}

export default Settings