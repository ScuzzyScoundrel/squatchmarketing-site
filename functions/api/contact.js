export async function onRequestPost(context) {
  const apiKey = context.env.BREVO_API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'API key not configured' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const formData = await context.request.formData();

  const email = formData.get('EMAIL');
  if (!email) {
    return new Response(JSON.stringify({ error: 'Email is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const phone = formData.get('SMS');
  const attributes = {
    FIRSTNAME: formData.get('FIRSTNAME') || '',
    LASTNAME: formData.get('LASTNAME') || '',
    COMPANY_NAME: formData.get('COMPANY_NAME') || '',
    SERVICES: formData.get('SERVICES') || '',
    MESSAGE: formData.get('MESSAGE') || '',
  };
  if (phone) {
    attributes.LANDLINE_NUMBER = `+1${phone.replace(/\D/g, '')}`;
  }

  const body = { email, attributes, listIds: [3], updateEnabled: true };

  const headers = {
    'api-key': apiKey,
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };

  let res = await fetch('https://api.brevo.com/v3/contacts', {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  });

  // If phone number conflicts with another contact, retry without it
  if (!res.ok) {
    const errorText = await res.text();
    if (errorText.includes('duplicate_parameter') && errorText.includes('LANDLINE_NUMBER')) {
      delete attributes.LANDLINE_NUMBER;
      res = await fetch('https://api.brevo.com/v3/contacts', {
        method: 'POST',
        headers,
        body: JSON.stringify({ email, attributes, listIds: [3], updateEnabled: true }),
      });
    } else {
      return new Response(JSON.stringify({ success: false, error: errorText }), {
        status: res.status,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }

  if (res.ok || res.status === 204) {
    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const error = await res.text();
  return new Response(JSON.stringify({ success: false, error }), {
    status: res.status,
    headers: { 'Content-Type': 'application/json' },
  });
}
