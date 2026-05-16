// Sri Lankan travel theme color palette
export const COLORS = {
  primary: '#10b981', // Emerald green
  secondary: '#0ea5e9', // Ocean blue
  accent: '#f59e0b', // Golden
  background: '#ffffff',
  foreground: '#1f2937',
  muted: '#9ca3af',
  'muted-foreground': '#6b7280',
  border: '#e5e7eb',
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
} as const

// Category definitions
export const CATEGORIES = {
  VISIT: 'visit',
  EAT: 'eat',
  STAY: 'stay',
} as const

export const CATEGORY_LABELS = {
  visit: 'Places to Visit',
  eat: 'Where to Eat',
  stay: 'Where to Stay',
} as const

export const CATEGORY_ICONS = {
  visit: '🗺️',
  eat: '🍽️',
  stay: '🏨',
} as const

// Navigation routes
export const ROUTES = {
  HOME: '/',
  DESTINATIONS: '/destinations',
  VIDEOS: '/videos',
  BLOG: '/blog',
  ABOUT: '/about',
  LOGIN: '/auth/login',
  ADMIN: '/admin',
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_DESTINATIONS: '/admin/destinations',
  ADMIN_BLOG: '/admin/blog',
  ADMIN_VIDEOS: '/admin/videos',
} as const

// Responsive breakpoints (Tailwind CSS)
export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const

// Touch target sizes (48px minimum, 56px for primary actions)
export const TOUCH_TARGET = {
  DEFAULT: 48,
  PRIMARY: 56,
  ICON: 44,
} as const

// Image optimization
export const IMAGE_SIZES = {
  THUMBNAIL: 300,
  MEDIUM: 600,
  LARGE: 1200,
  HERO: 1920,
} as const

export const IMAGE_QUALITY = 85 // JPEG quality 0-100

// Performance targets
export const PERFORMANCE = {
  LCP_TARGET: 2500, // Largest Contentful Paint < 2.5s
  CLS_TARGET: 0.1, // Cumulative Layout Shift < 0.1
  FID_TARGET: 100, // First Input Delay < 100ms
} as const

// Social media links
export const SOCIAL_LINKS = {
  FACEBOOK: 'https://facebook.com',
  INSTAGRAM: 'https://instagram.com',
  YOUTUBE: 'https://youtube.com',
  TWITTER: 'https://twitter.com',
} as const

// Meta tags defaults
export const SITE_NAME = 'Travel Hunter'
export const SITE_DESCRIPTION =
  'Discover the hidden gems of Sri Lanka. Explore unique destinations, authentic cuisine, and memorable stays curated by local travel experts.'
export const SITE_URL = 'https://travelhunter.com'
export const SITE_KEYWORDS = [
  'Sri Lanka',
  'travel',
  'destinations',
  'places to visit',
  'where to eat',
  'where to stay',
  'tourism',
  'adventure',
]
