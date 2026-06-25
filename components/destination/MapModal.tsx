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
        className="fixed inset-0 z-[9999] flex flex-col bg-slate-50 dark:bg-slate-950 animate-in slide-in-from-bottom duration-300 ease-out"
        style={{ height: '100dvh' }}
        role="dialog"
        aria-modal="true"
        aria-label="Browse destinations on map"
      >
        {/* ── Map Area (100% height) ── */}
        <div className="relative flex-1 overflow-hidden">
          
          {/* ── Floating Header ── */}
          <div className="absolute top-4 inset-x-4 z-[1001] flex justify-between items-start pointer-events-none">
            <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-lg rounded-2xl px-4 py-2 pointer-events-auto border border-slate-200/50 dark:border-slate-800/50">
              <h2 className="font-bold text-sm text-slate-900 dark:text-white leading-tight">Sri Lanka Map</h2>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">Tap to filter</p>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-full flex items-center justify-center pointer-events-auto transition-all active:scale-95 border border-slate-200/50 dark:border-slate-800/50"
              aria-label="Close map"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

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
