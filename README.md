# Bharat Darshan — Heritage Atlas of India

A Next.js 15 + React 19 + TypeScript starter for an ancient-India-inspired heritage atlas.

## Run locally

1. Install Node.js 20.9 or newer.
2. Extract this ZIP and open the **bharat-darshan** folder in VS Code.
3. In the VS Code terminal, run:

   ```powershell
   npm install
   npm run dev
   ```

4. Open http://localhost:3000

## What's included

- Consistent parchment, deep-maroon and antique-gold visual system.
- Cinematic homepage with slow background drift, atmospheric light, clouds, flying bird silhouettes and floating dust.
- Jharokha-inspired hero frame and ornamental details.
- Original synthesized ambient soundscape (`public/audio/ambient-heritage.wav`) with a gentle sustained drone, airy texture and sparse bell-like tones. This is an original electronic ambience, not a field recording of shehnai, flute or temple bells.
- Visitor-controlled play/pause and volume control. Audio does not autoplay.
- Responsive mobile navigation.
- Explore page with keyword search, region/category filters and UNESCO toggle.
- Monument detail pages, heritage map integration, five-stop journey planner and visited tracking.
- Virtual experience information page, About page and Sources & Credits page.
- Reduced-motion support for visitors who prefer less animation.

## Map setup

The live MapLibre map requires a MapTiler public key. Copy `.env.example` to `.env.local` and set:

```env
NEXT_PUBLIC_MAPTILER_KEY=your_public_key
```

Restart the dev server after changing environment variables. Do not commit private keys.

## Replace or extend the ambience

The included WAV is a synthesized placeholder soundscape made specifically for this project. If you later add a recorded shehnai/flute/temple ambience, use audio you recorded yourself or have a licence to use. Replace `public/audio/ambient-heritage.wav` and update the `src` in `components/audio-toggle.tsx` if you use a different filename/format.

## Before production

- Verify monument descriptions, historical dates, coordinates, UNESCO status and official links against authoritative sources.
- Replace demonstration image URLs with properly licensed, attributed images.
- Add verified Hindi translations and professionally recorded bilingual narrations.
- Add genuine licensed 360° panorama assets and integrate a viewer such as Pannellum or Marzipano.
- Add a routing provider for road distances and route geometry.
- Consider a database such as Supabase if the monument catalogue needs to be maintained online.
- Test all pages and controls on desktop and mobile.

The sample catalogue is illustrative, not a complete scholarly archive.
