# Squatch Marketing — Email Branding & Development Guidelines

> Bulletproof HTML email template based on the Cerberus pattern (Ted Goas).
> Renders correctly in Outlook 2010-2021, Office 365, Gmail, Apple Mail, iOS, Yahoo.
> Last rebuilt: 2026-03-31

---

## 1. Brand Identity

| Field | Value |
|-------|-------|
| **Name** | Squatch Marketing |
| **Location** | West Valley City, Utah |
| **Phone** | 801-803-2136 |
| **Email** | marketing@squatchmarketing.com |
| **Website** | https://squatchmarketing.com |
| **Facebook** | https://www.facebook.com/squatchmarketing |
| **LinkedIn** | https://www.linkedin.com/company/squatchmarketing |
| **Brevo Sender** | Squatch Marketing / marketing@squatchmarketing.com / ID: 1 |

---

## 2. Color Palette

### Dark Backgrounds
| Token | Hex | Usage |
|-------|-----|-------|
| void | `#000A12` | Body bg, CTA section bg |
| abyss | `#001220` | Hero section bg, stats/divider bg |
| deep | `#00192E` | Content section bg |
| slate | `#0C2D48` | Card bg, social icon bg, section borders |

### Accents
| Token | Hex | Usage |
|-------|-----|-------|
| blue | `#2EA3F2` | Primary accent, links, CTA buttons |
| blue-light | `#5BB8F5` | Hover states |
| teal | `#26D1BD` | Secondary accent, pill labels |
| teal-light | `#5EEBD5` | Hover states |

### Text Colors (on dark backgrounds)
| Token | Hex | Usage |
|-------|-----|-------|
| white | `#FFFFFF` | Headings |
| ink-bright | `#CBD5E1` | Body copy |
| ink | `#94A3B8` | Secondary text |
| ink-muted | `#475569` | Footer text |
| ink-dark | `#334155` | Footer links subdued |

### Component Colors
| Element | BG | Border |
|---------|-----|--------|
| Card | `#0C2D48` | `#1A3A55` |
| Icon box (blue) | `#0A1E30` | none |
| Icon box (teal) | `#0A2520` | none |
| Pill (teal) | `#082A24` | none |
| Pill (blue) | `#0A2540` | none |
| Section border | — | `#0C2D48` |
| Ghost button border | — | `#1E293B` |

### Gradients (modern clients only — Outlook gets solid fallback)
| Name | CSS | Usage |
|------|-----|-------|
| CTA gradient | `linear-gradient(135deg, #2EA3F2, #26D1BD)` | Primary buttons |
| CTA hover | `linear-gradient(135deg, #5BB8F5, #5EEBD5)` | Button hover state |

---

## 3. Typography

### Font Stack
```
Headings: 'Syne', Helvetica, Arial, sans-serif
Body:     'DM Sans', Helvetica, Arial, sans-serif
```
Outlook gets forced to `sans-serif` via `<!--[if mso]><style>* { font-family: sans-serif !important; }</style><![endif]-->`.
Web fonts loaded via `<link>` inside `<!--[if !mso]><!-->` conditional.

### Type Scale
| Element | Size | Weight | Color |
|---------|------|--------|-------|
| Hero heading | 30px | 700 | `#FFFFFF` |
| Section heading | 22px | 700 | `#FFFFFF` |
| CTA heading | 24px | 700 | `#FFFFFF` |
| Body copy | 15px | 400 | `#CBD5E1` |
| Card title | 15px | 600 | `#FFFFFF` |
| Card description | 13px | 400 | `#94A3B8` |
| Pill label | 12px | 600 | `#26D1BD` or `#2EA3F2` |
| Stat number | 26px | 700 | `#2EA3F2` or `#FFFFFF` |
| Footer text | 11-12px | 400 | `#475569` |

### Heading MSO Overrides (required on EVERY heading)
```
mso-line-height-rule: exactly;
mso-margin-top-alt: 0;
mso-margin-bottom-alt: Xpx;  (match CSS margin-bottom)
```

---

## 4. Logo

Hosted PNG at `public/emails/squatch-logo.png` (595x123 source).
```html
<img alt="Squatch Marketing" border="0" width="200"
     src="https://squatchmarketing.com/emails/squatch-logo.png"
     style="width: 200px; height: auto; display: block; margin: auto;" />
```

---

## 5. Template Architecture (Cerberus-based)

### Container Structure
```
<body>                                    ← bg color #1
  <center>                                ← bg color #2 (Gmail)
    <!--[if mso | IE]><table 100%>        ← bg color #3 (Win10 Mail)
      <!--[if mso]><table 600>            ← width constraint (Outlook)
        <table 600 .email-container>      ← actual content
        </table>
      <!--[if mso]></table>
    <!--[if mso | IE]></table>
  </center>
</body>
```

### Width Strategy (4 layers)
1. `width="600"` HTML attribute on content `<table>` — universal
2. `style="margin: auto"` — centers in modern clients
3. `align="center"` — centers in older clients
4. `<!--[if mso]><table width="600">` ghost wrapper — Outlook constraint

### CSS Reset (critical rules)
- `table { border-spacing: 0 !important; }` — NO `border-collapse: collapse` (breaks `border-radius`)
- `.email-container { table-layout: fixed !important; margin: 0 auto !important; }` — scoped to container only
- `table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }` — removes Outlook table spacing
- `* { -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; }` — prevents auto-scaling

### Dark Sections — NO VML Needed
For solid background colors, use `bgcolor` attribute + `background-color` CSS on `<td>`:
```html
<td bgcolor="#001220" style="background-color: #001220; border-radius: 16px 16px 0 0; border: 1px solid #0C2D48;">
```
VML (`v:rect`) is ONLY needed for background IMAGES in Outlook. We don't use background images.

### Mobile Responsive
```css
@media screen and (max-width: 600px) {
    .email-container { width: 100% !important; margin: auto !important; }
    .mobile-padding { padding: 28px 20px !important; }
    .mobile-gutter { padding-left: 20px !important; padding-right: 20px !important; }
    .mobile-btn-stack { display: block !important; width: 100% !important; }
}
```

---

## 6. Component Patterns

### Pill Badge
```html
<table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin-bottom: 20px;">
    <tr>
        <td bgcolor="#082A24" style="background-color: #082A24; border-radius: 50px; padding: 6px 14px;">
            <table role="presentation" cellspacing="0" cellpadding="0" border="0"><tr>
                <td valign="middle" style="padding-right: 8px; font-size: 8px; color: #26D1BD; line-height: 1;">&#9679;</td>
                <td valign="middle" style="font-family: 'DM Sans', Helvetica, Arial, sans-serif; font-size: 12px; font-weight: 600; color: #26D1BD; letter-spacing: 0.5px; line-height: 1;">Label Text</td>
            </tr></table>
        </td>
    </tr>
</table>
```
Blue variant: swap `#082A24` -> `#0A2540`, `#26D1BD` -> `#2EA3F2`

### CTA Button (Cerberus border trick)
```html
<table role="presentation" cellspacing="0" cellpadding="0" border="0">
    <tr>
        <td style="border-radius: 10px; background-color: #2EA3F2;" bgcolor="#2EA3F2">
            <a href="URL" class="btn-primary"
               style="background-color: #2EA3F2; background: linear-gradient(135deg, #2EA3F2, #26D1BD);
                      border: 1px solid #2EA3F2; font-family: 'DM Sans', Helvetica, Arial, sans-serif;
                      font-size: 14px; line-height: 14px; text-decoration: none; padding: 14px 28px;
                      color: #ffffff; display: block; border-radius: 10px; font-weight: 600;">
                Button Text &#8594;
            </a>
        </td>
    </tr>
</table>
```
**How the border trick works:** `border: 1px solid #2EA3F2` (matching bg color) forces Outlook to
respect padding on the `<a>` tag. The border is invisible because it matches the background.
Always include `background-color` BEFORE `background: linear-gradient(...)` as fallback.

### Ghost Button
```html
<td style="border-radius: 10px; background-color: #001220;" bgcolor="#001220">
    <a href="URL" class="btn-ghost"
       style="background-color: #001220; border: 1px solid #1E293B; font-family: ...;
              padding: 13px 24px; color: #94A3B8; display: block; border-radius: 10px;">
        Learn More
    </a>
</td>
```

### Icon Box
```html
<td bgcolor="#0A1E30" width="36" height="36" align="center" valign="middle"
    style="background-color: #0A1E30; border-radius: 10px; font-family: Helvetica, Arial, sans-serif;
           font-size: 16px; color: #2EA3F2;">
    &#9670;
</td>
```
Available symbols: `&#9670;` (&#9670;), `&#9671;` (&#9671;), `&#9674;` (&#9674;)
Teal variant: `#0A2520` bg, `#26D1BD` color

### Accent Bar
```html
<td bgcolor="#2EA3F2" style="background-color: #2EA3F2; font-size: 3px; line-height: 3px;
    border-left: 1px solid #0C2D48; border-right: 1px solid #0C2D48;">&nbsp;</td>
```

### Section Divider
```html
<td bgcolor="#001220" style="background-color: #001220; padding: 0 40px; border-left: 1px solid #0C2D48; border-right: 1px solid #0C2D48;">
    <table width="100%"><tr>
        <td bgcolor="#0C2D48" style="background-color: #0C2D48; font-size: 1px; line-height: 1px;" height="1">&nbsp;</td>
    </tr></table>
</td>
```

---

## 7. Development Rules

### MUST
1. Start from `base-template.html` — never build from scratch
2. `width="600"` on the container table (HTML attribute)
3. `bgcolor` attribute on EVERY element with a background color
4. `role="presentation"` on all layout tables
5. `border="0" cellpadding="0" cellspacing="0"` on every table
6. Inline styles on every element — `<style>` block is progressive enhancement only
7. `mso-line-height-rule: exactly` + `mso-margin-top-alt/bottom-alt` on all headings
8. `background-color` fallback BEFORE `background: linear-gradient(...)` on buttons
9. `border: 1px solid #matching-color` on `<a>` buttons (Outlook padding trick)
10. `width` HTML attribute on all `<img>` tags
11. Brevo `{{ unsubscribe }}` link in footer (CAN-SPAM required)
12. Physical address in footer (CAN-SPAM required)

### NEVER
- `border-collapse: collapse` — breaks `border-radius` everywhere
- `table-layout: fixed` on anything except `.email-container`
- `margin: 0 auto` on anything except `.email-container`
- `rgba()` in inline styles — Outlook renders as invisible/black
- `position: absolute/fixed` — breaks in Outlook
- `float`, `flex`, `grid` — zero Outlook support
- `max-width` as the ONLY width constraint — Outlook ignores it
- `padding` on `<a>` without the border trick — Outlook ignores padding on inline elements
- VML `v:roundrect` inside VML `v:rect` textbox — buttons fly to top-left corner
- Nested `<!--[if mso]>` conditionals inside VML textboxes
- `v:fill type="gradient"` — unreliable across Outlook versions
- SVG images — use PNG
- JavaScript, `<form>` elements, embedded video
- `rem`/`em` units — use `px` only
- CSS variables — zero email support
- `background-image` inside `<style>` block — Gmail strips entire `<style>` if it finds this

### Outlook 2016 Known Limitations (acceptable degradation)
- No `border-radius` — renders square corners
- No CSS gradients — sees solid `background-color` fallback
- No hover states — buttons look static
- Width may not lock exactly to 600px — renders in a constrained but slightly wider box
- No web fonts — falls back to Helvetica/Arial/sans-serif

---

## 8. Brevo Variables

| Variable | Purpose |
|----------|---------|
| `{{ unsubscribe }}` | Unsubscribe link (required) |
| `{{ mirror }}` | View in browser link |
| `{{ contact.EMAIL }}` | Recipient email |
| `{{ contact.FIRSTNAME }}` | First name |
| `{{ contact.LASTNAME }}` | Last name |

---

## 9. Campaign Types & Lists

| Campaign Type | Brevo List | Audience |
|---------------|-----------|----------|
| Newsletter | #4 | Blog/footer subscribers |
| Consultation follow-up | #3 | Demo requesters |
| Welcome sequence | #4 | New subscribers |
| Promo / announcement | #3 + #4 | All contacts |

---

## 10. Testing Checklist

- [ ] Width holds at 600px in Gmail web
- [ ] Width holds in Apple Mail
- [ ] Width constrained in Outlook 2016 (may be slightly wider — acceptable)
- [ ] Dark backgrounds render in all clients
- [ ] Buttons are clickable and properly padded
- [ ] Pill badges left-aligned, no boxy outlines
- [ ] Rounded corners visible in modern clients
- [ ] Logo loads (check `squatchmarketing.com/emails/squatch-logo.png`)
- [ ] All links resolve
- [ ] `{{ unsubscribe }}` works
- [ ] Mobile responsive (buttons stack, padding adjusts)
- [ ] Images-off: alt text readable
- [ ] Under 102KB total HTML (Gmail clips above this)

---

## 11. File Organization

```
squatchmarketing-site/
  public/emails/
    squatch-logo.png              ← Hosted logo
  emails/
    EMAIL-GUIDELINES.md           ← This file
    base-template.html            ← Cerberus-based production template
```

---

*Based on: Cerberus (Ted Goas), Litmus, Email on Acid, Campaign Monitor, CareCloud production rules*
*Last updated: 2026-03-31*
