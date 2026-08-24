export const AMENITIES_DATA = [
    // --- Transit (Bus, Auto, Train) ---
    {
      id: "a1",
      name: "Samayapuram Toll Plaza Bus Stop",
      type: "transit",
      subType: "Bus Stop",
      lat: 10.9520,
      lng: 78.7435,
      details: "Frequent town buses towards Chathiram Bus Stand & Central."
    },
    {
      id: "a2",
      name: "Irungalur Auto Stand",
      type: "transit",
      subType: "Auto Stand",
      lat: 10.9565,
      lng: 78.7405,
      details: "24/7 student auto stand for local transit."
    },
    {
      id: "a3",
      name: "Thuvakudi Bus Stop (NIT Gate)",
      type: "transit",
      subType: "Bus Stop",
      lat: 10.7578,
      lng: 78.8145,
      details: "Express & local buses connecting Tanjore Highway to Central Trichy."
    },
    {
      id: "a4",
      name: "Tiruchirappalli Junction (TPJ)",
      type: "transit",
      subType: "Railway Station",
      lat: 10.7932,
      lng: 78.6854,
      details: "Main railway junction connecting all state and interstate express trains."
    },
    {
      id: "a5",
      name: "Chathiram Bus Stand",
      type: "transit",
      subType: "Bus Terminal",
      lat: 10.8358,
      lng: 78.6940,
      details: "Primary north-bound bus terminus in Trichy."
    },
  
    // --- Food (Messes, Cloud Kitchens, Hotels) ---
    {
      id: "a6",
      name: "Annapoorna Student Mess & Meals",
      type: "food",
      subType: "Mess",
      lat: 10.9578,
      lng: 78.7425,
      details: "Monthly subscription meal plans (Veg & Non-Veg)."
    },
    {
      id: "a7",
      name: "Trichy Cloud Kitchen Hub",
      type: "food",
      subType: "Cloud Kitchen",
      lat: 10.8290,
      lng: 78.6890,
      details: "Late-night meal and tiffin delivery via Swiggy/Zomato."
    },
    {
      id: "a8",
      name: "Sri Krishna Bhavan Veg Hotel",
      type: "food",
      subType: "Restaurant",
      lat: 10.7595,
      lng: 78.8120,
      details: "Affordable South Indian breakfast and meals for students."
    },
    {
      id: "a9",
      name: "Campus Tiffin Center",
      type: "food",
      subType: "Mess",
      lat: 10.9590,
      lng: 78.7380,
      details: "Morning breakfast and home-style dinner packages."
    },
  
    // --- Laundry Services ---
    {
      id: "a10",
      name: "QuickWash Student Laundry & Ironing",
      type: "laundry",
      subType: "Laundromat",
      lat: 10.9560,
      lng: 78.7440,
      details: "Per-kilo washing, drying, and student discounts."
    },
    {
      id: "a11",
      name: "Sparkle Dry Cleaners & Express Wash",
      type: "laundry",
      subType: "Dry Cleaner",
      lat: 10.8270,
      lng: 78.6850,
      details: "Same-day ironing and monthly laundry pickup."
    },
    {
      id: "a12",
      name: "NIT Campus Area Express Laundry",
      type: "laundry",
      subType: "Laundromat",
      lat: 10.7600,
      lng: 78.8150,
      details: "Budget per-load washing and steam pressing."
    }
  ];
  
  // Helper: Haversine distance in kilometers
  export function calculateDistanceKm(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return parseFloat((R * c).toFixed(2));
  }