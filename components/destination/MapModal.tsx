'use client'

import { useEffect } from 'react'
import { X } from 'lucide-react'
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
  // Lock scroll + hide site header/footer while modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      // Add class so global CSS can hide header/footer/bottom-nav
      document.documentElement.classList.add('map-modal-open')
    } else {
      document.body.style.overflow = ''
      document.documentElement.classList.remove('map-modal-open')
    }
    return () => {
      document.body.style.overflow = ''
      document.documentElement.classList.remove('map-modal-open')
    }
  }, [isOpen])

  // Auto-close modal when user selects a district
  const handleDistrictSelect = (district: string | null) => {
    onDistrictSelect(district)
    if (district) {
      setTimeout(onClose, 350)
    }
  }

  if (!isOpen) return null

  return (
    <>
      {/* True full-screen overlay — sits ABOVE everything */}
      <div
        className="map-modal-overlay"
        role="dialog"
        aria-modal="true"
        aria-label="Browse destinations on map"
      >
        {/* ── Compact Top Bar ── */}
        <div className="map-modal-topbar">
          <div className="map-modal-title">
            <span className="map-modal-title-icon">🗺️</span>
            <div>
              <div className="map-modal-title-text">Sri Lanka Map</div>
              <div className="map-modal-title-sub">Tap a district to filter</div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="map-modal-close-x"
            aria-label="Close map"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ── Full Map Area ── */}
        <div className="map-modal-map-area">
          <SriLankaMap
            destinations={destinations}
            selectedDistrict={selectedDistrict}
            onDistrictSelect={handleDistrictSelect}
            height={undefined}
            className="map-modal-map"
          />
        </div>

        {/* ── Bottom Action Button ── */}
        <div className="map-modal-footer">
          <button
            onClick={onClose}
            className={`map-modal-cta ${selectedDistrict ? 'map-modal-cta--selected' : ''}`}
          >
            {selectedDistrict ? `✓ Show results for ${selectedDistrict}` : 'Close Map'}
          </button>
        </div>
      </div>
    </>
  )
}
