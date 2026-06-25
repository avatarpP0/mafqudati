'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
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
} from 'lucide-react'
import { LostItem, CATEGORIES, CATEGORY_COLORS } from '@/lib/types'
import { format } from 'date-fns'
import { ar } from 'date-fns/locale'
import { useState } from 'react'
import { useToast } from '@/hooks/use-toast'

interface ItemDetailDialogProps {
  item: LostItem | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onItemClaimed: () => void
}

export function ItemDetailDialog({
  item,
  open,
  onOpenChange,
  onItemClaimed,
}: ItemDetailDialogProps) {
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  if (!item) return null

  const categoryLabel =
    CATEGORIES.find((c) => c.id === item.category)?.label || item.category
  const categoryColor =
    CATEGORY_COLORS[item.category] || CATEGORY_COLORS.other

  const handleClaim = async () => {
    setLoading(true)
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

      onOpenChange(false)
      onItemClaimed()
    } catch {
      toast({
        title: 'خطأ',
        description: 'حدث خطأ أثناء تحديث الحالة',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg" dir="rtl">
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

          {/* Description */}
          <div>
            <p className="text-muted-foreground leading-relaxed">
              {item.description}
            </p>
          </div>

          <Separator />

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

            <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
              <User className="h-4 w-4 text-primary shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">اسم المبلغ</p>
                <p className="text-sm font-medium">{item.contactName}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
              <Phone className="h-4 w-4 text-primary shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">رقم الهاتف</p>
                <p className="text-sm font-medium" dir="ltr">
                  {item.contactPhone}
                </p>
              </div>
            </div>
          </div>

          {/* Date Posted */}
          <p className="text-xs text-muted-foreground text-center">
            تم النشر في {formatDate(item.createdAt)}
          </p>

          {/* Claim Button */}
          {item.status === 'found' && (
            <Button
              onClick={handleClaim}
              className="w-full text-base font-semibold bg-green-600 hover:bg-green-700"
              disabled={loading}
            >
              {loading ? (
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
