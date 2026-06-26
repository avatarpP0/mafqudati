'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { AlertCircle, Loader2, Gift } from 'lucide-react'
import { CATEGORIES } from '@/lib/types'
import { useToast } from '@/hooks/use-toast'
import { useI18n } from '@/lib/i18n'

interface PostLostReportDialogProps {
  onReportAdded: () => void
}

export function PostLostReportDialog({ onReportAdded }: PostLostReportDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const { t, dir } = useI18n()

  const [form, setForm] = useState({
    title: '',
    description: '',
    category: '',
    location: '',
    dateLost: '',
    contactName: '',
    contactPhone: '',
    reward: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch('/api/lost-reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      if (!res.ok) {
        throw new Error('Failed to add report')
      }

      toast({
        title: t('toastReportPublished'),
        description: t('toastReportPublishedDesc'),
      })

      setForm({
        title: '',
        description: '',
        category: '',
        location: '',
        dateLost: '',
        contactName: '',
        contactPhone: '',
        reward: '',
      })

      setOpen(false)
      onReportAdded()
    } catch {
      toast({
        title: t('toastPublished'),
        description: t('toastReportError'),
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const updateForm = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg" variant="outline" className="gap-2 text-base font-semibold border-2 border-amber-300 dark:border-amber-700 hover:bg-amber-50 dark:hover:bg-amber-950/30">
          <AlertCircle className="h-5 w-5" />
          {t('btnReportLost')}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto" dir={dir}>
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-right">
            {t('postLostTitle')}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="lost-title">{t('labelLostTitle')}</Label>
            <Input
              id="lost-title"
              placeholder={t('phLostTitle')}
              value={form.title}
              onChange={(e) => updateForm('title', e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="lost-description">{t('labelLostDescription')}</Label>
            <Textarea
              id="lost-description"
              placeholder={t('phLostDescription')}
              value={form.description}
              onChange={(e) => updateForm('description', e.target.value)}
              rows={3}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="lost-category">{t('labelCategory')}</Label>
            <Select
              value={form.category}
              onValueChange={(value) => updateForm('category', value)}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder={t('labelCategory')} />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.filter((c) => c.id !== 'all').map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {t(cat.labelKey)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="lost-location">{t('labelLostLocation')}</Label>
            <Input
              id="lost-location"
              placeholder={t('phLostLocation')}
              value={form.location}
              onChange={(e) => updateForm('location', e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="lost-dateLost">{t('labelDateLost')}</Label>
            <Input
              id="lost-dateLost"
              type="date"
              value={form.dateLost}
              onChange={(e) => updateForm('dateLost', e.target.value)}
              required
            />
          </div>

          {/* Reward */}
          <div className="p-4 rounded-lg border-2 border-green-200 dark:border-green-800 bg-green-50/50 dark:bg-green-950/20 space-y-3">
            <Label className="flex items-center gap-1.5 text-green-700 dark:text-green-400 font-semibold">
              <Gift className="h-4 w-4" />
              {t('labelReward')}
            </Label>
            <p className="text-xs text-muted-foreground">
              {t('rewardDescLost')}
            </p>
            <Input
              placeholder={t('phRewardLost')}
              value={form.reward}
              onChange={(e) => updateForm('reward', e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="lost-contactName">{t('labelContactName')}</Label>
              <Input
                id="lost-contactName"
                placeholder={t('phContactName')}
                value={form.contactName}
                onChange={(e) => updateForm('contactName', e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lost-contactPhone">{t('labelContactPhone')}</Label>
              <Input
                id="lost-contactPhone"
                placeholder={t('phContactPhone')}
                value={form.contactPhone}
                onChange={(e) => updateForm('contactPhone', e.target.value)}
                dir="ltr"
                required
              />
            </div>
          </div>

          <Button type="submit" className="w-full text-base font-semibold" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin ml-2" />
                {t('btnPublishingLost')}
              </>
            ) : (
              t('btnPublishLost')
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
