# Task 2-backend: Build all backend API routes

## Agent: full-stack-developer

## Summary
Built all backend API routes for the Lost & Found website, including verification, lost reports CRUD, and AI matching.

## Files Modified
- `/home/z/my-project/src/app/api/items/route.ts` - Updated POST handler to accept verificationQuestion, verificationAnswer, reward, latitude, longitude
- `/home/z/my-project/src/app/api/items/[id]/route.ts` - Added verification endpoint (action: 'verify')
- `/home/z/my-project/src/app/api/lost-reports/route.ts` - New: GET/POST for LostReport
- `/home/z/my-project/src/app/api/lost-reports/[id]/route.ts` - New: PATCH/DELETE for individual LostReport
- `/home/z/my-project/src/app/api/match/route.ts` - New: AI matching using z-ai-web-dev-sdk LLM
- `/home/z/my-project/seed.ts` - Updated with new fields and 5 LostReport entries
- `/home/z/my-project/src/lib/db.ts` - Reverted to original (was temporarily modified for cache busting)

## API Endpoints
1. `GET /api/items` - List found items (with category/search/status filters)
2. `POST /api/items` - Create found item (now includes verification, reward, coordinates)
3. `PATCH /api/items/[id]` - Update item (status update OR verification check)
4. `DELETE /api/items/[id]` - Delete item
5. `GET /api/lost-reports` - List lost reports (with category/search/status filters)
6. `POST /api/lost-reports` - Create lost report
7. `PATCH /api/lost-reports/[id]` - Update lost report
8. `DELETE /api/lost-reports/[id]` - Delete lost report
9. `GET /api/match?lostReportId=xxx` - AI matching endpoint

## Key Design Decisions
- Verification uses case-insensitive, trimmed comparison
- PATCH /api/items/[id] dual-purpose: `{action: 'verify', answer}` OR `{status: 'claimed'}`
- AI matching uses z-ai-web-dev-sdk server-side only, with JSON parsing from LLM response
- Match endpoint returns enriched data (full item details alongside scores)
- LostReport status values: 'active', 'found', 'closed'

## Testing Results
- All endpoints returning correct HTTP status codes
- Verification endpoint tested: correct answer → `{verified: true}`, wrong → `{verified: false}`
- Lost reports filtering by category works
- Items API returns new fields correctly
- Zero lint errors
