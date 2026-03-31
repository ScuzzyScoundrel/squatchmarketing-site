# Squatch Marketing — Email Branding & Development Guidelines

> The definitive reference for building HTML emails that match squatchmarketing.com
> and render correctly in every email client including Outlook 2007–2021.

---

## 1. Brand Identity

### Company Info (for footers & schema)
- **Name:** Squatch Marketing
- **Tagline:** Full-Service Marketing Agency
- **Location:** West Valley City, Utah
- **Phone:** 801-803-2136
- **Email:** marketing@squatchmarketing.com
- **Website:** https://squatchmarketing.com
- **Social:** [Facebook](https://www.facebook.com/squatchmarketing) | [LinkedIn](https://www.linkedin.com/company/squatchmarketing)

### Sender Defaults (Brevo)
- **From Name:** Squatch Marketing
- **From Email:** marketing@squatchmarketing.com
- **Reply-To:** marketing@squatchmarketing.com
- **Sender ID:** 1

---

## 2. Color Palette

All colors derived from the website's `global.css` theme tokens.

### Dark Backgrounds (primary email aesthetic — dark mode first)
| Token         | Hex       | Usage                                      |
|---------------|-----------|----------------------------------------------|
| `void`        | `#000A12` | Email body background                        |
| `abyss`       | `#001220` | Primary card/section background              |
| `deep`        | `#00192E` | Secondary section background                 |
| `navy`        | `#00273F` | Tertiary / hover state backgrounds           |
| `slate`       | `#0C2D48` | Borders, subtle card differentiation         |

### Accent Colors
| Token         | Hex       | Usage                                      |
|---------------|-----------|----------------------------------------------|
| `blue`        | `#2EA3F2` | Primary accent, links, icons                 |
| `blue-light`  | `#5BB8F5` | Secondary link color, hover states           |
| `teal`        | `#26D1BD` | Secondary accent, highlights, badges         |
| `teal-light`  | `#5EEBD5` | Emphasis highlights, tag labels              |

### Text Colors (on dark backgrounds)
| Token         | Hex       | Usage                                      |
|---------------|-----------|----------------------------------------------|
| `white`       | `#FFFFFF` | Headings, hero text                          |
| `ink-bright`  | `#CBD5E1` | Body copy on dark backgrounds                |
| `ink`         | `#94A3B8` | Secondary text, descriptions                 |
| `ink-muted`   | `#475569` | Tertiary text, disclaimers, fine print       |

### Gradients
| Name              | CSS                                                            | Usage             |
|-------------------|----------------------------------------------------------------|-------------------|
| Brand gradient    | `linear-gradient(135deg, #2EA3F2 0%, #26D1BD 100%)`           | CTA buttons       |
| Accent bar        | `linear-gradient(90deg, #2EA3F2 0%, #26D1BD 50%, #2EA3F2 100%)` | Divider lines   |
| Dark gradient     | `linear-gradient(135deg, #000A12 0%, #001220 100%)`           | Dark card sections|
| Section divider   | `linear-gradient(90deg, transparent, rgba(46,163,242,0.12), rgba(38,209,189,0.12), transparent)` | Subtle breaks |

> **Outlook note:** `linear-gradient` is ignored in MSO. Always set a `bgcolor` fallback.

---

## 3. Typography

### Font Stack
```
Primary (headings):  'Syne', Helvetica, Arial, sans-serif
Fallback (body):     'DM Sans', Helvetica, Arial, sans-serif
```

Since `Syne` and `DM Sans` are Google web fonts, they only load in clients that support
`<style>` blocks with `@font-face` (Apple Mail, iOS Mail, Gmail app, some Android clients).
Outlook, Gmail web, and Yahoo fall back to Helvetica/Arial.

### @font-face Declarations (place inside `<style>` in `<head>`)
```html
@media screen {
  @font-face {
    font-family: 'Syne';
    font-style: normal;
    font-weight: 700;
    src: url('https://fonts.gstatic.com/s/syne/v22/8vIS7w4qzmVxsWxjBZRjr0FKM_04uQ6OT1o3dLg.woff2') format('woff2');
  }
  @font-face {
    font-family: 'DM Sans';
    font-style: normal;
    font-weight: 400;
    src: url('https://fonts.gstatic.com/s/dmsans/v15/rP2Hp2ywxg089UriCZOIHTWEBlw.woff2') format('woff2');
  }
  @font-face {
    font-family: 'DM Sans';
    font-style: normal;
    font-weight: 600;
    src: url('https://fonts.gstatic.com/s/dmsans/v15/rP2Hp2ywxg089UriCZOIHTWEBlw.woff2') format('woff2');
  }
}
```

### Type Scale
| Element          | Font               | Size   | Weight | Line Height | Color        |
|------------------|--------------------|--------|--------|-------------|--------------|
| Hero heading     | Syne fallback      | 28–32px| 700    | 1.2         | `#FFFFFF`    |
| Section heading  | Syne fallback      | 20–24px| 700    | 1.3         | `#FFFFFF`    |
| Subheading       | DM Sans fallback   | 16–18px| 600    | 1.4         | `#FFFFFF`    |
| Body copy        | DM Sans fallback   | 14–15px| 400    | 1.6         | `#CBD5E1`    |
| Small / caption  | DM Sans fallback   | 12–13px| 400    | 1.5         | `#94A3B8`    |
| Pill badge text  | DM Sans fallback   | 12px   | 600    | 1.0         | `#26D1BD` or `#2EA3F2` |
| Footer text      | DM Sans fallback   | 12px   | 400    | 1.5         | `#475569`    |

---

## 4. Logo in Email

SVG is **not supported** in most email clients.

### Hosted PNG Logo (primary)
Source: `images/Logos/SquatchLogo 2026 PNG.png` (595x123 RGBA)
Hosted: `public/emails/squatch-logo.png` → `https://squatchmarketing.com/emails/squatch-logo.png`

```html
<a href="https://squatchmarketing.com" style="text-decoration: none;">
  <img src="https://squatchmarketing.com/emails/squatch-logo.png"
       alt="Squatch Marketing"
       width="200" height="41"
       style="display: block; border: 0; width: 200px; height: auto;" />
</a>
```

### Text-Based Fallback (for when images are blocked)
```html
<td style="font-family: 'Syne', Helvetica, Arial, sans-serif;
           font-size: 22px; font-weight: 700; color: #FFFFFF;
           letter-spacing: 1px;">
  <span style="color: #2EA3F2;">&#9670;</span>&nbsp;SQUATCH MARKETING
</td>
```

> **Always include `alt` text.** Many corporate environments block images by default.

---

## 5. Component Patterns

### CTA Button (Outlook-Safe)
```html
<!-- Gradient button with VML fallback for Outlook -->
<table border="0" cellpadding="0" cellspacing="0" role="presentation">
  <tr>
    <td align="center" style="border-radius: 8px; background: linear-gradient(135deg, #2EA3F2 0%, #26D1BD 100%);" bgcolor="#2EA3F2">
      <!--[if mso]>
      <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml"
                   xmlns:w="urn:schemas-microsoft-com:office:word"
                   href="https://squatchmarketing.com/request-demo"
                   style="height:48px;v-text-anchor:middle;width:220px;"
                   arcsize="17%"
                   strokecolor="#2EA3F2"
                   fillcolor="#2EA3F2">
        <w:anchorlock/>
        <center style="font-family:Helvetica,Arial,sans-serif;font-size:15px;font-weight:600;color:#ffffff;">
          Get Started
        </center>
      </v:roundrect>
      <![endif]-->
      <!--[if !mso]><!-->
      <a href="https://squatchmarketing.com/request-demo"
         style="display: inline-block; padding: 14px 32px;
                font-family: 'DM Sans', Helvetica, Arial, sans-serif;
                color: #FFFFFF; text-decoration: none;
                font-weight: 600; font-size: 15px;
                border-radius: 8px;
                background: linear-gradient(135deg, #2EA3F2 0%, #26D1BD 100%);">
        Get Started &#8594;
      </a>
      <!--<![endif]-->
    </td>
  </tr>
</table>
```

### Ghost/Outline Button (Outlook-Safe)
```html
<table border="0" cellpadding="0" cellspacing="0" role="presentation">
  <tr>
    <td align="center" style="border: 2px solid #2EA3F2; border-radius: 8px;">
      <!--[if mso]>
      <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml"
                   xmlns:w="urn:schemas-microsoft-com:office:word"
                   href="https://squatchmarketing.com/solutions"
                   style="height:48px;v-text-anchor:middle;width:200px;"
                   arcsize="17%"
                   strokecolor="#2EA3F2"
                   fillcolor="#001220">
        <w:anchorlock/>
        <center style="font-family:Helvetica,Arial,sans-serif;font-size:14px;font-weight:600;color:#2EA3F2;">
          Learn More
        </center>
      </v:roundrect>
      <![endif]-->
      <!--[if !mso]><!-->
      <a href="https://squatchmarketing.com/solutions"
         style="display: inline-block; padding: 12px 28px;
                font-family: 'DM Sans', Helvetica, Arial, sans-serif;
                color: #2EA3F2; text-decoration: none;
                font-weight: 600; font-size: 14px;">
        Learn More
      </a>
      <!--<![endif]-->
    </td>
  </tr>
</table>
```

### Accent Divider Bar
```html
<table border="0" cellpadding="0" cellspacing="0" width="100%" role="presentation">
  <tr>
    <td style="padding: 0;">
      <!--[if mso]>
      <table width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
        <td style="background-color:#2EA3F2;font-size:1px;line-height:4px;" height="4">&nbsp;</td>
      </tr></table>
      <![endif]-->
      <!--[if !mso]><!-->
      <div style="height: 4px; background: linear-gradient(90deg, #2EA3F2 0%, #26D1BD 50%, #2EA3F2 100%);"></div>
      <!--<![endif]-->
    </td>
  </tr>
</table>
```

### Card Container (Glass-Style on Dark)
```html
<table border="0" cellpadding="0" cellspacing="0" width="100%" role="presentation"
       style="border-radius: 16px; border: 1px solid rgba(255,255,255,0.06);"
       bgcolor="#001220">
  <!--[if mso]>
  <tr><td style="background-color:#001220; padding: 30px;">
  <![endif]-->
  <!--[if !mso]><!-->
  <tr><td style="background-color: #001220; padding: 30px; border-radius: 16px; border: 1px solid rgba(255,255,255,0.06);">
  <!--<![endif]-->
    <!-- Card content here -->
  </td></tr>
</table>
```

### Pill Badge (replaces eyebrow labels — matches website pattern)
```html
<!-- Teal variant -->
<table border="0" cellpadding="0" cellspacing="0" role="presentation">
  <tr>
    <td style="border-radius: 50px; border: 1px solid rgba(38,209,189,0.15);
               padding: 6px 14px; background-color: rgba(38,209,189,0.06);"
        bgcolor="#041F1B">
      <table border="0" cellpadding="0" cellspacing="0" role="presentation">
        <tr>
          <td valign="middle" style="padding-right: 8px;">
            <!--[if mso]><span style="font-size:10px;color:#26D1BD;">&#9679;</span><![endif]-->
            <!--[if !mso]><!-->
            <div style="width:7px;height:7px;border-radius:50%;background-color:#26D1BD;"></div>
            <!--<![endif]-->
          </td>
          <td valign="middle" style="font-family:'DM Sans',Helvetica,Arial,sans-serif;
              font-size:12px;font-weight:600;color:#26D1BD;letter-spacing:0.5px;line-height:1;">
            Label Text
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
```
> For a blue variant, swap `#26D1BD` → `#2EA3F2` and `rgba(38,209,189,...)` → `rgba(46,163,242,...)`

### Button Hovers (progressive enhancement)
Add these in the `<style>` block — only works in clients that support `<style>` (Apple Mail,
iOS, Gmail app, some Android). Outlook and Gmail web ignore them gracefully.
```css
a.btn-primary:hover {
  background: linear-gradient(135deg, #5BB8F5 0%, #5EEBD5 100%) !important;
  box-shadow: 0 12px 40px rgba(46,163,242,0.35), 0 0 60px rgba(38,209,189,0.12) !important;
}
a.btn-ghost:hover {
  border-color: rgba(46,163,242,0.4) !important;
  background-color: rgba(46,163,242,0.08) !important;
}
a.footer-link:hover {
  color: #5BB8F5 !important;
}
```
> Add `class="btn-primary"`, `class="btn-ghost"`, or `class="footer-link"` to your `<a>` tags.

---

## 6. Email Layout Structure

### Standard Width
- **Max width:** 600px
- **Mobile breakpoint:** 600px
- **Body padding:** 30px top/bottom, 15px left/right (on outer wrapper)
- **Card padding:** 40px desktop, 20px mobile
- **Minimum touch target:** 44px for buttons/links

### Design Philosophy — All Dark, Always
Emails are **dark-mode-first** to match squatchmarketing.com. No white/light sections.

| Section       | Background                  |
|---------------|-----------------------------|
| Body wrapper  | `#000A12` (void)            |
| Hero card     | `#001220` (abyss)           |
| Content area  | `#00192E` (deep)            |
| Glass cards   | `rgba(255,255,255,0.03)` on `#0C2D48` MSO fallback |
| CTA card      | `#000A12` (void)            |
| Footer        | transparent on void         |

### Section Order (recommended)
1. **Header** — PNG logo (centered)
2. **Hero** — Dark glass card, pill badge + gradient headline + body + dual CTAs
3. **Accent bar** — 3px gradient divider
4. **Content** — Dark glass cards with icon + title + description blocks
5. **Mockup image** — (optional) Screenshot of website section as PNG
6. **Section divider** — Subtle gradient line
7. **Stats row** — Metric cards with gradient numbers
8. **CTA** — Darkest card with pill + heading + CTA button
9. **Footer** — Social, contact, legal links, Brevo unsubscribe

---

## 7. Email Development Rules

### MUST — Required for every email

1. **DOCTYPE:** Use XHTML 1.0 Transitional
   ```html
   <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
     "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
   ```

2. **XML namespaces** for Outlook VML:
   ```html
   <html xmlns="http://www.w3.org/1999/xhtml"
         xmlns:v="urn:schemas-microsoft-com:vml"
         xmlns:o="urn:schemas-microsoft-com:office:office">
   ```

3. **MSO OfficeDocumentSettings** in `<head>`:
   ```html
   <!--[if gte mso 9]><xml>
     <o:OfficeDocumentSettings>
       <o:AllowPNG/>
       <o:PixelsPerInch>96</o:PixelsPerInch>
     </o:OfficeDocumentSettings>
   </xml><![endif]-->
   ```

4. **Table-based layout** — No `<div>` for structure. All layout via `<table>`.

5. **Inline styles on every element** — Never rely solely on `<style>` blocks.
   The `<style>` block is a progressive enhancement for clients that support it.

6. **`bgcolor` attribute on every element with a background color** — MSO ignores
   CSS `background-color` on many elements but respects the HTML attribute.

7. **`role="presentation"`** on all layout tables for accessibility.

8. **`border="0" cellpadding="0" cellspacing="0"`** on every `<table>`.

9. **Images:** Always include `width`, `height`, `alt`, `style="display:block; border:0;"`.

10. **Unsubscribe link:** Use Brevo's `{{ unsubscribe }}` variable. Required by CAN-SPAM.

11. **Physical address** in footer. Required by CAN-SPAM.

### MUST — Outlook-Specific (IF MSO)

12. **VML buttons** — Outlook ignores `border-radius` and `background: linear-gradient(...)`.
    Use `v:roundrect` with `arcsize` for rounded corners and `fillcolor` for solid color.

13. **MSO table wrappers** for max-width containers:
    ```html
    <!--[if (gte mso 9)|(IE)]>
    <table width="600" align="center" cellpadding="0" cellspacing="0" border="0"><tr><td>
    <![endif]-->
      <!-- Your max-width table here -->
    <!--[if (gte mso 9)|(IE)]>
    </td></tr></table>
    <![endif]-->
    ```

14. **MSO line-height fix** on headings:
    ```html
    style="mso-line-height-rule: exactly;"
    ```

15. **MSO margin reset** on headings:
    ```html
    style="mso-margin-top-alt: 0; mso-margin-bottom-alt: 16px;"
    ```

16. **`mso-table-lspace: 0pt; mso-table-rspace: 0pt;`** on all `<table>` and `<td>`.

### SHOULD — Best Practices

17. **Preheader text** — Hidden preview text with zero-width spacer padding:
    ```html
    <div style="display:none !important; visibility:hidden; mso-hide:all;
                font-size:1px; color:#000A12; line-height:1px;
                max-height:0; max-width:0; opacity:0; overflow:hidden;">
      Preview text here&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;...
    </div>
    ```

18. **Responsive `@media` queries** — Progressive enhancement for mobile:
    ```css
    @media screen and (max-width: 600px) {
      .container { width: 100% !important; }
      .mobile-padding { padding: 20px !important; }
      .mobile-stack { display: block !important; width: 100% !important; }
      .mobile-hide { display: none !important; }
      .mobile-full { width: 100% !important; text-align: center !important; }
    }
    ```

19. **Text-size-adjust** reset on `body`:
    ```css
    -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%;
    ```

20. **Link colors** — Override default blue links:
    ```css
    .appleLink a { color: #94A3B8 !important; text-decoration: none !important; }
    ```

### NEVER — Prohibited

- **No JavaScript** — Stripped by all email clients
- **No `<form>` elements** — Unreliable rendering
- **No `position: absolute/fixed`** — Breaks in Outlook
- **No `float`** — Inconsistent across clients
- **No `flex` or `grid`** — Zero Outlook support
- **No `margin` on `<td>`** — Use `padding` instead
- **No shorthand CSS** — Use `padding-top`, `padding-right`, etc. individually
  (shorthand `padding: 10px 20px` is OK, but `font` shorthand is not)
- **No `max-width` without MSO table wrapper** — Outlook ignores max-width
- **No SVG images** — Use PNG with 2x resolution
- **No CSS `background-image`** without MSO VML fallback
- **No `rem`/`em` units** — Use `px` only
- **No CSS variables** — Zero support
- **No `<div>` for layout** — Tables only
- **No embedded video** — Use a thumbnail image with play button linking to hosted video
- **No emoji icons** — Render inconsistently across clients. Use clean Unicode geometric
  symbols (`◆` `◇` `◊` `▪`) in tinted icon boxes instead. Match the website's `rounded-md bg-blue/15` pattern.

### Mobile Button Stacking

Side-by-side buttons MUST stack vertically on mobile. Apply `class="mobile-btn-stack"`
to each button's `<td>`. The responsive CSS handles the rest:
```css
.mobile-btn-stack { display: block !important; width: 100% !important; padding: 0 !important; margin-bottom: 10px !important; }
.mobile-btn-stack table { width: 100% !important; }
.mobile-btn-stack a { display: block !important; width: 100% !important; text-align: center !important; box-sizing: border-box !important; }
```

### Icon Boxes (replaces emoji)

Use tinted rounded boxes with Unicode geometric characters. Alternate blue/teal tints.
```html
<!--[if mso]>
<table cellpadding="0" cellspacing="0" border="0" role="presentation"><tr>
    <td style="width:36px;height:36px;background-color:#0C2D48;text-align:center;
               vertical-align:middle;font-family:Helvetica,Arial,sans-serif;
               font-size:16px;color:#2EA3F2;">&#9670;</td>
</tr></table>
<![endif]-->
<!--[if !mso]><!-->
<div style="width:36px;height:36px;border-radius:10px;
            background-color:rgba(46,163,242,0.12);text-align:center;
            line-height:36px;font-family:Helvetica,Arial,sans-serif;
            font-size:16px;color:#2EA3F2;">&#9670;</div>
<!--<![endif]-->
```

Available symbols: `&#9670;` (◆), `&#9671;` (◇), `&#9674;` (◊), `&#9642;` (▪), `&#9654;` (▶)

---

## 8. Testing Checklist

Before sending any campaign:

- [ ] **Brevo test email** — Send to yourself via `send_test_email`
- [ ] **Gmail web** — Check rendering (strips `<style>` block)
- [ ] **Gmail app (iOS/Android)** — Check mobile rendering
- [ ] **Apple Mail** — Full CSS support, verify web fonts load
- [ ] **Outlook 365 web** — Check rendering
- [ ] **Outlook desktop (Windows)** — The acid test. VML buttons, bgcolor fallbacks
- [ ] **Dark mode** — Gmail, Apple Mail, Outlook all have dark mode overrides
- [ ] **Images off** — Verify alt text is meaningful, layout doesn't break
- [ ] **Link check** — Every URL resolves, UTM params are correct
- [ ] **Unsubscribe** — `{{ unsubscribe }}` resolves to working Brevo link
- [ ] **Spam score** — Subject line not flaggy, text-to-image ratio is healthy
- [ ] **Mobile** — Touch targets >= 44px, text readable without zoom

---

## 9. Brevo-Specific Variables

| Variable             | Purpose                     |
|----------------------|-----------------------------|
| `{{ unsubscribe }}`  | Unsubscribe link (required) |
| `{{ mirror }}`       | View in browser link        |
| `{{ contact.EMAIL }}`| Recipient email             |
| `{{ contact.FIRSTNAME }}` | First name             |
| `{{ contact.LASTNAME }}`  | Last name              |
| `{{ update_profile }}` | Update preferences link   |

---

## 10. Campaign Types & List Mapping

| Campaign Type          | Brevo List | Target Audience              |
|------------------------|------------|------------------------------|
| Newsletter             | #4         | Blog/footer subscribers      |
| Consultation follow-up | #3         | Demo/consultation requesters |
| Welcome sequence       | #4         | New subscribers (automated)  |
| Promo / announcement   | #3 + #4    | All contacts                 |

---

## 11. Mockup Images — Website-to-Email Visual Pipeline

Our website has rich HTML mockups (dashboard, AI workflow diagrams, stats strips) that
are too complex for email HTML but make **excellent visual assets** as PNG screenshots.

### Workflow: Capture Website Sections as Email Images

1. **Identify** the website section you want (hero dashboard, workflow diagram, stats bar)
2. **Screenshot** at exactly 1200px wide (2x for retina, renders at 600px in email)
3. **Crop** to just the mockup — no surrounding whitespace beyond the card border
4. **Optimize** — TinyPNG or similar, target under 150KB per image
5. **Save** to `public/emails/` with a descriptive name (e.g., `mockup-dashboard.png`)
6. **Deploy** — next Cloudflare push makes it live at `squatchmarketing.com/emails/`

### Available Website Sections for Capture
| Section              | Page      | Description                                    |
|----------------------|-----------|------------------------------------------------|
| Campaign Dashboard   | `/` hero  | Glass card with metrics, chart bars, counters  |
| AI Workflow Diagram  | `/` below | 3-step brief → generate → deploy flow          |
| Results Strip        | `/`       | 38% open rate, 4.2x ROAS, 10x faster stats    |
| Solution Cards       | `/solutions` | Individual service mockups                  |

### Embedding in Email
```html
<td style="padding: 0 24px 32px 24px;">
  <img src="https://squatchmarketing.com/emails/mockup-dashboard.png"
       alt="Campaign dashboard showing real-time analytics"
       width="552" height="auto"
       class="mockup-img"
       style="display: block; border: 0; width: 100%; max-width: 552px;
              height: auto; border-radius: 12px;" />
</td>
```

### Creating New Mockups
You can also build standalone HTML mockup files in `emails/mockups/` that are
specifically designed to be screenshotted — simpler than the website versions,
optimized for 600px email width, with static data. Use Puppeteer, Playwright,
or a browser screenshot tool to capture them.

> **Tip:** Keep text-to-image ratio above 60:40 for spam score health. Mockup images
> should supplement text content, not replace it.

---

## 12. File Organization

```
squatchmarketing-site/
  public/
    emails/
      squatch-logo.png           ← Hosted logo (595x123 source, display at 200w)
      mockup-dashboard.png       ← Screenshot captures (future)
      mockup-workflow.png
  emails/
    EMAIL-GUIDELINES.md          ← This file
    base-template.html           ← Production-ready dark base template
    mockups/                     ← Standalone HTML for screenshot capture (future)
    campaigns/                   ← Sent campaign archives
```

---

## 13. Dark Mode — Why We Don't Worry About It

Our emails are **all-dark by design** — `#000A12` body, `#001220` cards, light text.
This means:
- Email clients in light mode see our dark brand exactly as intended
- Email clients in dark mode have nothing to invert — everything already works
- No need for `prefers-color-scheme` overrides or light-to-dark swaps

We declare `<meta name="color-scheme" content="dark">` in the `<head>` to tell
clients we're intentionally dark. This prevents aggressive auto-inversion in
Outlook and Apple Mail.

---

*Last updated: 2026-03-31*
*Derived from squatchmarketing.com global.css theme tokens*
