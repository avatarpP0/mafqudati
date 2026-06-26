'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  Loader2,
  Sparkles,
  ChevronDown,
  ChevronUp,
  MapPin,
  Calendar,
  Gift,
  CheckCircle2,
} from 'lucide-react'
import { LostReport, CATEGORIES, CATEGORY_COLORS } from '@/lib/types'
import { useToast } from '@/hooks/use-toast'
import { format } from 'date-fns'
import { ar } from 'date-fns/locale'
import { useI18n } from '@/lib/i18n'

interface MatchItem {
  lostItemId: string
  matchScore: number
  reason: string
  item: {
    id: string
    title: string
    description: string
    category: string
    location: string
    dateFound: string
    imageUrl: string | null
    hasVerification: boolean
    verificationQuestion: string | null
    reward: string | null
  } | null
}

interface AIMatchResultsProps {
  report: LostReport
  onMatchClick?: (itemId: string) => void
}

export function AIMatchResults({ report, onMatchClick }: AIMatchResultsProps) {
  const [matches, setMatches] = useState<MatchItem[]>([])
  const [loading, setLoading] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const [searched, setSearched] = useState(false)
  const { toast } = useToast()
  const { t, locale } = useI18n()

  const searchMatches = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/match?lostReportId=${report.id}`)
      if (!res.ok) throw new Error('Search failed')

      const data = await res.json()
      setMatches(data.matches || [])
      setSearched(true)
      setExpanded(true)

      if (data.matches?.length > 0) {
        toast({
          title: t('matchSuccessTitle'),
          description: t('matchSuccessDesc', { count: data.matches.length }),
        })
      } else {
        toast({
          title: t('matchNoResults'),
          description: t('matchNoResultsDesc'),
        })
      }
    } catch {
      toast({
        title: t('toastPublished'),
        description: t('matchError'),
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateStr: string) => {
    try {
      return format(new Date(dateStr), 'd MMMM yyyy', { locale: locale === 'ar' ? ar : undefined })
    } catch {
      return dateStr
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-amber-600'
    return 'text-orange-600'
  }

  const getScoreLabel = (score: number) => {
    if (score >= 80) return t('matchHigh')
    if (score >= 60) return t('matchMedium')
    return t('matchPotentialLabel')
  }

  const getProgressColor = (score: number) => {
    if (score >= 80) return '[&>div]:bg-green-500'
    if (score >= 60) return '[&>div]:bg-amber-500'
    return '[&>div]:bg-orange-500'
  }

  return (
    <div className="space-y-3">
      <Button
        onClick={searchMatches}
        disabled={loading}
        className="gap-2 bg-gradient-to-l from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white shadow-lg shadow-purple-500/20"
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            {t('btnSearchingAI')}
          </>
        ) : (
          <>
            <Sparkles className="h-4 w-4" />
            {t('btnSearchAI')}
          </>
        )}
      </Button>

      {searched && matches.length > 0 && (
        <div className="space-y-2">
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-2 text-sm font-medium text-purple-700 dark:text-purple-400 hover:underline"
          >
            {matches.length} {t('matchPotential')}
            {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>

          {expanded && (
            <div className="space-y-3">
              {matches.map((match, index) => (
                <Card
                  key={index}
                  className="overflow-hidden cursor-pointer hover:shadow-md transition-all border-purple-200 dark:border-purple-800"
                  onClick={() => onMatchClick?.(match.lostItemId)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-sm truncate">
                          {match.item?.title || t('statusFound')}
                        </h4>
                        <Badge
                          className={`${CATEGORY_COLORS[match.item?.category || 'other'] || CATEGORY_COLORS.other} text-xs mt-1`}
                        >
                          {t(CATEGORIES.find((c) => c.id === match.item?.category)?.labelKey || 'catOther')}
                        </Badge>
                      </div>
                      <div className="text-left shrink-0">
                        <p className={`text-lg font-bold ${getScoreColor(match.matchScore)}`}>
                          {match.matchScore}%
                        </p>
                        <p className="text-[10px] text-muted-foreground">
                          {getScoreLabel(match.matchScore)}
                        </p>
                      </div>
                    </div>

                    <Progress value={match.matchScore} className={`h-1.5 mb-2 ${getProgressColor(match.matchScore)}`} />

                    <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        <span className="truncate max-w-[100px]">{match.item?.location}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>{match.item?.dateFound ? formatDate(match.item.dateFound) : ''}</span>
                      </div>
                      {match.item?.reward && (
                        <div className="flex items-center gap-1 text-green-600">
                          <Gift className="h-3 w-3" />
                          <span>{match.item.reward}</span>
                        </div>
                      )}
                    </div>

                    <div className="p-2 rounded bg-purple-50 dark:bg-purple-950/20 text-xs text-purple-700 dark:text-purple-300">
                      <Sparkles className="h-3 w-3 inline ml-1" />
                      {match.reason}
                    </div>

                    <div className="mt-2 flex items-center gap-1 text-xs text-primary">
                      <CheckCircle2 className="h-3 w-3" />
                      <span>{t('matchClickToVerify')}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {searched && matches.length === 0 && (
        <p className="text-sm text-muted-foreground p-3 rounded-lg bg-muted/50">
          {t('matchNoResultsDesc')}
        </p>
      )}
    </div>
  )
}
