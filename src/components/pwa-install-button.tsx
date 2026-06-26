'use client'

import { Button } from '@/components/ui/button'
import { Download } from 'lucide-react'
import { useI18n } from '@/lib/i18n'
import { usePWA } from '@/hooks/use-pwa'
import { useToast } from '@/hooks/use-toast'

export function PWAInstallButton() {
  const { t } = useI18n()
  const { canInstall, install } = usePWA()
  const { toast } = useToast()

  if (!canInstall) return null

  const handleInstall = async () => {
    const success = await install()
    if (success) {
      toast({
        title: t('pwaInstalled'),
        description: '🎉',
      })
    }
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleInstall}
      title={t('pwaInstall')}
    >
      <Download className="h-4 w-4" />
    </Button>
  )
}
