'use client'

import dynamic from 'next/dynamic'

const MapDisplay = dynamic(
  () => import('@/components/lost-found/map-display-inner').then((mod) => mod.MapDisplayInner),
  {
    ssr: false,
    loading: () => (
      <div className="h-[200px] rounded-lg overflow-hidden border border-border bg-muted flex items-center justify-center">
        <p className="text-sm text-muted-foreground">جاري تحميل الخريطة...</p>
      </div>
    ),
  }
)

export { MapDisplay }
