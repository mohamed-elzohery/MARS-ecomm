import { generateAccessToken, paypal } from "@/lib/paypal";
import {  it, expect } from '@jest/globals';


it('generates access token from PayPal', async () => {
  const accessToken = await generateAccessToken();
  expect(accessToken).toBeDefined();
  expect(accessToken.length).toBeGreaterThan(1);
});

test('simulate capturing a payment from an order', async () => {
  const orderId = '100';

  const mockCapturePayment = jest
    .spyOn(paypal, 'capturePayment')
    .mockResolvedValue({
      status: 'COMPLETED',
    });

  const captureResponse = await paypal.capturePayment(orderId);
  expect(captureResponse).toHaveProperty('status', 'COMPLETED');

  mockCapturePayment.mockRestore();
});