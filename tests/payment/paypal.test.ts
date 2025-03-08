import { generateAccesToken } from "@/lib/paypal";
import {  it, expect } from '@jest/globals';


it('generates access token from PayPal', async () => {
  const accessToken = await generateAccesToken();
  expect(accessToken).toBeDefined();
  expect(accessToken.length).toBeGreaterThan(1);
});