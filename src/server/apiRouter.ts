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
    const { items, shipping, paymentMethod, paymentStatus, total, status, notes } = req.body;
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
    return res.json({ success: true, order: newOrder });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to create order' });
  }
});

apiRouter.patch('/admin/orders/:id', (req, res) => {
  const { id } = req.params;
  const { status, paymentStatus, notes, shipping, courierName, estimatedDeliveryDate } = req.body;
  const order = orderStore.find((o) => o.id === id || o.trackingNumber === id);
  if (order) {
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

    return res.json({ success: true, order });
  }
  return res.status(404).json({ error: 'Order not found' });
});

apiRouter.delete('/admin/orders/:id', (req, res) => {
  const { id } = req.params;
  const idx = orderStore.findIndex((o) => o.id === id || o.trackingNumber === id);
  if (idx > -1) {
    orderStore.splice(idx, 1);
    return res.json({ success: true, message: 'Order deleted' });
  }
  return res.status(404).json({ error: 'Order not found' });
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
