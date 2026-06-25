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
import { Plus, Loader2, Shield, Gift, MapPin } from 'lucide-react'
import { CATEGORIES } from '@/lib/types'
import { useToast } from '@/hooks/use-toast'
import { MapPicker } from '@/components/lost-found/map-picker'
import { useI18n } from '@/lib/i18n'

interface PostItemDialogProps {
  onItemAdded: () => void
}

export function PostItemDialog({ onItemAdded }: PostItemDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const { t, dir } = useI18n()

  const [form, setForm] = useState({
    title: '',
    description: '',
    category: '',
    location: '',
    dateFound: '',
    imageUrl: '',
    contactName: '',
    contactPhone: '',
    verificationQuestion: '',
    verificationAnswer: '',
    reward: '',
    latitude: '' as string,
    longitude: '' as string,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch('/api/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      if (!res.ok) {
        throw new Error('Failed to add item')
      }

      toast({
        title: t('toastPublished'),
        description: t('toastPublishedDesc'),
      })

      setForm({
        title: '',
        description: '',
        category: '',
        location: '',
        dateFound: '',
        imageUrl: '',
        contactName: '',
        contactPhone: '',
        verificationQuestion: '',
        verificationAnswer: '',
        reward: '',
        latitude: '',
        longitude: '',
      })

      setOpen(false)
      onItemAdded()
    } catch {
      toast({
        title: t('toastPublished'),
        description: t('toastPublishError'),
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const updateForm = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleMapChange = (lat: number, lng: number) => {
    setForm((prev) => ({ ...prev, latitude: String(lat), longitude: String(lng) }))
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className="gap-2 text-base font-semibold shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all">
          <Plus className="h-5 w-5" />
          {t('btnReportFound')}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto" dir={dir}>
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-right">
            {t('postFoundTitle')}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">{t('labelTitle')}</Label>
            <Input
              id="title"
              placeholder={t('phTitle')}
              value={form.title}
              onChange={(e) => updateForm('title', e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">{t('labelDescription')}</Label>
            <Textarea
              id="description"
              placeholder={t('phDescription')}
              value={form.description}
              onChange={(e) => updateForm('description', e.target.value)}
              rows={3}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">{t('labelCategory')}</Label>
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
            <Label htmlFor="location">{t('labelLocation')}</Label>
            <Input
              id="location"
              placeholder={t('phLocation')}
              value={form.location}
              onChange={(e) => updateForm('location', e.target.value)}
              required
            />
          </div>

          {/* Map Picker */}
          <div className="space-y-2">
            <Label className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4 text-primary" />
              {t('labelMap')}
            </Label>
            <MapPicker
              latitude={form.latitude ? parseFloat(form.latitude) : null}
              longitude={form.longitude ? parseFloat(form.longitude) : null}
              onChange={handleMapChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dateFound">{t('labelDateFound')}</Label>
            <Input
              id="dateFound"
              type="date"
              value={form.dateFound}
              onChange={(e) => updateForm('dateFound', e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="imageUrl">{t('labelImageUrl')}</Label>
            <Input
              id="imageUrl"
              placeholder="https://example.com/image.jpg"
              value={form.imageUrl}
              onChange={(e) => updateForm('imageUrl', e.target.value)}
              dir="ltr"
            />
          </div>

          {/* Verification Question */}
          <div className="p-4 rounded-lg border-2 border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-950/20 space-y-3">
            <Label className="flex items-center gap-1.5 text-amber-700 dark:text-amber-400 font-semibold">
              <Shield className="h-4 w-4" />
              {t('labelVerification')}
            </Label>
            <p className="text-xs text-muted-foreground">
              {t('verificationDesc')}
            </p>
            <div className="space-y-2">
              <Input
                placeholder={t('phVerificationQ')}
                value={form.verificationQuestion}
                onChange={(e) => updateForm('verificationQuestion', e.target.value)}
                required
              />
              <Input
                placeholder={t('phVerificationA')}
                value={form.verificationAnswer}
                onChange={(e) => updateForm('verificationAnswer', e.target.value)}
                required
              />
            </div>
          </div>

          {/* Reward */}
          <div className="p-4 rounded-lg border-2 border-green-200 dark:border-green-800 bg-green-50/50 dark:bg-green-950/20 space-y-3">
            <Label className="flex items-center gap-1.5 text-green-700 dark:text-green-400 font-semibold">
              <Gift className="h-4 w-4" />
              {t('labelReward')}
            </Label>
            <p className="text-xs text-muted-foreground">
              {t('rewardDesc')}
            </p>
            <Input
              placeholder={t('phReward')}
              value={form.reward}
              onChange={(e) => updateForm('reward', e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="contactName">{t('labelContactName')}</Label>
              <Input
                id="contactName"
                placeholder={t('phContactName')}
                value={form.contactName}
                onChange={(e) => updateForm('contactName', e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactPhone">{t('labelContactPhone')}</Label>
              <Input
                id="contactPhone"
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
                {t('btnPublishing')}
              </>
            ) : (
              t('btnPublish')
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
