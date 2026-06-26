'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useI18n } from '@/lib/i18n'
import { CATEGORIES } from '@/lib/types'

// Dynamic import for the Leaflet heat map (SSR disabled)
const StatsHeatmap = dynamic(
  () => import('@/components/lost-found/stats-heatmap-inner').then((mod) => mod.StatsHeatmapInner),
  {
    ssr: false,
    loading: () => (
      <div className="h-[300px] rounded-lg overflow-hidden border border-border bg-muted flex items-center justify-center">
        <p className="text-sm text-muted-foreground">...</p>
      </div>
    ),
  }
)

// Category color palette for charts
const CATEGORY_CHART_COLORS: Record<string, string> = {
  electronics: '#3b82f6',
  documents: '#f59e0b',
  keys: '#eab308',
  clothing: '#ec4899',
  accessories: '#a855f7',
  bags: '#22c55e',
  wallets: '#f97316',
  pets: '#14b8a6',
  other: '#6b7280',
}

interface StatsData {
  categoryDistribution: { category: string; count: number }[]
  monthlyTrend: { month: string; found: number; lost: number }[]
  locationHeatmap: { location: string; lat: number; lng: number; count: number }[]
  statusDistribution: { status: string; count: number }[]
  topLocations: { location: string; count: number }[]
}

export function AdvancedStats() {
  const { t, locale } = useI18n()
  const [stats, setStats] = useState<StatsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      try {
        setLoading(true)
        const res = await fetch('/api/stats')
        if (res.ok) {
          const data = await res.json()
          setStats(data)
        }
      } catch (error) {
        console.error('Error fetching stats:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  const getCategoryLabel = (catId: string) => {
    const cat = CATEGORIES.find((c) => c.id === catId)
    if (cat) return t(cat.labelKey)
    return catId
  }

  // Prepare pie chart data with translated labels
  const pieData = (stats?.categoryDistribution || []).map((item) => ({
    ...item,
    name: getCategoryLabel(item.category),
    color: CATEGORY_CHART_COLORS[item.category] || '#6b7280',
  }))

  // Prepare top locations data with percentage bars
  const topLocData = stats?.topLocations || []
  const maxLocCount = Math.max(...topLocData.map((l) => l.count), 1)

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-5 w-40" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-[250px] w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (!stats) return null

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Category Distribution - Pie Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <span className="text-lg">📊</span>
            {t('statsCategoryDist')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {pieData.length > 0 ? (
            <div className="flex flex-col items-center">
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={85}
                    paddingAngle={3}
                    dataKey="count"
                    nameKey="name"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number, name: string) => [value, name]}
                    contentStyle={{
                      borderRadius: '8px',
                      border: '1px solid hsl(var(--border))',
                      backgroundColor: 'hsl(var(--popover))',
                      color: 'hsl(var(--popover-foreground))',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              {/* Legend */}
              <div className="flex flex-wrap justify-center gap-x-4 gap-y-1.5 mt-2">
                {pieData.map((entry, index) => {
                  const total = pieData.reduce((sum, e) => sum + e.count, 0)
                  const pct = total > 0 ? ((entry.count / total) * 100).toFixed(0) : 0
                  return (
                    <div key={index} className="flex items-center gap-1.5 text-xs">
                      <div
                        className="h-2.5 w-2.5 rounded-sm shrink-0"
                        style={{ backgroundColor: entry.color }}
                      />
                      <span className="text-muted-foreground">
                        {entry.name} ({pct}%)
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          ) : (
            <div className="h-[250px] flex items-center justify-center text-sm text-muted-foreground">
              {locale === 'ar' ? 'لا توجد بيانات' : 'No data available'}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Monthly Trend - Bar Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <span className="text-lg">📈</span>
            {t('statsMonthlyTrend')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {stats.monthlyTrend.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={stats.monthlyTrend} margin={{ top: 5, right: 5, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 10 }}
                  angle={-35}
                  textAnchor="end"
                  height={50}
                />
                <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    borderRadius: '8px',
                    border: '1px solid hsl(var(--border))',
                    backgroundColor: 'hsl(var(--popover))',
                    color: 'hsl(var(--popover-foreground))',
                  }}
                />
                <Legend
                  wrapperStyle={{ fontSize: '12px' }}
                />
                <Bar
                  dataKey="found"
                  name={t('statsFoundItems')}
                  fill="#f59e0b"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="lost"
                  name={t('statsLostReports')}
                  fill="#a855f7"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[280px] flex items-center justify-center text-sm text-muted-foreground">
              {locale === 'ar' ? 'لا توجد بيانات' : 'No data available'}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Location Heat Map */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <span className="text-lg">🗺️</span>
            {t('statsLocationHeat')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {stats.locationHeatmap.length > 0 ? (
            <StatsHeatmap points={stats.locationHeatmap} />
          ) : (
            <div className="h-[300px] flex items-center justify-center text-sm text-muted-foreground rounded-lg border border-border bg-muted">
              {locale === 'ar' ? 'لا توجد مواقع محددة' : 'No locations with coordinates'}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Top Locations - Horizontal Bar Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <span className="text-lg">📍</span>
            {t('statsTopLocations')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {topLocData.length > 0 ? (
            <div className="space-y-4 py-2">
              {topLocData.map((loc, index) => {
                const widthPct = (loc.count / maxLocCount) * 100
                return (
                  <div key={index} className="space-y-1.5">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium truncate max-w-[180px]" title={loc.location}>
                        {loc.location}
                      </span>
                      <span className="text-muted-foreground font-mono text-xs tabular-nums">
                        {loc.count}
                      </span>
                    </div>
                    <div className="h-6 bg-muted rounded-md overflow-hidden">
                      <div
                        className="h-full rounded-md transition-all duration-500"
                        style={{
                          width: `${widthPct}%`,
                          background: `linear-gradient(to ${locale === 'ar' ? 'left' : 'right'}, #f59e0b, #d97706)`,
                        }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="h-[200px] flex items-center justify-center text-sm text-muted-foreground">
              {locale === 'ar' ? 'لا توجد بيانات' : 'No data available'}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
