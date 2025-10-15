import React from 'react'
import { useLoading } from '../contexts/LoadingContext'

const LoadingPage = () => {
  const { loadingMessage, loadingProgress } = useLoading()

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center z-50">
      <div className="text-center">
        {/* Logo/Icon de chargement */}
        <div className="mb-8">
          <div className="w-20 h-20 mx-auto relative">
            {/* Cercle de chargement animé */}
            <div className="absolute inset-0 border-4 border-white/20 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-transparent border-t-white rounded-full animate-spin"></div>
            <div className="absolute inset-2 border-2 border-transparent border-b-white rounded-full animate-spin" style={{animationDirection: 'reverse', animationDuration: '0.8s'}}></div>
          </div>
        </div>

        {/* Texte de chargement dynamique */}
        <h2 className="text-3xl font-bold text-white mb-4 animate-pulse">
          {loadingMessage}
        </h2>
        
        {/* Sous-titre */}
        <p className="text-white/70 text-lg mb-8">
          Préparation de votre boutique
        </p>

        {/* Barre de progression avec pourcentage */}
        <div className="w-64 mx-auto mb-4">
          <div className="bg-white/20 rounded-full h-3 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-purple-400 to-blue-400 h-full rounded-full transition-all duration-500 ease-out"
              style={{ width: `${loadingProgress}%` }}
            ></div>
          </div>
          <div className="text-white/80 text-sm mt-2">
            {loadingProgress}%
          </div>
        </div>

        {/* Points de chargement */}
        <div className="flex justify-center mt-6 space-x-2">
          <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
          <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
          <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
        </div>
      </div>
    </div>
  )
}

export default LoadingPage