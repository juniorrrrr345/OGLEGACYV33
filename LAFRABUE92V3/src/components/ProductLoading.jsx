import React from 'react'
import { motion } from 'framer-motion'

const ProductLoading = ({ message = "Chargement des produits...", progress = 0 }) => {
  return (
    <div className="min-h-screen cosmic-bg flex items-center justify-center">
      <div className="text-center">
        {/* Animation de chargement sophistiquée */}
        <div className="mb-8 relative">
          <div className="w-24 h-24 mx-auto relative">
            {/* Cercle principal avec gradient animé */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 opacity-20"></div>
            
            {/* Cercle de chargement principal */}
            <div className="absolute inset-2 border-4 border-transparent border-t-purple-400 rounded-full animate-spin"></div>
            
            {/* Cercle secondaire avec direction inverse */}
            <div className="absolute inset-4 border-2 border-transparent border-b-pink-400 rounded-full animate-spin" 
                 style={{animationDirection: 'reverse', animationDuration: '1.2s'}}></div>
            
            {/* Cercle intérieur avec pulsation */}
            <div className="absolute inset-6 border border-transparent border-r-blue-400 rounded-full animate-pulse"></div>
            
            {/* Point central animé */}
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                className="w-3 h-3 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.7, 1, 0.7]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </div>
          </div>
        </div>

        {/* Message de chargement avec animation */}
        <motion.h2 
          className="text-2xl md:text-3xl font-bold text-white mb-4"
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          {message}
        </motion.h2>
        
        {/* Sous-titre élégant */}
        <p className="text-white/70 text-lg mb-8">
          Préparation de votre sélection
        </p>

        {/* Barre de progression avec effet de brillance */}
        <div className="w-80 mx-auto mb-6">
          <div className="relative bg-white/10 rounded-full h-2 overflow-hidden">
            <motion.div 
              className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 h-full rounded-full relative"
              style={{ width: `${progress}%` }}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              {/* Effet de brillance qui se déplace */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                animate={{ x: ['-100%', '100%'] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              />
            </motion.div>
          </div>
          <div className="text-white/80 text-sm mt-3 font-medium">
            {progress}%
          </div>
        </div>

        {/* Points de chargement avec animation en vague */}
        <div className="flex justify-center space-x-2">
          {[0, 1, 2].map((index) => (
            <motion.div
              key={index}
              className="w-3 h-3 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: index * 0.2,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>

        {/* Texte d'encouragement */}
        <motion.p 
          className="text-white/60 text-sm mt-6"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          Quelques instants de patience...
        </motion.p>
      </div>
    </div>
  )
}

export default ProductLoading