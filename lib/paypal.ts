const base = process.env.PAYPAL_API_URL ? process.env.PAYPAL_API_URL  : "https://api.sandbox.paypal.com";


export const generateAccesToken = async () => {
    const {PAYPAL_CLIENT_ID: clientId,  PAYPAL_CLIENT_SECRET: clientSecret} =  process.env;
    // Create base64 encoded auth credentials
  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
  
  try {
    const response = await fetch(`${base}/v1/oauth2/token`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Accept-Language': 'en_US',
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials',
    });

    
    if (!response.ok) {
        const errorMsg = await response.text();
      throw new Error(`PayPal API error: ${errorMsg || 'Failed to fetch access token'}`);
    };

    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error('Failed to generate PayPal access token:', error);
    throw error;
  }
}

