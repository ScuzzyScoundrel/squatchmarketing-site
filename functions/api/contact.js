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
  const industry = formData.get('INDUSTRY') || '';
  const attributes = {
    FIRSTNAME: formData.get('FIRSTNAME') || '',
    LASTNAME: formData.get('LASTNAME') || '',
    COMPANY_NAME: formData.get('COMPANY_NAME') || '',
    SERVICES: formData.get('SERVICES') || '',
    MESSAGE: formData.get('MESSAGE') || '',
    LEAD_STATUS: 'opportunity',
  };
  if (industry) {
    attributes.INDUSTRY = industry;
  }
  if (phone) {
    attributes.LANDLINE_NUMBER = `+1${phone.replace(/\D/g, '')}`;
  }

  const headers = {
    'api-key': apiKey,
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };

  // If industry provided, find or create the segment list
  let segmentListId = null;
  if (industry) {
    const segmentName = `Segment | ${industry}`;

    // Search existing lists for a match
    const listsRes = await fetch('https://api.brevo.com/v3/contacts/lists?limit=50', { headers });
    if (listsRes.ok) {
      const listsData = await listsRes.json();
      const existing = listsData.lists.find((l) => l.name === segmentName);
      if (existing) {
        segmentListId = existing.id;
      } else {
        // Create new segment list (folder 6 = "Industry Segments")
        const createRes = await fetch('https://api.brevo.com/v3/contacts/lists', {
          method: 'POST',
          headers,
          body: JSON.stringify({ name: segmentName, folderId: 6 }),
        });
        if (createRes.ok) {
          const created = await createRes.json();
          segmentListId = created.id;
        }
      }
    }
  }

  // Build list IDs: always #3 (consultations), plus segment if found/created
  const listIds = [3];
  if (segmentListId) {
    listIds.push(segmentListId);
  }

  const body = { email, attributes, listIds, updateEnabled: true };

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
        body: JSON.stringify({ email, attributes, listIds, updateEnabled: true }),
      });
    } else {
      return new Response(JSON.stringify({ success: false, error: errorText }), {
        status: res.status,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }

  if (res.ok || res.status === 204) {
    // Send branded thank-you email (must await — Cloudflare kills pending fetches on return)
    const firstname = formData.get('FIRSTNAME') || '';
    try {
      // Fetch the hosted HTML template
      const templateRes = await fetch('https://squatchmarketing.com/emails/thank-you.html');
      if (templateRes.ok) {
        const htmlContent = await templateRes.text();
        await fetch('https://api.brevo.com/v3/smtp/email', {
          method: 'POST',
          headers,
          body: JSON.stringify({
            sender: { name: 'Squatch Marketing', email: 'marketing@squatchmarketing.com' },
            to: [{ email, name: firstname }],
            subject: "Thanks for reaching out \u2014 we'll be in touch soon",
            htmlContent,
          }),
        });
      }
    } catch (_) {} // don't fail the form submission if email fails

    // Send internal new-lead notification
    try {
      const lastname = formData.get('LASTNAME') || '';
      const company = formData.get('COMPANY_NAME') || '';
      const services = formData.get('SERVICES') || '';
      const message = formData.get('MESSAGE') || '';
      const escape = (s) => String(s).replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
      const fullname = `${firstname} ${lastname}`.trim();
      const rows = [
        ['Name', fullname],
        ['Email', email],
        ['Phone', phone || ''],
        ['Company', company],
        ['Industry', industry],
        ['Services', services],
        ['Message', message],
      ].filter(([, v]) => v);
      const rowsHtml = rows
        .map(([k, v]) => `<tr><td style="padding:6px 12px 6px 0;font-weight:600;vertical-align:top">${escape(k)}</td><td style="padding:6px 0;white-space:pre-wrap">${escape(v)}</td></tr>`)
        .join('');
      await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          sender: { name: 'Squatch Marketing Leads', email: 'marketing@squatchmarketing.com' },
          to: [{ email: 'heaton.jerris@gmail.com', name: 'Jerris' }],
          replyTo: { email, name: fullname || email },
          subject: `New lead: ${fullname || email}${company ? ` (${company})` : ''}`,
          htmlContent: `<div style="font-family:system-ui,sans-serif;font-size:14px;color:#111"><h2 style="margin:0 0 12px">New contact form submission</h2><table style="border-collapse:collapse">${rowsHtml}</table></div>`,
        }),
      });
    } catch (_) {} // don't fail the form submission if notification fails

    return new Response(JSON.stringify({
      success: true,
      segmentCreated: segmentListId ? true : false,
      segmentListId,
    }), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const error = await res.text();
  return new Response(JSON.stringify({ success: false, error }), {
    status: res.status,
    headers: { 'Content-Type': 'application/json' },
  });
}
