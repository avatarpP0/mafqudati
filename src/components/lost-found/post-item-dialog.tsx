'use client'

import { useState, useRef, useCallback } from 'react'
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
import { Progress } from '@/components/ui/progress'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Plus, Loader2, Shield, Gift, MapPin, Wand2, Upload, X, ImagePlus } from 'lucide-react'
import { CATEGORIES } from '@/lib/types'
import { useToast } from '@/hooks/use-toast'
import { MapPicker } from '@/components/lost-found/map-picker'
import { useI18n } from '@/lib/i18n'

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB

interface PostItemDialogProps {
  onItemAdded: () => void
}

export function PostItemDialog({ onItemAdded }: PostItemDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [generatingImage, setGeneratingImage] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [showManualUrl, setShowManualUrl] = useState(false)
  const [isDragOver, setIsDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
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
      setImagePreview(null)
      setShowManualUrl(false)
      setUploadProgress(0)

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

  const uploadFile = async (file: File) => {
    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      toast({
        title: t('uploadError'),
        description: t('uploadInvalidType'),
        variant: 'destructive',
      })
      return
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      toast({
        title: t('uploadError'),
        description: t('uploadTooLarge'),
        variant: 'destructive',
      })
      return
    }

    setUploading(true)
    setUploadProgress(0)

    // Show local preview immediately
    const reader = new FileReader()
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string)
    }
    reader.readAsDataURL(file)

    try {
      const formData = new FormData()
      formData.append('file', file)

      // Simulate progress since fetch doesn't support upload progress natively
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 10
        })
      }, 200)

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      clearInterval(progressInterval)

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Upload failed')
      }

      const data = await res.json()
      setUploadProgress(100)
      updateForm('imageUrl', data.url)
      setImagePreview(data.url)

      toast({
        title: t('uploadSuccess'),
        description: '',
      })
    } catch (error) {
      console.error('Upload error:', error)
      setImagePreview(null)
      setUploadProgress(0)
      toast({
        title: t('uploadError'),
        description: error instanceof Error ? error.message : '',
        variant: 'destructive',
      })
    } finally {
      setUploading(false)
    }
  }

  const handleFileSelect = useCallback((file: File) => {
    void uploadFile(file)
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(false)

    const files = e.dataTransfer.files
    if (files.length > 0) {
      void handleFileSelect(files[0])
    }
  }, [handleFileSelect])

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      void handleFileSelect(files[0])
    }
    // Reset input so the same file can be selected again
    e.target.value = ''
  }, [handleFileSelect])

  const clearImage = () => {
    updateForm('imageUrl', '')
    setImagePreview(null)
    setUploadProgress(0)
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

          {/* Image Upload Section */}
          <div className="space-y-3">
            <Label>{t('uploadImage')}</Label>

            {imagePreview ? (
              /* Image Preview */
              <div className="relative rounded-lg overflow-hidden border border-border">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-48 object-cover"
                />
                {!uploading && (
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 h-7 w-7 rounded-full"
                    onClick={clearImage}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
                {uploading && (
                  <div className="absolute bottom-0 inset-x-0 bg-background/80 backdrop-blur-sm p-2">
                    <Progress value={uploadProgress} className="h-2" />
                  </div>
                )}
              </div>
            ) : (
              /* Dropzone */
              <div
                className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer ${
                  isDragOver
                    ? 'border-primary bg-primary/5'
                    : 'border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                {uploading ? (
                  <div className="space-y-3">
                    <Loader2 className="h-10 w-10 mx-auto text-primary animate-spin" />
                    <Progress value={uploadProgress} className="h-2 max-w-xs mx-auto" />
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Upload className="h-10 w-10 mx-auto text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      {t('uploadDropzone')}
                    </p>
                    <p className="text-xs text-muted-foreground/70">
                      JPEG, PNG, WebP, GIF • {t('uploadTooLarge')}
                    </p>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  className="hidden"
                  onChange={handleInputChange}
                />
              </div>
            )}

            {/* Generate Image & Manual URL Row */}
            {!imagePreview && !uploading && (
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="gap-1.5"
                  disabled={generatingImage || !form.title}
                  onClick={async () => {
                    setGeneratingImage(true)
                    try {
                      const res = await fetch('/api/generate-image', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ prompt: `${form.category} ${form.title} ${form.description}` }),
                      })
                      if (res.ok) {
                        const data = await res.json()
                        updateForm('imageUrl', data.imageUrl)
                        setImagePreview(data.imageUrl)
                        toast({ title: t('toastPublished'), description: t('imageGenerated') })
                      }
                    } catch {
                      toast({ title: t('uploadError'), variant: 'destructive' })
                    } finally {
                      setGeneratingImage(false)
                    }
                  }}
                >
                  {generatingImage ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wand2 className="h-4 w-4" />}
                  {t('btnGenerateImage')}
                </Button>

                <span className="text-xs text-muted-foreground">{t('uploadOr')}</span>

                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="gap-1.5"
                  onClick={() => setShowManualUrl(!showManualUrl)}
                >
                  <ImagePlus className="h-4 w-4" />
                  {t('uploadManualUrl')}
                </Button>
              </div>
            )}

            {/* Collapsible Manual URL Input */}
            {showManualUrl && !imagePreview && (
              <Input
                placeholder="https://example.com/image.jpg"
                value={form.imageUrl}
                onChange={(e) => updateForm('imageUrl', e.target.value)}
                dir="ltr"
              />
            )}
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
