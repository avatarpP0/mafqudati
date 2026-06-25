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

interface PostLostReportDialogProps {
  onReportAdded: () => void
}

export function PostLostReportDialog({ onReportAdded }: PostLostReportDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

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
        throw new Error('فشل في إضافة البلاغ')
      }

      toast({
        title: 'تم بنجاح',
        description: 'تم نشر بلاغ الفقدان. سيقوم النظام بالبحث تلقائياً عن تطابقات.',
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
        title: 'خطأ',
        description: 'حدث خطأ أثناء نشر بلاغ الفقدان',
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
          أبلغ عن شيء مفقود
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto" dir="rtl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-right">
            أبلغ عن شيء فقدته
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="lost-title">عنوان الشيء المفقود *</Label>
            <Input
              id="lost-title"
              placeholder="مثال: هاتف آيفون 15 برو ماكس أسود"
              value={form.title}
              onChange={(e) => updateForm('title', e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="lost-description">الوصف التفصيلي *</Label>
            <Textarea
              id="lost-description"
              placeholder="صف الشيء المفقود بالتفصيل: اللون، العلامات المميزة، المحتوى..."
              value={form.description}
              onChange={(e) => updateForm('description', e.target.value)}
              rows={3}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="lost-category">التصنيف *</Label>
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
            <Label htmlFor="lost-location">آخر مكان كان فيه *</Label>
            <Input
              id="lost-location"
              placeholder="مثال: محطة المترو - الدقي"
              value={form.location}
              onChange={(e) => updateForm('location', e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="lost-dateLost">تاريخ الفقدان *</Label>
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
              مكافأة مالية (اختياري)
            </Label>
            <p className="text-xs text-muted-foreground">
              رصد مكافأة تشجيعية يزيد من فرص استرجاع الشيء
            </p>
            <Input
              placeholder="مثال: 500 جنيه"
              value={form.reward}
              onChange={(e) => updateForm('reward', e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="lost-contactName">اسمك *</Label>
              <Input
                id="lost-contactName"
                placeholder="اسمك الكامل"
                value={form.contactName}
                onChange={(e) => updateForm('contactName', e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lost-contactPhone">رقم الهاتف *</Label>
              <Input
                id="lost-contactPhone"
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
                جاري النشر والبحث عن تطابقات...
              </>
            ) : (
              'نشر بلاغ الفقدان'
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
