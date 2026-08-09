import { WalletProduct, CustomerReview } from '../types';
import bifoldImg from '../assets/images/bifold_wallet_thumb_1786252896356.jpg';

export const PAKISTAN_CITIES = [
  'Karachi',
  'Lahore',
  'Islamabad',
  'Rawalpindi',
  'Faisalabad',
  'Multan',
  'Peshawar',
  'Quetta',
  'Sialkot',
  'Gujranwala',
  'Hyderabad',
  'Sukkur',
  'Bahawalpur',
  'Abbottabad',
  'Sargodha',
  'Mardan',
  'Gilgit',
  'Mirpur (AJK)'
];

export const WALLET_PRODUCTS: WalletProduct[] = [
  // GUCCI INSPIRED / LUXURY COLLECTION LISTINGS
  {
    id: 'gucci-gg-supreme-bifold',
    name: 'Gucci GG Supreme Web Stripe Bifold',
    category: 'Designer Inspired',
    price: 4999,
    originalPrice: 6800,
    rating: 4.95,
    reviewsCount: 184,
    isBestSeller: true,
    isNewArrival: true,
    tagline: 'Signature Monogram GG Canvas with Iconic Green & Red Web Center Ribbon',
    description: 'Inspired by the timeless Italian heritage, this bifold features GG monogram canvas with genuine top-grain brown calfskin interior. Sized specifically to fit PKR 5,000 currency notes without folding, with 8 card slots and dual cash dividers.',
    leatherType: 'GG Canvas & Embossed Calfskin',
    cardCapacity: '8 Cards + 2 Hidden Pockets',
    hasRfidProtection: true,
    dimensions: '11.8 cm x 9.2 cm x 1.5 cm',
    colors: [
      { name: 'GG Beige & Web Stripe', hex: '#8B5A2B', image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?q=80&w=800&auto=format&fit=crop' },
      { name: 'Monochrome GG Black', hex: '#1C1C1C', image: 'https://images.unsplash.com/photo-1606503153255-59d8b8b82176?q=80&w=800&auto=format&fit=crop' }
    ],
    images: [
      'https://images.unsplash.com/photo-1627123424574-724758594e93?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1606503153255-59d8b8b82176?q=80&w=800&auto=format&fit=crop',
      bifoldImg
    ],
    features: [
      'GG Supreme Monogram Pattern Canvas Outer',
      'Iconic Red & Green Heritage Web Ribbon Stripe',
      '100% Top-Grain Italian Calfskin Interior Lining',
      'Dual Cash Slots Tailored for PKR Currency Notes',
      'Integrated High-Frequency RFID Shielding',
      'Includes Luxury Rigid Gift Box, Dust Bag & Authenticity Card'
    ],
    inStock: true
  },
  {
    id: 'gucci-gg-signature-bifold',
    name: 'Gucci Signature Monogram Embossed Bifold',
    category: 'Designer Inspired',
    price: 5499,
    originalPrice: 7500,
    rating: 4.9,
    reviewsCount: 129,
    isBestSeller: true,
    tagline: 'Deep Heat-Embossed GG Micro-Monogram on 100% Full-Grain Calfskin',
    description: 'For the subtle luxury connoisseur. Features deeply debossed GG insignia throughout the full exterior calfskin. Meticulously burnished and edge-finished by hand in Sialkot, with smooth nappa lining.',
    leatherType: 'Top Grain Italian Calfskin',
    cardCapacity: '10 Cards + 2 Cash Slots',
    hasRfidProtection: true,
    dimensions: '11.5 cm x 9.5 cm x 1.6 cm',
    colors: [
      { name: 'Embossed Midnight Black', hex: '#111111', image: 'https://images.unsplash.com/photo-1606503153255-59d8b8b82176?q=80&w=800&auto=format&fit=crop' },
      { name: 'Embossed Dark Espresso', hex: '#3B2314', image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=800&auto=format&fit=crop' }
    ],
    images: [
      'https://images.unsplash.com/photo-1606503153255-59d8b8b82176?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=800&auto=format&fit=crop'
    ],
    features: [
      'Full Exterior Thermal GG Debossed Pattern',
      'German Bonded Thread Double-Stitched Seams',
      'Extra Currency Depth for Large PKR Notes',
      'RFID Anti-Theft Metal Fiber Interlining',
      '100% Top-Grain Italian Calfskin Leather'
    ],
    inStock: true
  },
  {
    id: 'gucci-ophidia-cardholder',
    name: 'Gucci Ophidia Web Slim Card Case',
    category: 'Designer Inspired',
    price: 3250,
    originalPrice: 4500,
    rating: 4.88,
    reviewsCount: 110,
    isBestSeller: false,
    isNewArrival: true,
    tagline: 'Front-Pocket GG Canvas Card Case with Web Stripe & Gold Double G Emblem',
    description: 'Ultra-compact front-pocket card case featuring GG monogram canvas, central Web stripe, and antiqued gold Double G hardware accent. Holds 5 essential cards plus folded cash in the center slot.',
    leatherType: 'GG Canvas & Embossed Calfskin',
    cardCapacity: '5 Credit Cards + Center Cash Sleeve',
    hasRfidProtection: true,
    dimensions: '10.0 cm x 7.0 cm x 0.5 cm',
    colors: [
      { name: 'GG Beige / Green-Red Web', hex: '#A0522D', image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=800&auto=format&fit=crop' },
      { name: 'GG Black / Blue-Red Web', hex: '#1C1C1C', image: 'https://images.unsplash.com/photo-1606503153255-59d8b8b82176?q=80&w=800&auto=format&fit=crop' }
    ],
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1606503153255-59d8b8b82176?q=80&w=800&auto=format&fit=crop'
    ],
    features: [
      'GG Canvas Outer Sleeve with Oval GG Medallion',
      'Signature Central Web Ribbon Accent',
      '4 Outer Slots + 1 Center Pocket for Folded PKR Bills',
      'Ultra-Slim 5mm Thickness for Front Pocket Comfort',
      'RFID Blocking Shield for ATM/Credit Cards'
    ],
    inStock: true
  },
  {
    id: 'gucci-marmont-zip-around',
    name: 'Gucci Marmont Matelassé Zip-Around Wallet',
    category: 'Designer Inspired',
    price: 6999,
    originalPrice: 9500,
    rating: 4.96,
    reviewsCount: 87,
    isBestSeller: true,
    tagline: 'Chevron Quilted Italian Leather with Antiqued Brass Double G Motif',
    description: 'Extravagant chevron-quilted leather zip-around organizer with a smooth YKK antique gold zipper. Features 12 card slots, 3 cash compartments, and a zippered coin pocket for total convenience.',
    leatherType: 'Full Grain Nappa',
    cardCapacity: '12 Cards + Coin Zip + Phone Sleeve',
    hasRfidProtection: true,
    dimensions: '19.5 cm x 10.5 cm x 2.5 cm',
    colors: [
      { name: 'Matelassé Nero Black', hex: '#111111', image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=800&auto=format&fit=crop' },
      { name: 'Matelassé Dusty Rose', hex: '#D2B48C', image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=800&auto=format&fit=crop' }
    ],
    images: [
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=800&auto=format&fit=crop'
    ],
    features: [
      'Chevron Quilted Italian Nappa Calfskin',
      'Antiqued Brass GG Emblem Accent',
      '12 Credit Card Sleeves + Zippered Coin Pocket',
      'Accordion Cash Chambers Holding Up To Rs. 200,000 Cash',
      'Heavy-duty Smooth YKK Brass Zipper'
    ],
    inStock: true
  },
  {
    id: 'gucci-horsebit-bifold',
    name: 'Gucci Horsebit 1955 Italian Leather Bifold',
    category: 'Designer Inspired',
    price: 5850,
    originalPrice: 7900,
    rating: 4.9,
    reviewsCount: 62,
    isNewArrival: true,
    tagline: 'Equestrian Heritage Golden Horsebit Hardware on Smooth Calfskin',
    description: 'Celebrating vintage equestrian aesthetics, the Horsebit 1955 bifold combines hand-burnished brown calfskin with a solid brass horsebit motif on the front flap closure.',
    leatherType: 'Top Grain Italian Calfskin',
    cardCapacity: '8 Cards + Coin Pouch',
    hasRfidProtection: true,
    dimensions: '11.0 cm x 9.5 cm x 2.0 cm',
    colors: [
      { name: 'Vintage Horsebit Brown', hex: '#5C4033', image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=800&auto=format&fit=crop' },
      { name: 'Classic Ebony Black', hex: '#1C1C1C', image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?q=80&w=800&auto=format&fit=crop' }
    ],
    images: [
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1627123424574-724758594e93?q=80&w=800&auto=format&fit=crop'
    ],
    features: [
      'Solid Brass Horsebit Hardware Detail',
      'Snap-Button Coin & Key Compartment',
      'Dual Length Currency Slots for PKR Notes',
      'Hand-burnished Beveled Edges',
      'RFID Secure Lining'
    ],
    inStock: true
  },
  {
    id: 'gucci-neo-classic-executive',
    name: 'Gucci Neo Classic Long Envelope Organizer',
    category: 'Designer Inspired',
    price: 7999,
    originalPrice: 10800,
    rating: 4.97,
    reviewsCount: 94,
    isBestSeller: true,
    tagline: 'Full Executive GG Supreme Passport, Phone & Currency Travel Wallet',
    description: 'The definitive executive wallet for business travels across Pakistan and abroad. Fits Pakistani passport, checkbook, smartphone up to 6.7 inches, and 14 cards securely.',
    leatherType: 'GG Canvas & Embossed Calfskin',
    cardCapacity: '14 Cards + Passport & Phone Slot',
    hasRfidProtection: true,
    dimensions: '20.5 cm x 11.5 cm x 2.8 cm',
    colors: [
      { name: 'Monogram Beige & Ebony', hex: '#8B5A2B', image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=800&auto=format&fit=crop' },
      { name: 'Monogram Onyx Black', hex: '#111111', image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?q=80&w=800&auto=format&fit=crop' }
    ],
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1627123424574-724758594e93?q=80&w=800&auto=format&fit=crop'
    ],
    features: [
      'GG Supreme Coated Water-Resistant Canvas',
      'Dedicated Passport & Flight Boarding Pass Sleeve',
      '14 Card Sleeves + Zippered Coin Vault',
      'Detachable Genuine Leather Wristlet Strap',
      'Gift Box with Certificate of Authenticity'
    ],
    inStock: true
  },
  {
    id: 'gucci-kingsnake-bifold',
    name: 'Gucci Kingsnake Monogram Graphic Bifold',
    category: 'Designer Inspired',
    price: 5200,
    originalPrice: 7000,
    rating: 4.87,
    reviewsCount: 78,
    tagline: 'Artisan Printed Coiled Kingsnake Motif on GG Supreme Canvas',
    description: 'A striking statement piece featuring the iconic Kingsnake graphic printed across GG Supreme monogram canvas. Finished with smooth dark calfskin interior and gold foil logo stamping.',
    leatherType: 'GG Canvas & Embossed Calfskin',
    cardCapacity: '8 Cards + 2 Cash Slots',
    hasRfidProtection: true,
    dimensions: '11.8 cm x 9.2 cm x 1.5 cm',
    colors: [
      { name: 'GG Supreme / Kingsnake Red', hex: '#A52A2A', image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?q=80&w=800&auto=format&fit=crop' }
    ],
    images: [
      'https://images.unsplash.com/photo-1627123424574-724758594e93?q=80&w=800&auto=format&fit=crop',
      bifoldImg
    ],
    features: [
      'Vibrant UV-Cured Kingsnake Artwork',
      'GG Supreme Canvas with Leather Interior',
      'Dual Cash Slots fitting PKR 1,000 and PKR 5,000 notes',
      'RFID Shielding Layer'
    ],
    inStock: true
  },

  // ORIGINAL ATELIER ZAR CLASSICS
  {
    id: 'sovereign-bifold',
    name: 'The Sovereign Italian Bifold',
    category: 'Bifold Wallets',
    price: 5499,
    originalPrice: 7200,
    rating: 4.9,
    reviewsCount: 142,
    isBestSeller: true,
    tagline: 'Handcrafted Italian Calfskin with Dual Currency Compartments & RFID Shield',
    description: 'The Sovereign is crafted for the distinguished gentleman in Pakistan. Made from top-grain Italian calfskin that develops a rich patina over time. Designed specifically with extra height to comfortably accommodate large Pakistani Rupee currency notes without creasing.',
    leatherType: 'Top Grain Italian Calfskin',
    cardCapacity: '8-12 Cards + 2 Hidden Slots',
    hasRfidProtection: true,
    dimensions: '11.8 cm x 9.2 cm x 1.6 cm',
    colors: [
      { name: 'Vintage Mahogany Tan', hex: '#8B4513', image: bifoldImg },
      { name: 'Midnight Obsidian Black', hex: '#1C1C1C', image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?q=80&w=800&auto=format&fit=crop' },
      { name: 'Dark Chestnut Brown', hex: '#4A2E1A', image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=800&auto=format&fit=crop' }
    ],
    images: [
      bifoldImg,
      'https://images.unsplash.com/photo-1627123424574-724758594e93?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=800&auto=format&fit=crop'
    ],
    features: [
      '100% Top Grain Italian Calfskin Leather',
      'RFID Blocking Shielding Layer against Digital Theft',
      'Dual Bill Compartments tailored for PKR Notes',
      '8 Precision Stitched Card Slots + Quick Access ID Window',
      'Reinforced German Polyester Thread Stitching',
      'Includes Luxury Matte Packaging Gift Box & Certificate of Authenticity'
    ],
    inStock: true
  },
  {
    id: 'obsidian-smart-cardholder',
    name: 'The Obsidian Pop-Up RFID Vault',
    category: 'RFID Smart Wallets',
    price: 3499,
    originalPrice: 4800,
    rating: 4.8,
    reviewsCount: 98,
    isBestSeller: true,
    tagline: 'Minimalist Aerospace Aluminum Core with Full-Grain Leather Outer Sleeve',
    description: 'Engineered for sleek modern living. Push the ergonomic side-trigger and your bank cards slide out smoothly in a cascading view. Wrapped in oil-waxed full-grain cowhide with a dedicated cash clip for PKR currency notes.',
    leatherType: 'Full Grain Cowhide',
    cardCapacity: '6 Cards in Vault + 4 Outer Slots',
    hasRfidProtection: true,
    dimensions: '10.2 cm x 6.5 cm x 1.8 cm',
    colors: [
      { name: 'Matte Obsidian Black', hex: '#111111', image: 'https://images.unsplash.com/photo-1606503153255-59d8b8b82176?q=80&w=800&auto=format&fit=crop' },
      { name: 'Saddle Tan Brown', hex: '#A0522D', image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?q=80&w=800&auto=format&fit=crop' }
    ],
    images: [
      'https://images.unsplash.com/photo-1606503153255-59d8b8b82176?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1627123424574-724758594e93?q=80&w=800&auto=format&fit=crop'
    ],
    features: [
      'Aerospace Grade Aluminum RFID Anti-Scanning Chamber',
      'One-Touch Smooth Ejection Mechanism',
      'Cash Strap for Folded PKR Notes & CNIC',
      'Ultra Slim Profile for Front Pocket Comfort',
      '1-Year Mechanism Replacement Guarantee'
    ],
    inStock: true
  },
  {
    id: 'monarch-executive-zipper',
    name: 'The Monarch Long Executive Wallet',
    category: 'Executive & Passport',
    price: 7999,
    originalPrice: 10500,
    rating: 4.95,
    reviewsCount: 76,
    tagline: 'Spacious Zipper Wallet for Passport, Smartphone, Cards & Business Notes',
    description: 'The ultimate accessory for executives and international travelers. Holds up to 16 cards, Pakistani passport, smartphone (up to 6.7"), pen, and full currency bundles safely sealed with a smooth YKK brass zipper.',
    leatherType: 'Full Grain Cowhide',
    cardCapacity: '16 Cards + Passport & Phone Slot',
    hasRfidProtection: true,
    dimensions: '20.5 cm x 11.0 cm x 2.5 cm',
    colors: [
      { name: 'Royal Espresso Brown', hex: '#2B1B17', image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=800&auto=format&fit=crop' },
      { name: 'Classic Black Saffiano', hex: '#1C1C1C', image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?q=80&w=800&auto=format&fit=crop' }
    ],
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1627123424574-724758594e93?q=80&w=800&auto=format&fit=crop'
    ],
    features: [
      'Japanese YKK Antiqued Brass Zipper',
      'Holds Passport, CNIC, Smartphone & Checkbook',
      '16 Card Sleeves + Zippered Coin & Receipt Pouch',
      'Detachable Hand Wristlet Strap Included',
      'Handcrafted by Master Leather Artisans in Sialkot'
    ],
    inStock: true
  },
  {
    id: 'artisan-crazy-horse-bifold',
    name: 'The Artisan Vintage Bifold',
    category: 'Personalized Editions',
    price: 4850,
    originalPrice: 6500,
    rating: 4.85,
    reviewsCount: 112,
    isBestSeller: true,
    tagline: 'Distressed Vintage Leather with Hand-Waxed Finish & Dual Cash Divider',
    description: 'Each Artisan Bifold tells its own unique story. Made from Crazy Horse pull-up leather that absorbs natural oils from your hands, developing character scratches and a dark lustrous tone over time.',
    leatherType: 'Vintage Crazy Horse',
    cardCapacity: '6-10 Cards + Cash Divider',
    hasRfidProtection: true,
    dimensions: '11.5 cm x 9.0 cm x 1.5 cm',
    colors: [
      { name: 'Distressed Rustic Brown', hex: '#654321', image: bifoldImg },
      { name: 'Tobacco Olive Brown', hex: '#556B2F', image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=800&auto=format&fit=crop' }
    ],
    images: [
      bifoldImg,
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=800&auto=format&fit=crop'
    ],
    features: [
      'Natural Crazy Horse Pull-Up Raw Leather finish',
      'Hand-waxed edges for water resistance',
      'Dual Cash dividers fitting PKR 5,000 notes',
      'Ideal gift for Eid, Weddings & Corporate Recognition',
      '100% Genuine Handcrafted Pakistani Leather'
    ],
    inStock: true
  },
  {
    id: 'heritage-passport-companion',
    name: 'The Heritage Passport Travel Organizer',
    category: 'Executive & Passport',
    price: 8499,
    originalPrice: 11000,
    rating: 4.9,
    reviewsCount: 45,
    tagline: 'Full-Grain Italian Leather Travel Wallet with SIM Card Holder & Boarding Pass Pocket',
    description: 'Travel in luxury whether flying from Islamabad to London or Karachi to Dubai. Features quick-access passport sleeve, ticket holder, SIM card slot, ejector pin slot, and RFID shield for total travel peace of mind.',
    leatherType: 'Top Grain Italian Calfskin',
    cardCapacity: '10 Cards + Passport & SIM Holder',
    hasRfidProtection: true,
    dimensions: '14.5 cm x 10.5 cm x 1.8 cm',
    colors: [
      { name: 'Royal Emerald Navy', hex: '#002366', image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=800&auto=format&fit=crop' },
      { name: 'Midnight Black', hex: '#111111', image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?q=80&w=800&auto=format&fit=crop' }
    ],
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1627123424574-724758594e93?q=80&w=800&auto=format&fit=crop'
    ],
    features: [
      'Dedicated Passport Sleeve & Boarding Pass Pocket',
      'Integrated Micro-SIM Card Holder & Ejector Pin slot',
      'RFID 13.56 MHz High-Frequency Shield',
      'Full Grain Smooth Nappa Leather Lining',
      'Includes Rigid Executive Gift Box & Warranty Card'
    ],
    inStock: true
  },
  {
    id: 'minimalist-saffiano-cardholder',
    name: 'The Saffiano Slim Card Case',
    category: 'Minimalist Cardholders',
    price: 2850,
    originalPrice: 3999,
    rating: 4.75,
    reviewsCount: 88,
    tagline: 'Cross-Hatch Textured Water Resistant Saffiano Leather for Front Pocket Carry',
    description: 'Saffiano leather is celebrated worldwide for its scratch and water resistance. Designed for those who carry only essential cards and a few folded cash bills in a ultra-slim front pocket layout.',
    leatherType: 'Saffiano Textured',
    cardCapacity: '6 Cards + Central Cash Pocket',
    hasRfidProtection: true,
    dimensions: '10.0 cm x 7.5 cm x 0.4 cm',
    colors: [
      { name: 'Charcoal Black', hex: '#222222', image: 'https://images.unsplash.com/photo-1606503153255-59d8b8b82176?q=80&w=800&auto=format&fit=crop' },
      { name: 'Cognac Gold Brown', hex: '#B8860B', image: bifoldImg }
    ],
    images: [
      'https://images.unsplash.com/photo-1606503153255-59d8b8b82176?q=80&w=800&auto=format&fit=crop',
      bifoldImg
    ],
    features: [
      'Scratch & Stain Resistant Saffiano Pattern',
      'Ultra-thin 4mm Thickness',
      'Center Sleeve for Folded PKR Bills',
      'RFID Safe Card Slots'
    ],
    inStock: true
  }
];

export const CUSTOMER_REVIEWS: CustomerReview[] = [
  {
    id: 'rev-1',
    author: 'Hamza Rizwan',
    city: 'Lahore (Defence Phase 5)',
    rating: 5,
    date: '3 days ago',
    title: 'Incredible Gucci GG Supreme Finish & Fast TCS COD!',
    comment: 'Ordered the Gucci GG Supreme Web Stripe Bifold. Received it via TCS in 2 days in Lahore. The GG monogram canvas and interior calfskin quality are world-class!',
    productName: 'Gucci GG Supreme Web Stripe Bifold',
    productId: 'gucci-gg-supreme-bifold',
    verifiedPurchase: true
  },
  {
    id: 'rev-2',
    author: 'Dr. Shahbaz Ahmed',
    city: 'Karachi (Clifton)',
    rating: 5,
    date: '1 week ago',
    title: 'Luxury Box & Perfect Designer Look',
    comment: 'I bought the Gucci Marmont Zip-Around Wallet for my wife and the Neo Classic Long Organizer for myself. Paid Cash on Delivery in Karachi. The magnetic gift boxes and authenticity certificate cards feel like Rs. 100,000+ designer boutique packaging!',
    productName: 'Gucci Marmont Zip-Around Wallet',
    productId: 'gucci-marmont-zip-around',
    verifiedPurchase: true
  },
  {
    id: 'rev-3',
    author: 'Bilal Chaudhry',
    city: 'Islamabad (F-7/2)',
    rating: 5,
    date: '2 weeks ago',
    title: 'Ophidia Card Case fits front pocket nicely!',
    comment: 'The Gucci Ophidia Web Slim Card Case has crisp GG canvas detail and the web stripe looks super sharp. Fits easily into my blazer pocket.',
    productName: 'Gucci Ophidia Web Slim Card Case',
    productId: 'gucci-ophidia-cardholder',
    verifiedPurchase: true
  },
  {
    id: 'rev-4',
    author: 'Usman Ali Sial',
    city: 'Multan',
    rating: 5,
    date: '3 weeks ago',
    title: 'GG Embossed Leather is 10/10',
    comment: 'The heat-embossed micro-monogram on the Gucci Signature bifold is deep and clean. Smells like genuine high-grade Italian leather.',
    productName: 'Gucci Signature Monogram Embossed Bifold',
    productId: 'gucci-gg-signature-bifold',
    verifiedPurchase: true
  },
  {
    id: 'rev-5',
    author: 'Aamir Farooq',
    city: 'Rawalpindi (Bahria Town)',
    rating: 5,
    date: '4 days ago',
    title: 'Fits PKR 5000 notes comfortably',
    comment: 'Most imported wallets are too small for 5000 Rupee notes. The Sovereign Italian Bifold is tailored perfectly with extra currency depth. Outstanding quality!',
    productName: 'The Sovereign Italian Bifold',
    productId: 'sovereign-bifold',
    verifiedPurchase: true
  },
  {
    id: 'rev-6',
    author: 'Zainab Faisal',
    city: 'Peshawar',
    rating: 5,
    date: '5 days ago',
    title: 'Pop-Up card ejector is smooth as butter',
    comment: 'Purchased The Obsidian Pop-Up RFID Vault for my husband. The side trigger mechanism ejects all 6 bank cards smoothly without scratching. Very premium metal build!',
    productName: 'The Obsidian Pop-Up RFID Vault',
    productId: 'obsidian-smart-cardholder',
    verifiedPurchase: true
  },
  {
    id: 'rev-7',
    author: 'Kashif Mehmood',
    city: 'Faisalabad',
    rating: 5,
    date: '2 weeks ago',
    title: 'Gold Horsebit detail looks super classy',
    comment: 'The Gucci Horsebit 1955 Bifold hardware feels solid and heavy. Has a nice snap button pocket inside for coins too.',
    productName: 'Gucci Horsebit 1955 Italian Leather Bifold',
    productId: 'gucci-horsebit-bifold',
    verifiedPurchase: true
  },
  {
    id: 'rev-8',
    author: 'Tariq Jameel',
    city: 'Sialkot',
    rating: 5,
    date: '1 month ago',
    title: 'Fits passport, phone, and cash for flight travel',
    comment: 'The Neo Classic Long Envelope Organizer held my Pakistani Passport, flight tickets, and iPhone during my Dubai trip. Unmatched convenience!',
    productName: 'Gucci Neo Classic Long Envelope Organizer',
    productId: 'gucci-neo-classic-executive',
    verifiedPurchase: true
  }
];
