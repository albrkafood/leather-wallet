export type LeatherType = 
  | 'Full Grain Cowhide'
  | 'Top Grain Italian Calfskin'
  | 'Vintage Crazy Horse'
  | 'Saffiano Textured'
  | 'GG Canvas & Embossed Calfskin'
  | 'Full Grain Nappa';

export type WalletCategory = 
  | 'All'
  | 'Designer Inspired'
  | 'Bifold Wallets'
  | 'Minimalist Cardholders'
  | 'Executive & Passport'
  | 'RFID Smart Wallets'
  | 'Personalized Editions';

export type FoilType = 'Gold Foil' | 'Silver Foil' | 'Deep Blind Deboss';

export interface WalletProduct {
  id: string;
  name: string;
  category: WalletCategory;
  price: number; // in PKR
  originalPrice: number; // in PKR for discount tag
  rating: number;
  reviewsCount: number;
  isBestSeller?: boolean;
  isNewArrival?: boolean;
  tagline: string;
  description: string;
  leatherType: LeatherType;
  cardCapacity: string; // e.g. "8-12 Cards"
  hasRfidProtection: boolean;
  dimensions: string; // e.g. "11.5cm x 9cm x 1.5cm"
  colors: { name: string; hex: string; image: string }[];
  images: string[];
  features: string[];
  inStock: boolean;
}

export interface CartItem {
  product: WalletProduct;
  selectedColor: { name: string; hex: string; image: string };
  customInitials?: string;
  foilType?: FoilType;
  isGiftWrapped?: boolean;
  quantity: number;
}

export interface ShippingDetails {
  fullName: string;
  email: string;
  phone: string; // e.g. 03001234567
  address: string;
  nearestLandmark?: string;
  city: string;
  province: string;
  postalCode?: string;
  deliveryNotes?: string;
}

export type PaymentMethod = 'COD' | 'JazzCash' | 'EasyPaisa' | 'BankTransfer' | 'Card';

export interface Order {
  id: string; // e.g. LCPK-98231
  trackingNumber: string;
  createdAt: string;
  items: CartItem[];
  shipping: ShippingDetails;
  paymentMethod: PaymentMethod;
  subtotal: number;
  discount: number;
  giftWrapFee: number;
  deliveryFee: number;
  total: number;
  status: 'Order Placed' | 'Quality Check' | 'Dispatched via TCS' | 'Out for Delivery' | 'Delivered';
  estimatedDeliveryDate: string;
  courierName: string;
}

export interface CustomerReview {
  id: string;
  author: string;
  city: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
  productName: string;
  productId?: string;
  verifiedPurchase: boolean;
}
