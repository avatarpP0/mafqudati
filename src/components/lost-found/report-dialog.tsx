'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Loader2, Flag } from 'lucide-react'
import { useI18n } from '@/lib/i18n'
import { useToast } from '@/hooks/use-toast'

interface ReportDialogProps {
  itemType: 'lostItem' | 'lostReport'
  itemId: string
  open: boolean
  onClose: () => void
}

const REPORT_REASONS = ['fake', 'inappropriate', 'wrong_info', 'other'] as const

export function ReportDialog({ itemType, itemId, open, onClose }: ReportDialogProps) {
  const [reason, setReason] = useState<string>('')
  const [details, setDetails] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const { t, dir } = useI18n()
  const { toast } = useToast()

  const reasonLabelMap: Record<string, string> = {
    fake: t('reportFake'),
    inappropriate: t('reportInappropriate'),
    wrong_info: t('reportWrongInfo'),
    other: t('reportOther'),
  }

  const handleSubmit = async () => {
    if (!reason) return

    setSubmitting(true)
    try {
      const res = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          itemType,
          itemId,
          reason,
          details: details.trim() || undefined,
        }),
      })

      if (!res.ok) {
        throw new Error('Failed to submit report')
      }

      toast({
        title: t('reportSuccess'),
        description: '',
      })

      // Reset and close
      setReason('')
      setDetails('')
      onClose()
    } catch {
      toast({
        title: t('reportError'),
        variant: 'destructive',
      })
    } finally {
      setSubmitting(false)
    }
  }

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setReason('')
      setDetails('')
      onClose()
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-md" dir={dir}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg font-bold">
            <Flag className="h-5 w-5 text-red-500" />
            {t('reportTitle')}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Report Reason */}
          <div className="space-y-3">
            <Label className="text-sm font-semibold">{t('reportReason')}</Label>
            <RadioGroup value={reason} onValueChange={setReason} className="gap-2">
              {REPORT_REASONS.map((r) => (
                <div key={r} className="flex items-center gap-2">
                  <RadioGroupItem value={r} id={`reason-${r}`} />
                  <Label
                    htmlFor={`reason-${r}`}
                    className="text-sm cursor-pointer font-normal"
                  >
                    {reasonLabelMap[r]}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Additional Details */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold">{t('reportDetails')}</Label>
            <Textarea
              placeholder={t('reportDetailsPh')}
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              rows={3}
            />
          </div>

          {/* Submit Button */}
          <Button
            onClick={handleSubmit}
            disabled={!reason || submitting}
            className="w-full gap-2 bg-red-600 hover:bg-red-700 text-white"
          >
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                {t('reportSubmit')}
              </>
            ) : (
              <>
                <Flag className="h-4 w-4" />
                {t('reportSubmit')}
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
