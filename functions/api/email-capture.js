// functions/api/email-capture.js
// Cloudflare Pages Function — POST /api/email-capture
// Adds submitted email to a Brevo contact list.
// Requires env vars: BREVO_API_KEY, BREVO_LIST_ID

export async function onRequestPost(context) {
  const { request, env } = context;
  const JSON_HEADERS = { 'Content-Type': 'application/json' };

  // Parse request body
  let body;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid request' }), {
      status: 400,
      headers: JSON_HEADERS,
    });
  }

  // Validate email
  const email = (body?.email ?? '').trim();
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return new Response(JSON.stringify({ error: 'Invalid email' }), {
      status: 400,
      headers: JSON_HEADERS,
    });
  }

  // Check env vars
  const { BREVO_API_KEY, BREVO_LIST_ID } = env;
  const listId = parseInt(BREVO_LIST_ID, 10);
  if (!BREVO_API_KEY || !Number.isInteger(listId)) {
    console.error('[email-capture] Missing or invalid BREVO_API_KEY or BREVO_LIST_ID');
    return new Response(JSON.stringify({ error: 'Server misconfigured' }), {
      status: 500,
      headers: JSON_HEADERS,
    });
  }

  // Call Brevo Contacts API
  let brevoRes;
  try {
    brevoRes = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: {
        'api-key': BREVO_API_KEY,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        email,
        listIds: [listId],
        updateEnabled: true,
        attributes: { SOURCE: 'website' },
      }),
    });
  } catch (err) {
    console.error('[email-capture] Brevo fetch error:', err);
    return new Response(JSON.stringify({ error: 'Subscription failed' }), {
      status: 500,
      headers: JSON_HEADERS,
    });
  }

  // Brevo returns 201 (new contact created) or 204 (existing contact updated via updateEnabled:true)
  if (brevoRes.status === 201 || brevoRes.status === 204) {
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: JSON_HEADERS,
    });
  }

  const brevoBody = await brevoRes.text();
  console.error('[email-capture] Brevo error:', brevoRes.status, brevoBody);
  return new Response(JSON.stringify({ error: 'Subscription failed' }), {
    status: 500,
    headers: JSON_HEADERS,
  });
}

// Reject non-POST methods with 405
export async function onRequest() {
  return new Response(null, { status: 405, headers: { Allow: 'POST, OPTIONS' } });
}

// Handle preflight (same-origin requests don't need this, but it's harmless)
export async function onRequestOptions() {
  return new Response(null, { status: 204 });
}
