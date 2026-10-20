---
version: 1
slug: "src-app-viajes-page-tsx"
primary_target: "src/app/(viajes)/page.tsx"
related_targets: ["src/components/pasaporte/Pasaporte.tsx","src/app/(viajes)/layout.tsx","src/app/(viajes)/lista/page.tsx","src/app/(viajes)/mundo/page.tsx"]
---

## Scope

Entry of Worldtour: the passport view (`/`), the shared shell with the view bar (Pasaporte · Mundo · Lista), the country list (`/lista`) and the globe inside the shell (`/mundo`). Visitor mode: Experience. Desktop and phone are equal citizens.

## Audience and job

The owner, and friends or family the owner shows it to, on a laptop or a phone. Job: browse every recorded trip. The passport is the way in; the globe and the list are the other two ways to find a place. Copy: Spanish, neutral, minimal: names, countries, dates.

## Direction contract

THESIS: The passport is the interface, not a picture of one: a burgundy booklet that opens itself, tilts under the hand and turns page by page, one stamp per place, grouped by country. Refuses the travel-site grid of photo cards with a title on a gradient.

OWN-WORLD: The established visa-paper world, expanded: cool mint security paper with guilloché and microprint for pages, rubber-stamp inks (one per country) as the only saturated colour, a deep burgundy grained cover with a foil emblem and lettering in tapa-texto, laser-perforated page numbers, MRZ on the data page. Depth from overlap, stacked page edges and a turning leaf's shade; never box shadows.

STORY: Arrive → the closed passport settles and opens by itself like a book in a fantasy film, pages riffle, the first spread lands and its stamps press one by one → drag or click to turn pages → tap a stamp and it flies into that trip's page.

FIRST VIEWPORT: Desktop: brand and counts on a thin top band; the open spread centred, about 80% of the free height, data page left, first Spain page right; small pager under it; view bar centred at the bottom. Phone: one page at a time, spine on the left, same bar at the bottom within thumb reach.

FORM: Pinned by the user in planning (interactive passport with page turning; three views in one shell); no concept seed was dealt.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

## Unresolved

None blocking. Place pages keep their own brief (`src-app-pais-lugar-page-tsx`) and gain a desktop layout in this run.
