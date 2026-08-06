# Aexo reproduction

Production-oriented Next.js reproduction of the Aexo Framer site, using `Unicode IT Website (Copy).fig` as the desktop visual source and the live site for responsive and motion behavior.

## Run locally

```bash
npm install
npm run dev
```

Configure contact delivery with `CONTACT_FORM_WEBHOOK_URL`. Optionally set `CONTACT_FORM_WEBHOOK_SECRET` to add an HMAC SHA-256 signature and `CONTACT_FORM_ALLOWED_ORIGIN` to pin the accepted origin.

## Validation

```bash
npm run typecheck
npm run lint
npm test
npm run build
```

Original Figma rasters are preserved in `public/assets/source`; `public/assets/manifest.json` maps the semantic production filenames back to their archive hashes.
