'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import {
  MapPin,
  Calendar,
  User,
  Phone,
  Tag,
  Clock,
  CheckCircle2,
  Loader2,
  Shield,
  ShieldCheck,
  ShieldX,
  Gift,
  Eye,
  EyeOff,
  AlertTriangle,
  Scale,
  Ban,
  Share2,
  Flag,
} from 'lucide-react'
import { LostItem, CATEGORIES, CATEGORY_COLORS } from '@/lib/types'
import { format } from 'date-fns'
import { ar } from 'date-fns/locale'
import { useState } from 'react'
import { useToast } from '@/hooks/use-toast'
import { MapDisplay } from '@/components/lost-found/map-display'
import { FavoriteButton } from '@/components/lost-found/favorite-button'
import { ReportDialog } from '@/components/lost-found/report-dialog'
import { useI18n } from '@/lib/i18n'

interface ItemDetailDialogProps {
  item: LostItem | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onItemClaimed: () => void
}

type VerificationState = 'idle' | 'verifying' | 'success' | 'failed' | 'locked'

const MAX_ATTEMPTS = 3

export function ItemDetailDialog({
  item,
  open,
  onOpenChange,
  onItemClaimed,
}: ItemDetailDialogProps) {
  const [loading, setLoading] = useState(false)
  const [claimLoading, setClaimLoading] = useState(false)
  const [verifyAnswer, setVerifyAnswer] = useState('')
  const [verifyState, setVerifyState] = useState<VerificationState>('idle')
  const [contactRevealed, setContactRevealed] = useState(false)
  const [remainingAttempts, setRemainingAttempts] = useState(MAX_ATTEMPTS)
  const [rateLimitMessage, setRateLimitMessage] = useState<string | null>(null)
  const [reportOpen, setReportOpen] = useState(false)
  const { toast } = useToast()
  const { t, dir, locale } = useI18n()

  // Reset state when item changes
  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setVerifyAnswer('')
      setVerifyState('idle')
      setContactRevealed(false)
      setRemainingAttempts(MAX_ATTEMPTS)
      setRateLimitMessage(null)
    }
    onOpenChange(newOpen)
  }

  if (!item) return null

  const categoryLabel =
    t(CATEGORIES.find((c) => c.id === item.category)?.labelKey || 'catOther')
  const categoryColor =
    CATEGORY_COLORS[item.category] || CATEGORY_COLORS.other

  const hasVerification = !!item.hasVerification
  const showContact = !hasVerification || contactRevealed || item.status === 'claimed'

  const handleVerify = async () => {
    if (!verifyAnswer.trim()) {
      toast({
        title: t('toastPublished'),
        description: t('verifyError'),
        variant: 'destructive',
      })
      return
    }

    setLoading(true)
    try {
      const res = await fetch(`/api/items/${item.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'verify', answer: verifyAnswer }),
      })

      const data = await res.json()

      // Handle rate limiting (429)
      if (res.status === 429 || data.rateLimited) {
        setVerifyState('locked')
        setRemainingAttempts(0)
        setRateLimitMessage(data.message || t('verifyLockedDesc'))
        toast({
          title: t('toastRateLimited'),
          description: t('verifyLockedDesc'),
          variant: 'destructive',
        })
        return
      }

      if (!res.ok) throw new Error('Verification failed')

      // Update remaining attempts from backend response
      if (data.remainingAttempts !== undefined) {
        setRemainingAttempts(data.remainingAttempts)
      }

      if (data.verified) {
        setVerifyState('success')
        setContactRevealed(true)
        toast({
          title: t('toastVerified'),
          description: t('toastVerifiedDesc'),
        })
      } else {
        setVerifyState('failed')
        // Check if now rate limited
        if (data.rateLimited) {
          setVerifyState('locked')
          setRateLimitMessage(data.message)
        }
        toast({
          title: t('toastWrongAnswer'),
          description: t('toastWrongAnswerDesc'),
          variant: 'destructive',
        })
      }
    } catch {
      toast({
        title: t('toastPublished'),
        description: t('toastVerifyError'),
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleClaim = async () => {
    setClaimLoading(true)
    try {
      const res = await fetch(`/api/items/${item.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'claimed' }),
      })

      if (!res.ok) throw new Error('Failed to update status')

      toast({
        title: t('toastClaimed'),
        description: t('toastClaimedDesc'),
      })

      handleOpenChange(false)
      onItemClaimed()
    } catch {
      toast({
        title: t('toastPublished'),
        description: t('toastClaimError'),
        variant: 'destructive',
      })
    } finally {
      setClaimLoading(false)
    }
  }

  const formatDate = (dateStr: string) => {
    try {
      return format(new Date(dateStr), 'd MMMM yyyy', { locale: locale === 'ar' ? ar : undefined })
    } catch {
      return dateStr
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto" dir={dir}>
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-right">
            {t('detailTitle')}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Image */}
          {item.imageUrl && (
            <div className="rounded-lg overflow-hidden border">
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-48 object-cover"
              />
            </div>
          )}

          {/* Title & Status */}
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-lg font-bold">{item.title}</h3>
            <Badge
              variant={item.status === 'claimed' ? 'default' : 'secondary'}
              className={
                item.status === 'claimed'
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 shrink-0'
                  : 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300 shrink-0'
              }
            >
              {item.status === 'claimed' ? (
                <>
                  <CheckCircle2 className="h-3 w-3 ml-1" />
                  {t('statusClaimed')}
                </>
              ) : (
                <>
                  <Clock className="h-3 w-3 ml-1" />
                  {t('detailAvailableForReturn')}
                </>
              )}
            </Badge>
          </div>

          {/* Category */}
          <div className="flex items-center gap-2">
            <Tag className="h-4 w-4 text-muted-foreground" />
            <Badge className={categoryColor}>{categoryLabel}</Badge>
          </div>

          {/* Reward Badge with Terms */}
          {item.reward && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 p-3 rounded-lg bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800">
                <Gift className="h-5 w-5 text-green-600 shrink-0" />
                <div>
                  <p className="text-xs text-green-600 dark:text-green-400 font-medium">{t('rewardLabel')}</p>
                  <p className="text-base font-bold text-green-700 dark:text-green-300">{item.reward}</p>
                </div>
              </div>
              {/* Reward Terms & Conditions */}
              <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 space-y-1.5">
                <div className="flex items-center gap-1.5 text-amber-700 dark:text-amber-400">
                  <Scale className="h-3.5 w-3.5 shrink-0" />
                  <p className="text-xs font-semibold">{t('rewardTermsTitle')}</p>
                </div>
                <p className="text-[11px] text-amber-600 dark:text-amber-500 leading-relaxed">
                  {t('rewardTermsText')}
                </p>
              </div>
            </div>
          )}

          {/* Description */}
          <div>
            <p className="text-muted-foreground leading-relaxed">
              {item.description}
            </p>
          </div>

          <Separator />

          {/* Map */}
          {item.latitude != null && item.longitude != null && (
            <div className="space-y-1.5">
              <p className="text-sm font-medium flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-primary" />
                {t('mapLocationLabel')}
              </p>
              <MapDisplay
                latitude={item.latitude}
                longitude={item.longitude}
                title={item.location}
              />
            </div>
          )}

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
              <MapPin className="h-4 w-4 text-primary shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">{t('detailPlace')}</p>
                <p className="text-sm font-medium">{item.location}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
              <Calendar className="h-4 w-4 text-primary shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">{t('detailDateFound')}</p>
                <p className="text-sm font-medium">
                  {formatDate(item.dateFound)}
                </p>
              </div>
            </div>

            {/* Contact Info - Hidden until verified */}
            <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
              <User className="h-4 w-4 text-primary shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">{t('detailReporterName')}</p>
                <p className="text-sm font-medium">
                  {showContact ? item.contactName : '●●●●●●'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
              <Phone className="h-4 w-4 text-primary shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">{t('detailPhone')}</p>
                <p className="text-sm font-medium" dir="ltr">
                  {showContact ? item.contactPhone : '●●●●●●●●●●'}
                </p>
              </div>
            </div>
          </div>

          {/* Verification Section */}
          {hasVerification && !contactRevealed && item.status === 'found' && (
            <div className="p-4 rounded-lg border-2 border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-950/20 space-y-3">
              <div className="flex items-center gap-2">
                {verifyState === 'success' ? (
                  <ShieldCheck className="h-5 w-5 text-green-600" />
                ) : verifyState === 'failed' ? (
                  <ShieldX className="h-5 w-5 text-red-600" />
                ) : verifyState === 'locked' ? (
                  <Ban className="h-5 w-5 text-red-600" />
                ) : (
                  <Shield className="h-5 w-5 text-amber-600" />
                )}
                <p className="font-semibold text-sm">
                  {t('verifyTitle')}
                </p>
              </div>
              <p className="text-xs text-muted-foreground">
                {t('verifyDesc')}
              </p>

              {/* Attempts counter */}
              {verifyState !== 'locked' && (
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <AlertTriangle className="h-3 w-3" />
                  <span>
                    {t('verifyAttemptsLeft', { count: remainingAttempts, max: MAX_ATTEMPTS })}
                  </span>
                </div>
              )}

              <div className="p-3 rounded-lg bg-background border">
                <p className="text-sm font-medium mb-1">{t('verifyQuestion')}</p>
                <p className="text-sm text-primary">{item.verificationQuestion}</p>
              </div>

              {verifyState !== 'locked' ? (
                <div className="flex gap-2">
                  <Input
                    placeholder={t('verifyPlaceholder')}
                    value={verifyAnswer}
                    onChange={(e) => {
                      setVerifyAnswer(e.target.value)
                      if (verifyState === 'failed') setVerifyState('idle')
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleVerify()
                    }}
                    className={verifyState === 'failed' ? 'border-red-400' : ''}
                  />
                  <Button
                    onClick={handleVerify}
                    disabled={loading || !verifyAnswer.trim()}
                    className="shrink-0"
                  >
                    {loading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Shield className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              ) : (
                <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800">
                  <div className="flex items-center gap-2 text-red-700 dark:text-red-400">
                    <Ban className="h-4 w-4 shrink-0" />
                    <p className="text-sm font-semibold">{t('verifyLocked')}</p>
                  </div>
                  <p className="text-xs text-red-600 dark:text-red-500 mt-1">
                    {rateLimitMessage || t('verifyLockedDesc')}
                  </p>
                </div>
              )}

              {verifyState === 'failed' && remainingAttempts > 0 && (
                <p className="text-xs text-red-600 flex items-center gap-1">
                  <ShieldX className="h-3 w-3" />
                  {remainingAttempts === 1 ? t('verifyWrongAnswerOne') : t('verifyWrongAnswer', { count: remainingAttempts })}
                </p>
              )}
              {verifyState === 'success' && (
                <p className="text-xs text-green-600 flex items-center gap-1">
                  <ShieldCheck className="h-3 w-3" />
                  {t('verifySuccess')}
                </p>
              )}
            </div>
          )}

          {/* Contact revealed info */}
          {contactRevealed && hasVerification && (
            <div className="flex items-center gap-2 p-2 rounded-lg bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400 text-xs">
              <Eye className="h-3.5 w-3.5" />
              {t('verifyContactRevealed')}
            </div>
          )}

          {/* No verification - info message */}
          {!hasVerification && item.status === 'found' && (
            <div className="flex items-center gap-2 p-2 rounded-lg bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400 text-xs">
              <EyeOff className="h-3.5 w-3.5" />
              {t('verifyNoQuestion')}
            </div>
          )}

          {/* Date Posted */}
          <p className="text-xs text-muted-foreground text-center">
            {t('detailPostedAt')} {formatDate(item.createdAt)}
          </p>

          {/* Claim Button */}
          {item.status === 'found' && showContact && (
            <Button
              onClick={handleClaim}
              className="w-full text-base font-semibold bg-green-600 hover:bg-green-700"
              disabled={claimLoading}
            >
              {claimLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin ml-2" />
                  {t('btnClaiming')}
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-5 w-5 ml-2" />
                  {t('btnClaim')}
                </>
              )}
            </Button>
          )}

          {/* Share, Favorite & Report Buttons */}
          {item.status === 'found' && (
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  const ogImageUrl = `${window.location.origin}/api/og?title=${encodeURIComponent(item.title)}&category=${encodeURIComponent(item.category)}&location=${encodeURIComponent(item.location)}`
                  const shareText = `${item.title} - ${item.description}`
                  if (navigator.share) {
                    navigator.share({
                      title: item.title,
                      text: shareText,
                      url: ogImageUrl,
                    })
                  } else {
                    navigator.clipboard.writeText(shareText + '\n' + ogImageUrl)
                    toast({ title: t('toastPublished'), description: t('shareCopied') })
                  }
                }}
                className="flex-1 gap-2"
              >
                <Share2 className="h-4 w-4" />
                {t('btnShare')}
              </Button>
              <FavoriteButton itemType="lostItem" itemId={item.id} />
              <Button
                variant="outline"
                onClick={() => setReportOpen(true)}
                className="flex-1 gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30 border-red-200 dark:border-red-800"
              >
                <Flag className="h-4 w-4" />
                {t('btnReport')}
              </Button>
            </div>
          )}

          {/* Report Dialog */}
          <ReportDialog
            itemType="lostItem"
            itemId={item.id}
            open={reportOpen}
            onClose={() => setReportOpen(false)}
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}
