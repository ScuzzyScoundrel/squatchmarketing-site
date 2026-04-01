# Squatch Marketing — Email Production Workflow

> Complete instructions for building emails, exporting assets, and deploying campaigns.
> This is the operational playbook. For brand rules see `EMAIL-GUIDELINES.md`.

---

## Quick Reference

```bash
# Preview asset components in browser
open emails/assets/components.html

# List all exportable assets
node emails/assets/export.cjs --list

# Export all assets to public/emails/
node emails/assets/export.cjs

# Export a single asset
node emails/assets/export.cjs mockup-dashboard

# Deploy to Cloudflare
git add public/emails && git commit -m "Update email assets" && git push
```

---

## 1. Building a New Email Campaign

### Step 1: Copy the base template
```bash
cp emails/base-template.html emails/campaigns/campaign-name.html
```

### Step 2: Customize content
Edit the copied file — swap placeholder text for real copy:
- Preview text (hidden preheader)
- Pill badge labels
- Headings and body copy
- Button text and URLs
- Card titles and descriptions
- Stats numbers

### Step 3: Add mockup images (optional)
Insert between any sections:
```html
<tr>
    <td style="padding: 0 24px 20px 24px;">
        <img src="https://squatchmarketing.com/emails/mockup-dashboard.png"
             alt="Campaign analytics dashboard"
             width="552"
             style="display: block; width: 100%; max-width: 552px; height: auto; border: 0; border-radius: 12px;" />
    </td>
</tr>
```

### Step 4: Test
1. Paste HTML into HubSpot's email code editor for preview
2. Check: width holds at 600px, content renders, buttons work
3. Outlook 2016 will have square corners and solid colors — acceptable

### Step 5: Deploy to Brevo
Use the Brevo MCP server or API to create/update the campaign.

---

## 2. Asset Export Pipeline

### How It Works

```
emails/assets/components.html     Design components here (open in browser)
         |
         v
node emails/assets/export.cjs     Puppeteer screenshots each [data-export] element
         |
         v
public/emails/                    PNGs saved here (icons/ subfolder for icons)
         |
         v
git push                          Auto-deployed to Cloudflare Pages
         |
         v
squatchmarketing.com/emails/      Live URLs for use in email <img> tags
```

### Adding a New Icon

1. Open `emails/assets/components.html`
2. Add a new icon box in the Icons section:
```html
<div>
    <p class="label">Icon Name (color)</p>
    <div class="icon-box blue" data-export="icon-name">
        <svg fill="none" viewBox="0 0 24 24" stroke="#2EA3F2" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="PASTE HEROICON PATH HERE"/>
        </svg>
    </div>
</div>
```
3. Find icon paths at https://heroicons.com — copy the `<path>` element
4. Use class `blue` (bg `#0A1E30`, stroke `#2EA3F2`) or `teal` (bg `#0A2520`, stroke `#26D1BD`)
5. Export: `node emails/assets/export.cjs icon-name`
6. Push: `git add public/emails/icons && git push`

### Adding a New Mockup

1. Open `emails/assets/components.html`
2. Add a new mockup in the Mockups section:
```html
<p class="label">Mockup Name</p>
<div class="mockup-container" data-export="mockup-name">
    <div class="mockup-panel">
        <div class="mockup-chrome">
            <div class="chrome-dot"></div><div class="chrome-dot"></div><div class="chrome-dot"></div>
            <span class="chrome-label">Panel Title</span>
        </div>
        <div class="mockup-body">
            <!-- Your mockup content here -->
        </div>
    </div>
    <!-- Optional floating card -->
    <div class="float-card bottom-left" style="width: 180px;">
        <!-- Floating card content -->
    </div>
</div>
```
3. Available CSS classes for mockups:
   - `.mockup-container` — 552px wrapper with padding for floating cards
   - `.mockup-panel` — Main panel with dark bg and border
   - `.mockup-chrome` — Title bar with dots
   - `.mockup-body` — Content area
   - `.float-card` — Floating overlay card (add `.bottom-left`, `.top-right`, or `.bottom-right`)
   - `.mini-metric` — Small metric card
   - `.progress-row` — Horizontal progress bar
   - `.mini-bars` — Vertical bar chart
4. Export: `node emails/assets/export.cjs mockup-name`
5. Push: `git add public/emails && git push`

### Exporting Only What Changed
```bash
node emails/assets/export.cjs mockup-name    # Single component
node emails/assets/export.cjs icon-name      # Single icon
node emails/assets/export.cjs                # All (slower but safe)
```

---

## 3. Current Asset Library

### Icons (72x72 source, display at 36x36)
| Name | Color | URL |
|------|-------|-----|
| `icon-strategy` | Blue (chart) | `/emails/icons/icon-strategy.png` |
| `icon-web` | Teal (code brackets) | `/emails/icons/icon-web.png` |
| `icon-email` | Blue (envelope) | `/emails/icons/icon-email.png` |
| `icon-content` | Blue (paintbrush) | `/emails/icons/icon-content.png` |
| `icon-ai` | Teal (sparkles) | `/emails/icons/icon-ai.png` |
| `icon-check` | Teal (checkmark) | `/emails/icons/icon-check.png` |

### Mockups (552px wide, @2x retina)
| Name | Description | Has Floating Cards |
|------|------------|-------------------|
| `mockup-dashboard` | Campaign metrics + weekly chart | No |
| `mockup-workflow` | AI 3-step workflow diagram | No |
| `mockup-stats` | Stats strip (38%, 4.2x, 10x, 92%) | No |
| `mockup-digital-marketing` | Ad performance + platform breakdown | CTR card |
| `mockup-email-marketing` | Email template preview + engagement | Metrics + automation badge |
| `mockup-website-dev` | Browser with page builder | Lighthouse + responsive badge |
| `mockup-ai-workflows` | Brand engine terminal | Output summary + speed badge |
| `mockup-content-design` | Brand book colors/typography | Engagement chart |

All URLs prefixed with `https://squatchmarketing.com`

---

## 4. Template Architecture

### Container (Cerberus pattern)
- `<table width="600">` as HTML attribute — the universal constraint
- `table-layout: fixed` scoped to `.email-container` only
- MSO ghost table `<!--[if mso]><table width="600">` for Outlook
- Triple background: `<body>` + `<center>` + MSO `<table>`
- Mobile override: `@media (max-width: 600px) { .email-container { width: 100% } }`

### Dark Sections
- `bgcolor` + `background-color` on `<td>` — no VML needed for solid colors
- VML is ONLY needed for background images (not currently used)

### Buttons (Cerberus border trick)
- `<td bgcolor="#2EA3F2">` for background
- `<a style="border: 1px solid #2EA3F2; display: block; padding: 14px 28px;">` — border matching bg tricks Outlook into respecting padding
- `background-color` fallback BEFORE `background: linear-gradient()` for gradient buttons

### Pill Badges
- Inner `<table>` with dot `<td>` + label `<td>`
- `border-radius: 50px` for pill shape (ignored by Outlook)
- Tinted `bgcolor` for the background

---

## 5. Brevo Campaign Deployment

### Creating a Campaign
```
MCP tool: mcp__brevo__create_email_campaign
Required: name, subject, htmlContent
Optional: sender, replyTo, listIds
Note: Free plan does NOT support the "tag" parameter
```

### Updating a Campaign
```
MCP tool: mcp__brevo__update_email_campaign
Required: campaignId
Optional: name, subject, htmlContent, recipients
```

### Sending a Test
```
MCP tool: mcp__brevo__send_test_email
Required: campaignId, emailTo
```

### Lists
| List | ID | Purpose |
|------|----|---------|
| Consultations | #3 | Demo/contact form submissions |
| Newsletter | #4 | Blog/footer subscribers |

### Sender
- Name: Squatch Marketing
- Email: marketing@squatchmarketing.com
- Sender ID: 1

---

## 6. File Structure

```
squatchmarketing-site/
  emails/
    WORKFLOW.md                    This file
    EMAIL-GUIDELINES.md            Brand rules, colors, typography, dev rules
    base-template.html             Cerberus-based production template
    assets/
      components.html              Visual component designer (open in browser)
      export.cjs                   Puppeteer export script
    campaigns/                     Saved campaign HTML files (future)
  public/
    emails/
      squatch-logo.png             Hosted logo
      mockup-*.png                 Exported mockup images
      icons/
        icon-*.png                 Exported icon images
        icon-*.svg                 Source SVG files
```

---

## 7. Prerequisites

### One-Time Setup
```bash
# Chrome dependencies for Puppeteer (Ubuntu/WSL)
sudo apt-get install -y libnspr4 libnss3 libatk1.0-0 libatk-bridge2.0-0 \
  libcups2 libdrm2 libxkbcommon0 libxcomposite1 libxdamage1 libxrandr2 \
  libgbm1 libasound2t64 libpango-1.0-0 libcairo2

# Puppeteer (already in package.json as devDependency)
npm install
```

### Verify Setup
```bash
node emails/assets/export.cjs --list
# Should show all 14 components
```

---

*Last updated: 2026-04-01*
