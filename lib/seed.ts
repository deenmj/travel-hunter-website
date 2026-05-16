import { createClient } from '@supabase/supabase-js'

// Note: To run this script, you would typically use a tool like ts-node
// Example: npx ts-node lib/seed.ts

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

const supabase = createClient(supabaseUrl, supabaseKey)

const destinationsToSeed = [
  {
    id: '1',
    slug: 'sigiriya-rock-fortress',
    name: 'Sigiriya Rock Fortress',
    description: 'An ancient palace and fortress complex carved into a massive column of rock. Known as the Eighth Wonder of the World by locals, it offers breathtaking views and features ancient frescoes.',
    category: 'visit',
    featured_image: 'https://images.unsplash.com/photo-1588598198321-17769a6eb34f?q=80&w=800&auto=format&fit=crop',
    images: ['https://images.unsplash.com/photo-1588598198321-17769a6eb34f?q=80&w=400&auto=format&fit=crop'],
    video_id: 'wM3j0P1iI9w',
    best_time: 'January to April',
    location: 'Central Province',
    highlights: ['Ancient ruins', 'Panoramic views', 'Mirror wall frescoes', 'Lion Paws'],
    created_by: 'admin',
  },
  {
    id: '2',
    slug: 'galle-fort',
    name: 'Galle Dutch Fort',
    description: 'A beautifully preserved colonial-era fort on the southwest coast. Wander through cobblestone streets, boutique shops, and cafes while watching stunning sunsets from the ramparts.',
    category: 'visit',
    featured_image: 'https://images.unsplash.com/photo-1548013146-72f90ecb3c6b?q=80&w=800&auto=format&fit=crop',
    images: ['https://images.unsplash.com/photo-1548013146-72f90ecb3c6b?q=80&w=400&auto=format&fit=crop'],
    video_id: 'qKqg5vP_6A0',
    best_time: 'December to March',
    location: 'Southern Province',
    highlights: ['Colonial architecture', 'Lighthouse', 'Boutique shopping', 'Sunset walks'],
    created_by: 'admin',
  },
  {
    id: '3',
    slug: 'nine-arch-bridge',
    name: 'Nine Arch Bridge',
    description: 'A spectacular colonial-era railway bridge hidden deep in the jungle. An iconic spot for photography, especially when the iconic blue train passes through the misty mountains of Ella.',
    category: 'visit',
    featured_image: 'https://images.unsplash.com/photo-1546708453-15743b0d268d?q=80&w=800&auto=format&fit=crop',
    images: ['https://images.unsplash.com/photo-1546708453-15743b0d268d?q=80&w=400&auto=format&fit=crop'],
    video_id: 'V1bFr2SWP1I',
    best_time: 'January to May',
    location: 'Ella, Uva Province',
    highlights: ['Jungle trek', 'Photography', 'Historic railway', 'Scenic views'],
    created_by: 'admin',
  },
  {
    id: '4',
    slug: 'yala-national-park',
    name: 'Yala National Park',
    description: 'The most famous wildlife park in Sri Lanka, offering the highest leopard density in the world. Embark on a thrilling safari to spot elephants, sloth bears, and diverse birdlife.',
    category: 'visit',
    featured_image: 'https://images.unsplash.com/photo-1620959828455-6bba0379ea66?q=80&w=800&auto=format&fit=crop',
    images: ['https://images.unsplash.com/photo-1620959828455-6bba0379ea66?q=80&w=400&auto=format&fit=crop'],
    video_id: 'tNxg7Z5kH7U',
    best_time: 'February to July',
    location: 'Southern Province',
    highlights: ['Leopard spotting', 'Jeep safari', 'Wild elephants', 'Nature photography'],
    created_by: 'admin',
  },
  {
    id: '5',
    slug: 'galle-face-street-food',
    name: 'Galle Face Green Street Food',
    description: 'Experience the bustling heart of Colombo at sunset. The promenade comes alive with dozens of food carts offering spicy isso vadei (prawn fritters), kottu roti, and local sweets.',
    category: 'eat',
    featured_image: 'https://images.unsplash.com/photo-1504674900968-8d6e7b8b0e48?q=80&w=800&auto=format&fit=crop',
    images: ['https://images.unsplash.com/photo-1504674900968-8d6e7b8b0e48?q=80&w=400&auto=format&fit=crop'],
    video_id: 'dQw4w9WgXcQ',
    best_time: 'Year-round (Evenings)',
    location: 'Colombo',
    highlights: ['Isso Vadei', 'Ocean views', 'Local atmosphere', 'Affordable eats'],
    created_by: 'admin',
  },
  {
    id: '6',
    slug: 'mirissa-seafood',
    name: 'Mirissa Beach Seafood',
    description: 'Dine right on the sand under fairy lights. Mirissa beach is famous for its massive displays of freshly caught seafood that you can pick and have grilled to order.',
    category: 'eat',
    featured_image: 'https://images.unsplash.com/photo-1601314120367-9c9e54a93fcd?q=80&w=800&auto=format&fit=crop',
    images: ['https://images.unsplash.com/photo-1601314120367-9c9e54a93fcd?q=80&w=400&auto=format&fit=crop'],
    video_id: 'dQw4w9WgXcQ',
    best_time: 'November to April',
    location: 'Mirissa',
    highlights: ['Fresh catch', 'Beachfront dining', 'Grilled jumbo prawns', 'Romantic setting'],
    created_by: 'admin',
  },
  {
    id: '7',
    slug: 'jetwing-beach',
    name: 'Jetwing Beach Hotel',
    description: 'A luxurious beachfront property in Negombo designed by the legendary architect Geoffrey Bawa. Offers stunning Indian Ocean views, a world-class spa, and exceptional dining.',
    category: 'stay',
    featured_image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=800&auto=format&fit=crop',
    images: ['https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=400&auto=format&fit=crop'],
    video_id: 'dQw4w9WgXcQ',
    best_time: 'December to April',
    location: 'Negombo',
    highlights: ['Beachfront pool', 'Ayurvedic spa', 'Geoffrey Bawa design', 'Fine dining'],
    created_by: 'admin',
  },
  {
    id: '8',
    slug: '98-acres-resort',
    name: '98 Acres Resort & Spa',
    description: 'An elegant, eco-friendly boutique hotel standing on a scenic 98-acre tea estate. Experience ultimate luxury in chalets made of recyclable materials with majestic views of Little Adams Peak.',
    category: 'stay',
    featured_image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=800&auto=format&fit=crop',
    images: ['https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=400&auto=format&fit=crop'],
    video_id: 'dQw4w9WgXcQ',
    best_time: 'February to June',
    location: 'Ella',
    highlights: ['Eco-luxury', 'Mountain views', 'Tea estate', 'Infinity pool'],
    created_by: 'admin',
  },
]

export async function seedDatabase() {
  console.log('Starting to seed database...')
  
  if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase environment variables. Please check your .env file.')
    return
  }

  try {
    for (const destination of destinationsToSeed) {
      console.log(`Upserting destination: ${destination.name}`)
      
      const { data, error } = await supabase
        .from('destinations')
        .upsert(destination, { onConflict: 'slug' })
      
      if (error) {
        console.error(`Error inserting ${destination.name}:`, error.message)
      } else {
        console.log(`Successfully seeded ${destination.name}`)
      }
    }
    console.log('Seeding complete!')
  } catch (error) {
    console.error('Unexpected error during seeding:', error)
  }
}

// Check if file is being run directly
if (typeof require !== 'undefined' && require.main === module) {
  seedDatabase()
}
