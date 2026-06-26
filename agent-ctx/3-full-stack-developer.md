# Task 3 - Reports & Moderation System

## Agent: full-stack-developer

## Summary
Implemented the complete Reports & Moderation system for the Mafqudati Lost & Found website.

## Files Created
1. `/src/app/api/reports/route.ts` - POST (create report) + GET (list reports for admin)
2. `/src/app/api/reports/[id]/route.ts` - DELETE (resolve/delete a report)
3. `/src/components/lost-found/report-dialog.tsx` - Report dialog with radio group, textarea, submit

## Files Modified
1. `/src/lib/i18n/translations.ts` - Added 13 translation keys (reportTitle, reportReason, reportFake, reportInappropriate, reportWrongInfo, reportOther, reportDetails, reportDetailsPh, reportSubmit, reportSuccess, reportError, btnReport)
2. `/src/components/lost-found/item-detail-dialog.tsx` - Added Flag icon, ReportDialog import, reportOpen state, Share+Report button row, ReportDialog component
3. `/src/app/page.tsx` - Added Flag icon, ReportDialog import, report state vars, Flag button on lost report cards, ReportDialog instance

## API Design
- POST /api/reports: Validates itemType (lostItem|lostReport), itemId, reason (fake|inappropriate|wrong_info|other), verifies referenced item exists
- GET /api/reports: Returns all reports with included lostItem/lostReport relations
- DELETE /api/reports/[id]: Deletes a report by ID with 404 check

## UI Design
- ReportDialog: Dialog with RadioGroup for reason selection, optional Textarea for details, red-themed Submit button
- ItemDetailDialog: Share + Report buttons side-by-side (flex layout), Report button styled with red theme
- Lost report cards: Small Flag icon button next to FavoriteButton, uses stopPropagation

## Quality
- Lint: 0 errors
- Database: In sync (Report model already existed)
- i18n: Full Arabic + English support
- RTL: Direction-aware layout
