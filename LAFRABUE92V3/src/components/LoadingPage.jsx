import React, { useState, useEffect } from 'react'
import { useLoading } from '../contexts/LoadingContext'

const LoadingPage = () => {
  const { loadingMessage, loadingProgress } = useLoading()
  const [currentTip, setCurrentTip] = useState(0)
  const [particles, setParticles] = useState([])

  // Conseils motivants pour la boutique
  const tips = [
    "✨ Découvrez nos produits d'exception",
    "🛍️ Livraison rapide et sécurisée",
    "💎 Qualité premium garantie",
    "🌟 Service client exceptionnel",
    "🎁 Offres exclusives en cours",
    "🚀 Innovation et tendances",
    "💝 Satisfaction client 100%",
    "🔥 Nouveautés chaque semaine"
  ]

  // Générer des particules flottantes
  useEffect(() => {
    const generateParticles = () => {
      const newParticles = []
      for (let i = 0; i < 50; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 4 + 1,
          speed: Math.random() * 2 + 0.5,
          opacity: Math.random() * 0.6 + 0.2
        })
      }
      setParticles(newParticles)
    }
    generateParticles()
  }, [])

  // Changer de conseil toutes les 2 secondes
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % tips.length)
    }, 2000)
    return () => clearInterval(interval)
  }, [tips.length])

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center z-50 overflow-hidden">
      {/* Particules flottantes en arrière-plan */}
      <div className="absolute inset-0">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute rounded-full bg-white/20 animate-pulse"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              animationDuration: `${particle.speed}s`,
              opacity: particle.opacity
            }}
          />
        ))}
      </div>

      {/* Effet de vague animé */}
      <div className="absolute inset-0">
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-purple-500/20 to-transparent animate-pulse-slow"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-blue-500/10 to-transparent rounded-full animate-float"></div>
      </div>

      <div className="text-center relative z-10">
        {/* Logo principal avec animation */}
        <div className="mb-12">
          <div className="relative">
            {/* Cercle externe avec effet de glow */}
            <div className="w-32 h-32 mx-auto relative">
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 rotate-slow"></div>
              <div className="absolute inset-2 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 rotate-slow" style={{animationDirection: 'reverse', animationDuration: '4s'}}></div>
              <div className="absolute inset-4 rounded-full bg-slate-900 flex items-center justify-center pulse-glow">
                <div className="text-4xl float-gentle">🛍️</div>
              </div>
            </div>
            
            {/* Effet de glow autour du logo */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500/30 to-pink-500/30 blur-xl animate-pulse"></div>
            
            {/* Particules autour du logo */}
            <div className="absolute inset-0">
              <div className="absolute top-2 left-8 w-2 h-2 bg-purple-400 rounded-full animate-ping" style={{animationDelay: '0s'}}></div>
              <div className="absolute top-8 right-2 w-1.5 h-1.5 bg-pink-400 rounded-full animate-ping" style={{animationDelay: '1s'}}></div>
              <div className="absolute bottom-4 left-4 w-1 h-1 bg-blue-400 rounded-full animate-ping" style={{animationDelay: '2s'}}></div>
              <div className="absolute bottom-8 right-8 w-2.5 h-2.5 bg-cyan-400 rounded-full animate-ping" style={{animationDelay: '0.5s'}}></div>
            </div>
          </div>
        </div>

        {/* Titre principal avec effet de glow */}
        <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent mb-4 fade-in-up">
          Bienvenue !
        </h1>

        {/* Message de chargement dynamique */}
        <h2 className="text-2xl font-semibold text-white mb-6 fade-in-up" style={{animationDelay: '0.2s'}}>
          {loadingMessage}
        </h2>
        
        {/* Conseil motivant */}
        <div className="mb-8 h-8 flex items-center justify-center">
          <p className="text-white/80 text-lg fade-in-up" style={{animationDelay: '0.4s'}}>
            {tips[currentTip]}
          </p>
        </div>

        {/* Barre de progression moderne */}
        <div className="w-80 mx-auto mb-6 fade-in-up" style={{animationDelay: '0.6s'}}>
          <div className="relative">
            {/* Barre de fond avec effet de glow */}
            <div className="bg-white/10 rounded-full h-4 overflow-hidden backdrop-blur-sm border border-white/20 pulse-glow">
              <div 
                className="bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 h-full rounded-full transition-all duration-700 ease-out relative shimmer-effect"
                style={{ width: `${loadingProgress}%` }}
              >
                {/* Effet de brillance */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
              </div>
            </div>
            
            {/* Pourcentage avec animation */}
            <div className="text-white/90 text-sm mt-3 font-medium fade-in-up">
              {loadingProgress}%
            </div>
          </div>
        </div>

        {/* Indicateur de chargement avec points animés */}
        <div className="flex justify-center space-x-3 fade-in-up" style={{animationDelay: '0.8s'}}>
          <div className="w-3 h-3 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-bounce pulse-glow" style={{animationDelay: '0ms'}}></div>
          <div className="w-3 h-3 bg-gradient-to-r from-pink-400 to-blue-400 rounded-full animate-bounce pulse-glow" style={{animationDelay: '200ms'}}></div>
          <div className="w-3 h-3 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full animate-bounce pulse-glow" style={{animationDelay: '400ms'}}></div>
        </div>

        {/* Message d'encouragement */}
        <div className="mt-8 text-white/60 text-sm fade-in-up" style={{animationDelay: '1s'}}>
          <p>Préparez-vous à une expérience shopping exceptionnelle !</p>
        </div>
      </div>

    </div>
  )
}

export default LoadingPage