export async function onRequestPost(context) {
  const apiKey = context.env.BREVO_API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({
      error: 'BREVO_API_KEY not found in env',
      envKeys: Object.keys(context.env),
    }), {
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

  const body = {
    email,
    attributes: {
      FIRSTNAME: formData.get('FIRSTNAME') || '',
      LASTNAME: formData.get('LASTNAME') || '',
      LANDLINE_NUMBER: phone ? `+1${phone.replace(/\D/g, '')}` : '',
      COMPANY_NAME: formData.get('COMPANY_NAME') || '',
      SERVICES: formData.get('SERVICES') || '',
      MESSAGE: formData.get('MESSAGE') || '',
    },
    listIds: [3],
    updateEnabled: true,
  };

  const res = await fetch('https://api.brevo.com/v3/contacts', {
    method: 'POST',
    headers: {
      'api-key': apiKey,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify(body),
  });

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
