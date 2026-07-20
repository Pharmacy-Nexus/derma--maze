# Derma-Maze Drug Index Guide

## Purpose

`drugs.html` is an index and locator, not a treatment database. It should help a reader find a drug name and the related Derma-Maze chapter without publishing the book's protected scientific content.

## Files

- `drugs.html` — page structure and SEO
- `css/pages/drugs.css` — page design and responsiveness
- `js/pages/drugs.js` — search, filters, favorites, bilingual UI, and modal
- `data/drugs/drugs.js` — drug records

## Record format

```js
{
  id: 'terbinafine',
  name: 'Terbinafine',
  class: { ar: 'مضاد فطريات', en: 'Antifungal' },
  category: 'antifungal',
  routes: ['oral', 'topical'],
  chapters: ['fungal'],
  featured: true
}
```

Supported categories:

- `antibacterial`
- `antifungal`
- `antiviral`
- `antiparasitic`
- `antimycobacterial`

Supported routes:

- `oral`
- `topical`
- `injectable`

Supported chapters:

- `bacterial`
- `fungal`
- `viral`
- `parasitic`
- `mycobacterial`

## Content boundary

Do not add:

- Doses
- Treatment duration
- First-line or alternative recommendations
- Diagnosis or algorithms
- Pregnancy or pediatric guidance
- Monitoring or adverse-effect tables
- Clinical pearls copied from the book

The page should remain a light searchable index.
