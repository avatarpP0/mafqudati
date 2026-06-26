'use client'

import L from 'leaflet'
import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Popup,
} from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

// Fix default marker icon for webpack/Next.js
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
})

interface HeatmapPoint {
  location: string
  lat: number
  lng: number
  count: number
}

interface StatsHeatmapInnerProps {
  points: HeatmapPoint[]
}

// Default center (Cairo, Egypt)
const DEFAULT_CENTER: [number, number] = [30.0444, 31.2357]
const DEFAULT_ZOOM = 12

export function StatsHeatmapInner({ points }: StatsHeatmapInnerProps) {
  // Calculate center from points or use default
  const center: [number, number] = points.length > 0
    ? [
        points.reduce((sum, p) => sum + p.lat, 0) / points.length,
        points.reduce((sum, p) => sum + p.lng, 0) / points.length,
      ]
    : DEFAULT_CENTER

  const maxCount = Math.max(...points.map((p) => p.count), 1)

  return (
    <div className="h-[300px] rounded-lg overflow-hidden border border-border">
      <MapContainer
        center={center}
        zoom={DEFAULT_ZOOM}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {points.map((point, index) => {
          const radius = Math.max(8, Math.min(35, (point.count / maxCount) * 35))
          const opacity = Math.max(0.4, Math.min(0.85, point.count / maxCount))
          return (
            <CircleMarker
              key={index}
              center={[point.lat, point.lng]}
              radius={radius}
              pathOptions={{
                fillColor: '#f59e0b',
                color: '#d97706',
                weight: 2,
                opacity: opacity,
                fillOpacity: opacity * 0.7,
              }}
            >
              <Popup>
                <div className="text-center">
                  <strong>{point.location}</strong>
                  <br />
                  <span>{point.count} item(s)</span>
                </div>
              </Popup>
            </CircleMarker>
          )
        })}
      </MapContainer>
    </div>
  )
}
