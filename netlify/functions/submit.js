const DEFAULT_ENDPOINT =
  'https://script.google.com/macros/s/AKfycbz0P_E0GIB14x1HUyTr0b_bTW709rBdyL1NyY4gztVGiR5SkWPlYNYiQbHvmrepYGfwuA/exec';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, x-api-key',
};

export const handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: corsHeaders, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers: corsHeaders, body: 'Method Not Allowed' };
  }

  try {
    const endpoint = process.env.MUNDO_MASCOTA_ENDPOINT || DEFAULT_ENDPOINT;
    const serverApiKey = process.env.MUNDO_MASCOTA_KEY;
    const incomingApiKey = event.headers['x-api-key'] || event.headers['X-Api-Key'];

    const payload = JSON.parse(event.body || '{}');

    const headers = { 'Content-Type': 'application/json' };
    const apiKeyToSend = serverApiKey || incomingApiKey;
    if (apiKeyToSend) headers['x-api-key'] = apiKeyToSend;

    const upstreamResponse = await fetch(endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
    });

    const text = await upstreamResponse.text();
    let statusCode = upstreamResponse.status;
    let body = text;

    // Si el Apps Script responde con JSON { ok: false }, devolvemos 400 para que el front lo vea como error.
    try {
      const parsed = JSON.parse(text);
      if (parsed && parsed.ok === false) {
        statusCode = 400;
        body = JSON.stringify(parsed);
      } else {
        body = JSON.stringify(parsed);
      }
    } catch {
      // Si no es JSON y el upstream fue 200, lo consideramos fallo de backend.
      if (upstreamResponse.ok) {
        statusCode = 502;
      }
    }

    return {
      statusCode,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
      },
      body,
    };
  } catch (error) {
    console.error('Proxy error', error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: 'Internal Server Error',
    };
  }
};
