'use client'

import { Button } from '@/components/ui/button'
import { Heart } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useFavorites } from '@/hooks/use-favorites'
import { useToast } from '@/hooks/use-toast'
import { useI18n } from '@/lib/i18n'

interface FavoriteButtonProps {
  itemType: string
  itemId: string
  className?: string
  size?: 'sm' | 'default'
}

export function FavoriteButton({
  itemType,
  itemId,
  className = '',
  size = 'default',
}: FavoriteButtonProps) {
  const { isFavorite, toggleFavorite } = useFavorites()
  const { t } = useI18n()
  const { toast } = useToast()

  const fav = isFavorite(itemType, itemId)

  const handleToggle = async (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()

    const wasFav = fav
    await toggleFavorite(itemType, itemId)

    toast({
      title: wasFav ? t('favoriteRemoved') : t('favoriteAdded'),
      description: wasFav
        ? t('favoriteRemoved')
        : t('favoriteAdded'),
    })
  }

  const iconSize = size === 'sm' ? 'h-4 w-4' : 'h-5 w-5'
  const buttonSize = size === 'sm' ? 'h-8 w-8' : 'h-9 w-9'

  return (
    <Button
      variant="ghost"
      size="icon"
      className={`${buttonSize} rounded-full bg-white/80 dark:bg-black/50 backdrop-blur-sm hover:bg-white dark:hover:bg-black/70 ${className}`}
      onClick={handleToggle}
      aria-label={fav ? t('favoriteRemoved') : t('favoriteAdded')}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={fav ? 'filled' : 'outline'}
          initial={{ scale: 0.5 }}
          animate={{ scale: 1 }}
          exit={{ scale: 1.5 }}
          transition={{
            type: 'spring',
            stiffness: 500,
            damping: 20,
            duration: 0.3,
          }}
        >
          <Heart
            className={`${iconSize} transition-colors ${
              fav
                ? 'fill-red-500 text-red-500'
                : 'text-gray-600 dark:text-gray-300'
            }`}
          />
        </motion.div>
      </AnimatePresence>
    </Button>
  )
}
