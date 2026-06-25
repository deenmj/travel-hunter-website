'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { MapPin, X, Loader2, AlertTriangle, Map } from 'lucide-react'
import type { Destination } from '@/lib/types'
import { ALL_DISTRICTS } from '@/lib/constants'

// ─── Types ───────────────────────────────────────────────────────────────────

interface DistrictProperties {
  district: string
  province: string
}

interface DistrictFeature {
  type: 'Feature'
  properties: DistrictProperties
  geometry: { type: string; coordinates: number[][][] }
}

interface GeoJSONData {
  type: 'FeatureCollection'
  features: DistrictFeature[]
}

export interface SriLankaMapProps {
  destinations: Destination[]
  selectedDistrict: string | null
  onDistrictSelect: (district: string | null) => void
  height?: number
  className?: string
}

// ─── Province colour palette (Sri Lankan theme) ──────────────────────────────
const PROVINCE_COLORS: Record<string, string> = {
  Western:         '#a7f3d0', // Emerald 200
  Central:         '#6ee7b7', // Emerald 300
  Southern:        '#34d399', // Emerald 400
  Northern:        '#99f6e4', // Teal 200
  Eastern:         '#5eead4', // Teal 300
  'North Western': '#bae6fd', // Sky 200
  'North Central': '#7dd3fc', // Sky 300
  Uva:             '#bbf7d0', // Green 200
  Sabaragamuwa:    '#86efac', // Green 300
}

// Key city labels
const LABEL_PLACES = [
  { name: 'Colombo',      lat: 6.927,  lng: 79.86,  emoji: '🏙️' },
  { name: 'Kandy',        lat: 7.293,  lng: 80.635, emoji: '🏯' },
  { name: 'Galle',        lat: 6.053,  lng: 80.22,  emoji: '⛵' },
  { name: 'Ella',         lat: 6.868,  lng: 81.046, emoji: '🌿' },
  { name: 'Sigiriya',     lat: 7.957,  lng: 80.76,  emoji: '🗿' },
  { name: 'Jaffna',       lat: 9.668,  lng: 80.007, emoji: '🕌' },
  { name: 'Mirissa',      lat: 5.947,  lng: 80.47,  emoji: '🐢' },
  { name: 'Trincomalee',  lat: 8.577,  lng: 81.233, emoji: '🐬' },
  { name: 'Anuradhapura', lat: 8.312,  lng: 80.407, emoji: '🏛️' },
  { name: 'Nuwara Eliya', lat: 6.949,  lng: 80.779, emoji: '🍵' },
  { name: 'Arugam Bay',   lat: 6.843,  lng: 81.836, emoji: '🌅' },
]

const LEAFLET_CSS = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
const LEAFLET_JS  = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'

// ─── Load Leaflet from CDN (idempotent) ──────────────────────────────────────
function loadLeaflet(): Promise<any> {
  return new Promise((resolve, reject) => {
    // Already loaded
    if ((window as any).L) { resolve((window as any).L); return }

    // CSS
    if (!document.getElementById('leaflet-css')) {
      const link = document.createElement('link')
      link.id   = 'leaflet-css'
      link.rel  = 'stylesheet'
      link.href = LEAFLET_CSS
      document.head.appendChild(link)
    }

    // JS
    if (document.getElementById('leaflet-js')) {
      // script tag exists but L not ready yet — wait
      const existing = document.getElementById('leaflet-js') as HTMLScriptElement
      existing.addEventListener('load', () => resolve((window as any).L))
      existing.addEventListener('error', reject)
      return
    }

    const script   = document.createElement('script')
    script.id      = 'leaflet-js'
    script.src     = LEAFLET_JS
    script.async   = true
    script.onload  = () => resolve((window as any).L)
    script.onerror = reject
    document.head.appendChild(script)
  })
}

// ─── Fallback when map fails ──────────────────────────────────────────────────
function DistrictFallback({
  destinations, selectedDistrict, onDistrictSelect,
}: {
  destinations: Destination[]
  selectedDistrict: string | null
  onDistrictSelect: (d: string | null) => void
}) {
  const counts = ALL_DISTRICTS.reduce((acc, d) => {
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
            {counts[d] > 0 && <span className="ml-1.5 text-xs opacity-75">({counts[d]})</span>}
          </button>
        ))}
      </div>
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────
export function SriLankaMap({
  destinations,
  selectedDistrict,
  onDistrictSelect,
  height = 340,
  className = '',
}: SriLankaMapProps) {
  const containerRef   = useRef<HTMLDivElement>(null)
  const mapRef         = useRef<any>(null)
  const geoLayerRef    = useRef<any>(null)
  const currentSelRef  = useRef<string | null>(selectedDistrict)

  const [mapReady,  setMapReady]  = useState(false)
  const [loading,   setLoading]   = useState(true)
  const [error,     setError]     = useState(false)

  // district → destination count
  const districtCounts = destinations.reduce((acc, dest) => {
    const r = dest.region
    if (r) acc[r] = (acc[r] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  // Style helper (uses refs so Leaflet event closures stay fresh)
  const getStyle = useCallback((
    feature: DistrictFeature, hovered: boolean, selected: boolean,
  ) => {
    const base = PROVINCE_COLORS[feature.properties.province] ?? '#99f6e4'
    if (selected) return { fillColor: '#0d9488', fillOpacity: 0.95, color: '#0f766e', weight: 2.5, opacity: 1 }
    if (hovered)  return { fillColor: '#14b8a6', fillOpacity: 0.85, color: '#0d9488', weight: 2.5, opacity: 1 }
    return { fillColor: base, fillOpacity: 0.65, color: '#ffffff', weight: 1.5, opacity: 0.9 }
  }, [])

  // ── Bootstrap map ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (mapRef.current || !containerRef.current) return

    let cancelled = false

    Promise.all([
      loadLeaflet(),
      fetch('/sri-lanka-districts.geojson').then((r) => r.json() as Promise<GeoJSONData>),
    ])
      .then(([L, geoData]) => {
        if (cancelled || !containerRef.current || mapRef.current) return

        // Fix default icon paths (Next.js asset hashing breaks them)
        delete (L.Icon.Default.prototype as any)._getIconUrl
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
          iconUrl:       'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
          shadowUrl:     'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
        })

        const map = L.map(containerRef.current, {
          zoomControl:       true,
          scrollWheelZoom:   false,
          attributionControl: false,
          dragging:          true,
          touchZoom:         true,
          doubleClickZoom:   true,
        })
        mapRef.current = map

        // Note: Removed the tile layer for a cleaner, premium "floating island" look.
        // It helps focus entirely on the districts without distracting terrain.

        // ── GeoJSON district polygons ────────────────────────────────────────
        let hoveredDistrict: string | null = null

        const geoLayer = L.geoJSON(geoData, {
          style: (f: DistrictFeature) => getStyle(
            f,
            f.properties.district === hoveredDistrict,
            f.properties.district === currentSelRef.current,
          ),
          onEachFeature: (feature: DistrictFeature, layer: any) => {
            const { district, province } = feature.properties
            const count = districtCounts[district] ?? 0

            // Premium Tooltip
            layer.bindTooltip(
              `<div style="font-family: 'Inter', system-ui, sans-serif; background: #ffffff; border-radius: 12px; padding: 10px 16px; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1); min-width: 160px; border: 1px solid #e2e8f0;">
                <div style="font-size: 15px; font-weight: 700; color: #0f172a; margin-bottom: 4px; display: flex; justify-content: space-between; align-items: center;">
                  <span>${district}</span>
                  <span style="font-size: 12px; font-weight: 600; background: #ecfdf5; color: #059669; padding: 2px 8px; border-radius: 9999px;">${count}</span>
                </div>
                <div style="font-size: 12px; color: #64748b; font-weight: 500;">${province} Province</div>
                ${count > 0 ? `<div style="font-size: 12px; color: #059669; font-weight: 600; margin-top: 8px;">Click to view places &rarr;</div>` : `<div style="font-size: 12px; color: #94a3b8; margin-top: 8px; font-weight: 500;">No listings yet</div>`}
              </div>`,
              { sticky: true, opacity: 1, direction: 'top', offset: [0, -10], className: 'map-tooltip-custom' },
            )

            layer.on('mouseover', () => {
              hoveredDistrict = district
              layer.setStyle(getStyle(feature, true, district === currentSelRef.current))
              layer.bringToFront()
            })
            layer.on('mouseout', () => {
              hoveredDistrict = null
              layer.setStyle(getStyle(feature, false, district === currentSelRef.current))
            })
            layer.on('click', () => {
              const wasSelected = district === currentSelRef.current
              const next = wasSelected ? null : district
              currentSelRef.current = next
              onDistrictSelect(next)
              // Re-style all layers
              geoLayer.eachLayer((l: any) => {
                const f = l.feature as DistrictFeature
                l.setStyle(getStyle(f, false, f.properties.district === next))
              })
            })
          },
        }).addTo(map)

        geoLayerRef.current = geoLayer

        // Auto-fit bounds to cleanly frame the map without awkward empty space
        map.fitBounds(geoLayer.getBounds(), { padding: [20, 20] })

        // ── City labels ──────────────────────────────────────────────────────
        LABEL_PLACES.forEach(({ name, lat, lng, emoji: e }) => {
          const icon = L.divIcon({
            html: `<div style="font-size:10px;font-weight:700;color:#064e3b;white-space:nowrap;pointer-events:none;text-shadow:0 1px 3px rgba(255,255,255,.9)">${e} ${name}</div>`,
            className: '',
            iconAnchor: [0, 0],
          })
          L.marker([lat, lng], { icon, interactive: false }).addTo(map)
        })

        setMapReady(true)
        setLoading(false)
      })
      .catch(() => {
        if (!cancelled) { setError(true); setLoading(false) }
      })

    return () => {
      cancelled = true
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current    = null
        geoLayerRef.current = null
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Sync external selectedDistrict changes (dropdown → map)
  useEffect(() => {
    currentSelRef.current = selectedDistrict
    if (!geoLayerRef.current) return
    geoLayerRef.current.eachLayer((l: any) => {
      const f = l.feature as DistrictFeature
      l.setStyle(getStyle(f, false, f.properties.district === selectedDistrict))
    })
  }, [selectedDistrict, getStyle])

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
      <style>{`
        .leaflet-tooltip.map-tooltip-custom {
          background: transparent;
          border: none;
          box-shadow: none;
          padding: 0;
        }
        .leaflet-tooltip-top.map-tooltip-custom::before,
        .leaflet-tooltip-bottom.map-tooltip-custom::before,
        .leaflet-tooltip-left.map-tooltip-custom::before,
        .leaflet-tooltip-right.map-tooltip-custom::before {
          display: none;
        }
      `}</style>
      
      {/* Loading state */}
      {loading && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900 gap-3">
          <div className="relative">
            <Map className="w-10 h-10 text-emerald-500 opacity-30" />
            <Loader2 className="w-6 h-6 text-emerald-500 animate-spin absolute -top-1 -right-1" />
          </div>
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Loading Sri Lanka map…</p>
        </div>
      )}

      {/* Selected district pill */}
      {selectedDistrict && mapReady && (
        <div className="absolute top-3 left-1/2 -translate-x-1/2 z-[1000]">
          <div className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-full shadow-lg text-sm font-bold whitespace-nowrap">
            <MapPin className="w-4 h-4 shrink-0" />
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

      {/* Hint */}
      {!selectedDistrict && mapReady && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-[1000] pointer-events-none">
          <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm text-slate-500 dark:text-slate-400 text-xs font-medium px-3 py-1.5 rounded-full shadow border border-slate-200 dark:border-slate-700 whitespace-nowrap">
            Click a district to filter destinations
          </div>
        </div>
      )}

      {/* Map container — always rendered so Leaflet can attach */}
      <div ref={containerRef} className="w-full h-full" style={{ background: '#f8fafc' }} />
    </div>
  )
}
