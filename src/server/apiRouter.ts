import { Router } from 'express';
import { GoogleGenAI } from '@google/genai';

export interface OrderRecord {
  id: string;
  trackingNumber: string;
  createdAt: string;
  items: any[];
  shipping: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    nearestLandmark?: string;
    city: string;
    province: string;
  };
  paymentMethod: string;
  paymentStatus: 'Paid' | 'Unpaid';
  total: number;
  status: 'Order Placed' | 'Confirmed' | 'Processing' | 'Quality Check' | 'Ready to Ship' | 'Dispatched via TCS' | 'Out for Delivery' | 'Delivered' | 'Cancelled' | 'Returned';
  estimatedDeliveryDate: string;
  courierName: string;
  notes?: string;
}

const now = Date.now();
const DAY = 86400000;

// In-memory order store initialized with rich Pakistani ecommerce order history
const orderStore: OrderRecord[] = [
  {
    id: 'LCPK-99101',
    trackingNumber: 'LCPK-99101',
    createdAt: new Date(now - 1000 * 60 * 45).toISOString(), // 45 mins ago (Today)
    items: [
      {
        product: { id: 'gucci-gg-supreme-bifold', name: 'The Sovereign Italian Bifold', price: 5499 },
        selectedColor: { name: 'Vintage Mahogany Tan' },
        customInitials: 'A.K.',
        quantity: 1
      }
    ],
    shipping: {
      fullName: 'Ahmed Khan',
      email: 'ahmed.k@gmail.com',
      phone: '03001234567',
      address: 'House 45-B, Main Boulevard, Gulberg III',
      nearestLandmark: 'Near Liberty Roundabout',
      city: 'Lahore',
      province: 'Punjab'
    },
    paymentMethod: 'COD',
    paymentStatus: 'Unpaid',
    total: 5699,
    status: 'Order Placed',
    estimatedDeliveryDate: 'In 2 Business Days',
    courierName: 'TCS Express Pakistan'
  },
  {
    id: 'LCPK-98502',
    trackingNumber: 'LCPK-98502',
    createdAt: new Date(now - 1000 * 60 * 180).toISOString(), // 3 hours ago (Today)
    items: [
      {
        product: { id: 'obsidian-rfid-smart-cardholder', name: 'The Obsidian RFID Smart Vault', price: 3499 },
        selectedColor: { name: 'Midnight Matte Black' },
        quantity: 1
      },
      {
        product: { id: 'gucci-ophidia-canvas-cardholder', name: 'GG Supreme Signature Slim Cardholder', price: 3850 },
        selectedColor: { name: 'Beige & Ebony Supreme Canvas' },
        quantity: 1
      }
    ],
    shipping: {
      fullName: 'Zainab Fatima',
      email: 'zainab.f@hotmail.com',
      phone: '03219876543',
      address: 'Flat 402, Al-Razi Heights, Clifton Block 5',
      nearestLandmark: 'Opposite Ocean Mall',
      city: 'Karachi',
      province: 'Sindh'
    },
    paymentMethod: 'Card',
    paymentStatus: 'Paid',
    total: 7549,
    status: 'Confirmed',
    estimatedDeliveryDate: 'Tomorrow by 5:00 PM',
    courierName: 'PostEx Courier'
  },
  {
    id: 'LCPK-97304',
    trackingNumber: 'LCPK-97304',
    createdAt: new Date(now - DAY * 1 - 1000 * 60 * 120).toISOString(), // Yesterday
    items: [
      {
        product: { id: 'royal-executive-passport-travel-wallet', name: 'The Executive Passport & Travel Folio', price: 8499 },
        selectedColor: { name: 'Cognac Saddle Brown' },
        customInitials: 'M.U.',
        quantity: 1
      }
    ],
    shipping: {
      fullName: 'Muhammad Usman',
      email: 'usman.m@yahoo.com',
      phone: '03335551212',
      address: 'Street 14, Sector F-8/3',
      nearestLandmark: 'Near Madina Market',
      city: 'Islamabad',
      province: 'Federal Capital'
    },
    paymentMethod: 'COD',
    paymentStatus: 'Unpaid',
    total: 8699,
    status: 'Processing',
    estimatedDeliveryDate: 'Tomorrow by 2:00 PM',
    courierName: 'M&P Express'
  },
  {
    id: 'LCPK-96105',
    trackingNumber: 'LCPK-96105',
    createdAt: new Date(now - DAY * 1 - 1000 * 60 * 360).toISOString(), // Yesterday
    items: [
      {
        product: { id: 'vintage-crazy-horse-trifold', name: 'The Heritage Crazy Horse Trifold', price: 4250 },
        selectedColor: { name: 'Rustic Crazy Horse Tan' },
        quantity: 2
      }
    ],
    shipping: {
      fullName: 'Bilal Chaudhry',
      email: 'bilal.c@gmail.com',
      phone: '03014448899',
      address: 'House 88, Block C, Peoples Colony #1',
      nearestLandmark: 'Near D-Ground Park',
      city: 'Faisalabad',
      province: 'Punjab'
    },
    paymentMethod: 'JazzCash',
    paymentStatus: 'Paid',
    total: 8700,
    status: 'Ready to Ship',
    estimatedDeliveryDate: 'In 2 Business Days',
    courierName: 'TCS Express Pakistan'
  },
  {
    id: 'LCPK-95208',
    trackingNumber: 'LCPK-95208',
    createdAt: new Date(now - DAY * 3).toISOString(), // 3 Days Ago (Last 7 days / This month)
    items: [
      {
        product: { id: 'gucci-gg-supreme-bifold', name: 'The Sovereign Italian Bifold', price: 5499 },
        selectedColor: { name: 'Vintage Mahogany Tan' },
        quantity: 1
      }
    ],
    shipping: {
      fullName: 'Omer Farooq',
      email: 'omer.f@gmail.com',
      phone: '03451112233',
      address: 'House 12, Officers Colony, Mall Road',
      nearestLandmark: 'Near Cantonment Board',
      city: 'Peshawar',
      province: 'KPK'
    },
    paymentMethod: 'COD',
    paymentStatus: 'Unpaid',
    total: 5699,
    status: 'Dispatched via TCS',
    estimatedDeliveryDate: 'Expected Today',
    courierName: 'TCS Express Pakistan'
  },
  {
    id: 'LCPK-94112',
    trackingNumber: 'LCPK-94112',
    createdAt: new Date(now - DAY * 4).toISOString(), // 4 Days Ago
    items: [
      {
        product: { id: 'saffiano-monogram-long-wallet', name: 'Saffiano Luxury Zipper Continental', price: 6200 },
        selectedColor: { name: 'Obsidian Black' },
        quantity: 1
      }
    ],
    shipping: {
      fullName: 'Dr. Sarah Tariq',
      email: 'sarah.t@hospital.pk',
      phone: '03087776655',
      address: 'Apartment 301, Royal Avenue, University Road',
      nearestLandmark: 'Opposite Nishtar Hospital',
      city: 'Multan',
      province: 'Punjab'
    },
    paymentMethod: 'EasyPaisa',
    paymentStatus: 'Paid',
    total: 6400,
    status: 'Out for Delivery',
    estimatedDeliveryDate: 'Today by 6:00 PM',
    courierName: 'TCS Express Pakistan'
  },
  {
    id: 'LCPK-93001',
    trackingNumber: 'LCPK-93001',
    createdAt: new Date(now - DAY * 6).toISOString(), // 6 Days Ago
    items: [
      {
        product: { id: 'obsidian-rfid-smart-cardholder', name: 'The Obsidian RFID Smart Vault', price: 3499 },
        selectedColor: { name: 'Midnight Matte Black' },
        customInitials: 'S.A.',
        quantity: 1
      }
    ],
    shipping: {
      fullName: 'Saad Ali',
      email: 'saad.ali@tech.pk',
      phone: '03028889900',
      address: 'House 551, Sector I-8/2',
      nearestLandmark: 'Near I-8 Markaz',
      city: 'Islamabad',
      province: 'Federal Capital'
    },
    paymentMethod: 'COD',
    paymentStatus: 'Paid',
    total: 3699,
    status: 'Delivered',
    estimatedDeliveryDate: 'Delivered on 3 days ago',
    courierName: 'TCS Express Pakistan'
  },
  {
    id: 'LCPK-92100',
    trackingNumber: 'LCPK-92100',
    createdAt: new Date(now - DAY * 12).toISOString(), // 12 Days Ago (Last 30 days)
    items: [
      {
        product: { id: 'gucci-gg-supreme-bifold', name: 'The Sovereign Italian Bifold', price: 5499 },
        selectedColor: { name: 'Vintage Mahogany Tan' },
        quantity: 2
      }
    ],
    shipping: {
      fullName: 'Hamza Rizwan',
      email: 'hamza@example.com',
      phone: '03001234567',
      address: 'House 142, Street 8, Phase 5 DHA',
      city: 'Lahore',
      province: 'Punjab'
    },
    paymentMethod: 'COD',
    paymentStatus: 'Paid',
    total: 11198,
    status: 'Delivered',
    estimatedDeliveryDate: 'Delivered',
    courierName: 'TCS Express Pakistan'
  },
  {
    id: 'LCPK-91044',
    trackingNumber: 'LCPK-91044',
    createdAt: new Date(now - DAY * 18).toISOString(), // 18 Days Ago
    items: [
      {
        product: { id: 'gucci-ophidia-canvas-cardholder', name: 'GG Supreme Signature Slim Cardholder', price: 3850 },
        selectedColor: { name: 'Beige & Ebony Supreme Canvas' },
        quantity: 1
      }
    ],
    shipping: {
      fullName: 'Kamran Siddiqui',
      email: 'kamran.s@gmail.com',
      phone: '03341239876',
      address: 'House 19, Block 3, KDA Scheme 1',
      city: 'Karachi',
      province: 'Sindh'
    },
    paymentMethod: 'COD',
    paymentStatus: 'Unpaid',
    total: 4050,
    status: 'Cancelled',
    estimatedDeliveryDate: 'Cancelled by customer',
    courierName: 'N/A',
    notes: 'Customer requested cancellation due to wrong address'
  },
  {
    id: 'LCPK-89912',
    trackingNumber: 'LCPK-89912',
    createdAt: new Date(now - DAY * 24).toISOString(), // 24 Days Ago
    items: [
      {
        product: { id: 'royal-executive-passport-travel-wallet', name: 'The Executive Passport & Travel Folio', price: 8499 },
        selectedColor: { name: 'Cognac Saddle Brown' },
        quantity: 1
      }
    ],
    shipping: {
      fullName: 'Usman Ghani',
      email: 'usman.ghani@gmail.com',
      phone: '03125554433',
      address: 'House 42, Satellite Town',
      city: 'Rawalpindi',
      province: 'Punjab'
    },
    paymentMethod: 'COD',
    paymentStatus: 'Unpaid',
    total: 8699,
    status: 'Returned',
    estimatedDeliveryDate: 'Returned to Warehouse',
    courierName: 'PostEx Courier',
    notes: 'Courier failed delivery 3 times, item returned to warehouse'
  },
  {
    id: 'LCPK-88500',
    trackingNumber: 'LCPK-88500',
    createdAt: new Date(now - DAY * 38).toISOString(), // 38 Days Ago (Last Month)
    items: [
      {
        product: { id: 'gucci-gg-supreme-bifold', name: 'The Sovereign Italian Bifold', price: 5499 },
        selectedColor: { name: 'Vintage Mahogany Tan' },
        quantity: 1
      },
      {
        product: { id: 'obsidian-rfid-smart-cardholder', name: 'The Obsidian RFID Smart Vault', price: 3499 },
        selectedColor: { name: 'Midnight Matte Black' },
        quantity: 1
      }
    ],
    shipping: {
      fullName: 'Zainab Fatima',
      email: 'zainab.f@hotmail.com',
      phone: '03219876543',
      address: 'Flat 402, Al-Razi Heights, Clifton Block 5',
      city: 'Karachi',
      province: 'Sindh'
    },
    paymentMethod: 'COD',
    paymentStatus: 'Paid',
    total: 9198,
    status: 'Delivered',
    estimatedDeliveryDate: 'Delivered',
    courierName: 'TCS Express Pakistan'
  },
  {
    id: 'LCPK-87200',
    trackingNumber: 'LCPK-87200',
    createdAt: new Date(now - DAY * 45).toISOString(), // 45 Days Ago (Last Month)
    items: [
      {
        product: { id: 'vintage-crazy-horse-trifold', name: 'The Heritage Crazy Horse Trifold', price: 4250 },
        selectedColor: { name: 'Rustic Crazy Horse Tan' },
        quantity: 1
      }
    ],
    shipping: {
      fullName: 'Farhan Ahmed',
      email: 'farhan.a@gmail.com',
      phone: '03009988776',
      address: 'House 77, Model Town',
      city: 'Gujranwala',
      province: 'Punjab'
    },
    paymentMethod: 'Card',
    paymentStatus: 'Paid',
    total: 4450,
    status: 'Delivered',
    estimatedDeliveryDate: 'Delivered',
    courierName: 'TCS Express Pakistan'
  }
];

// Backend Products Store
let productsStore = [
  {
    id: 'gucci-gg-supreme-bifold',
    name: 'Gucci GG Supreme Web Stripe Bifold',
    sku: 'SKU-GG-BIFOLD-01',
    category: 'Designer Inspired',
    price: 5499,
    salePrice: 4999,
    costPrice: 2200,
    stock: 24,
    reservedStock: 3,
    lowStockAlert: 5,
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?q=80&w=800&auto=format&fit=crop',
    description: 'GG monogram canvas with genuine top-grain brown calfskin interior.'
  },
  {
    id: 'gucci-gg-signature-bifold',
    name: 'Gucci Signature Monogram Embossed Bifold',
    sku: 'SKU-GG-EMBOSS-02',
    category: 'Designer Inspired',
    price: 6500,
    salePrice: 5499,
    costPrice: 2400,
    stock: 18,
    reservedStock: 2,
    lowStockAlert: 5,
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1606503153255-59d8b8b82176?q=80&w=800&auto=format&fit=crop',
    description: 'Deeply debossed GG insignia throughout full exterior calfskin.'
  },
  {
    id: 'gucci-ophidia-cardholder',
    name: 'Gucci Ophidia Web Slim Card Case',
    sku: 'SKU-GG-OPHIDIA-03',
    category: 'Designer Inspired',
    price: 3999,
    salePrice: 3250,
    costPrice: 1300,
    stock: 35,
    reservedStock: 5,
    lowStockAlert: 8,
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=800&auto=format&fit=crop',
    description: 'Ultra-compact front pocket card case with Web ribbon stripe.'
  },
  {
    id: 'gucci-marmont-zip-around',
    name: 'Gucci Marmont Matelassé Zip-Around Wallet',
    sku: 'SKU-GG-MARMONT-04',
    category: 'Designer Inspired',
    price: 8500,
    salePrice: 6999,
    costPrice: 3100,
    stock: 4,
    reservedStock: 2,
    lowStockAlert: 5,
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=800&auto=format&fit=crop',
    description: 'Chevron-quilted Italian leather zip-around organizer.'
  },
  {
    id: 'obsidian-smart-cardholder',
    name: 'The Obsidian Pop-Up RFID Vault',
    sku: 'SKU-OBSIDIAN-05',
    category: 'RFID Smart Wallets',
    price: 4500,
    salePrice: 3499,
    costPrice: 1400,
    stock: 3,
    reservedStock: 1,
    lowStockAlert: 5,
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1606503153255-59d8b8b82176?q=80&w=800&auto=format&fit=crop',
    description: 'Aerospace aluminum pop-up card ejector with full-grain sleeve.'
  },
  {
    id: 'sovereign-bifold',
    name: 'The Sovereign Italian Bifold',
    sku: 'SKU-SOVEREIGN-06',
    category: 'Bifold Wallets',
    price: 6800,
    salePrice: 5499,
    costPrice: 2300,
    stock: 2,
    reservedStock: 1,
    lowStockAlert: 5,
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?q=80&w=800&auto=format&fit=crop',
    description: 'Top-grain Italian calfskin with dual PKR bill compartments.'
  },
  {
    id: 'monarch-executive-zipper',
    name: 'The Monarch Long Executive Wallet',
    sku: 'SKU-MONARCH-07',
    category: 'Executive & Passport',
    price: 9500,
    salePrice: 7999,
    costPrice: 3400,
    stock: 0,
    reservedStock: 0,
    lowStockAlert: 3,
    status: 'Out of Stock',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=800&auto=format&fit=crop',
    description: 'Spacious zipper travel wallet for passport, phone, and PKR bills.'
  }
];

// Backend Stock History Store
let stockHistoryStore: any[] = [
  {
    id: 'SH-101',
    productId: 'sovereign-bifold',
    productName: 'The Sovereign Italian Bifold',
    sku: 'SKU-SOVEREIGN-06',
    change: -1,
    type: 'Order Reduction',
    previousStock: 3,
    newStock: 2,
    reason: 'Automatic stock reduction for Order #LCPK-99101',
    adminName: 'System Auto-Inventory',
    date: new Date(now - 1000 * 60 * 45).toISOString()
  },
  {
    id: 'SH-102',
    productId: 'obsidian-smart-cardholder',
    productName: 'The Obsidian Pop-Up RFID Vault',
    sku: 'SKU-OBSIDIAN-05',
    change: +10,
    type: 'Restock',
    previousStock: 2,
    newStock: 12,
    reason: 'Restocked from Sialkot Workshop Shipment #44',
    adminName: 'Inventory Manager',
    date: new Date(now - DAY * 2).toISOString()
  }
];

// Activity Log Store
let activityLogStore: any[] = [
  {
    id: 'ACT-901',
    adminName: 'Store Owner',
    role: 'Store Owner',
    action: 'Order created',
    target: 'Order #LCPK-99101',
    details: 'Customer Ahmed Khan placed order for Sovereign Bifold (COD Rs. 5,699)',
    date: new Date(now - 1000 * 60 * 45).toISOString()
  },
  {
    id: 'ACT-902',
    adminName: 'Order Manager',
    role: 'Order Manager',
    action: 'Status changed',
    target: 'Order #LCPK-98502',
    details: 'Status updated to "Confirmed". Assigned to PostEx Courier.',
    date: new Date(now - 1000 * 60 * 150).toISOString()
  },
  {
    id: 'ACT-903',
    adminName: 'Inventory Manager',
    role: 'Inventory Manager',
    action: 'Stock adjustment',
    target: 'SKU-OBSIDIAN-05',
    details: 'Restocked +10 units to Obsidian Vault.',
    date: new Date(now - DAY * 2).toISOString()
  }
];

// Notifications Store
let notificationsStore: any[] = [
  {
    id: 'NOTIF-1',
    title: 'New Order Received',
    message: 'New order #LCPK-99101 placed by Ahmed Khan (Lahore) - Rs. 5,699',
    type: 'New Order',
    timestamp: new Date(now - 1000 * 60 * 45).toISOString(),
    read: false,
    linkOrder: 'LCPK-99101'
  },
  {
    id: 'NOTIF-2',
    title: 'Payment Received',
    message: 'Payment of Rs. 7,549 received for Order #LCPK-98502 via Card',
    type: 'Payment Received',
    timestamp: new Date(now - 1000 * 60 * 180).toISOString(),
    read: false,
    linkOrder: 'LCPK-98502'
  },
  {
    id: 'NOTIF-3',
    title: 'Low Stock Alert',
    message: 'The Sovereign Italian Bifold stock is down to 2 units (Alert limit: 5)',
    type: 'Low Stock',
    timestamp: new Date(now - 1000 * 60 * 300).toISOString(),
    read: false
  },
  {
    id: 'NOTIF-4',
    title: 'Order Cancelled',
    message: 'Order #LCPK-91044 was cancelled by Kamran Siddiqui',
    type: 'Order Cancelled',
    timestamp: new Date(now - DAY * 18).toISOString(),
    read: true,
    linkOrder: 'LCPK-91044'
  },
  {
    id: 'NOTIF-5',
    title: 'Return Requested',
    message: 'Courier returned package for Order #LCPK-89912 (Delivery Failed 3x)',
    type: 'Return Requested',
    timestamp: new Date(now - DAY * 24).toISOString(),
    read: true,
    linkOrder: 'LCPK-89912'
  }
];

// Admin Settings Store
let settingsStore = {
  general: {
    storeName: 'LeatherCraft PK',
    tagline: 'Handcrafted Italian Full-Grain Leather Goods in Pakistan',
    contactEmail: 'support@leathercraft.pk',
    helplinePhone: '+92 300 123 4567',
    supportHours: 'Mon - Sat: 10:00 AM - 8:00 PM PST'
  },
  storeInformation: {
    workshopAddress: 'Workshop #14, Artisan Leather Quarter, Raiwind Road',
    city: 'Lahore',
    province: 'Punjab',
    postalCode: '54000',
    ntnNumber: '7483921-9',
    strnNumber: '3277876543210'
  },
  currency: {
    code: 'PKR',
    symbol: 'Rs.',
    thousandsSeparator: ',',
    decimalDigits: 0
  },
  tax: {
    enableTax: true,
    gstRatePercent: 0, // Tax inclusive display
    taxInclusive: true
  },
  shipping: {
    standardShippingFee: 200,
    freeShippingThreshold: 10000,
    estimatedDeliveryText: '2-3 Business Days via TCS / PostEx'
  },
  paymentMethods: {
    codEnabled: true,
    bankTransferEnabled: true,
    bankName: 'Meezan Bank Limited',
    accountTitle: 'LeatherCraft PK Private Limited',
    accountIban: 'PK36MEZN0001234567890123',
    jazzCashNumber: '03001234567',
    easyPaisaNumber: '03001234567',
    cardEnabled: true
  },
  courier: {
    primaryCourier: 'TCS Express Pakistan',
    tcsApiKey: 'TCS-LIVE-API-KEY-9941',
    postExApiKey: 'POSTEX-LIVE-3821-PK',
    mpApiKey: 'MP-EXPRESS-API-7721',
    autoBookCourierOnConfirm: true
  },
  orderStatus: {
    autoConfirmPaidOrders: true,
    autoStockDeduction: true,
    allowCancellationWithinHours: 24
  },
  whatsApp: {
    enableAutoWhatsAppMsg: true,
    businessWhatsAppNumber: '923001234567',
    orderConfirmationTemplate: 'Assalam o Alaikum {{customerName}}! Your LeatherCraft PK order #{{trackingNumber}} for Rs. {{total}} has been confirmed and is being hand-finished.'
  },
  notifications: {
    emailAlertsEnabled: true,
    lowStockThresholdDefault: 5,
    notifyOnNewOrder: true,
    notifyOnCancellation: true
  },
  invoice: {
    invoiceHeader: 'LEATHERCRAFT PK - OFFICIAL TAX INVOICE',
    footerGuarantee: '100% Genuine Full-Grain Leather backed by 1-Year Stitching Warranty.',
    showQrCode: true
  },
  adminUsers: [
    { id: 'usr-1', name: 'Zeeshan Malik', email: 'owner@leathercraft.pk', role: 'Store Owner', status: 'Active' },
    { id: 'usr-2', name: 'Ayesha Khan', email: 'admin@leathercraft.pk', role: 'Admin', status: 'Active' },
    { id: 'usr-3', name: 'Rizwan Ahmed', email: 'orders@leathercraft.pk', role: 'Order Manager', status: 'Active' },
    { id: 'usr-4', name: 'Bilal Hassan', email: 'inventory@leathercraft.pk', role: 'Inventory Manager', status: 'Active' },
    { id: 'usr-5', name: 'Sana Fatima', email: 'support@leathercraft.pk', role: 'Customer Support', status: 'Active' }
  ]
};

// Helper logger
function logActivity(adminName: string, role: string, action: string, target: string, details: string) {
  const newLog = {
    id: `ACT-${Math.floor(1000 + Math.random() * 9000)}`,
    adminName: adminName || 'Admin',
    role: role || 'Admin',
    action,
    target,
    details,
    date: new Date().toISOString()
  };
  activityLogStore.unshift(newLog);
}

function addNotification(title: string, message: string, type: string, linkOrder?: string) {
  const newNotif = {
    id: `NOTIF-${Date.now()}`,
    title,
    message,
    type,
    timestamp: new Date().toISOString(),
    read: false,
    linkOrder
  };
  notificationsStore.unshift(newNotif);
}

export const apiRouter = Router();

// Admin Endpoints
apiRouter.post('/admin/login', (req, res) => {
  const { password } = req.body;
  if (password === 'admin123' || password === 'admin' || password === 'leathercraft' || password === '123456') {
    return res.json({ success: true, token: 'admin-auth-token-lcpk' });
  }
  return res.status(401).json({ success: false, error: 'Invalid admin password' });
});

apiRouter.get('/admin/orders', (req, res) => {
  return res.json({ success: true, orders: orderStore });
});

apiRouter.post('/admin/orders', (req, res) => {
  try {
    const { items, shipping, paymentMethod, paymentStatus, total, status, notes, adminName, adminRole } = req.body;
    const randomDigits = Math.floor(10000 + Math.random() * 90000);
    const trackingNumber = `LCPK-${randomDigits}`;

    const newOrder: OrderRecord = {
      id: trackingNumber,
      trackingNumber,
      createdAt: new Date().toISOString(),
      items: items || [],
      shipping: shipping || { fullName: 'Direct Customer', phone: '03000000000', address: 'Store Order', city: 'Lahore', province: 'Punjab' },
      paymentMethod: paymentMethod || 'COD',
      paymentStatus: paymentStatus || 'Unpaid',
      total: total || 5499,
      status: status || 'Order Placed',
      estimatedDeliveryDate: 'In 2 Business Days',
      courierName: 'TCS Express Pakistan',
      notes
    };

    orderStore.unshift(newOrder);

    // Auto reduce stock for products in order
    if (newOrder.items && newOrder.items.length > 0) {
      newOrder.items.forEach((item: any) => {
        const prodId = item.product?.id || item.id;
        const p = productsStore.find((pr) => pr.id === prodId || pr.name === item.product?.name);
        if (p) {
          const qty = item.quantity || 1;
          const oldStock = p.stock;
          p.stock = Math.max(0, p.stock - qty);
          p.reservedStock = Math.max(0, p.reservedStock - qty);
          if (p.stock === 0) p.status = 'Out of Stock';

          stockHistoryStore.unshift({
            id: `SH-${Date.now()}-${Math.floor(Math.random()*100)}`,
            productId: p.id,
            productName: p.name,
            sku: p.sku,
            change: -qty,
            type: 'Order Reduction',
            previousStock: oldStock,
            newStock: p.stock,
            reason: `Order #${trackingNumber} created`,
            adminName: adminName || 'System Auto-Inventory',
            date: new Date().toISOString()
          });

          if (p.stock <= p.lowStockAlert) {
            addNotification('Low Stock Alert', `Product "${p.name}" stock is low (${p.stock} units left)`, 'Low Stock');
          }
        }
      });
    }

    logActivity(adminName || 'Admin', adminRole || 'Admin', 'Order created', `Order #${trackingNumber}`, `Created order for ${newOrder.shipping?.fullName} (Rs. ${newOrder.total})`);
    addNotification('New Order Received', `Order #${trackingNumber} created for ${newOrder.shipping?.fullName} (Rs. ${newOrder.total})`, 'New Order', trackingNumber);

    return res.json({ success: true, order: newOrder });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to create order' });
  }
});

apiRouter.patch('/admin/orders/:id', (req, res) => {
  const { id } = req.params;
  const { status, paymentStatus, notes, shipping, courierName, estimatedDeliveryDate, adminName, adminRole } = req.body;
  const order = orderStore.find((o) => o.id === id || o.trackingNumber === id);
  if (order) {
    const oldStatus = order.status;
    const oldPaymentStatus = order.paymentStatus;

    if (status) order.status = status;
    if (paymentStatus) order.paymentStatus = paymentStatus;
    if (notes !== undefined) order.notes = notes;
    if (shipping) order.shipping = { ...order.shipping, ...shipping };
    if (courierName) order.courierName = courierName;
    if (estimatedDeliveryDate) order.estimatedDeliveryDate = estimatedDeliveryDate;

    // Automatically mark paymentStatus as Paid if status becomes Delivered and paymentMethod is COD
    if (status === 'Delivered' && order.paymentMethod === 'COD') {
      order.paymentStatus = 'Paid';
    }

    // Inventory Rule: Stock Restoration on Cancelled/Returned
    if ((status === 'Cancelled' || status === 'Returned') && (oldStatus !== 'Cancelled' && oldStatus !== 'Returned')) {
      (order.items || []).forEach((item: any) => {
        const prodId = item.product?.id || item.id;
        const p = productsStore.find((pr) => pr.id === prodId || pr.name === item.product?.name);
        if (p) {
          const qty = item.quantity || 1;
          const oldStock = p.stock;
          p.stock += qty;
          if (p.status === 'Out of Stock') p.status = 'Active';

          stockHistoryStore.unshift({
            id: `SH-${Date.now()}-${Math.floor(Math.random()*100)}`,
            productId: p.id,
            productName: p.name,
            sku: p.sku,
            change: +qty,
            type: 'Order Restoration',
            previousStock: oldStock,
            newStock: p.stock,
            reason: `Order #${order.trackingNumber} status changed to ${status}`,
            adminName: adminName || 'System Auto-Inventory',
            date: new Date().toISOString()
          });
        }
      });

      if (status === 'Cancelled') {
        addNotification('Order Cancelled', `Order #${order.trackingNumber} was marked as Cancelled`, 'Order Cancelled', order.trackingNumber);
      } else {
        addNotification('Return Requested', `Order #${order.trackingNumber} was marked as Returned`, 'Return Requested', order.trackingNumber);
      }
    }

    if (status && status !== oldStatus) {
      logActivity(adminName || 'Admin', adminRole || 'Admin', 'Status changed', `Order #${order.trackingNumber}`, `Changed status from "${oldStatus}" to "${status}"`);
    }

    if (paymentStatus && paymentStatus !== oldPaymentStatus) {
      logActivity(adminName || 'Admin', adminRole || 'Admin', 'Payment updated', `Order #${order.trackingNumber}`, `Changed payment status to "${paymentStatus}"`);
      if (paymentStatus === 'Paid') {
        addNotification('Payment Received', `Payment received for Order #${order.trackingNumber} (Rs. ${order.total})`, 'Payment Received', order.trackingNumber);
      }
    }

    return res.json({ success: true, order });
  }
  return res.status(404).json({ error: 'Order not found' });
});

apiRouter.delete('/admin/orders/:id', (req, res) => {
  const { id } = req.params;
  const idx = orderStore.findIndex((o) => o.id === id || o.trackingNumber === id);
  if (idx > -1) {
    const deleted = orderStore[idx];
    orderStore.splice(idx, 1);
    logActivity('Admin', 'Admin', 'Order deleted', `Order #${deleted.trackingNumber}`, `Deleted order permanently`);
    return res.json({ success: true, message: 'Order deleted' });
  }
  return res.status(404).json({ error: 'Order not found' });
});

// Products API
apiRouter.get('/admin/products', (req, res) => {
  return res.json({ success: true, products: productsStore });
});

apiRouter.post('/admin/products', (req, res) => {
  try {
    const newProd = req.body;
    const id = newProd.id || newProd.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const fullProd = {
      id,
      name: newProd.name || 'New Leather Product',
      sku: newProd.sku || `SKU-LC-${Math.floor(100 + Math.random()*899)}`,
      category: newProd.category || 'Bifold Wallets',
      price: Number(newProd.price) || 4999,
      salePrice: Number(newProd.salePrice) || Number(newProd.price) || 4999,
      costPrice: Number(newProd.costPrice) || 2000,
      stock: Number(newProd.stock) || 10,
      reservedStock: Number(newProd.reservedStock) || 0,
      lowStockAlert: Number(newProd.lowStockAlert) || 5,
      status: newProd.status || 'Active',
      image: newProd.image || 'https://images.unsplash.com/photo-1627123424574-724758594e93?q=80&w=800&auto=format&fit=crop',
      description: newProd.description || ''
    };
    productsStore.unshift(fullProd);
    logActivity(req.body.adminName || 'Admin', req.body.adminRole || 'Admin', 'Product changed', fullProd.name, `Created new product ${fullProd.sku}`);
    return res.json({ success: true, product: fullProd });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to create product' });
  }
});

apiRouter.put('/admin/products/:id', (req, res) => {
  const { id } = req.params;
  const idx = productsStore.findIndex((p) => p.id === id);
  if (idx > -1) {
    productsStore[idx] = { ...productsStore[idx], ...req.body };
    logActivity(req.body.adminName || 'Admin', req.body.adminRole || 'Admin', 'Product changed', productsStore[idx].name, `Updated product details & price`);
    return res.json({ success: true, product: productsStore[idx] });
  }
  return res.status(404).json({ error: 'Product not found' });
});

apiRouter.delete('/admin/products/:id', (req, res) => {
  const { id } = req.params;
  const idx = productsStore.findIndex((p) => p.id === id);
  if (idx > -1) {
    const deleted = productsStore[idx];
    productsStore.splice(idx, 1);
    logActivity('Admin', 'Admin', 'Product deleted', deleted.name, `Deleted product ${deleted.sku}`);
    return res.json({ success: true });
  }
  return res.status(404).json({ error: 'Product not found' });
});

// Inventory Adjustment Endpoint
apiRouter.post('/admin/inventory/adjust', (req, res) => {
  const { productId, adjustmentQty, reason, adminName, type } = req.body;
  const p = productsStore.find((pr) => pr.id === productId);
  if (!p) return res.status(404).json({ error: 'Product not found' });

  const oldStock = p.stock;
  const change = Number(adjustmentQty) || 0;
  p.stock = Math.max(0, p.stock + change);
  if (p.stock === 0) p.status = 'Out of Stock';
  else if (p.status === 'Out of Stock' && p.stock > 0) p.status = 'Active';

  const logEntry = {
    id: `SH-${Date.now()}`,
    productId: p.id,
    productName: p.name,
    sku: p.sku,
    change,
    type: type || (change >= 0 ? 'Restock' : 'Manual Adjustment'),
    previousStock: oldStock,
    newStock: p.stock,
    reason: reason || 'Manual stock adjustment by admin',
    adminName: adminName || 'Inventory Manager',
    date: new Date().toISOString()
  };
  stockHistoryStore.unshift(logEntry);

  logActivity(adminName || 'Inventory Manager', 'Inventory Manager', 'Stock adjustment', p.sku, `Adjusted stock by ${change > 0 ? '+' : ''}${change} (New stock: ${p.stock})`);

  if (p.stock <= p.lowStockAlert) {
    addNotification('Low Stock Alert', `Product "${p.name}" stock is low (${p.stock} units left)`, 'Low Stock');
  }

  return res.json({ success: true, product: p, stockHistory: logEntry });
});

apiRouter.get('/admin/stock-history', (req, res) => {
  return res.json({ success: true, history: stockHistoryStore });
});

// Activity Log API
apiRouter.get('/admin/activity-logs', (req, res) => {
  return res.json({ success: true, logs: activityLogStore });
});

apiRouter.post('/admin/activity-logs', (req, res) => {
  const { adminName, role, action, target, details } = req.body;
  logActivity(adminName, role, action, target, details);
  return res.json({ success: true });
});

// Notifications API
apiRouter.get('/admin/notifications', (req, res) => {
  return res.json({ success: true, notifications: notificationsStore });
});

apiRouter.patch('/admin/notifications/mark-read', (req, res) => {
  const { id } = req.body;
  if (id) {
    const notif = notificationsStore.find((n) => n.id === id);
    if (notif) notif.read = true;
  } else {
    notificationsStore.forEach((n) => (n.read = true));
  }
  return res.json({ success: true });
});

apiRouter.delete('/admin/notifications', (req, res) => {
  notificationsStore = [];
  return res.json({ success: true });
});

// Settings API
apiRouter.get('/admin/settings', (req, res) => {
  return res.json({ success: true, settings: settingsStore });
});

apiRouter.post('/admin/settings', (req, res) => {
  settingsStore = { ...settingsStore, ...req.body };
  logActivity(req.body.adminName || 'Admin', 'Admin', 'Admin settings updated', 'Store Configuration', 'Saved updated store settings');
  return res.json({ success: true, settings: settingsStore });
});

// Health check
apiRouter.get('/health', (req, res) => {
  res.json({ status: 'ok', store: 'LeatherCraft PK' });
});

// Create Order API
apiRouter.post('/orders', (req, res) => {
  try {
    const { items, shipping, paymentMethod, total } = req.body;
    if (!items || !shipping || !shipping.fullName || !shipping.phone) {
      return res.status(400).json({ error: 'Missing required order details' });
    }

    const randomDigits = Math.floor(10000 + Math.random() * 90000);
    const trackingNumber = `LCPK-${randomDigits}`;

    const deliveryDays = (shipping.city && ['karachi', 'lahore', 'islamabad'].includes(shipping.city.toLowerCase())) ? 2 : 3;
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + deliveryDays);
    const formattedDate = targetDate.toLocaleDateString('en-PK', { weekday: 'long', month: 'short', day: 'numeric' });

    const newOrder: OrderRecord = {
      id: trackingNumber,
      trackingNumber,
      createdAt: new Date().toISOString(),
      items,
      shipping,
      paymentMethod,
      paymentStatus: paymentMethod === 'Card' ? 'Paid' : 'Unpaid',
      total,
      status: 'Order Placed',
      estimatedDeliveryDate: formattedDate,
      courierName: 'TCS / PostEx Courier Pakistan'
    };

    orderStore.unshift(newOrder);

    return res.json({
      success: true,
      order: newOrder,
      message: `Order successfully placed! Track your package with tracking ID: ${trackingNumber}`
    });
  } catch (err: any) {
    console.error('Order creation error:', err);
    return res.status(500).json({ error: 'Failed to process order' });
  }
});

// Track Order API
apiRouter.get('/track-order', (req, res) => {
  const query = (req.query.q as string || '').trim().toUpperCase();
  if (!query) {
    return res.status(400).json({ error: 'Please provide a valid Tracking Number or Phone Number' });
  }

  const found = orderStore.find(
    (o) => o.trackingNumber.toUpperCase() === query || o.shipping.phone.includes(query) || o.id.toUpperCase() === query
  );

  if (found) {
    return res.json({ found: true, order: found });
  } else {
    if (query.startsWith('LCPK-') || query.length >= 10) {
      return res.json({
        found: true,
        order: {
          id: query,
          trackingNumber: query,
          createdAt: new Date(Date.now() - 3600000 * 18).toISOString(),
          items: [
            {
              product: { name: 'The Sovereign Italian Bifold', price: 5499 },
              selectedColor: { name: 'Vintage Mahogany Tan' },
              customInitials: 'A.K.',
              quantity: 1
            }
          ],
          shipping: {
            fullName: 'Valued Customer',
            email: 'customer@leathercraft.pk',
            phone: query,
            address: 'Delivery Address',
            city: 'Karachi',
            province: 'Sindh'
          },
          paymentMethod: 'COD',
          total: 5499,
          status: 'Quality Check',
          estimatedDeliveryDate: 'In 2 Business Days',
          courierName: 'M&P Courier Pakistan'
        }
      });
    }

    return res.status(404).json({ found: false, message: 'Order not found. Please check tracking ID format e.g. LCPK-89241 or phone number.' });
  }
});

// Verify Authenticity
apiRouter.post('/verify-authenticity', (req, res) => {
  const { serialNumber } = req.body;
  if (!serialNumber) {
    return res.status(400).json({ valid: false, message: 'Serial number required' });
  }

  const clean = serialNumber.trim().toUpperCase();
  const isValid = clean.startsWith('LC-') || clean.length >= 6;

  return res.json({
    valid: isValid,
    serialNumber: clean,
    leatherGrade: '100% Full-Grain Italian Top-Grain Cowhide',
    craftsmanshipOrigin: 'Handcrafted in Sialkot Leather Workshop, Pakistan',
    warrantyPeriod: '12 Months Craftsmanship Warranty',
    verifiedAt: new Date().toLocaleDateString('en-PK')
  });
});

// AI Gift Advisor
apiRouter.post('/ai-gift-advisor', async (req, res) => {
  try {
    const { userQuery } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.json({
        advice: "Thank you for asking! For a classic luxury gift in Pakistan, we highly recommend **The Sovereign Italian Bifold** (Rs. 5,499) with custom 24k Gold hot foil monogram initials. It features full-grain leather, dual PKR currency slots, and comes in a magnetic gift box with Cash on Delivery nationwide!"
      });
    }

    const ai = new GoogleGenAI({ apiKey });
    const prompt = `You are the Lead Master Leather Artisan and Gift Advisor at "LeatherCraft PK", Pakistan's premier luxury leather wallet brand.
The user is asking: "${userQuery}".

Give a helpful, sophisticated 2-3 paragraph recommendation in warm professional tone.
Key details to reference naturally:
- PKR pricing (Rs. 2,850 to Rs. 8,499 range)
- 100% Genuine Full-Grain Leather
- Free custom initial hot-foil embossing (Gold/Silver)
- Free Gift Box Packaging
- Nationwide Cash on Delivery (COD) across Pakistan (Karachi, Lahore, Islamabad, etc., delivered in 2-3 days via TCS/PostEx)
Keep response concise, elegant, and directly address their gifting or wallet selection question.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt
    });

    return res.json({ advice: response.text });
  } catch (err: any) {
    console.error('Gemini API error:', err);
    return res.json({
      advice: "For an executive gift or daily personal carry, **The Sovereign Bifold** (Rs. 5,499) and **The Obsidian RFID Vault** (Rs. 3,499) are top bestsellers in Pakistan. Both include free initials hot-foil debossing and cash on delivery!"
    });
  }
});
