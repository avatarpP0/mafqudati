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
import { Plus, Loader2 } from 'lucide-react'
import { CATEGORIES } from '@/lib/types'
import { useToast } from '@/hooks/use-toast'

interface PostItemDialogProps {
  onItemAdded: () => void
}

export function PostItemDialog({ onItemAdded }: PostItemDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const [form, setForm] = useState({
    title: '',
    description: '',
    category: '',
    location: '',
    dateFound: '',
    imageUrl: '',
    contactName: '',
    contactPhone: '',
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
        throw new Error('فشل في إضافة الشيء')
      }

      toast({
        title: 'تم بنجاح',
        description: 'تم نشر الشيء المفقود بنجاح',
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
      })

      setOpen(false)
      onItemAdded()
    } catch {
      toast({
        title: 'خطأ',
        description: 'حدث خطأ أثناء نشر الشيء المفقود',
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
        <Button size="lg" className="gap-2 text-base font-semibold shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all">
          <Plus className="h-5 w-5" />
          أبلغ عن شيء موجود
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto" dir="rtl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-right">
            أبلغ عن شيء وجدته
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">عنوان الشيء *</Label>
            <Input
              id="title"
              placeholder="مثال: هاتف آيفون أسود"
              value={form.title}
              onChange={(e) => updateForm('title', e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">الوصف *</Label>
            <Textarea
              id="description"
              placeholder="صف الشيء الذي وجدته بالتفصيل..."
              value={form.description}
              onChange={(e) => updateForm('description', e.target.value)}
              rows={3}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">التصنيف *</Label>
            <Select
              value={form.category}
              onValueChange={(value) => updateForm('category', value)}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="اختر التصنيف" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.filter((c) => c.id !== 'all').map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">مكان الوجود *</Label>
            <Input
              id="location"
              placeholder="مثال: محطة المترو - الدقي"
              value={form.location}
              onChange={(e) => updateForm('location', e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dateFound">تاريخ الوجود *</Label>
            <Input
              id="dateFound"
              type="date"
              value={form.dateFound}
              onChange={(e) => updateForm('dateFound', e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="imageUrl">رابط الصورة (اختياري)</Label>
            <Input
              id="imageUrl"
              placeholder="https://example.com/image.jpg"
              value={form.imageUrl}
              onChange={(e) => updateForm('imageUrl', e.target.value)}
              dir="ltr"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="contactName">اسمك *</Label>
              <Input
                id="contactName"
                placeholder="اسمك الكامل"
                value={form.contactName}
                onChange={(e) => updateForm('contactName', e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactPhone">رقم الهاتف *</Label>
              <Input
                id="contactPhone"
                placeholder="01xxxxxxxxx"
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
                جاري النشر...
              </>
            ) : (
              'نشر البلاغ'
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
