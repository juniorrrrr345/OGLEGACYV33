import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

const PricingSelector = ({ onSelectionChange, productVariants = [] }) => {
  const [selectedQuantity, setSelectedQuantity] = useState('')
  const [selectedDelivery, setSelectedDelivery] = useState('meetup')

  // Construire le pricing à partir des variants du produit
  const pricing = {}
  const quantities = []
  
  if (productVariants && productVariants.length > 0) {
    productVariants.forEach(variant => {
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
  useEffect(() => {
    if (quantities.length > 0 && !selectedQuantity) {
      setSelectedQuantity(quantities[0])
    }
  }, [quantities, selectedQuantity])

  const deliveryOptions = [
    { value: 'meetup', label: 'Meet up', icon: '🤝' },
    { value: 'livraison', label: 'Livraison', icon: '🚚' }
  ]

  const currentPrice = pricing[selectedQuantity]?.[selectedDelivery] || 0

  const handleQuantityChange = (quantity) => {
    setSelectedQuantity(quantity)
    onSelectionChange?.(quantity, selectedDelivery, pricing[quantity]?.[selectedDelivery])
  }

  const handleDeliveryChange = (delivery) => {
    setSelectedDelivery(delivery)
    onSelectionChange?.(selectedQuantity, delivery, pricing[selectedQuantity]?.[delivery])
  }

  return (
    <div className="space-y-6">
      {/* Sélection de la quantité */}
      <div className="space-y-3">
        <h3 className="text-lg font-bold text-white mb-4">💰 Quantité & Prix</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {quantities.map((quantity) => (
            <motion.button
              key={quantity}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleQuantityChange(quantity)}
              className={`p-3 rounded-lg border-2 transition-all ${
                selectedQuantity === quantity
                  ? 'border-white bg-white/10 text-white'
                  : 'border-gray-700/30 bg-slate-800/50 text-gray-300 hover:border-white/50'
              }`}
            >
              <div className="text-center">
                <div className="text-sm font-bold">{quantity}</div>
                <div className="text-xs text-gray-400 mt-1">
                  {pricing[quantity]?.meetup}€ / {pricing[quantity]?.livraison}€
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Sélection du mode de livraison */}
      <div className="space-y-3">
        <h3 className="text-lg font-bold text-white mb-4">🚚 Mode de livraison</h3>
        <div className="grid grid-cols-2 gap-3">
          {deliveryOptions.map((option) => (
            <motion.button
              key={option.value}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleDeliveryChange(option.value)}
              className={`p-4 rounded-lg border-2 transition-all flex items-center justify-center space-x-2 ${
                selectedDelivery === option.value
                  ? 'border-white bg-white/10 text-white'
                  : 'border-gray-700/30 bg-slate-800/50 text-gray-300 hover:border-white/50'
              }`}
            >
              <span className="text-xl">{option.icon}</span>
              <span className="font-semibold">{option.label}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Prix final */}
      <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-xl p-4">
        <div className="text-center">
          <div className="text-sm text-gray-300 mb-1">
            {selectedQuantity} - {deliveryOptions.find(opt => opt.value === selectedDelivery)?.label}
          </div>
          <div className="text-3xl font-bold text-white">
            {currentPrice}€
          </div>
        </div>
      </div>
    </div>
  )
}

export default PricingSelector