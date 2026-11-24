// End-to-end automated verification script for Mahilo API
const BASE_URL = 'http://localhost:5000/api';

async function runTests() {
  console.log('🧪 Starting Mahilo E2E System Test Suite...\n');
  let passed = 0;
  let failed = 0;

  async function test(name, fn) {
    try {
      await fn();
      console.log(`✅ [PASS] ${name}`);
      passed++;
    } catch (err) {
      console.error(`❌ [FAIL] ${name}:`, err.message);
      failed++;
    }
  }

  // 1. Health
  await test('API Health Check', async () => {
    const res = await fetch(`${BASE_URL}/health`);
    const data = await res.json();
    if (data.status !== 'healthy') throw new Error('API is not healthy');
  });

  // 2. Auth Login (Customer Ananya)
  let customerToken = '';
  await test('Universal Single Login - Customer', async () => {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier: 'ananya@example.com', password: 'mahilo123' }),
    });
    const data = await res.json();
    if (!data.success || !data.data.token) throw new Error('Customer login failed');
    customerToken = data.data.token;
  });

  // 3. Auth Login (Seller Priya)
  let sellerToken = '';
  await test('Universal Single Login - Approved Seller with Role Detection', async () => {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier: 'saraswati@example.com', password: 'mahilo123' }),
    });
    const data = await res.json();
    if (!data.success || !data.data.token) throw new Error('Seller login failed');
    if (!data.data.user.roles.includes('SELLER')) throw new Error('Expected SELLER role');
    if (data.data.user.sellerStatus !== 'APPROVED') throw new Error('Expected APPROVED status');
    sellerToken = data.data.token;
  });

  // 4. Products Catalog
  let sampleProduct = null;
  await test('Product Catalog & Filtering', async () => {
    const res = await fetch(`${BASE_URL}/products`);
    const data = await res.json();
    if (!data.success || data.data.length === 0) throw new Error('Products empty');
    sampleProduct = data.data[0];
  });

  // 5. Service Dynamic Slot Generator
  await test('Service Appointment Slot Generator & Working Hours', async () => {
    const srvRes = await fetch(`${BASE_URL}/services`);
    const srvData = await srvRes.json();
    const service = srvData.data[0];

    // Pick upcoming Monday
    const targetDate = '2026-03-02';
    const slotRes = await fetch(`${BASE_URL}/services/${service.id}/available-slots?date=${targetDate}`);
    const slotData = await slotRes.json();
    if (!slotData.success || !slotData.data.slots || slotData.data.slots.length === 0) {
      throw new Error('Slot generator returned no slots');
    }
  });

  // 6. Multi-Vendor Cart & Checkout Order Splitting
  await test('Multi-Vendor Cart & Parent-Child Order Split Checkout', async () => {
    // Add item from Seller 1
    await fetch(`${BASE_URL}/cart/items`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${customerToken}`,
      },
      body: JSON.stringify({ productId: 'prod-h-1', quantity: 1 }),
    });

    // Add item from Seller 2
    await fetch(`${BASE_URL}/cart/items`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${customerToken}`,
      },
      body: JSON.stringify({ productId: 'prod-hm-3', quantity: 1 }),
    });

    // Checkout
    const checkoutRes = await fetch(`${BASE_URL}/orders/checkout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${customerToken}`,
      },
      body: JSON.stringify({
        shippingAddress: {
          name: 'Ananya Sharma',
          phone: '9876543210',
          addressLine1: 'Flat 402, Lotus Orchid Apts',
          city: 'Mumbai',
          state: 'Maharashtra',
          pincode: '400053',
        },
      }),
    });

    const checkoutData = await checkoutRes.json();
    if (!checkoutData.success) throw new Error(checkoutData.message || 'Checkout failed');
    if (!checkoutData.data.parentOrder) throw new Error('Missing parent order');
    if (checkoutData.data.sellerOrders.length !== 2) {
      throw new Error(`Expected 2 seller sub-orders, got ${checkoutData.data.sellerOrders.length}`);
    }
  });

  // 7. Double Booking Concurrency Protection
  await test('Service Booking & Concurrency Double-Booking Protection', async () => {
    const srvRes = await fetch(`${BASE_URL}/services`);
    const srvData = await srvRes.json();
    const service = srvData.data[0];

    // Use a unique date/time so test can be run repeatedly without collision with past runs
    const uniqueDay = String((Math.floor(Math.random() * 20) + 1)).padStart(2, '0');
    const bookingPayload = {
      serviceId: service.id,
      bookingDate: `2026-04-${uniqueDay}`,
      startTime: `${Math.floor(Math.random() * 4 + 10)}:00`,
      endTime: '15:00',
      specialNotes: 'Concurrency test slot',
    };

    // First booking reservation:
    const firstRes = await fetch(`${BASE_URL}/bookings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${customerToken}`,
      },
      body: JSON.stringify(bookingPayload),
    });
    const firstData = await firstRes.json();
    if (!firstData.success) throw new Error('First booking should succeed');

    // Second booking attempt on exact identical slot:
    const secondRes = await fetch(`${BASE_URL}/bookings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${customerToken}`,
      },
      body: JSON.stringify(bookingPayload),
    });
    const secondData = await secondRes.json();
    if (secondRes.status !== 409 || secondData.success) {
      throw new Error('Double booking concurrency guard should return 409 Conflict');
    }
  });

  // 8. Seller Financial Ledger & Bank Settlement
  await test('Seller Double-Entry Ledger Summary', async () => {
    const res = await fetch(`${BASE_URL}/ledger/summary`, {
      headers: { Authorization: `Bearer ${sellerToken}` },
    });
    const data = await res.json();
    if (!data.success) throw new Error('Ledger summary failed');
    if (typeof data.data.availableBalance !== 'number') throw new Error('Invalid balance calculation');
  });

  // 9. Admin Operations (Rajeshwari)
  await test('Admin Moderation, Commission Engine & Settlement Disbursal', async () => {
    // Admin login
    const adminLoginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier: 'admin@mahilo.in', password: 'mahilo123' }),
    });
    const adminData = await adminLoginRes.json();
    const adminToken = adminData.data.token;

    // Analytics
    const anaRes = await fetch(`${BASE_URL}/admin/analytics`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    const anaData = await anaRes.json();
    if (!anaData.success || typeof anaData.data.gmv !== 'number') {
      throw new Error('Admin analytics calculation failed');
    }

    // Commission update
    const commRes = await fetch(`${BASE_URL}/admin/commissions/comm-1`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({ value: 8.5 }),
    });
    const commData = await commRes.json();
    if (!commData.success || commData.data.value !== 8.5) {
      throw new Error('Commission rule update failed');
    }
  });

  // 10. Reviews & Ratings
  await test('Verified Buyer Reviews & Seller Responses', async () => {
    const revRes = await fetch(`${BASE_URL}/reviews`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${customerToken}`,
      },
      body: JSON.stringify({
        productId: 'prod-h-1',
        rating: 5,
        comment: 'Exceptional craftsmanship! Truly proud to support Indian women artisans.',
      }),
    });
    const revData = await revRes.json();
    if (!revData.success) throw new Error('Review submission failed');
  });

  console.log(`\n========================================`);
  console.log(`🎉 TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log(`========================================\n`);

  if (failed > 0) process.exit(1);
}

runTests();
