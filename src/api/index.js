// All API functions live here
// Currently returns hardcoded dummy data
// TODO: replace with real PHP backend calls

const BASE_URL = "http://localhost/wandernepal/api";

export const destinations = [
  {
    id: 1,
    name: "Everest Base Camp",
    region: "Koshi",
    category: "Trekking",
    description: "Journey to the foot of the world's highest mountain through stunning Sherpa villages and monasteries. A once in a lifetime experience with breathtaking Himalayan views.",
    image: "https://images.pexels.com/photos/14981339/pexels-photo-14981339.jpeg",
    avgRating: 4.9,
    mapLat: 28.0027,
    mapLng: 86.8528,
    reviews: [
      { id: 1, user: "Sarah Johnson", country: "United States", rating: 5, comment: "The Everest Base Camp trek was absolutely life-changing! Our guide was knowledgeable and the entire experience was well-organized." },
      { id: 2, user: "Michael Patel", country: "United Kingdom", rating: 5, comment: "Incredible journey through the Himalayas. Views were stunning and the local hospitality was amazing." },
    ]
  },
  {
    id: 2,
    name: "Pokhara Valley",
    region: "Gandaki",
    category: "Scenic",
    description: "Nestled beside the serene Phewa Lake with panoramic views of the Annapurna range. Pokhara is Nepal's adventure capital offering paragliding, boating, and trekking.",
    image: "https://images.pexels.com/photos/35917999/pexels-photo-35917999.jpeg",
    avgRating: 4.7,
    mapLat: 28.2096,
    mapLng: 83.9856,
    reviews: [
      { id: 3, user: "Emma Kim", country: "Australia", rating: 5, comment: "Pokhara is absolutely beautiful. The lake views and mountain backdrop are unlike anything I've seen." },
    ]
  },
  {
    id: 3,
    name: "Annapurna Circuit",
    region: "Gandaki",
    category: "Trekking",
    description: "One of the world's classic treks, circling the Annapurna massif through diverse landscapes from subtropical forests to alpine meadows and high mountain passes.",
    image: "https://images.pexels.com/photos/13041045/pexels-photo-13041045.jpeg",
    avgRating: 2.8,
    mapLat: 28.5967,
    mapLng: 83.8209,
    reviews: []
  },
  {
    id: 4,
    name: "Kathmandu",
    region: "Bagmati",
    category: "Cultural",
    description: "Nepal's vibrant capital filled with ancient temples, UNESCO World Heritage Sites, bustling markets, and rich Newari culture. The gateway to the Himalayas.",
    image: "https://images.pexels.com/photos/19835039/pexels-photo-19835039.jpeg",
    avgRating: 4.5,
    mapLat: 27.7172,
    mapLng: 85.3240,
    reviews: [
      { id: 4, user: "Liu Wei", country: "China", rating: 4, comment: "Kathmandu is a fascinating city. The temples and culture are incredible, though it can be quite busy." },
    ]
  },
  {
    id: 5,
    name: "Chitwan National Park",
    region: "Bagmati",
    category: "Wildlife",
    description: "Nepal's first national park and UNESCO World Heritage Site. Home to one-horned rhinos, Bengal tigers, elephants, and hundreds of bird species.",
    image: "https://images.unsplash.com/photo-1549366021-9f761d450615?w=800&q=80",
    avgRating: 4.6,
    mapLat: 27.5291,
    mapLng: 84.3542,
    reviews: []
  },
];

export const packages = [
  {
    id: 1,
    destinationId: 1,
    title: "Everest Base Camp Trek",
    duration: 14,
    maxPeople: 12,
    price: 1499,
    difficulty: "Challenging",
    image: "https://images.pexels.com/photos/28625167/pexels-photo-28625167.jpeg",
    description: "Journey to the base of the world's highest mountain through stunning Sherpa villages and monasteries.",
    inclusions: ["Airport transfers", "Accommodation (tea houses)", "All meals", "Experienced guide", "Porter", "Permits & fees", "First aid kit"],
    itinerary: [
      { day: 1, title: "Arrive Kathmandu", activities: "Airport pickup, hotel check-in, trip briefing, welcome dinner" },
      { day: 2, title: "Fly to Lukla", activities: "Scenic flight to Lukla (2,860m), trek to Phakding (2,610m)" },
      { day: 3, title: "Trek to Namche Bazaar", activities: "Trek through pine forests to Namche Bazaar (3,440m)" },
      { day: 4, title: "Acclimatization Day", activities: "Rest day in Namche, optional hike to Everest View Hotel" },
      { day: 5, title: "Trek to Tengboche", activities: "Trek to Tengboche (3,860m), visit famous monastery" },
      { day: 6, title: "Trek to Dingboche", activities: "Trek through Pangboche to Dingboche (4,360m)" },
      { day: 7, title: "Acclimatization Day", activities: "Rest day in Dingboche, short hike for altitude adaptation" },
      { day: 8, title: "Trek to Lobuche", activities: "Trek to Lobuche (4,940m) passing Thukla pass memorial" },
      { day: 9, title: "Everest Base Camp", activities: "Trek to Gorak Shep, hike to Everest Base Camp (5,364m)" },
      { day: 10, title: "Kala Patthar", activities: "Early morning hike to Kala Patthar (5,545m) for sunrise views" },
      { day: 11, title: "Trek down to Namche", activities: "Descend back to Namche Bazaar" },
      { day: 12, title: "Trek to Lukla", activities: "Final trek back to Lukla, farewell dinner" },
      { day: 13, title: "Fly to Kathmandu", activities: "Morning flight back to Kathmandu, free afternoon" },
      { day: 14, title: "Departure", activities: "Airport transfer, trip ends" },
    ]
  },
  {
    id: 2,
    destinationId: 3,
    title: "Annapurna Sanctuary Trek",
    duration: 10,
    maxPeople: 10,
    price: 1199,
    difficulty: "Moderate",
    image: "https://images.pexels.com/photos/29494791/pexels-photo-29494791.jpeg",
    description: "Experience diverse landscapes from subtropical forests to alpine meadows in the Annapurna range.",
    inclusions: ["Airport transfers", "Tea house accommodation", "All meals on trek", "Licensed guide", "Porter", "ACAP permit", "TIMS card"],
    itinerary: [
      { day: 1, title: "Arrive Pokhara", activities: "Transfer to Pokhara, briefing and rest" },
      { day: 2, title: "Trek to Tikhedhunga", activities: "Drive to Nayapul, begin trek to Tikhedhunga (1,540m)" },
      { day: 3, title: "Trek to Ghorepani", activities: "Climb stone steps to Ghorepani (2,860m)" },
      { day: 4, title: "Poon Hill Sunrise", activities: "Early hike to Poon Hill (3,210m), trek to Tadapani" },
      { day: 5, title: "Trek to Chhomrong", activities: "Descend to Chhomrong (2,170m), gateway to sanctuary" },
      { day: 6, title: "Trek to Dovan", activities: "Enter bamboo forests, trek to Dovan (2,600m)" },
      { day: 7, title: "Annapurna Base Camp", activities: "Trek through Machhapuchhre Base Camp to ABC (4,130m)" },
      { day: 8, title: "Explore Base Camp", activities: "Sunrise at ABC, surrounded by Annapurna massif" },
      { day: 9, title: "Descend to Jhinu", activities: "Descend to Jhinu Danda, natural hot springs" },
      { day: 10, title: "Return to Pokhara", activities: "Trek out, drive back to Pokhara, trip ends" },
    ]
  },
  {
    id: 3,
    destinationId: 4,
    title: "Kathmandu Valley Culture Tour",
    duration: 7,
    maxPeople: 15,
    price: 799,
    difficulty: "Easy",
    image: "https://images.pexels.com/photos/35227654/pexels-photo-35227654.jpeg",
    description: "Explore ancient temples, UNESCO heritage sites, and experience authentic Nepali culture.",
    inclusions: ["Hotel accommodation", "Daily breakfast", "Private vehicle", "Expert guide", "All entrance fees", "Welcome dinner"],
    itinerary: [
      { day: 1, title: "Arrive Kathmandu", activities: "Airport pickup, hotel check-in, Thamel orientation walk" },
      { day: 2, title: "Pashupatinath & Boudhanath", activities: "Visit sacred Hindu temple and giant Buddhist stupa" },
      { day: 3, title: "Swayambhunath & Durbar Square", activities: "Monkey Temple, Kathmandu Durbar Square UNESCO site" },
      { day: 4, title: "Patan & Bhaktapur", activities: "Medieval cities with fine Newari architecture and temples" },
      { day: 5, title: "Nagarkot Sunrise", activities: "Day trip to Nagarkot for Himalayan panorama views" },
      { day: 6, title: "Cooking Class & Market", activities: "Local market visit, traditional Nepali cooking class" },
      { day: 7, title: "Departure", activities: "Morning free, airport transfer" },
    ]
  },
  {
    id: 4,
    destinationId: 5,
    title: "Chitwan Wildlife Safari",
    duration: 4,
    maxPeople: 8,
    price: 599,
    difficulty: "Easy",
    image: "https://images.unsplash.com/photo-1549366021-9f761d450615?w=800&q=80",
    description: "Explore Nepal's premier national park on jeep safari, elephant-back, and canoe rides.",
    inclusions: ["Resort accommodation", "All meals", "Jeep safari", "Canoe ride", "Nature walk", "Cultural program", "Park fees"],
    itinerary: [
      { day: 1, title: "Arrive Chitwan", activities: "Transfer from Kathmandu, welcome briefing, evening cultural show" },
      { day: 2, title: "Jeep Safari", activities: "Morning jeep safari, rhino and elephant spotting, bird watching" },
      { day: 3, title: "Canoe & Nature Walk", activities: "Canoe ride on Rapti River, jungle nature walk with naturalist" },
      { day: 4, title: "Return to Kathmandu", activities: "Morning elephant bathing, transfer back to Kathmandu" },
    ]
  },
];

export const reviews = [
  { id: 1, user: "Sarah Johnson", country: "United States", rating: 5, comment: "The Everest Base Camp trek was absolutely life-changing! Our guide was knowledgeable and the entire experience was well-organized. I can't recommend WanderNepal enough!", destination: "Everest Base Camp" },
  { id: 2, user: "Michael Patel", country: "United Kingdom", rating: 5, comment: "Incredible journey through the Annapurna region. The views were stunning and the local hospitality was amazing. This trip exceeded all my expectations!", destination: "Annapurna Circuit" },
  { id: 3, user: "Emma Kim", country: "Australia", rating: 5, comment: "The cultural tour in Kathmandu Valley was fascinating. We learned so much about Nepali history and traditions. Perfect for first-time visitors to Nepal!", destination: "Kathmandu" },
];

// API functions — later replace
export const getDestinations = async () => destinations;
export const getDestinationById = async (id) => destinations.find(d => d.id === parseInt(id));
export const getPackages = async () => packages;
export const getPackageById = async (id) => packages.find(p => p.id === parseInt(id));
export const getReviews = async () => reviews;

export const createBooking = async (bookingData) => {
  // TODO: POST to PHP backend
  const bookingId = `WN-2025-${String(Math.floor(Math.random() * 9000) + 1000)}`;
  return { success: true, bookingId, ...bookingData };
};

export const submitReview = async (reviewData) => {
  // TODO: POST to PHP backend
  return { success: true, ...reviewData };
};
