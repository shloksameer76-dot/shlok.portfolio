# Session Handoff — Portfolio Site Work (Updated)

**Project root:** `/Users/shlok/Shlok Updated Port`
**Git:** local repo, origin = `/Users/shlok/GitHub/shlok.portfolio.realprojects` (not a real GitHub remote — nothing pushed to actual GitHub yet)
**Local dev server:** `python3 -m http.server 3000` run from project root. Dies frequently between turns — if the preview looks broken/blank, restart it first:
```bash
cd /Users/shlok/Shlok Updated Port && pkill -f "python3 -m http.server" 2>/dev/null; sleep 1; nohup python3 -m http.server 3000 > /tmp/server.log 2>&1 & sleep 2
```
**Deployed site:** `https://shlok-portfolio-realprojects.vercel.app` — **NOT updated** with anything from this session. Nothing has been committed or pushed to git either (`git status --short` shows a long list of modified/untracked files, all uncommitted).

---

## Source asset locations (check here before asking user to re-export from Figma)

- `/Users/shlok/Documents/Shlok/PEER ROBOTICS /` (note trailing space in folder name) and its subfolders:
  - `caseee/` — Peer Robotics + early DBS assets
  - `Merlin designs/` — Merlin AI assets
  - `Merlin designs/thine/` — all Thine assets (images, videos, gifs)
- User re-exports the same filename repeatedly with updated content (e.g. `merlinheroo.png` changed 3+ times in one session) — **always check file mtime/hash before assuming a cached copy is current**.
- When user pastes an image inline in chat, it's not directly accessible via Bash — ask them to save it to disk and give the filename. They often reference files by partial/approximate name (e.g. "merlin.52" meant `merlin53.png`, "thine2331" meant `thine21331.png`) — search by mtime (`find ... -mmin -20`) or fuzzy match when the literal name doesn't exist.
- No `ffmpeg` on this machine. Use macOS's built-in `avconvert` for video conversion: `avconvert -s in.mov -o out.mp4 -p PresetHighestQuality -prog`. PIL/Pillow is available via `pip3 install Pillow` if pixel-level image inspection is needed (e.g. finding transparent/opaque regions, measuring frame bezel bounds).

---

## Design system (case study pages)

635px centered column, numbered sections (`00 / 05` etc.), Switzer (headings) + Inter (labels) fonts, colors `--c-heading:#404040` `--c-body:#868686` `--c-dark:#191919` `--border:#e0e0dd`. Live IST clock in nav. Lightbox on image click (skips `arrow-` filenames). `.reveal` class + IntersectionObserver for scroll-fade-in.

**Video embedding rule (established this session):** always pair a `.mov` source with a `.mp4` fallback — Chrome/Firefox/Edge cannot play `video/quicktime`, only Safari can. A `.mov`-only video is *invisible* (not broken-icon, just blank) in non-Safari browsers. Convert with `avconvert` as above.

---

## `real-projects.html` (homepage) — current state

**Width:** Currently **1124px** centered content column (`max(16px, calc((100% - 1124px)/2))` used as horizontal padding formula across nav/intro/work-sec/about/footer — this centers a fixed-width column while keeping full-bleed section backgrounds). Two backup files preserve alternate versions:
- `real-projects.fullwidth-backup.html` — original full-width layout (no width constraint)
- `real-projects.566w-backup.html` — 566px version (regenerate 1124px from it via `sed 's/566px/1124px/g'`, they're a straight numeric swap of each other)

**Nav:** back to original `inset:0 0 auto 0` (a "push down 200px" experiment was tried and undone). Bottom border removed (`border-bottom` deleted from `.nav`).

**Hero (`.intro`):** unchanged, has its own load-triggered fade-in (`.intro__text.visible`, separate from the blur-reveal system below).

**Work section project cards, current order:**
1. **Peer Robotics** — full-width (`ar-16-7`)
2. **DBS Bank + Merlin AI** — two-column (`.tg`)
   - DBS Bank: `ar-4-5` (matches Swivl Tech height), image `dbs-hero.png`, `object-fit:contain; object-position:bottom`, background `#1C1C1C`, `transform:scale(1)` (was scaled down/up during experimentation, currently full scale)
   - Merlin AI: `ar-1-1`, image `system/merlin-ai/homepage-hero.png` (**currently `merlin53.png`** — this file gets swapped often, always check latest), `object-fit:contain; object-position:bottom`, background `#352542`
3. **Thine** — full-width (`ar-16-7`), image `system/thine-ai/hero.png` (currently `thine53.png` content)
4. **Swivl Tech + Fynd** — two-column, unchanged
5. **Hyperlab** — full-width, unchanged

**Project card header font sizes:** `.pm-name` and `.pm-year` reduced by 4px: `clamp(11px,1.4vw,16px)` (was `clamp(15px,1.4vw,20px)`).

**LinkedIn section:** entire `<section class="li-sec">` **removed** from the page (was between Thine/Swivl row and About section). Its CSS rules (`.li-sec`, `.li-text`, `.li-body` etc.) are still defined but unused/harmless dead code.

**About section — fully redesigned this session**, several iterations, final state:
- Structure: `.about-center` (namerow only) → `.about-body` (paragraphs + link), NOT nested — `.about-body` is a sibling, not a child, so it can span full width independently of `.about-center`
- `.about-namerow`: "Shlok Shetye" left, "2026." right, `justify-content:space-between`, spans full width (matches About page's own `.intro__namerow` typography: 20px, weight 500, `-0.05em` letter-spacing, `#404040`)
- Headline **removed entirely** ("Building the future where technology feels human." — deleted, not just hidden)
- Body: 3 paragraphs (condensed from original 5), **left-aligned**, full width
- "More about me →" link: positioned **below the body paragraphs**, **right-aligned** (`.about-link--right{align-self:flex-end}`) — went through several position changes (top-right next to "2026.", then below-left, then below-right) before landing here
- **Known CSS trap:** a stray `.about-body .about-link{align-self:flex-start}` rule was left behind during one iteration and silently overrode later alignment attempts due to higher specificity — already fixed/removed, but if alignment on this link ever "doesn't take effect" again, check for duplicate/conflicting rules first before assuming the edit didn't apply.

**Bottom-anchored "blur-reveal" system — new, added this session:**
- Separate from the existing `.reveal` (IntersectionObserver-based) system used on Work section cards
- Ported **exactly** from `about.html`'s scroll-position blur algorithm: `.blur-reveal` class (base: just `will-change`), JS computes `progress = (viewportHeight - elementTop) / 220px` on scroll, sets inline `opacity`/`filter:blur()`/`transform:translateY()` — plus an "at bottom of page" override that force-reveals everything if the user has scrolled all the way down (prevents content getting stuck blurred if there's no more room to scroll)
- Applied to: the 3 About paragraphs + link, and all footer elements (label, name, 3 contact links)

**Footer:** restyled from a huge dark (`#0B0B0B` background, up to 140px Geist text) block to match About's minimal Switzer typography (16px, `#404040`/`#191919`, light `#f2f2f0` background). Border-top divider above it was added then removed per request.

**Section gap experiment:** briefly tried +25% padding on major section boundaries (intro/work-sec/about/footer), then **reverted** — the +25% increase ended up applied to `.fr`/`.tg` (spacing *between project rows within* the work section) instead, which is what's currently live: `clamp(17.5px,3.125vw,75px)` (was `clamp(14px,2.5vw,60px)`).

---

## `thine-ai-case-study.html`

Section numbering is `00/04` through `05/04` (6 sections total, labelled 0-indexed but referred to colloquially as "1st section" through "6th section").

- **Hero placeholder** (top, before "00/04 Overview") → filled with `system/thine-ai/hero-cover.png` (train-window silhouette image, "thine — Co-founder to your life")
- **Below "00/04 Overview"** (colloquially "1st section"): **two** video blocks stacked:
  1. `system/thine-ai/onboarding.mp4` (portrait, 1290×2796, light blue `#eef6fa` background) — the onboarding flow video
  2. `system/thine-ai/thine2k.mp4` (landscape, 1280×676, grey `#e5e5e5` background) — added later per "add one more grey section below the other"
  - Note: `system/thine-ai/onboarding-4k.mp4` also exists on disk (copied from a file literally named `thine4k` with no extension, confirmed via `file` to be MP4) but was **not** wired into the page — the user's follow-up message pointed at `thine2k.mp4` instead and that's what's actually embedded. Worth confirming with user whether the 4k file should replace it somewhere.
- **"03/04 Use Cases" section** ("4th section"): a composited **iPhone frame + GIF** — this took real debugging, documented in detail below since it'll bite again if touched carelessly.
- **"04/04 Positioning"** ("5th section"): plain white (`#fff`) placeholder, empty, waiting for an iPhone 17 prototype screenshot
- **"05/04 For the Life You're Building"** ("6th section"): same, plain white placeholder, empty

### The iPhone-frame + GIF composite (important, easy to break)

`system/thine-ai/iphone-frame.png` (946×1882) is an **empty iPhone mockup with a fully opaque white screen** — confirmed via Pillow pixel sampling, `alpha=255` everywhere, not a transparent cutout. This means:

- You **cannot** put the GIF/video *behind* the frame image — the opaque white screen will completely hide it.
- The GIF must render **on top** (`z-index` higher than the frame), sized/positioned to exactly cover the white screen rectangle only (not the dynamic-island notch area above it, which needs to stay visible).
- Measured screen bounds (as % of the 946×1882 frame, found via horizontal/vertical pixel-transition scanning): `left:8.669% top:9.351% width:85.010% height:87.566%`. These intentionally exclude the dynamic island cutout (roughly y:47–176px) so the frame's notch graphic stays visible above the video content.
- **The bug that happened:** first implementation had the z-index backwards (frame:2, gif:1) — the opaque frame painted over the gif, screen looked blank white. Fixed by swapping to gif:2, frame:1. **If this composite ever looks blank again, check z-index ordering first.**

Currently uses `system/thine-ai/onboarding.gif` as the composited content (the same onboarding flow, as a GIF instead of the mp4).

---

## `merlin-agent-case-study.html`

- Hero placeholder (top) → `system/merlin-ai/case-hero.png` (purple gradient "Merlin AI — World's most complete AI workspace" branding splash)
- "02/05 Key Features" → `system/merlin-ai/chat-history.png`, `aspect-ratio:2564/1484; object-fit:contain` (no cropping)
- "03/05 Use Cases" → video, `trew.mov` + `trew.mp4` fallback
- "04/05 How It Works" → 1 grey placeholder (still empty) + video `merlin4.mov` + `merlin4.mp4` fallback
- 1 grey placeholder between Overview and Success Metrics still has the original `demo.mov`+`demo.mp4` video

---

## `peer-robotics-case-study.html`

- "02/08 The Challenge": 1 full-width placeholder filled with `system/peer-robotics/branding-1.png` (logo on red gradient) + 2 half-width placeholders below it, **still empty**
- "05/08 Dashboard Deep Dive": filled with `system/peer-robotics/dashboard-home.jpg`
- Second carousel added after "04/08 Solution" (concept-1.png through concept-4.png, early dashboard explorations) — matches the existing carousel's arrows/dots/lightbox styling
- **Both carousels auto-play**: start 1s after scrolling into view, advance every 3s, timer resets on manual interaction (arrow/dot click)

---

## `about.html`

Replaced the old stub (leftover Labs-page clone, hidden project cards, one bio sentence) with the full version from `/Users/shlok/GitHub/shlok.portfolio.realprojects/about.html`: Intro, "Me" bio, Experience, Contact sections. Backups exist as `about-backup.html` and `about.html.bak` (unclear which is from which session — check both if reverting).

**Experience section updated this session:**
- Added new entry: **Thine (Foyer Tech)**, Product Designer (Contract), **July 2026 – Present** — "Designing across Foyer Tech's product suite — scaling Merlin, an AI agent used by over 20 million users, and shaping Thine, a privacy-first personal intelligence app..."
- Studio Carbon (full-time) end date changed: Jan 2026 → **April 2026**

Both nav "About" and homepage "More about me →" link to this same `about.html` — always have, that was never actually broken, just the content inside it was wrong before.

---

## `shlok-portfolio/labs.html` and `shlok-portfolio/process.html`

- `labs.html`: card grid rebuilt into uniform phone-frame-silhouette + grey-placeholder-screen + caption grid. The 3 view-toggle icons now control column count (1/2/3, default 2) instead of varying layouts. Only Depth AI card is clickable. Dead Figma MCP asset URLs fixed with local paths + `onerror` fallback.
- `process.html`: new file, same interactive layout as `labs.html`, serves as the "Case Studies" index page. Nav loop works both ways (`labs.html` → "Case Studies" → `process.html` → "Labs" → back).

---

## Known unrecoverable / outstanding items

- **Hyperlab's 2 images** (`../OneDrive/Documents/Frame 2134285827.png`, `Frame 2134285597.png`) — confirmed permanently gone (searched whole disk), degrade gracefully via `onerror` but need re-export from Figma if wanted back.
- **Merlin Agent case study**: 1 grey placeholder in "04/05 How It Works" still empty; hero hasn't been reconfirmed against the very latest `merlin53.png`/`merlin42.png` exports — may be worth double-checking it's using the current preferred image.
- **Peer Robotics**: 2 of 3 placeholders in "02/08 The Challenge" still empty.
- **Thine**: "05/04 Positioning" and "06/04 For the Life You're Building" white placeholders empty, waiting for iPhone 17 prototype screenshots per user's plan. `onboarding-4k.mp4` sitting on disk unused — confirm with user if it should go somewhere.
- **Git**: nothing committed. `git status --short` shows the modified/untracked file list above — worth reviewing with `git diff` before committing, since `dbs-case-study.html`, `fynd-case-study.html`, `hyperlab-case-study.html`, `swivl-case-study.html` show as modified but weren't touched this session (leftover from an earlier session, per the previous handoff note).
- **Nothing deployed** — Vercel site unchanged.
