'use client'

import { useState, useCallback } from 'react'
import L from 'leaflet'
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
} from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

// Fix default marker icon for webpack/Next.js
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
})

const DEFAULT_CENTER: [number, number] = [30.0444, 31.2357] // Cairo, Egypt
const DEFAULT_ZOOM = 13

interface MapPickerProps {
  latitude?: number | null
  longitude?: number | null
  onChange: (lat: number, lng: number) => void
}

function ClickHandler({ onClick }: { onClick: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onClick(e.latlng.lat, e.latlng.lng)
    },
  })
  return null
}

function DraggableMarker({
  position,
  onDragEnd,
}: {
  position: [number, number]
  onDragEnd: (lat: number, lng: number) => void
}) {
  const handleDragEnd = useCallback(
    (e: L.DragEndEvent) => {
      const marker = e.target as L.Marker
      const { lat, lng } = marker.getLatLng()
      onDragEnd(lat, lng)
    },
    [onDragEnd],
  )

  return <Marker position={position} draggable eventHandlers={{ dragend: handleDragEnd }} />
}

export function MapPickerInner({ latitude, longitude, onChange }: MapPickerProps) {
  const hasInitialPosition = latitude != null && longitude != null
  const center: [number, number] = hasInitialPosition ? [latitude!, longitude!] : DEFAULT_CENTER

  // Track the marker position locally, initialized from props
  const [markerPos, setMarkerPos] = useState<[number, number] | null>(
    hasInitialPosition ? [latitude!, longitude!] : null,
  )

  const handleClick = useCallback(
    (lat: number, lng: number) => {
      setMarkerPos([lat, lng])
      onChange(lat, lng)
    },
    [onChange],
  )

  const handleDragEnd = useCallback(
    (lat: number, lng: number) => {
      setMarkerPos([lat, lng])
      onChange(lat, lng)
    },
    [onChange],
  )

  return (
    <div>
      <div className="h-[200px] rounded-lg overflow-hidden border border-border">
        <MapContainer
          center={center}
          zoom={DEFAULT_ZOOM}
          style={{ height: '100%', width: '100%' }}
          scrollWheelZoom
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <ClickHandler onClick={handleClick} />
          {markerPos && (
            <DraggableMarker position={markerPos} onDragEnd={handleDragEnd} />
          )}
        </MapContainer>
      </div>
      {markerPos ? (
        <p className="mt-1.5 text-xs text-muted-foreground text-center" dir="ltr">
          📍 {markerPos[0].toFixed(4)}, {markerPos[1].toFixed(4)}
        </p>
      ) : (
        <p className="mt-1.5 text-xs text-muted-foreground text-center">
          انقر على الخريطة لتحديد الموقع
        </p>
      )}
    </div>
  )
}
