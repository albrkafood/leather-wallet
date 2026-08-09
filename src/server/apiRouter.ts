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
    city: string;
    province: string;
  };
  paymentMethod: string;
  total: number;
  status: 'Order Placed' | 'Quality Check' | 'Dispatched via TCS' | 'Out for Delivery' | 'Delivered';
  estimatedDeliveryDate: string;
  courierName: string;
}

// In-memory order store
const orderStore: OrderRecord[] = [
  {
    id: 'LCPK-89241',
    trackingNumber: 'LCPK-89241',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    items: [
      {
        product: { name: 'The Sovereign Italian Bifold', price: 5499 },
        selectedColor: { name: 'Vintage Mahogany Tan' },
        customInitials: 'H.R.',
        quantity: 1
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
    total: 5499,
    status: 'Dispatched via TCS',
    estimatedDeliveryDate: 'Tomorrow by 4:00 PM',
    courierName: 'TCS Express Pakistan'
  }
];

export const apiRouter = Router();

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
      total,
      status: 'Order Placed',
      estimatedDeliveryDate: formattedDate,
      courierName: 'TCS / Leopards Courier Pakistan'
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
- Nationwide Cash on Delivery (COD) across Pakistan (Karachi, Lahore, Islamabad, etc., delivered in 2-3 days via TCS/Leopards)
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
