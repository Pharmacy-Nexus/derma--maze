# Derma-Maze Drug Index V4

## What changed

The master Word list was imported into the website and normalized into one searchable drug and therapeutic-agent index.

- 236 named mentions in the source document
- 211 unique normalized records
- 20 records referenced in more than one chapter
- 355 dermatology-related dosage-form rows
- 26 records marked **Form review needed**

## Unique records by chapter

These counts are not additive because a single record can appear in more than one chapter.

- Bacterial: 53
- Fungal: 65
- Viral: 62
- Parasitic: 34
- Mycobacterial: 19

## Normalization rules

- Synonyms were merged, such as `Rifampin / Rifampicin` and `Isoniazid / INH`.
- Duplicate mentions across chapters were stored once, while all chapter locations were preserved.
- Fixed combinations remain separate records where the source listed the combination as a distinct therapeutic product.
- Vaccines, immune products, supportive agents and procedures named in the source remain searchable, but are classified separately from conventional drugs.

## Scientific forms and Egypt availability

`Dermatology Forms` describes the dermatology-related route and dosage form, independently of whether a local Egyptian product exists.

`Egypt Availability` is tracked for every form separately. All statuses are intentionally set to **Market review pending** until a dated Egyptian-market verification is completed.

No Egyptian brand or availability claim should be published without a source and verification date.

## Content boundary

The index contains identification and navigation data only. It intentionally excludes:

- doses and treatment duration
- first-line or alternative treatment ranking
- diagnosis and treatment algorithms
- contraindications, interactions and monitoring
- pregnancy and paediatric recommendations
- clinical pearls copied from the book

## Files

- `data/drugs/drugs.js` — normalized records
- `js/pages/drugs.js` — search, filters, cards, dialog and pagination
- `css/pages/drugs.css` — page design
- `drugs.html` — public page
- `docs/drug-index-v4-summary.json` — machine-readable import summary
