import React, { createContext, useContext, useState, useEffect } from 'react'

const LoadingContext = createContext()

export const useLoading = () => {
  const context = useContext(LoadingContext)
  if (!context) {
    throw new Error('useLoading must be used within a LoadingProvider')
  }
  return context
}

export const LoadingProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true)
  const [loadingMessage, setLoadingMessage] = useState('Chargement de votre boutique...')
  const [loadingProgress, setLoadingProgress] = useState(0)

  // Simulation du chargement initial de l'application
  useEffect(() => {
    const loadApp = async () => {
      try {
        setLoadingMessage('Initialisation...')
        setLoadingProgress(20)
        await new Promise(resolve => setTimeout(resolve, 500))

        setLoadingMessage('Chargement des paramètres...')
        setLoadingProgress(40)
        await new Promise(resolve => setTimeout(resolve, 500))

        setLoadingMessage('Préparation de la boutique...')
        setLoadingProgress(70)
        await new Promise(resolve => setTimeout(resolve, 500))

        setLoadingMessage('Finalisation...')
        setLoadingProgress(90)
        await new Promise(resolve => setTimeout(resolve, 300))

        setLoadingProgress(100)
        await new Promise(resolve => setTimeout(resolve, 200))
        
        setIsLoading(false)
      } catch (error) {
        console.error('Erreur lors du chargement:', error)
        setIsLoading(false)
      }
    }

    loadApp()
  }, [])

  const startLoading = (message = 'Chargement...') => {
    setIsLoading(true)
    setLoadingMessage(message)
    setLoadingProgress(0)
  }

  const stopLoading = () => {
    setIsLoading(false)
    setLoadingProgress(100)
  }

  const updateProgress = (progress, message) => {
    setLoadingProgress(progress)
    if (message) {
      setLoadingMessage(message)
    }
  }

  const value = {
    isLoading,
    loadingMessage,
    loadingProgress,
    startLoading,
    stopLoading,
    updateProgress
  }

  return (
    <LoadingContext.Provider value={value}>
      {children}
    </LoadingContext.Provider>
  )
}