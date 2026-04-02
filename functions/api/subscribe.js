export async function onRequestPost(context) {
  const formData = await context.request.formData();

  const email = formData.get('EMAIL');
  if (!email) {
    return new Response(JSON.stringify({ error: 'Email is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const body = {
    email,
    listIds: [11],
    updateEnabled: true,
  };

  const res = await fetch('https://api.brevo.com/v3/contacts', {
    method: 'POST',
    headers: {
      'api-key': context.env.BREVO_API_KEY,
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
