# KLMAQAN — React frontend for Projects / Project Detail

A headless setup: WordPress stays your backend (content, ACF fields,
taxonomies), this Vite + React app renders the `/projects` listing and
`/project/:slug` detail page by talking to the WP REST API.

## 1. WordPress side — fix the REST API first

You got `rest_no_route` when hitting `/wp-json/wp/v2/project`. That means the
`project` post type isn't exposed over REST yet.

1. Install **ACF to REST API** plugin (you already chose this route) and
   activate it.
2. Add the file `wordpress/klmaqan-headless-api.php` from this project to
   your site as a **must-use plugin**:
   - Create the folder `wp-content/mu-plugins/` if it doesn't exist.
   - Copy `klmaqan-headless-api.php` into it.
   - No activation needed — mu-plugins load automatically.
3. Open `wordpress/klmaqan-headless-api.php` and update the CORS origins
   list (search for `your-react-app-domain.com`) with your real production
   URL once you have one.
4. Verify it worked — these should now return JSON, not a 404:
   - `https://klmaqan.w3icon.com/wp-json/wp/v2/project`
   - `https://klmaqan.w3icon.com/wp-json/wp/v2/property-status`
   - A single project should include a `klmaqan_fields` object with
     `property_price`, `bedrooms`, `payment_planner`, etc.

   If it's still 404 after that, your `register_post_type('project', ...)`
   call may be using a plugin (e.g. Pods, Custom Post Type UI) rather than
   code — in that case, look for a "Show in REST API" toggle in that
   plugin's UI for the `project` post type and each taxonomy, and flip it on
   instead of relying on the forced override in the mu-plugin.

5. The enquiry form on the detail page posts to a new endpoint,
   `POST /wp-json/klmaqan/v1/enquiry`, which emails the site admin via
   `wp_mail()`. Swap this for Contact Form 7's REST endpoint if you'd
   rather keep using CF7 — just change the `submitEnquiry()` call in
   `src/api/wordpress.js`.

## 2. React app

```bash
npm install
npm run dev      # http://localhost:5173
```

Set the WordPress base URL in `.env`:

```
VITE_WP_BASE_URL=https://klmaqan.w3icon.com
```

Build for production:

```bash
npm run build    # outputs to dist/
```

## What's implemented

- **`/projects`** — hero, taxonomy filters (builder, location, property
  type, status, price range, beds) matching your original filter form,
  quick-filter pills for status, and a responsive project grid.
- **`/project/:slug`** — hero banner, quick details (beds/baths/area/price
  per sq ft), description (`the_content()`), developer/payment
  plan/property type/handover table, key features tags (ACF repeater),
  Google Map embed, payment plan timeline (ACF repeater), related projects
  (same status), and a sticky enquiry sidebar form.

## What's simplified vs. the original PHP

- The original `single-project.php` gallery/lightbox/tab-popup used ~600
  lines of vanilla JS for a slider and modal. This version shows the
  featured image only. If your projects have an ACF gallery field with
  multiple images, add a `gallery` field in ACF, expose it in the
  `klmaqan_fields` REST callback (in the PHP file), and I can wire up a
  proper `<Gallery />` component with a lightbox on top of it.
- The "Facilities / Interior / Floor Plan" overview popup in the PHP was
  static placeholder content (not driven by real project data) — it's
  omitted here. Let me know if those should pull from real ACF fields.
- Styling assumes generic Tailwind tokens (`amber-700`, `stone-*`,
  `neutral-*`) and the `Manrope` / `Alata` fonts, matching the classes used
  in your PHP templates. If your theme has a custom `tailwind.config`
  (extra colors, spacing, etc.) share it and I'll bring those tokens over
  exactly.

## Still to do (tell me if you want these next)

- Header/footer/nav matching the rest of the site (this scaffold has a
  minimal header so the pages are self-contained).
- Pagination or infinite scroll if you have many projects.
- Real multi-image gallery + lightbox.
- Wiring the "Facilities/Interior/Floor Plan" popup to real content.
