# Mehedul — Video Editor Portfolio

A cinematic, dark-mode portfolio built with plain HTML, CSS, and JavaScript
(Tailwind-style utility spacing hand-rolled in `style.css`, GSAP + ScrollTrigger
for animation, and Lenis for smooth scroll). No build step, no frameworks —
upload it as-is.

The site is two pages: a **home page** (bio, services, experience, clients,
testimonials, contact) and a separate **portfolio page** with all the project
work, filters, and video previews. A "View Portfolio" button in the navbar
and hero links from the home page to the portfolio page.

## File structure

```
index.html          → home page markup (hero, about, services, experience,
                       clients, testimonials, contact)
portfolio.html       → portfolio page markup (filter bar, project grid,
                       video modal)
style.css            → design tokens, layout, glassmorphism, responsive rules
                       — shared by both pages
script.js            → GSAP animations, cursor, particles, etc. for index.html
portfolio.js         → GSAP animations, cursor, project grid/filters/modal
                       for portfolio.html
assets/
  images/            → put your profile photo / thumbnails here
  videos/            → optional, not used by the portfolio player (videos are
                       embedded from YouTube — see section 3); keep this folder
                       only if you want a local copy of your raw footage
  icons/             → optional extra icons
README.md
```

## 1. Open it locally

No build tools needed. Either:

- Double-click `index.html` to open it directly in a browser, **or**
- Serve it locally for the best experience (some browsers restrict video/canvas
  features on the `file://` protocol):

  ```bash
  # from inside the project folder
  npx serve .
  # or
  python3 -m http.server 5500
  ```

  Then visit `http://localhost:5500` (or whatever port is printed).

## 2. Upload to Netlify

**Option A — drag and drop**
1. Go to [app.netlify.com/drop](https://app.netlify.com/drop).
2. Drag the whole project folder onto the page.
3. Netlify deploys it instantly and gives you a live URL.

**Option B — Git**
1. Push this folder to a GitHub/GitLab/Bitbucket repo.
2. In Netlify: **Add new site → Import an existing project**.
3. Build command: leave blank. Publish directory: `/` (project root).

## 3. Replace the portfolio videos (via YouTube — no video files to host)

Each project card on the **Portfolio page** (`portfolio.html`) opens a modal
that plays a **YouTube video through an embed**, so you never need to upload
raw video files to the site itself. The flow is:

1. Upload your video to YouTube as normal.
2. On the video's **Visibility** setting, choose **Unlisted** (not Private —
   Private videos can't be embedded on outside sites; Unlisted can, and it
   still won't show up in search or on your channel page).
3. Open the video, click **Share → Embed**, and copy just the **video ID**
   out of the embed URL. For example, if the embed code contains
   `https://www.youtube.com/embed/dQw4w9WgXcQ`, the ID is the part after
   `/embed/`: `dQw4w9WgXcQ`.
4. Open `portfolio.js` and find the `projects` array (search for `const projects =`).
   Each project object has a `youtube` field — replace the placeholder ID with
   your own:

   ```js
   { cat: 'commercial', label: 'Commercial', title: 'Nova Skincare — Launch Film',
     desc: '...', grad: '...', youtube: 'dQw4w9WgXcQ' }
   ```

That's it — no files go into `assets/videos/` anymore. When a visitor clicks
a project card, `openModal()` in `portfolio.js` points the modal's `<iframe>` at
`https://www.youtube-nocookie.com/embed/<your-video-id>` and it plays right
there in the modal (the visitor never has to leave your site or land on
youtube.com). Closing the modal clears the iframe's `src`, which stops
playback.

**Thumbnails are automatic** — as soon as a project has a `youtube` ID, its
card on the "Work" grid pulls YouTube's own thumbnail for that video
(`https://img.youtube.com/vi/<id>/maxresdefault.jpg`, YouTube's highest-quality
auto-generated thumbnail). If a video doesn't have that high-res version
available, the site quietly falls back to YouTube's standard thumbnail
(`hqdefault.jpg`), so there's always an image and nothing ever looks broken.
You don't need to upload or set a thumbnail yourself — it's tied directly to
the `youtube` ID you already put in `portfolio.js`. The gradient (`grad`) is only
used as an instant-loading background color behind the thumbnail while it
loads, so you can leave those values as they are.

## 4. Replace the profile image

The About section now has a circular profile photo slot, already wired up in
`index.html`:
```html
<img src="assets/images/profile.jpg" alt="Mehedul" class="profile-photo" onerror="this.style.display='none'">
```
1. Save your photo as `assets/images/profile.jpg` (any square-ish photo works
   best — it's cropped into a circle).
2. That's it — the page picks it up automatically. Until you add the file,
   the image quietly hides itself instead of showing a broken-image icon.
3. Sizing/border/glow are controlled by `.profile-photo` in `style.css` if
   you want to adjust it.

## 5. Edit contact information

There's no contact form anymore — visitors reach out directly via four
highlighted buttons (`.contact-cta` in `index.html`/`style.css`): **WhatsApp**,
**Facebook**, **Email**, and **YouTube**. Open `index.html` and search for the
`#contact` section — each button needs two things updated: the link's `href`
and the visible detail text underneath the label.

- **WhatsApp** (`.cta-whatsapp`): replace the number in **both** places — the
  `href="https://wa.me/8801000000000"` and the visible `+880 10 000 00000`
  text — with your own number in international format (no `+`, no spaces,
  e.g. `8801712345678`).
- **Facebook** (`.cta-facebook`): replace `href="https://facebook.com/yourpage"`
  and the visible `facebook.com/yourpage` text with your actual Page or
  profile URL.
- **Email** (`.cta-email`): replace `href="mailto:hello@mehedul.studio"` and
  the visible `hello@mehedul.studio` text with your own address.
- **YouTube** (`.cta-youtube`): replace `href="https://youtube.com/@yourchannel"`
  and the visible `youtube.com/@yourchannel` text with your channel URL.
- **Location:** edit the plain text next to "Location" below the buttons.

Each button's color comes from a CSS variable pair (`--cta-grad` /
`--cta-shadow`) set on its class in `style.css`, so you can restyle any one
of them without touching the others. The footer's small `.footer-socials`
icons (FB / LinkedIn / Instagram) are separate and untouched — edit those
`href="#"` placeholders too if you use them.

## 6. Change colors

All colors are defined as CSS custom properties at the top of `style.css`:

```css
:root{
  --bg: #050505;            /* page background */
  --bg-elevated: #111111;   /* cards */
  --accent: #8B5CF6;        /* primary accent */
  --accent-2: #B794F6;      /* lighter accent, used for highlights/text */
  --text: #ffffff;
  --text-secondary: #A1A1AA;
}
```

Change any of these values and the whole site updates — no need to hunt
through individual rules.

## 7. Change fonts

Fonts are loaded from Google Fonts in `index.html`'s `<head>` and referenced
in `style.css`:

```css
--font-display: "Bricolage Grotesque", "Inter", sans-serif; /* headlines */
--font-body: "Inter", sans-serif;                            /* paragraphs, UI */
--font-mono: "JetBrains Mono", monospace;                    /* timecodes, labels */
```

To swap a font: update the Google Fonts `<link>` in `index.html` with the new
family, then change the matching `--font-*` variable in `style.css`.

## Notes

- The scroll progress bar at the very top is styled like a video-editing
  timeline scrubber (a nod to the profession) — it fills as you scroll and
  ends in a small diamond "playhead."
- Section labels use timecode-style formatting (`00:00:00:0X`) instead of
  generic numbering, since this is content a video editor would actually use.
- All animations respect `prefers-reduced-motion` and will simplify
  automatically for users who have that setting enabled.
- The custom cursor and mouse-trail particle canvas automatically disable on
  touch devices.
