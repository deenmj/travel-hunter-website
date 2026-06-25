'use client'

import { useEffect } from 'react'
import { X, Map } from 'lucide-react'
import { SriLankaMap } from './SriLankaMap'
import type { Destination } from '@/lib/types'

interface MapModalProps {
  isOpen: boolean
  onClose: () => void
  destinations: Destination[]
  selectedDistrict: string | null
  onDistrictSelect: (district: string | null) => void
}

export function MapModal({
  isOpen,
  onClose,
  destinations,
  selectedDistrict,
  onDistrictSelect,
}: MapModalProps) {
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  // Auto-close modal when user selects a district
  const handleDistrictSelect = (district: string | null) => {
    onDistrictSelect(district)
    if (district) {
      // Small delay so the selection animation shows before closing
      setTimeout(onClose, 350)
    }
  }

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Panel — slides up from bottom on mobile */}
      <div
        className="fixed inset-x-0 bottom-0 z-50 flex flex-col rounded-t-3xl overflow-hidden shadow-2xl animate-in slide-in-from-bottom-4 duration-300 ease-out"
        style={{ height: '92dvh', maxHeight: '92dvh' }}
        role="dialog"
        aria-modal="true"
        aria-label="Browse destinations on map"
      >
        {/* ── Header ── */}
        <div className="flex items-center justify-between px-5 py-4 bg-emerald-600 text-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center">
              <Map className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-black text-base leading-tight">Sri Lanka Map</h2>
              <p className="text-emerald-100 text-xs font-medium">Tap a district to filter places</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
            aria-label="Close map"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ── District Count Summary ── */}
        {selectedDistrict && (
          <div className="bg-emerald-50 dark:bg-emerald-950 border-b border-emerald-100 dark:border-emerald-900 px-5 py-2.5 shrink-0 flex items-center justify-between">
            <span className="text-sm font-bold text-emerald-800 dark:text-emerald-300">
              📍 {selectedDistrict} selected
            </span>
            <button
              onClick={() => onDistrictSelect(null)}
              className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold hover:underline"
            >
              Clear
            </button>
          </div>
        )}

        {/* ── Map ── */}
        <div className="flex-1 overflow-hidden bg-slate-50 dark:bg-slate-950">
          <SriLankaMap
            destinations={destinations}
            selectedDistrict={selectedDistrict}
            onDistrictSelect={handleDistrictSelect}
            height={undefined}
            className="h-full !rounded-none !border-0"
          />
        </div>

        {/* ── Bottom safe area ── */}
        <div className="bg-white dark:bg-slate-900 px-5 py-3 shrink-0 border-t border-slate-200 dark:border-slate-800">
          <button
            onClick={onClose}
            className="w-full h-12 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-sm transition-all active:scale-95"
          >
            {selectedDistrict ? `Show results for ${selectedDistrict}` : 'Close Map'}
          </button>
        </div>
      </div>
    </>
  )
}
