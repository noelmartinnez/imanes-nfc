# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Next.js (App Router) + TypeScript + Tailwind CSS v4, deployed on Vercel (`*.vercel.app` for now). Photos live in the repo and are pre-processed with `sharp` by a script. Chosen by the user during planning.

## Users

The owner, and the friends and family the owner shows it to, on a laptop or on a phone in equal measure. They come to browse the trips: relive one, or wander through all of them.

## Product Purpose

Worldtour is an interactive record of every trip the owner has taken (at least, every trip with photos). The entry is a passport that opens itself and can be tilted and paged through, with one stamp per place (a city or town), the stamps of a country sharing its pages. Two other views find the same places: a globe and a list by country (folded until a country is tapped). Each place opens its page with the trip's photos, a full-screen viewer and the date. Success: browsing the passport feels like holding a real one, and any trip is two taps away.

## Positioning

A personal travel passport made of real trips and real photos, never generic.

## Operating Context

- Content is added by dropping photos into a folder per place plus a small JSON file; the passport, globe and list update on build.
- Spain (the home country) always opens the passport; the other countries follow by date of first trip.
- Legacy `/m/<id>` URLs keep redirecting (307) through `content/tags.json` so no old link breaks, but nothing in the site links to them or mentions them.

## Capabilities and Constraints

- Hierarchy: country → place (city/town).
- Per place: name, country, trip date, photos, optional coordinates for the globe.
- Desktop and mobile are equal: the passport shows a two-page spread on wide screens and one page at a time on phones.

## Brand Commitments

Name: Worldtour. Copy is in Spanish, neutral and minimal: names, countries, dates. The photos do the talking. The passport is an invented one, never a copy of an official document.

## Evidence on Hand

The owner's own trip photos for most places; placeholders stand in for the rest and must be visibly temporary. Never use stock photos presented as the owner's.

## Product Principles

1. The passport is the interface, not a picture of one.
2. The photos are the product; the interface recedes once a trip is open.
3. Three ways to find a place (passport, globe, list), one place page.
4. Adding a place must not require touching code.

## Accessibility & Inclusion

Respect reduced motion (the passport opens without animation and pages change with a short fade); full keyboard support (arrow keys turn pages) and screen-reader labels for every page and stamp; alt text per photo when provided.
