'use client'

import dynamic from 'next/dynamic'

const MapPicker = dynamic(
  () => import('@/components/lost-found/map-picker-inner').then((mod) => mod.MapPickerInner),
  {
    ssr: false,
    loading: () => (
      <div>
        <div className="h-[200px] rounded-lg overflow-hidden border border-border bg-muted flex items-center justify-center">
          <p className="text-sm text-muted-foreground">جاري تحميل الخريطة...</p>
        </div>
        <p className="mt-1.5 text-xs text-muted-foreground text-center">
          انقر على الخريطة لتحديد الموقع
        </p>
      </div>
    ),
  }
)

export { MapPicker }
