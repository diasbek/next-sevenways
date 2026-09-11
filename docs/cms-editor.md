# CMS editor guide

Maps dashboard CMS areas to public pages. Content overlays merge over TypeScript seed (`src/data`, `src/i18n`) when Supabase tables have rows.

## Staging / site gate

Until launch, the public site may be locked by **`SW_SITE_GATE`** (default on). Set `SW_SITE_GATE=0` to disable the under-construction gate; optional code is `SW_SITE_GATE_CODE` (see `.env.example`).

## CMS key → public surface

| Dashboard | Table / key | Public pages |
| --- | --- | --- |
| **Tours** | `sw_destinations`, `sw_resorts`, `sw_tour_offers` | `/`, `/tours/`, `/tours/[slug]/`, `/search/`, `/calendar/` |
| **Offices** | `sw_offices` | `/offices/`, `/contacts/` |
| **Operators** | `sw_operators` | `/offices/` (operators block) |
| **News** | `sw_news` | `/news/`, `/news/[slug]/` |
| **Content** → `home` | `sw_site_copy` key `home` | `/` (hero, destinations lead, hot deals copy, FAQ teaser) |
| **Content** → `faq` | `sw_site_copy` key `faq` | `/faq/` |
| **Content** → `about` | `sw_site_copy` key `about` | `/about/` (hero, who-we-are, trust cards, process) |
| **Content** → `gifts` | `sw_site_copy` key `gifts` | `/gifts/` |
| **Content** → `nav` | `sw_site_copy` key `nav` | Header navigation (all locales) |
| **Content** → `footer` | `sw_site_copy` key `footer` | Site footer |
| **Content** → `meta` | `sw_site_copy` key `meta` | SEO titles/descriptions per route |
| **Content** → `brand` | `sw_site_copy` key `brand` | Logo descriptor |
| **Legal** | `sw_legal_pages` (`privacy`, `terms`) | `/privacy/`, `/terms/` |
| **Settings** | `sw_site_settings` | Contacts/request/booking mode, payments flags |
| **Media** | `sw_media` + storage | Covers and images referenced by CMS rows |
| **Export** | `/dashboard/export/` | JSON backup of CMS tables (not media/secrets) |

## Overlay payload shape (`sw_site_copy`)

Each row: `key` (SiteCopy section) + `payload` jsonb:

```json
{
  "uz": { "...section fields..." },
  "ru": { "...section fields..." },
  "en": { "...section fields..." }
}
```

`getContentMerged` deep-merges `payload[locale]` over seed for that section. For `nav`, the locale value may be a full `NavItem[]` array (replaces seed nav).

## Import seed

Overview → **Import seed → CMS** upserts destinations+resorts+offers, offices, news, and operators from code seed. Re-running updates by primary key.

## Audit

Mutations and imports write best-effort rows to `sw_admin_audit` via `writeAuditLog`.
