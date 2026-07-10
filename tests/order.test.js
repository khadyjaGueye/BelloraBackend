// tests/order.service.test.js
const orderService = require('../src/services/order.service');

describe('Order Service', () => {
  it('crée une commande et retourne un ID', async () => {
    const orderId = await orderService.createOrder({
      customer_name: 'Test User',
      customer_phone: '770000000',
      customer_address: 'Dakar',
      total_amount: 1000,
      user_id: null
    });
    expect(orderId).toBeDefined();
    expect(typeof orderId).toBe('number');
  });
});
    