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
} from 'lucide-react'
import { LostItem, CATEGORIES, CATEGORY_COLORS } from '@/lib/types'
import { format } from 'date-fns'
import { ar } from 'date-fns/locale'
import { useState } from 'react'
import { useToast } from '@/hooks/use-toast'
import { MapDisplay } from '@/components/lost-found/map-display'

interface ItemDetailDialogProps {
  item: LostItem | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onItemClaimed: () => void
}

type VerificationState = 'idle' | 'verifying' | 'success' | 'failed'

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
  const { toast } = useToast()

  // Reset state when item changes
  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setVerifyAnswer('')
      setVerifyState('idle')
      setContactRevealed(false)
    }
    onOpenChange(newOpen)
  }

  if (!item) return null

  const categoryLabel =
    CATEGORIES.find((c) => c.id === item.category)?.label || item.category
  const categoryColor =
    CATEGORY_COLORS[item.category] || CATEGORY_COLORS.other

  const hasVerification = !!item.verificationQuestion
  const showContact = !hasVerification || contactRevealed || item.status === 'claimed'

  const handleVerify = async () => {
    if (!verifyAnswer.trim()) {
      toast({
        title: 'خطأ',
        description: 'يرجى إدخال إجابة السؤال',
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

      if (!res.ok) throw new Error('فشل في التحقق')

      const data = await res.json()

      if (data.verified) {
        setVerifyState('success')
        setContactRevealed(true)
        toast({
          title: 'تم التحقق بنجاح!',
          description: 'يمكنك الآن رؤية بيانات التواصل',
        })
      } else {
        setVerifyState('failed')
        toast({
          title: 'إجابة خاطئة',
          description: 'الإجابة غير صحيحة. حاول مرة أخرى.',
          variant: 'destructive',
        })
      }
    } catch {
      toast({
        title: 'خطأ',
        description: 'حدث خطأ أثناء التحقق',
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

      if (!res.ok) throw new Error('فشل في تحديث الحالة')

      toast({
        title: 'تم بنجاح',
        description: 'تم تأكيد استرجاع الشيء. شكراً لك!',
      })

      handleOpenChange(false)
      onItemClaimed()
    } catch {
      toast({
        title: 'خطأ',
        description: 'حدث خطأ أثناء تحديث الحالة',
        variant: 'destructive',
      })
    } finally {
      setClaimLoading(false)
    }
  }

  const formatDate = (dateStr: string) => {
    try {
      return format(new Date(dateStr), 'd MMMM yyyy', { locale: ar })
    } catch {
      return dateStr
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto" dir="rtl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-right">
            تفاصيل الشيء
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
                  تم الاسترجاع
                </>
              ) : (
                <>
                  <Clock className="h-3 w-3 ml-1" />
                  متاح للاسترجاع
                </>
              )}
            </Badge>
          </div>

          {/* Category */}
          <div className="flex items-center gap-2">
            <Tag className="h-4 w-4 text-muted-foreground" />
            <Badge className={categoryColor}>{categoryLabel}</Badge>
          </div>

          {/* Reward Badge */}
          {item.reward && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800">
              <Gift className="h-5 w-5 text-green-600 shrink-0" />
              <div>
                <p className="text-xs text-green-600 dark:text-green-400 font-medium">مكافأة مقدمة</p>
                <p className="text-base font-bold text-green-700 dark:text-green-300">{item.reward}</p>
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
                موقع العثور على الخريطة
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
                <p className="text-xs text-muted-foreground">المكان</p>
                <p className="text-sm font-medium">{item.location}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
              <Calendar className="h-4 w-4 text-primary shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">تاريخ الوجود</p>
                <p className="text-sm font-medium">
                  {formatDate(item.dateFound)}
                </p>
              </div>
            </div>

            {/* Contact Info - Hidden until verified */}
            <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
              <User className="h-4 w-4 text-primary shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">اسم المبلغ</p>
                <p className="text-sm font-medium">
                  {showContact ? item.contactName : '●●●●●●'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
              <Phone className="h-4 w-4 text-primary shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">رقم الهاتف</p>
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
                ) : (
                  <Shield className="h-5 w-5 text-amber-600" />
                )}
                <p className="font-semibold text-sm">
                  تحقق من الملكية
                </p>
              </div>
              <p className="text-xs text-muted-foreground">
                يجب الإجابة على سؤال التحقق لعرض بيانات التواصل مع العاثر
              </p>
              <div className="p-3 rounded-lg bg-background border">
                <p className="text-sm font-medium mb-1">السؤال:</p>
                <p className="text-sm text-primary">{item.verificationQuestion}</p>
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="اكتب إجابتك هنا..."
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
              {verifyState === 'failed' && (
                <p className="text-xs text-red-600 flex items-center gap-1">
                  <ShieldX className="h-3 w-3" />
                  الإجابة غير صحيحة، حاول مرة أخرى
                </p>
              )}
              {verifyState === 'success' && (
                <p className="text-xs text-green-600 flex items-center gap-1">
                  <ShieldCheck className="h-3 w-3" />
                  تم التحقق بنجاح! يمكنك الآن رؤية بيانات التواصل
                </p>
              )}
            </div>
          )}

          {/* Contact revealed info */}
          {contactRevealed && hasVerification && (
            <div className="flex items-center gap-2 p-2 rounded-lg bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400 text-xs">
              <Eye className="h-3.5 w-3.5" />
              تم الكشف عن بيانات التواصل بعد التحقق من الملكية
            </div>
          )}

          {/* No verification - info message */}
          {!hasVerification && item.status === 'found' && (
            <div className="flex items-center gap-2 p-2 rounded-lg bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400 text-xs">
              <EyeOff className="h-3.5 w-3.5" />
              بيانات التواصل متاحة مباشرة - لم يحدد العاثر سؤال تحقق
            </div>
          )}

          {/* Date Posted */}
          <p className="text-xs text-muted-foreground text-center">
            تم النشر في {formatDate(item.createdAt)}
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
                  جاري التأكيد...
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-5 w-5 ml-2" />
                  هذا الشيء لي - أريد استرجاعه
                </>
              )}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
