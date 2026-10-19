---
version: 1
slug: "src-app-pais-lugar-page-tsx"
primary_target: "src/app/[pais]/[lugar]/page.tsx"
related_targets: ["src/app/page.tsx","src/app/[pais]/page.tsx"]
---

## Scope

Whole site: place page (NFC landing, `/[pais]/[lugar]`), country page (`/[pais]`), home (`/`), full-screen photo viewer, 404. Visitor mode: Experience (the photos lead).

## Audience and job

Owner and home visitors, phone in hand at the fridge, arriving cold from an NFC tap. Job: see where/when, then the photos, then swipe through them full screen. Content: owner's own photos (placeholders until supplied), place, country, trip date. Copy: Spanish, neutral, minimal.

## Direction contract

THESIS: Every magnet is an entry stamp; the place page is the passport visa page where that stamp was pressed, and the photos are what came back. Refuses the dark full-bleed photo app with a sans title on a gradient, and the polaroid/tape scrapbook.

OWN-WORLD: Security-printed visa paper in cool mint-grey (never cream), fine teal/lilac guilloché rosettes and microprint rules; rubber-stamp inks (carmine, violet, cobalt, green) with ragged edges are the only saturated colour, one ink per country; condensed grotesque caps for stamps and names, a technical mono for data and the MRZ band; laser-perforated page numbers. Depth only by overlap, never shadows. The viewer is the passport cover: deep burgundy-black.

STORY: Tap → the stamp says where and when → the photos are already there → one opens full screen and swipes. Home is the whole passport: every stamp, grouped by country.

FIRST VIEWPORT (place, 390×844): perforated page number and microline header (~48px); cover photo full width inside 16px gutters, 4:5, ~58% of height; stamp ~150px pressed over the cover's lower-right corner, rotated a few degrees, country ink; under it the data block on one left axis: LUGAR label + name in condensed caps (~44px), PAÍS + flag, FECHA in mono; first gallery row peeks at the bottom edge. Tapping any photo opens the viewer.

FORM: Passport visa page; position 1 of my ordered list (IMPECCABLE'S PICK card, chosen by the user); seed key 597ceb6e. Signature: the stamp presses once on arrival (scale 1.12→1, opacity, ink settle, ~240ms ease-out); viewer swipes with native scroll-snap and drags down to dismiss with velocity. Raises kept from declined challengers: darkroom → each photo develops from blur to sharp once; Łowicz papercut → depth by overlap only, no shadows; mesophotic dive → one vertical axis rules every line of copy.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

## Unresolved

Real photos and trip dates pending from the owner. Product name pending.
