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
      {/* Full-screen Modal Panel */}
      <div
        className="fixed inset-0 z-[100] flex flex-col bg-slate-50 dark:bg-slate-950 animate-in slide-in-from-bottom duration-300 ease-out"
        style={{ height: '100dvh' }}
        role="dialog"
        aria-modal="true"
        aria-label="Browse destinations on map"
      >
        {/* ── Compact Header ── */}
        <div className="flex items-center justify-between px-4 h-14 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shrink-0 z-10 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-emerald-100 dark:bg-emerald-900/50 rounded-full flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <Map className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-bold text-[15px] leading-tight text-slate-900 dark:text-white">Sri Lanka Map</h2>
              <p className="text-slate-500 dark:text-slate-400 text-[11px] font-semibold uppercase tracking-wider">Tap to filter</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 rounded-full flex items-center justify-center transition-colors"
            aria-label="Close map"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* ── Map Area ── */}
        <div className="relative flex-1 overflow-hidden">
          <SriLankaMap
            destinations={destinations}
            selectedDistrict={selectedDistrict}
            onDistrictSelect={handleDistrictSelect}
            height={undefined}
            className="h-full w-full !rounded-none !border-0"
          />

          {/* ── Bottom Floating Action Button ── */}
          <div className="absolute bottom-8 inset-x-6 z-[1000]">
            <button
              onClick={onClose}
              className={`w-full h-14 rounded-2xl font-bold text-[15px] shadow-2xl transition-all active:scale-[0.98] flex items-center justify-center ${
                selectedDistrict 
                  ? 'bg-emerald-600 text-white shadow-emerald-900/20' 
                  : 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
              }`}
            >
              {selectedDistrict ? `Show Results (${selectedDistrict})` : 'Close Map'}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
