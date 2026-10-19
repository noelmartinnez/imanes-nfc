# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Next.js (App Router) + TypeScript + Tailwind CSS v4, deployed on Vercel (`*.vercel.app` for now). Photos live in the repo and are pre-processed with `sharp` by a script. Chosen by the user during planning.

## Users

The owner and the people who visit their home, in equal measure. Someone holds a phone up to a souvenir fridge magnet; an NFC sticker behind it opens this site. The visitor lands cold, on a phone, standing in a kitchen, with no context and no intention of navigating a website. The owner uses it to relive the trip.

## Product Purpose

Each fridge magnet represents a city or town (not a country) that the owner visited — e.g. San Sebastián (Spain), Rome (Italy), Sofia (Bulgaria). Tapping the magnet opens that place's page: the owner's own photos from the trip, a full-screen photo viewer, and the trip date. A home page lists every country and its places. Success: the tap-to-photos moment feels instant and like opening an app, not a website.

## Positioning

A physical object on the fridge becomes a door into the real photos of that trip. The content is personal and real, never generic.

## Operating Context

- NFC stickers: TimesKey NTAG215, 25 mm PVC coin, 504 bytes, not anti-metal; written with NFC Tools on iPhone.
- Stickers store a stable URL `/m/<id>` with a human-readable id (e.g. `/m/donosti`). That route redirects (307, never permanent) to the place page, so content and page URLs can change without rewriting stickers.
- iPhone XS+ and Android read the URL without opening an app; the page opens in the mobile browser.
- Content is added by dropping photos into a folder per place plus a small JSON file.

## Capabilities and Constraints

- Hierarchy: country → place (city/town). One or more magnets can point at the same place.
- Per place: name, country, trip date (the only extra field for now), photos.
- Mobile-first; must also work on desktop.
- Future (unvalidated business): sell cork/wood world maps with NFC magnets where each sticker id redirects to a customer-configured link (e.g. their own Google Photos/iCloud album). The `/m/<id>` redirect layer exists to make that possible; customer photos must not be stored.
- Undecided: final list of places (starting with San Sebastián, Roma, Sofía), custom domain, product name.

## Brand Commitments

No product name yet; use a discreet provisional title. Copy is in Spanish, neutral and minimal: names, countries, dates. The photos do the talking.

## Evidence on Hand

The owner's own trip photos (not yet in the repo). Until they are added, placeholder images stand in and must be visibly temporary. Never use stock photos presented as the owner's.

## Product Principles

1. The photos are the product; the interface recedes.
2. Tap to content in one step: the place page must render fast on a phone and never require navigation to reach the photos.
3. Sticker URLs are forever; everything behind them is changeable.
4. Adding a place must not require touching code.

## Accessibility & Inclusion

Respect reduced motion; full keyboard and screen-reader support for the gallery and viewer; alt text per photo when provided.
