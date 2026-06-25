'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { MapPin, X, Loader2, AlertTriangle, Map } from 'lucide-react'
import type { Destination } from '@/lib/types'
import { ALL_DISTRICTS } from '@/lib/constants'

// ─── Types ───────────────────────────────────────────────────────────────────

interface DistrictFeature {
  type: 'Feature'
  properties: {
    district: string
    province: string
    labelLat: number
    labelLng: number
    emoji: string
  }
  geometry: {
    type: string
    coordinates: number[][][]
  }
}

interface GeoJSONData {
  type: 'FeatureCollection'
  features: DistrictFeature[]
}

interface SriLankaMapProps {
  destinations: Destination[]
  selectedDistrict: string | null
  onDistrictSelect: (district: string | null) => void
  height?: number
  className?: string
}

// ─── Province color palette (Sri Lankan theme) ──────────────────────────────
const PROVINCE_COLORS: Record<string, string> = {
  Western:       '#6ee7b7', // emerald-300
  Central:       '#34d399', // emerald-400
  Southern:      '#10b981', // emerald-500
  Northern:      '#a7f3d0', // emerald-200
  Eastern:       '#5eead4', // teal-300
  'North Western': '#99f6e4', // teal-200
  'North Central': '#67e8f9', // cyan-300
  Uva:           '#86efac', // green-300
  Sabaragamuwa:  '#bbf7d0', // green-200
}

// Key places to show as labels on the map
const LABEL_PLACES = [
  { name: 'Colombo',       lat: 6.927,  lng: 79.86,  emoji: '🏙️' },
  { name: 'Kandy',         lat: 7.293,  lng: 80.635, emoji: '🏯' },
  { name: 'Galle',         lat: 6.053,  lng: 80.22,  emoji: '⛵' },
  { name: 'Ella',          lat: 6.868,  lng: 81.046, emoji: '🌿' },
  { name: 'Sigiriya',      lat: 7.957,  lng: 80.76,  emoji: '🗿' },
  { name: 'Jaffna',        lat: 9.668,  lng: 80.007, emoji: '🕌' },
  { name: 'Mirissa',       lat: 5.947,  lng: 80.47,  emoji: '🐢' },
  { name: 'Trincomalee',   lat: 8.577,  lng: 81.233, emoji: '🐬' },
  { name: 'Anuradhapura',  lat: 8.312,  lng: 80.407, emoji: '🏛️' },
  { name: 'Nuwara Eliya',  lat: 6.949,  lng: 80.779, emoji: '🍵' },
  { name: 'Arugam Bay',    lat: 6.843,  lng: 81.836, emoji: '🌅' },
]

// ─── Fallback Component (when map fails) ─────────────────────────────────────
function DistrictFallback({
  destinations,
  selectedDistrict,
  onDistrictSelect,
}: {
  destinations: Destination[]
  selectedDistrict: string | null
  onDistrictSelect: (d: string | null) => void
}) {
  const districtCounts = ALL_DISTRICTS.reduce((acc, d) => {
    acc[d] = destinations.filter(
      (dest) => dest.region === d || dest.location?.includes(d)
    ).length
    return acc
  }, {} as Record<string, number>)

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4">
      <div className="flex items-center gap-2 mb-3 text-slate-500 dark:text-slate-400">
        <AlertTriangle className="w-4 h-4 text-amber-500" />
        <span className="text-sm font-medium">Map unavailable — browse by district</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {ALL_DISTRICTS.map((d) => (
          <button
            key={d}
            onClick={() => onDistrictSelect(selectedDistrict === d ? null : d)}
            className={`px-3 py-1.5 rounded-full text-sm font-semibold transition-all ${
              selectedDistrict === d
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 hover:text-emerald-700'
            }`}
          >
            {d}
            {districtCounts[d] > 0 && (
              <span className="ml-1.5 text-xs opacity-75">({districtCounts[d]})</span>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}

// ─── Main Map Component ───────────────────────────────────────────────────────
export function SriLankaMap({
  destinations,
  selectedDistrict,
  onDistrictSelect,
  height = 340,
  className = '',
}: SriLankaMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<any>(null)
  const geoJsonLayerRef = useRef<any>(null)
  const labelsLayerRef = useRef<any[]>([])

  const [geoData, setGeoData] = useState<GeoJSONData | null>(null)
  const [mapLoaded, setMapLoaded] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [hoveredDistrict, setHoveredDistrict] = useState<string | null>(null)

  // Count destinations per district
  const districtCounts = destinations.reduce((acc, dest) => {
    const d = dest.region || ''
    if (d) {
      acc[d] = (acc[d] || 0) + 1
    }
    return acc
  }, {} as Record<string, number>)

  // Inject Leaflet CSS
  useEffect(() => {
    if (document.getElementById('leaflet-css')) return
    const link = document.createElement('link')
    link.id = 'leaflet-css'
    link.rel = 'stylesheet'
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
    document.head.appendChild(link)
  }, [])

  // Fetch GeoJSON
  useEffect(() => {
    fetch('/sri-lanka-districts.geojson')
      .then((r) => r.json())
      .then((data: GeoJSONData) => setGeoData(data))
      .catch(() => setError(true))
  }, [])

  // Compute style for a feature
  const getFeatureStyle = useCallback(
    (feature: DistrictFeature, isHovered: boolean, isSelected: boolean) => {
      const province = feature.properties.province
      const baseColor = PROVINCE_COLORS[province] || '#6ee7b7'

      if (isSelected) {
        return {
          fillColor: '#059669',
          fillOpacity: 0.85,
          color: '#047857',
          weight: 2.5,
          opacity: 1,
        }
      }
      if (isHovered) {
        return {
          fillColor: '#10b981',
          fillOpacity: 0.72,
          color: '#047857',
          weight: 2,
          opacity: 1,
        }
      }
      return {
        fillColor: baseColor,
        fillOpacity: 0.55,
        color: '#047857',
        weight: 1.2,
        opacity: 0.8,
      }
    },
    []
  )

  // Initialize Leaflet map
  useEffect(() => {
    if (!geoData || mapRef.current || !mapContainerRef.current) return
    if (error) return

    let L: any
    import('leaflet').then((leafletModule) => {
      L = leafletModule.default || leafletModule

      // Fix default icon path issue in Next.js
      delete (L.Icon.Default.prototype as any)._getIconUrl
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      })

      const map = L.map(mapContainerRef.current!, {
        center: [7.8731, 80.7718],
        zoom: 7.2,
        zoomControl: true,
        scrollWheelZoom: false,
        attributionControl: false,
        dragging: true,
        touchZoom: true,
        doubleClickZoom: true,
      })

      mapRef.current = map

      // CartoDB Positron tiles — clean, minimal, no API key
      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png', {
        attribution: '© OpenStreetMap contributors, © CARTO',
        subdomains: 'abcd',
        maxZoom: 14,
      }).addTo(map)

      // Small attribution
      L.control.attribution({ position: 'bottomright', prefix: '© CARTO / OSM' }).addTo(map)

      // ─── GeoJSON layer ─────────────────────────────────────────────
      let currentHovered: string | null = null
      let currentSelected: string | null = selectedDistrict

      const geoLayer = L.geoJSON(geoData, {
        style: (feature: DistrictFeature) => {
          const d = feature.properties.district
          return getFeatureStyle(feature, d === currentHovered, d === currentSelected)
        },
        onEachFeature: (feature: DistrictFeature, layer: any) => {
          const districtName = feature.properties.district
          const count = districtCounts[districtName] || 0
          const emoji = feature.properties.emoji

          // Tooltip
          layer.bindTooltip(
            `<div style="
              font-family: 'Inter', sans-serif;
              background: white;
              border: 2px solid #059669;
              border-radius: 10px;
              padding: 8px 14px;
              box-shadow: 0 4px 16px rgba(0,0,0,0.12);
              min-width: 140px;
            ">
              <div style="font-size:14px; font-weight:800; color:#1e293b; margin-bottom:3px;">
                ${emoji} ${districtName}
              </div>
              <div style="font-size:12px; color:#059669; font-weight:600;">
                ${count > 0 ? `${count} place${count !== 1 ? 's' : ''}` : 'No listings yet'}
              </div>
              <div style="font-size:11px; color:#94a3b8; margin-top:2px;">
                ${feature.properties.province} Province
              </div>
            </div>`,
            { sticky: true, opacity: 1, className: 'leaflet-custom-tooltip' }
          )

          // Hover
          layer.on('mouseover', () => {
            currentHovered = districtName
            setHoveredDistrict(districtName)
            geoLayer.resetStyle(layer)
            layer.setStyle(getFeatureStyle(feature, true, districtName === currentSelected))
            layer.bringToFront()
          })
          layer.on('mouseout', () => {
            currentHovered = null
            setHoveredDistrict(null)
            geoLayer.resetStyle(layer)
            layer.setStyle(getFeatureStyle(feature, false, districtName === currentSelected))
          })

          // Click
          layer.on('click', () => {
            const wasSelected = districtName === currentSelected
            currentSelected = wasSelected ? null : districtName
            onDistrictSelect(wasSelected ? null : districtName)
            // Re-style all layers
            geoLayer.eachLayer((l: any) => {
              const f = l.feature as DistrictFeature
              geoLayer.resetStyle(l)
              l.setStyle(getFeatureStyle(f, false, f.properties.district === currentSelected))
            })
          })
        },
      }).addTo(map)

      geoJsonLayerRef.current = geoLayer

      // ─── City Labels (DivIcon markers) ─────────────────────────────
      const labelMarkers = LABEL_PLACES.map((place) => {
        const icon = L.divIcon({
          html: `<div style="
            font-family: 'Inter', sans-serif;
            font-size: 10px;
            font-weight: 700;
            color: #064e3b;
            text-shadow: 0 1px 3px rgba(255,255,255,0.9), 0 0 6px rgba(255,255,255,0.7);
            white-space: nowrap;
            pointer-events: none;
            line-height: 1.2;
          ">${place.emoji} ${place.name}</div>`,
          className: '',
          iconAnchor: [0, 0],
        })
        return L.marker([place.lat, place.lng], { icon, interactive: false }).addTo(map)
      })
      labelsLayerRef.current = labelMarkers

      setMapLoaded(true)
      setLoading(false)
    }).catch(() => {
      setError(true)
      setLoading(false)
    })

    return () => {
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
        geoJsonLayerRef.current = null
        labelsLayerRef.current = []
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [geoData, error])

  // Sync selectedDistrict changes from outside (e.g., region dropdown)
  useEffect(() => {
    if (!geoJsonLayerRef.current || !mapLoaded) return
    const layer = geoJsonLayerRef.current
    layer.eachLayer((l: any) => {
      const feature = l.feature as DistrictFeature
      l.setStyle(
        getFeatureStyle(feature, false, feature.properties.district === selectedDistrict)
      )
    })
  }, [selectedDistrict, mapLoaded, getFeatureStyle])

  if (error) {
    return (
      <DistrictFallback
        destinations={destinations}
        selectedDistrict={selectedDistrict}
        onDistrictSelect={onDistrictSelect}
      />
    )
  }

  return (
    <div
      className={`relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-sm ${className}`}
      style={height !== undefined ? { height } : undefined}
    >
      {/* Loading Overlay */}
      {loading && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900 gap-3">
          <div className="relative">
            <Map className="w-10 h-10 text-emerald-500 opacity-30" />
            <Loader2 className="w-6 h-6 text-emerald-500 animate-spin absolute -top-1 -right-1" />
          </div>
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Loading Sri Lanka map…</p>
        </div>
      )}

      {/* Selected District Banner */}
      {selectedDistrict && mapLoaded && (
        <div className="absolute top-3 left-1/2 -translate-x-1/2 z-[1000] animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-full shadow-lg text-sm font-bold">
            <MapPin className="w-4 h-4" />
            {selectedDistrict}
            <button
              onClick={() => onDistrictSelect(null)}
              className="ml-1 hover:bg-emerald-500 rounded-full p-0.5 transition-colors"
              aria-label="Clear selection"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Hint text */}
      {!selectedDistrict && mapLoaded && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-[1000] pointer-events-none">
          <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm text-slate-500 dark:text-slate-400 text-xs font-medium px-3 py-1.5 rounded-full shadow border border-slate-200 dark:border-slate-700 whitespace-nowrap">
            Click a district to filter destinations
          </div>
        </div>
      )}

      {/* Leaflet map container */}
      <div
        ref={mapContainerRef}
        className="w-full h-full"
        style={{ background: '#f0fdf4' }}
      />
    </div>
  )
}
