# Task 3-dialogs: Update Dialog Components to Use i18n

## Summary
Successfully migrated all 4 dialog components to use the i18n translation system.

## Changes Made

### 1. post-item-dialog.tsx
- Added `import { useI18n } from '@/lib/i18n'`
- Added `const { t, dir } = useI18n()`
- Replaced 15+ hardcoded Arabic strings with `t()` calls
- Replaced `dir="rtl"` with `dir={dir}`
- Category labels: `t(cat.labelKey)` instead of `cat.label`

### 2. item-detail-dialog.tsx
- Added `import { useI18n } from '@/lib/i18n'`
- Added `const { t, dir, locale } = useI18n()`
- Replaced 25+ hardcoded Arabic strings with `t()` calls
- Replaced `dir="rtl"` with `dir={dir}`
- Category: `t(CATEGORIES.find((c) => c.id === item.category)?.labelKey || 'catOther')`
- Date formatting: `format(date, 'd MMMM yyyy', { locale: locale === 'ar' ? ar : undefined })`
- Verification attempts: `t('verifyAttemptsLeft', { count, max })`
- Wrong answer: `t('verifyWrongAnswer', { count })` / `t('verifyWrongAnswerOne')`

### 3. post-lost-report-dialog.tsx
- Added `import { useI18n } from '@/lib/i18n'`
- Added `const { t, dir } = useI18n()`
- Replaced 12+ hardcoded Arabic strings with `t()` calls
- Replaced `dir="rtl"` with `dir={dir}`
- Category labels: `t(cat.labelKey)` instead of `cat.label`

### 4. ai-match-results.tsx
- Added `import { useI18n } from '@/lib/i18n'`
- Added `const { t, locale } = useI18n()`
- Replaced 10+ hardcoded Arabic strings with `t()` calls
- Category: `t(CATEGORIES.find((c) => c.id === match.item?.category)?.labelKey || 'catOther')`
- Date formatting: `format(date, 'd MMMM yyyy', { locale: locale === 'ar' ? ar : undefined })`

## Lint
- `bun run lint` — zero errors
