# Derma-Maze Smart Drug Index

## Fixed content rule

The page is a **Smart Drug Index + Book Locator**, not a treatment database.

It may display:

- Generic name and searchable aliases
- Drug class and subclass
- Dermatology-related dosage forms
- Route for each displayed form
- Egyptian availability for each form as a separate field
- Verified Egyptian brands, when available
- Verification date
- Chapter, section, and page locator

It must not display:

- Doses or treatment duration
- First-line or alternative treatment choices
- Diagnosis or treatment algorithms
- Pregnancy, pediatric, contraindication, monitoring, or interaction guidance
- Clinical pearls or scientific tables copied from the book

## The key data distinction

`dermatologyForms` represents scientifically relevant forms in dermatology. A form remains listed even when it is not marketed in Egypt.

`egyptStatus` represents current Egyptian market availability for that exact form. It must never be inferred from the scientific form.

Supported statuses:

- `available`: a current Egyptian product has been verified
- `not_verified`: no current Egyptian product has been verified
- `pending`: the market review has not been completed
- `unknown`: insufficient data

The interface calculates `partial` automatically when only some forms are verified as available.

## Record example

```js
{
  id: 'example-drug',
  name: 'Example Drug',
  aliases: ['Alternative spelling'],
  class: { ar: 'الفئة', en: 'Class' },
  subclass: { ar: 'التصنيف الفرعي', en: 'Subclass' },
  category: 'antifungal',
  dermatologyForms: [
    {
      id: 'oral-tablet',
      route: 'oral',
      form: { ar: 'أقراص فموية', en: 'Oral tablets' },
      egyptStatus: 'available',
      verifiedAt: '2026-07-20',
      brands: ['Verified Brand']
    },
    {
      id: 'topical-cream',
      route: 'topical',
      form: { ar: 'كريم موضعي', en: 'Topical cream' },
      egyptStatus: 'not_verified',
      verifiedAt: '2026-07-20',
      brands: []
    }
  ],
  book: {
    chapter: 'fungal',
    section: { ar: 'اسم القسم', en: 'Section name' },
    page: 84
  },
  recordStatus: 'reviewed'
}
```

## Publishing workflow

1. Confirm the scientific dermatology forms.
2. Enter every relevant form even when unavailable in Egypt.
3. Verify the Egyptian market separately for each form.
4. Add only verified local brands.
5. Add the verification date.
6. Confirm the exact chapter, section, and page.
7. Change `recordStatus` from `draft` to `reviewed`.

The bundled records are draft design examples and should not be published as final market data without review.
