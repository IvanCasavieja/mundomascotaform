const DEFAULT_ENDPOINT =
  'https://script.google.com/macros/s/AKfycbz6KNpsJmJ3pA0FG_WMX_687CsHKVbLjT0jFE95LmpLnptQQm9cAWBUCYU2vCHK8hu1Nw/exec';

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

    return {
      statusCode: upstreamResponse.status,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
      },
      body: text,
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
