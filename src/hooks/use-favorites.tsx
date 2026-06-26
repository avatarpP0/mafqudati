'use client'

import { useState, useEffect, useCallback, createContext, useContext, ReactNode } from 'react'

const SESSION_KEY = 'mafqudati-session'

interface FavoriteItem {
  itemType: string
  itemId: string
}

interface FavoritesState {
  favorites: FavoriteItem[]
  isFavorite: (itemType: string, itemId: string) => boolean
  toggleFavorite: (itemType: string, itemId: string) => Promise<void>
  loading: boolean
  count: number
}

const FavoritesContext = createContext<FavoritesState>({
  favorites: [],
  isFavorite: () => false,
  toggleFavorite: async () => {},
  loading: true,
  count: 0,
})

function getOrCreateSessionId(): string {
  if (typeof window === 'undefined') return ''
  let sessionId = localStorage.getItem(SESSION_KEY)
  if (!sessionId) {
    sessionId = crypto.randomUUID()
    localStorage.setItem(SESSION_KEY, sessionId)
  }
  return sessionId
}

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([])
  const [loading, setLoading] = useState(true)
  const [sessionId, setSessionId] = useState<string>('')

  // Initialize session ID
  useEffect(() => {
    const id = getOrCreateSessionId()
    setSessionId(id)
  }, [])

  // Fetch favorites when sessionId is ready
  useEffect(() => {
    if (!sessionId) return

    const fetchFavorites = async () => {
      try {
        setLoading(true)
        const res = await fetch(`/api/favorites?sessionId=${encodeURIComponent(sessionId)}`)
        if (res.ok) {
          const data = await res.json()
          setFavorites(data.map((f: { itemType: string; itemId: string }) => ({
            itemType: f.itemType,
            itemId: f.itemId,
          })))
        }
      } catch (error) {
        console.error('Error fetching favorites:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchFavorites()
  }, [sessionId])

  const isFavorite = useCallback(
    (itemType: string, itemId: string): boolean => {
      return favorites.some(
        (f) => f.itemType === itemType && f.itemId === itemId
      )
    },
    [favorites]
  )

  const toggleFavorite = useCallback(
    async (itemType: string, itemId: string) => {
      if (!sessionId) return

      const isFav = isFavorite(itemType, itemId)

      // Optimistic update
      if (isFav) {
        setFavorites((prev) =>
          prev.filter(
            (f) => !(f.itemType === itemType && f.itemId === itemId)
          )
        )
      } else {
        setFavorites((prev) => [...prev, { itemType, itemId }])
      }

      try {
        if (isFav) {
          const res = await fetch('/api/favorites', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ itemType, itemId, sessionId }),
          })
          if (!res.ok) {
            // Revert on error
            setFavorites((prev) => [...prev, { itemType, itemId }])
          }
        } else {
          const res = await fetch('/api/favorites', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ itemType, itemId, sessionId }),
          })
          if (!res.ok) {
            // Revert on error
            setFavorites((prev) =>
              prev.filter(
                (f) => !(f.itemType === itemType && f.itemId === itemId)
              )
            )
          }
        }
      } catch (error) {
        console.error('Error toggling favorite:', error)
        // Revert on error
        if (isFav) {
          setFavorites((prev) => [...prev, { itemType, itemId }])
        } else {
          setFavorites((prev) =>
            prev.filter(
              (f) => !(f.itemType === itemType && f.itemId === itemId)
            )
          )
        }
      }
    },
    [sessionId, isFavorite]
  )

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        isFavorite,
        toggleFavorite,
        loading,
        count: favorites.length,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  )
}

export function useFavorites(): FavoritesState {
  return useContext(FavoritesContext)
}
