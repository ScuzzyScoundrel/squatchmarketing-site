# Squatch Marketing — Email Branding & Technical Rules

> These rules are derived from the working base template at commit `5e22c83`.
> Every new email MUST start from `base-template.html`. Never build from scratch.
> Last verified working: 2026-04-01 (Outlook 2016, O365, Gmail, Apple Mail, iOS)

---

## Rule #1: Always Start From the Template

**Copy `base-template.html` and modify content. Never build email HTML from scratch.**

The template contains proven patterns for width constraining, Outlook compatibility,
responsive behavior, and dark theme rendering. Building from scratch WILL break.

```bash
cp emails/base-template.html emails/campaigns/my-campaign.html
```

---

## Template Architecture (DO NOT MODIFY)

### DOCTYPE & Head
```
DOCTYPE: XHTML 1.0 Transitional (NOT HTML5)
xmlns:v and xmlns:o required for Outlook VML namespace
MSO OfficeDocumentSettings with AllowPNG and 96 DPI
```

### CSS Boilerplate (proven, do not modify)
```css
#outlook a{padding:0;}
.ReadMsgBody{width:100%;} .ExternalClass{width:100%;}
.ExternalClass, .ExternalClass span/td/div {line-height: 100%;}
body, table, td, a{text-size-adjust:100%;}
table, td{mso-table-lspace:0pt; mso-table-rspace:0pt;}
img {-ms-interpolation-mode:bicubic;}
body {height:100%; margin:0; padding:0; width:100%;}
```

### Width Strategy (4 layers — all required)
| Layer | Code | Purpose |
|-------|------|---------|
| Desktop CSS lock | `@media (min-width: 601px) { .container { width: 600px !important } }` | Forces width in web clients |
| Mobile CSS | `@media (max-width: 600px) { .container { width: 100% !important } }` | Responsive on mobile |
| MSO ghost table | `<!--[if (gte mso 9)\|(IE)]><table width="600">` | Constrains Outlook desktop |
| Container | `<table class="container" style="max-width: 600px;" width="100%">` | Fallback |

### Body Wrapper Structure (exact pattern, do not change)
```html
<body bgcolor="#000A12">
  preheader divs
  <table width="100%">
    <tr>
      <td align="center" bgcolor="#000A12" style="padding: 0px 15px 50px 15px;">
        <!--[if (gte mso 9)|(IE)]><table width="600" align="center"><tr><td><![endif]-->
        <table class="container" style="max-width: 600px;" width="100%">
          <!-- ALL CONTENT HERE -->
        </table>
        <!--[if (gte mso 9)|(IE)]></td></tr></table><![endif]-->
      </td>
    </tr>
    <tr><!-- FOOTER with its own MSO ghost table --></tr>
  </table>
</body>
```

### Footer Has Its Own MSO Ghost Table
```html
<td align="center" bgcolor="#000A12">
  <!--[if (gte mso 9)|(IE)]><table width="600"><tr><td><![endif]-->
  <table style="max-width:600px" width="100%">
    <!-- footer content -->
  </table>
  <!--[if (gte mso 9)|(IE)]></td></tr></table><![endif]-->
</td>
```

---

## NEVER Do These (proven to break rendering)

| Rule | Why |
|------|-----|
| `table-layout: fixed` | Overrides MSO ghost table width — email goes full viewport |
| `border-collapse: collapse` | Prevents `border-radius` from rendering in all clients |
| `<center>` tag | Breaks Outlook 2016 width constraining |
| `#MessageViewBody { width: 100% }` | Cascades to child elements, forces full width |
| `* { }` universal selectors | Unpredictable cascade in email clients |
| `width="600"` on container table | Use `width="100%"` — desktop CSS lock does the constraining |
| Cerberus CSS reset | Multiple rules conflict with dark email themes |
| VML `v:rect` for solid-color backgrounds | Unnecessary complexity — `bgcolor` attribute is sufficient |
| `v:roundrect` inside `v:rect` textbox | Buttons fly to top-left corner in Outlook 2016 |
| Nested `<!--[if mso]>` inside VML | Breaks Outlook rendering |
| `rgba()` in inline styles | Outlook renders as invisible or black |
| `v:fill type="gradient"` | Unreliable across Outlook versions |
| `background-image` inside `<style>` block | Gmail strips the ENTIRE `<style>` block |

---

## Brand Colors

### Backgrounds
| Name | Hex | Usage |
|------|-----|-------|
| void | `#000A12` | Body bg, CTA section |
| abyss | `#001220` | Hero, stats section |
| deep | `#00192E` | Services section |
| slate | `#0C2D48` | Card bg, borders, social icons |

### Accents
| Name | Hex | Usage |
|------|-----|-------|
| blue | `#2EA3F2` | Primary accent, CTA buttons, links |
| blue-light | `#5BB8F5` | Hover states |
| teal | `#26D1BD` | Teal pills, secondary accent |
| teal-light | `#5EEBD5` | Hover states |

### Text
| Name | Hex | Usage |
|------|-----|-------|
| white | `#FFFFFF` | Headings |
| ink-bright | `#CBD5E1` | Hero body copy |
| ink | `#94A3B8` | Secondary text, descriptions |
| ink-muted | `#475569` | Footer text |

### Component Colors
| Component | BG | Border |
|-----------|-----|--------|
| Service card | `#0C2D48` | `#1A3A55` |
| Stat card | `#0C2D48` | `#1A3A55` |
| Pill (teal) | `#082A24` | none |
| Pill (blue) | `#0A2540` | none |
| Email card outline | — | `#0C2D48` |
| Ghost button border | — | `#1E293B` |

---

## Typography

### Fonts
```
Headings: 'Syne', Helvetica, Arial, sans-serif
Body:     'DM Sans', Helvetica, Arial, sans-serif
```
Web fonts loaded via `@font-face` inside `@media screen {}`.
Outlook falls back to Helvetica/Arial automatically.

### Scale
| Element | Size | Weight | Color | MSO Overrides Required |
|---------|------|--------|-------|----------------------|
| Hero heading | 30px | 700 | `#FFFFFF` | Yes |
| Section heading | 22px | 700 | `#FFFFFF` | Yes |
| CTA heading | 24px | 700 | `#FFFFFF` | Yes |
| Body copy | 15px | 400 | `#CBD5E1` | No |
| Card title | 15px | 600 | `#FFFFFF` | No |
| Card description | 13px | 400 | `#94A3B8` | No |
| Pill label | 12px | 600 | `#26D1BD` or `#2EA3F2` | No |
| Stat number | 24px | 700 | `#2EA3F2` or `#FFFFFF` | No |
| Footer | 12px | 400 | `#475569` | No |

### MSO Heading Overrides (required on every h1/h2)
```css
mso-line-height-rule: exactly;
mso-margin-top-alt: 0;
mso-margin-bottom-alt: Xpx;  /* match margin-bottom value */
```

---

## Component Patterns

### Pill Badge (Teal variant)
```html
<table border="0" cellpadding="0" cellspacing="0" style="margin-bottom: 18px;">
    <tr>
        <td bgcolor="#082A24" style="background-color: #082A24; border-radius: 50px; padding: 6px 14px;">
            <table border="0" cellpadding="0" cellspacing="0"><tr>
                <td valign="middle" style="padding-right: 8px; font-size: 8px; color: #26D1BD; line-height: 1;">&#9679;</td>
                <td valign="middle" style="font-family:'DM Sans', Helvetica, Arial, sans-serif; font-size: 12px; font-weight: 600; color: #26D1BD; letter-spacing: 0.5px; line-height: 1;">Label</td>
            </tr></table>
        </td>
    </tr>
</table>
```
Blue variant: `bgcolor="#0A2540"`, color `#2EA3F2`

### CTA Button (gradient with border trick)
```html
<table border="0" cellpadding="0" cellspacing="0"><tr>
    <td bgcolor="#2EA3F2" style="background-color:#2EA3F2; border-radius:10px;">
        <a href="URL" class="btn-primary"
           style="background-color:#2EA3F2; background:linear-gradient(135deg, #2EA3F2 0%, #26D1BD 100%); border:1px solid #2EA3F2; font-family:'DM Sans', Helvetica, Arial, sans-serif; font-size:14px; line-height:14px; padding:14px 28px; color:#ffffff; display:block; border-radius:10px; font-weight:600;">
            Button Text &#8594;
        </a>
    </td>
</tr></table>
```
**`border: 1px solid #2EA3F2`** matching the bg color tricks Outlook into respecting padding on `<a>`.
**`background-color`** before `background: linear-gradient()` provides solid fallback.

### Ghost Button
```html
<td bgcolor="#001220" style="background-color:#001220; border-radius:10px;">
    <a href="URL" class="btn-ghost"
       style="background-color:#001220; border:1px solid #1E293B; ... color:#94A3B8; display:block; border-radius:10px;">
        Button Text
    </a>
</td>
```

### Service Card (with icon image)
```html
<table width="100%" bgcolor="#0C2D48" style="background-color:#0C2D48; border-radius:14px; border:1px solid #1A3A55;">
    <tr>
        <td style="padding: 18px; font-family:'DM Sans', Helvetica, Arial, sans-serif;">
            <table style="margin-bottom: 6px;"><tr>
                <td width="36" valign="middle" style="padding-right: 12px;">
                    <img alt="" width="36" height="36" src="URL" style="display:block; width:36px; height:36px; border:0; border-radius:10px;" />
                </td>
                <td valign="middle" style="font-size:15px; font-weight:600; color:#FFFFFF;">Title</td>
            </tr></table>
            <p style="margin:0; font-size:13px; color:#94A3B8; line-height:1.6;">Description.</p>
        </td>
    </tr>
</table>
```

### Stat Card
```html
<table bgcolor="#0C2D48" style="background-color:#0C2D48; border-radius:12px; border:1px solid #1A3A55; width:100%;">
    <tr>
        <td align="center" style="padding: 16px 6px;">
            <p style="margin:0 0 3px 0; font-size:24px; font-weight:700; color:#2EA3F2; font-family:'Syne', Helvetica, Arial, sans-serif; line-height:1;">38%</p>
            <p style="margin:0; font-size:10px; color:#94A3B8; font-family:'DM Sans', Helvetica, Arial, sans-serif; line-height:1.3;">Label</p>
        </td>
    </tr>
</table>
```

### Card Outline Border (connects all sections)
```
Hero:     border: 1px solid #0C2D48; border-bottom: none;   + border-radius top
Accent:   border-left/right: 1px solid #0C2D48
Services: border-left/right: 1px solid #0C2D48
Stats:    border-left/right: 1px solid #0C2D48
CTA:      border: 1px solid #0C2D48; border-top: none;      + border-radius bottom
```

---

## Brevo Integration

### Variables
| Variable | Purpose |
|----------|---------|
| `{{ unsubscribe }}` | Unsubscribe link (CAN-SPAM required) |
| `{{ mirror }}` | View in browser |
| `{{ contact.FIRSTNAME }}` | First name personalization |
| `{{ contact.EMAIL }}` | Recipient email |

### Lists
| List | ID | Purpose |
|------|----|---------|
| Consultations | #3 | Demo/contact form |
| Newsletter | #4 | Blog/footer subscribers |

### Sender
- Name: Squatch Marketing
- Email: marketing@squatchmarketing.com
- ID: 1
- Free plan: does NOT support `tag` parameter

---

## Email Sections (template order)

| # | Section | bgcolor | Border | Content |
|---|---------|---------|--------|---------|
| 1 | **Logo** | none | none | Centered logo image |
| 2 | **Hero** | `#001220` | top + sides | Teal pill + heading + body + dual buttons |
| 3 | **Accent Bar** | `#2EA3F2` | sides | 3px color bar |
| 4 | **Services** | `#00192E` | sides | Blue pill + heading + icon cards + optional mockup |
| 5 | **Stats** | `#001220` | sides | 3-column metric cards |
| 6 | **CTA** | `#000A12` | bottom + sides | Teal pill + heading + body + button |
| 7 | **Footer** | `#000A12` | none (outside card) | Social + contact + legal |

---

## Testing Checklist

- [ ] Width holds at 600px in browser
- [ ] Width constrained in HubSpot previewer
- [ ] Width constrained in Outlook 2016 preview
- [ ] Dark backgrounds render in all clients
- [ ] Buttons clickable and properly padded
- [ ] Pill badges left-aligned, no box outlines
- [ ] Rounded corners visible in modern clients (square in Outlook — OK)
- [ ] Icons load from `squatchmarketing.com/emails/icons/`
- [ ] Logo loads from `squatchmarketing.com/emails/squatch-logo.png`
- [ ] Mockup image loads (if used)
- [ ] `{{ unsubscribe }}` link present
- [ ] Mobile responsive (buttons stack, padding adjusts)
- [ ] Under 102KB total (Gmail clips above this)
- [ ] Card outline border continuous from hero to CTA

---

## File Structure

```
emails/
  base-template.html          ← GOLDEN TEMPLATE (commit 5e22c83)
  EMAIL-GUIDELINES.md         ← This file
  WORKFLOW.md                  ← Production workflow
  assets/
    components.html            ← Asset designer (open in browser)
    export.cjs                 ← Puppeteer export script
  campaigns/
    welcome-to-the-pack.html   ← First campaign
```

---

## Hosted Assets

| Asset | URL |
|-------|-----|
| Logo | `squatchmarketing.com/emails/squatch-logo.png` |
| Icons | `squatchmarketing.com/emails/icons/icon-*.png` |
| Mockups | `squatchmarketing.com/emails/mockup-*.png` |

Available icons: `icon-strategy`, `icon-web`, `icon-email`, `icon-content`, `icon-ai`, `icon-check`
Available mockups: `mockup-dashboard`, `mockup-workflow`, `mockup-stats`, `mockup-digital-marketing`, `mockup-email-marketing`, `mockup-website-dev`, `mockup-ai-workflows`, `mockup-content-design`

---

*Based on CareCloud production email templates (proven across Outlook 2010-2021)*
*Golden template: commit 5e22c83 | Last updated: 2026-04-01*
