'use client'

import L from 'leaflet'
import {
  MapContainer,
  TileLayer,
  Marker,
} from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

// Fix default marker icon for webpack/Next.js
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
})

const DEFAULT_ZOOM = 15

interface MapDisplayProps {
  latitude: number
  longitude: number
  title?: string
}

export function MapDisplayInner({ latitude, longitude, title }: MapDisplayProps) {
  const center: [number, number] = [latitude, longitude]

  return (
    <div>
      <div className="h-[200px] rounded-lg overflow-hidden border border-border">
        <MapContainer
          center={center}
          zoom={DEFAULT_ZOOM}
          style={{ height: '100%', width: '100%' }}
          scrollWheelZoom={false}
          dragging={false}
          doubleClickZoom={false}
          zoomControl={false}
          touchZoom={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={center} />
        </MapContainer>
      </div>
      {title && (
        <p className="mt-1.5 text-xs text-muted-foreground text-center">
          {title}
        </p>
      )}
      <p className="mt-0.5 text-xs text-muted-foreground text-center" dir="ltr">
        📍 {latitude.toFixed(4)}, {longitude.toFixed(4)}
      </p>
    </div>
  )
}
