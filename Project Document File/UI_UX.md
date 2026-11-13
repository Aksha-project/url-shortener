# UI/UX Design Specification (UI_UX.md)

## Project: URL Shortener (Backend Learning Project 1)
**Foundational References:**
- [PRD.md](file:///c:/Users/aksha/OneDrive/Desktop/Basic%20Project%20for%20backend/URL%20Shortner/Project%20Document%20File/PRD.md) (Product Requirements Document)
- [TRD.md](file:///c:/Users/aksha/OneDrive/Desktop/Basic%20Project%20for%20backend/URL%20Shortner/Project%20Document%20File/TRD.md) (Technical Requirements Document)
- [ARCHITECTURE.md](file:///c:/Users/aksha/OneDrive/Desktop/Basic%20Project%20for%20backend/URL%20Shortner/Project%20Document%20File/ARCHITECTURE.md) (System Architecture Document)
- [PROJECT_RULES.md](file:///c:/Users/aksha/OneDrive/Desktop/Basic%20Project%20for%20backend/URL%20Shortner/Project%20Document%20File/PROJECT_RULES.md) (Project Rules & Guidelines)
- [FLOW.md](file:///c:/Users/aksha/OneDrive/Desktop/Basic%20Project%20for%20backend/URL%20Shortner/Project%20Document%20File/FLOW.md) (Application Flow & User Journeys)
- [TASKS.md](file:///c:/Users/aksha/OneDrive/Desktop/Basic%20Project%20for%20backend/URL%20Shortner/Project%20Document%20File/TASKS.md) (Implementation Checklist)

---

## 1. Design Goal & Philosophy

The URL Shortener frontend is designed as a **clean, practical, utility-oriented web tool**—built with the understated clarity of a high-quality developer utility rather than an AI-generated SaaS landing page.

### Core Design Principles
- **Utilitarian & Restrained:** Prioritize function, speed, and usability over decorative flourishes.
- **Natural Visual Balance:** Symmetrical, centered layout with compact proportions and comfortable whitespace.
- **Human-Designed Simplicity:** No neon glows, floating decorative cards, glassmorphism, or multi-color gradients.
- **Immediate Feedback:** Clear visual states for idle, loading, success, copy confirmation, and input validation.

---

## 2. Visual Design System

### 2.1 Color Palette
The color system relies on high-contrast, accessible neutral tones paired with a single muted accent color:

| Role | Color Name | Hex Code | Usage |
| :--- | :--- | :--- | :--- |
| **Page Background** | Off-White / Pure White | `#F9FAFB` (body) / `#FFFFFF` (card) | Neutral, calm, and readable backdrop |
| **Primary Text** | Deep Charcoal | `#111827` | Main headings, input text, and link output |
| **Secondary Text** | Slate Gray | `#4B5563` | Subtitles, labels, character hints, and timestamps |
| **Borders & Dividers** | Light Neutral Gray | `#E5E7EB` | Input borders, result container outlines, dividers |
| **Primary Accent** | Muted Slate Blue | `#2563EB` | "Shorten URL" action button and active link color |
| **Accent Hover** | Deep Blue | `#1D4ED8` | Subtle hover state for primary action button |
| **Success Background** | Soft Pale Green | `#ECFDF5` | Success confirmation container background |
| **Success Text** | Forest Green | `#065F46` | "Copied!" feedback and success status text |
| **Success Border** | Light Mint Green | `#A7F3D0` | Subtle outline for success banners |
| **Error Background** | Soft Pale Red | `#FEF2F2` | Validation and server error alert background |
| **Error Text** | Crimson Red | `#991B1B` | Error messages and input validation warnings |
| **Error Border** | Light Rose | `#FECACA` | Border outline for error alerts |

> **Strict Rule:** No purple, pink, neon accents, or multicolor gradient fills.

---

### 2.2 Typography
- **Font Family:** Standard system UI font stack for fast loading and native OS legibility:
  ```css
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  ```
- **Type Scale:**
  - **App Title (`h1`):** `24px` (Desktop) / `22px` (Mobile), font-weight `600`, line-height `1.3`.
  - **Description Subtitle (`p`):** `14px` - `15px`, font-weight `400`, color `#4B5563`.
  - **Input & Button Text:** `14px` - `15px`, font-weight `500`.
  - **Shortened URL Result:** `15px`, font-weight `600`, color `#2563EB`.
  - **Small Labels & Helpers:** `12px` - `13px`, font-weight `400`.
- **Typographic Rules:** Avoid oversized hero typography, extreme letter-spacing, or aggressive font weights.

---

### 2.3 Shapes, Borders, and Shadows
- **Corner Radius:** Modest, rectangular corner rounding:
  - Input fields: `6px`.
  - Buttons: `6px`.
  - Main container / Result card: `8px`.
  - *Strict Rule: No capsule-shaped or pill-shaped buttons.*
- **Borders:** Thin, crisp `1px solid #E5E7EB` borders.
- **Shadows:** Minimal, subtle elevation only where necessary for visual separation:
  - Container shadow: `0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px 0 rgba(0, 0, 0, 0.03)`.
  - *Strict Rule: No glowing dropshadows or glassmorphic blur filters.*

---

## 3. Layout & Page Structure

The application features a single, focused work area centered horizontally and vertically on standard viewports.

```
┌──────────────────────────────────────────────────────────┐
│                                                          │
│                     URL Shortener                        │
│       Paste a long URL below to create a short link      │
│                                                          │
│  ┌────────────────────────────────────────────────────┐  │
│  │ [ Enter long URL (e.g. https://example.com)  ] [Shorten]│  │
│  └────────────────────────────────────────────────────┘  │
│                                                          │
│  ┌─ Result Box (Shown when active) ───────────────────┐  │
│  │ Short URL: http://localhost:8080/aB3k9Z    [ Copy ]│  │
│  └────────────────────────────────────────────────────┘  │
│                                                          │
│  ┌─ Error Box (Shown only on failure) ────────────────┐  │
│  │ Please enter a valid URL starting with http/https  │  │
│  └────────────────────────────────────────────────────┘  │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

### 3.1 Container Specifications
- **Max Width:** `560px` centered horizontally (`margin: 0 auto`).
- **Padding:** `24px` to `32px` internal padding.
- **Background:** Crisp `#FFFFFF` card against a subtle `#F9FAFB` body background.

### 3.2 Responsive Arrangements
- **Desktop ($\ge$ 640px):**
  - The URL input field and the "Shorten URL" button sit side-by-side in a horizontal row (`display: flex; gap: 8px`).
  - The input field expands to fill remaining space (`flex: 1`).
  - The button retains its natural compact width based on padding and label size.
- **Mobile (< 640px):**
  - The URL input field and button stack vertically (`flex-direction: column; gap: 10px`).
  - Both input and button occupy `100%` width with minimum touch target heights of `44px` for effortless tapping.

---

## 4. Component Specifications & Interactive States

### 4.1 Header Component
- **Title:** "URL Shortener" — clean, unambiguous, unpretentious.
- **Subtitle:** "Enter a long URL to generate a short, shareable link."
- Simple bottom margin (`20px`) separating the header from the input form.

### 4.2 URL Input Field
- **Type:** `<input type="url">` with associated `<label>` (visually hidden or explicit helper label).
- **Placeholder:** `https://example.com/long-page-address`
- **Default State:** White background, `1px solid #D1D5DB` border, `#111827` text.
- **Hover State:** Border shifts slightly darker (`#9CA3AF`).
- **Focus State:** `2px solid #2563EB` border with clean outline offset. No blurry neon glow.
- **Disabled State (during loading):** Background changes to `#F3F4F6`, cursor `not-allowed`.

### 4.3 Action Buttons

#### Primary Button: "Shorten URL"
- **Style:** Rectangular, `6px` border radius, solid `#2563EB` background, white text.
- **Padding:** `10px 18px`.
- **States:**
  - *Default:* `#2563EB` background.
  - *Hover:* `#1D4ED8` background.
  - *Active:* `#1E40AF` background.
  - *Disabled / Loading:* `#93C5FD` background with cursor `not-allowed`. Text updates to "Shortening...".

#### Secondary Button: "Copy"
- **Style:** Compact rectangular button positioned directly beside the shortened URL result.
- **Padding:** `8px 14px`.
- **States:**
  - *Default:* Light gray outline button (`border: 1px solid #D1D5DB; background: #FFFFFF; color: #374151`).
  - *Hover:* Background tints to `#F3F4F6`.
  - *Active / Clicked:* Transitions to green text `#065F46` and label changes to "Copied!" for 2 seconds.

---

### 4.4 Result Display Component
- Appears smoothly below the form upon successful URL creation.
- **Appearance:** A compact, functional utility row (not a promotional hero banner):
  - Background: `#F9FAFB`.
  - Border: `1px solid #E5E7EB`.
  - Border radius: `6px`.
  - Layout: Flexbox aligning the generated short link (`http://localhost:8080/xyz123`) on the left and the "Copy" button on the right.
- **Link Behavior:** The shortened URL is rendered as a clickable link (`<a href="..." target="_blank" rel="noopener noreferrer">`) in `#2563EB` with underline on hover.

---

### 4.5 Error and Validation Alerts
- **Inline Placement:** Displayed directly underneath the form input when triggered.
- **Appearance:** Simple alert box with `1px solid #FECACA`, `#FEF2F2` background, and `#991B1B` text.
- **Content:** Concise, human-readable explanations:
  - *"Please enter a URL starting with http:// or https://"*
  - *"Short URL code not found."*
  - *"Unable to connect to server. Please try again."*

---

## 5. UI State Transitions

```
[ Idle State ]
- Empty or pre-filled input
- "Shorten URL" button enabled
- No result or error boxes displayed
        │
        │ User clicks "Shorten URL"
        ▼
[ Loading State ]
- Input disabled
- Button text changes to "Shortening..." (button disabled)
- Any previous errors cleared
        │
   ┌────┴──────────────────────────┐
   │ Success                       │ Failure
   ▼                               ▼
[ Success State ]             [ Error State ]
- Result box appears          - Error alert appears
- Short URL displayed         - Input re-enabled with current text
- "Copy" button ready         - Focus returned to input
- Input remains available     - Button re-enabled to "Shorten URL"
```

---

## 6. Accessibility & Usability (a11y)

1. **Contrast Ratios:** All text combinations satisfy WCAG 2.1 AA requirements (minimum 4.5:1 contrast against backgrounds).
2. **Keyboard Navigation:**
   - User can press `Tab` to navigate naturally: `Input` $\rightarrow$ `Shorten Button` $\rightarrow$ `Short URL Link` $\rightarrow$ `Copy Button`.
   - Pressing `Enter` inside the input field automatically triggers form submission.
3. **Screen Readers:**
   - Explicit `aria-label` or `<label>` on the input field.
   - Dynamic result box uses `aria-live="polite"` so screen readers announce the newly generated short link.
   - Errors use `role="alert"` for immediate accessibility announcements.
4. **Visible Focus Rings:** Standard, distinct browser focus outlines are preserved for all interactive controls.

---

## 7. Frontend Mock Integration Plan

To verify all UI states before connecting to the live Spring Boot backend, the frontend maintains a clean mock toggle:

- **Mock Implementation:** An isolated helper function simulating server response latency (e.g., 400ms delay via `setTimeout`).
- **Mock Success:** Returns a sample payload (`{ shortCode: "xyz789", shortUrl: "http://localhost:8080/xyz789", originalUrl: "..." }`).
- **Mock Validation:** Validates URL prefix locally; returns mock `400 Bad Request` if invalid.
- **Switching Mechanism:** A single boolean or configuration toggle (`USE_MOCK_API = true`) in the frontend API module allows instant switching from mock data to the real backend once the REST API is live.
