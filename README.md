# Smart Rental — Reusable Car Rental Website Prototype

A **white-label**, mobile-first car-rental website and owner dashboard demo. Use one GitHub repo called **`smart-rental`** and change branding, vehicle data and contact details for each new client.

## Customize a new brand

1. Open `config.js` and change `businessName`, `businessSubtitle`, `city`, `country`, `address`, `primaryColor`, and optional `darkColor`.
2. Add the client's own approved logo to `assets/client-logo.png`, then set `logoPath: 'assets/client-logo.png'`. Leave `logoPath: ''` for the default car icon.
3. Add real phone / WhatsApp / email to `config.js` **only after confirming the correct business contact**. Leave empty for safe demo mode. Set `showDemoBanner: false` only for a fully finished, verified production deployment.
4. Replace `fleet-data.js` and every thumbnail in `assets/` with the client's **approved car models, photos, prices and availability information**. The 60+ sample models were adapted from screenshots for demonstration; listed price periods are unverified.
5. Before production use, replace the localStorage-only demo with real secure backend, availability, staff authentication, data protection and owner-approved rental terms. **GitHub Pages cannot provide a private backend.**

## Publish on GitHub Pages

1. Create a **public** GitHub repository named `smart-rental`.
2. Upload the **contents** of this ZIP into the repo root: `index.html`, `styles.css`, `app.js`, `config.js`, `fleet-data.js`, `.nojekyll`, `README.md` and `assets/`. Do not upload just the ZIP file.
3. Open **Settings → Pages**, choose **Deploy from a branch**, set branch **main** and folder **/(root)**, Save.
4. When published, visit `https://YOUR-USERNAME.github.io/smart-rental/` (replace `YOUR-USERNAME` with your actual GitHub username).

## What works in the demo

- Mobile-first homepage, categories, search, filters and example car details
- Quote inquiry form, recorded **only in the same browser** through localStorage
- Owner dashboard showing new demo inquiries, sample rentals and extensions
- Quick-add walk-in sample rental and customer rental-extension request
- Safe contact behavior: **no WhatsApp messages or emails sent** unless you explicitly configure client contact details; no payment collection

Open the site and try **Cars → Car Details → Request Quote → Owner Demo → Inquiries**. Also try **My Rental → Request Extension → Owner Demo**.

### Important limits

This is **not a live customer booking system**. It does not check availability, send inquiries to a server, or securely manage customer information. No real customer data should be entered or uploaded. Static GitHub Pages sites are publicly visible and public repos expose the source. `noindex` does not make the demo private.

To give multiple companies **separate live websites**, deploy separate copies or branches with different configs and databases; one public repository is your common template, not a single shared client site.


## Car photographs (28 October 2026)

58 optimized WebP vehicle photos have been imported successfully into `assets/` by the GitHub Actions photo-import workflow. The homepage now references the supplied fleet images. `hyundai-staria.webp` and `land-rover-defender.webp` remain from the earlier catalogue imagery until new replacement photographs are supplied. Images must be licensed for commercial use and matched to the actual vehicles before launch.
