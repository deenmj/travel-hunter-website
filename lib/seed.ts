import { createClient } from '@supabase/supabase-js'

// Note: To run this script, you would typically use a tool like ts-node
// Example: npx ts-node lib/seed.ts

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

const supabase = createClient(supabaseUrl, supabaseKey)

const destinationsToSeed = [
  {
    slug: 'sigiriya-rock-fortress',
    name: 'Sigiriya Rock Fortress',
    description: 'An ancient palace and fortress complex carved into a massive column of rock. Known as the Eighth Wonder of the World by locals, it offers breathtaking views and features ancient frescoes.',
    category: 'visit',
    featured_image: 'https://upload.wikimedia.org/wikipedia/commons/4/4c/Beauty_of_Sigiriya_by_Buddhika_Upahal.jpg',
    images: ['https://upload.wikimedia.org/wikipedia/commons/4/4c/Beauty_of_Sigiriya_by_Buddhika_Upahal.jpg'],
    video_id: 'wM3j0P1iI9w',
    best_time: 'January to April',
    location: 'Central Province',
    highlights: ['Ancient ruins', 'Panoramic views', 'Mirror wall frescoes', 'Lion Paws'],
    is_top_pick: true,
    created_by: 'admin',
  },
  {
    slug: 'galle-fort',
    name: 'Galle Dutch Fort',
    description: 'A beautifully preserved colonial-era fort on the southwest coast. Wander through cobblestone streets, boutique shops, and cafes while watching stunning sunsets from the ramparts.',
    category: 'visit',
    featured_image: 'https://upload.wikimedia.org/wikipedia/commons/5/5e/Galle_Fort_Lighthouse_01.jpg',
    images: ['https://upload.wikimedia.org/wikipedia/commons/5/5e/Galle_Fort_Lighthouse_01.jpg'],
    video_id: 'qKqg5vP_6A0',
    best_time: 'December to March',
    location: 'Southern Province',
    highlights: ['Colonial architecture', 'Lighthouse', 'Boutique shopping', 'Sunset walks'],
    is_top_pick: true,
    created_by: 'admin',
  },
  {
    slug: 'nine-arch-bridge',
    name: 'Nine Arch Bridge',
    description: 'A spectacular colonial-era railway bridge hidden deep in the jungle. An iconic spot for photography, especially when the iconic blue train passes through the misty mountains of Ella.',
    category: 'visit',
    featured_image: 'https://upload.wikimedia.org/wikipedia/commons/e/e7/Nine_Arches_Bridge%2C_Demodara.jpg',
    images: ['https://upload.wikimedia.org/wikipedia/commons/e/e7/Nine_Arches_Bridge%2C_Demodara.jpg'],
    video_id: 'V1bFr2SWP1I',
    best_time: 'January to May',
    location: 'Ella, Uva Province',
    highlights: ['Jungle trek', 'Photography', 'Historic railway', 'Scenic views'],
    created_by: 'admin',
  },
  {
    slug: 'yala-national-park',
    name: 'Yala National Park',
    description: 'The most famous wildlife park in Sri Lanka, offering the highest leopard density in the world. Embark on a thrilling safari to spot elephants, sloth bears, and diverse birdlife.',
    category: 'visit',
    featured_image: 'https://upload.wikimedia.org/wikipedia/commons/6/69/Sri_Lankan_Leopard_in_Yala_National_Park.jpg',
    images: ['https://upload.wikimedia.org/wikipedia/commons/6/69/Sri_Lankan_Leopard_in_Yala_National_Park.jpg'],
    video_id: 'tNxg7Z5kH7U',
    best_time: 'February to July',
    location: 'Southern Province',
    highlights: ['Leopard spotting', 'Jeep safari', 'Wild elephants', 'Nature photography'],
    is_top_pick: true,
    created_by: 'admin',
  },
  {
    slug: 'galle-face-street-food',
    name: 'Galle Face Green Street Food',
    description: 'Experience the bustling heart of Colombo at sunset. The promenade comes alive with dozens of food carts offering spicy isso vadei (prawn fritters), kottu roti, and local sweets.',
    category: 'eat',
    featured_image: 'https://upload.wikimedia.org/wikipedia/commons/4/4b/Galle_Face_Green_Colombo.jpg',
    images: ['https://upload.wikimedia.org/wikipedia/commons/4/4b/Galle_Face_Green_Colombo.jpg'],
    video_id: 'dQw4w9WgXcQ',
    best_time: 'Year-round (Evenings)',
    location: 'Colombo',
    highlights: ['Isso Vadei', 'Ocean views', 'Local atmosphere', 'Affordable eats'],
    created_by: 'admin',
  },
  {
    slug: 'mirissa-seafood',
    name: 'Mirissa Beach Seafood',
    description: 'Dine right on the sand under fairy lights. Mirissa beach is famous for its massive displays of freshly caught seafood that you can pick and have grilled to order.',
    category: 'eat',
    featured_image: 'https://upload.wikimedia.org/wikipedia/commons/8/87/Mirissa_Beach_Sri_Lanka.jpg',
    images: ['https://upload.wikimedia.org/wikipedia/commons/8/87/Mirissa_Beach_Sri_Lanka.jpg'],
    video_id: 'dQw4w9WgXcQ',
    best_time: 'November to April',
    location: 'Mirissa',
    highlights: ['Fresh catch', 'Beachfront dining', 'Grilled jumbo prawns', 'Romantic setting'],
    created_by: 'admin',
  },
  {
    slug: 'jetwing-beach',
    name: 'Jetwing Beach Hotel',
    description: 'A luxurious beachfront property in Negombo designed by the legendary architect Geoffrey Bawa. Offers stunning Indian Ocean views, a world-class spa, and exceptional dining.',
    category: 'stay',
    featured_image: 'https://upload.wikimedia.org/wikipedia/commons/9/91/Negombo_beach.jpg',
    images: ['https://upload.wikimedia.org/wikipedia/commons/9/91/Negombo_beach.jpg'],
    video_id: 'dQw4w9WgXcQ',
    best_time: 'December to April',
    location: 'Negombo',
    highlights: ['Beachfront pool', 'Ayurvedic spa', 'Geoffrey Bawa design', 'Fine dining'],
    created_by: 'admin',
  },
  {
    slug: '98-acres-resort',
    name: '98 Acres Resort & Spa',
    description: 'An elegant, eco-friendly boutique hotel standing on a scenic 98-acre tea estate. Experience ultimate luxury in chalets made of recyclable materials with majestic views of Little Adams Peak.',
    category: 'stay',
    featured_image: 'https://upload.wikimedia.org/wikipedia/commons/3/30/Ella_Rock_Sri_Lanka.jpg',
    images: ['https://upload.wikimedia.org/wikipedia/commons/3/30/Ella_Rock_Sri_Lanka.jpg'],
    video_id: 'dQw4w9WgXcQ',
    best_time: 'February to June',
    location: 'Ella',
    highlights: ['Eco-luxury', 'Mountain views', 'Tea estate', 'Infinity pool'],
    is_top_pick: true,
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
