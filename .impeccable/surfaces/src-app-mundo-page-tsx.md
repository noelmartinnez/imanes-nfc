---
version: 1
slug: "src-app-mundo-page-tsx"
primary_target: "src/app/mundo/page.tsx"
related_targets: ["src/components/mundo/Mundo.tsx"]
---

## Scope

`/mundo`: full-screen interactive globe inside the established Pasaporte world (DESIGN.md). Extension, not a new identity: no direction round. Mode: Experience (the globe leads). Entry point from the home header.

## Audience and job

Owner and home visitors on a phone. Job: spin and zoom the world, see at a glance which countries have photos, tap one, see its places pinned, open a place's page.

## Direction contract

THESIS: The world as an engraved security-print globe: the same paper, guilloché line work and stamp inks as the passport; countries with photos are inked like their stamp. Refuses the 3D glossy earth, satellite textures and the Google-Maps look.

OWN-WORLD: Inherited. Paper ocean (papel-hondo) with guilloche graticule, land in papel with texto-suave hairlines, visited countries filled at ~20% of their stamp ink with an ink outline, double rim like a stamp ring; no shadows, no glow, no gradients. Controls in condensed caps; mono only for counts.

STORY: Arrive → globe drifting slowly with the visited countries inked → grab it (drift stops, inertia on release) → tap an inked country → globe flies to it and zooms, pins land on each place, a paper sheet rises with the places → open a place.

FIRST VIEWPORT (390×844): back link + microline header on a paper band; globe centred in the free band between header and controls, ~90% of width in portrait (raised from 84% so small countries get more touch area) and 88% of the free height in landscape; bottom: row of country chips in their ink (flag + name) and +/− zoom buttons on the right. On wide screens the header shares the controls' 16px left axis. Ocean carries the paper's guilloché waves (screen-fixed, it is the paper); visited countries carry the stamp ink's grain, multiplied.

FORM: Extension of the Pasaporte world (seed key 597ceb6e). Signature: fly-to (ease-in-out quart, 450–950ms by distance, geometric zoom) + pins entering with 40ms stagger + sheet rising with ease-drawer, draggable to dismiss (0.11 px/ms). Reduced motion: no drift, no inertia, jump cuts.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

## Unresolved

Real photos (and their GPS) pending; current pins use manual city-centre coords.
