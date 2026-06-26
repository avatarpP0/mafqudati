import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'
import ZAI from 'z-ai-web-dev-sdk'

interface MatchResult {
  lostItemId: string
  matchScore: number
  reason: string
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const lostReportId = searchParams.get('lostReportId')

    if (!lostReportId) {
      return NextResponse.json({ error: 'Missing lostReportId parameter' }, { status: 400 })
    }

    // Fetch the lost report
    const lostReport = await db.lostReport.findUnique({
      where: { id: lostReportId },
    })

    if (!lostReport) {
      return NextResponse.json({ error: 'Lost report not found' }, { status: 404 })
    }

    // Fetch all found items with status 'found'
    const foundItems = await db.lostItem.findMany({
      where: { status: 'found' },
    })

    if (foundItems.length === 0) {
      return NextResponse.json({ matches: [] })
    }

    // Build a summary of found items for the LLM prompt
    const itemsSummary = foundItems.map((item) => ({
      id: item.id,
      title: item.title,
      description: item.description,
      category: item.category,
      location: item.location,
      dateFound: item.dateFound.toISOString().split('T')[0],
    }))

    // Create the LLM prompt
    const systemPrompt = `You are an AI assistant that helps match lost items with found items. You will be given a lost item report and a list of found items. Your task is to compare them and return match scores.

IMPORTANT: You must respond with ONLY a valid JSON array, no other text. Each element should have:
- lostItemId: the id of the found item
- matchScore: a number from 0 to 100 indicating how likely it's a match
- reason: a brief explanation in Arabic of why this might be a match

Consider these factors for matching:
1. Category match (same category = higher score)
2. Description similarity (similar descriptions = higher score)
3. Location proximity (same or nearby locations = higher score)
4. Date proximity (dates close together = higher score)
5. Title similarity (similar titles = higher score)

Return the top 5 matches sorted by matchScore descending.`

    const userPrompt = `Lost Item Report:
- Title: ${lostReport.title}
- Description: ${lostReport.description}
- Category: ${lostReport.category}
- Location: ${lostReport.location}
- Date Lost: ${lostReport.dateLost.toISOString().split('T')[0]}

Found Items:
${JSON.stringify(itemsSummary, null, 2)}

Return ONLY a JSON array of matches sorted by matchScore (highest first), max 5 items.`

    // Call the LLM
    const zai = await ZAI.create()
    const completion = await zai.chat.completions.create({
      messages: [
        { role: 'assistant', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      thinking: { type: 'disabled' },
    })

    const messageContent = completion.choices[0]?.message?.content

    if (!messageContent) {
      return NextResponse.json({ error: 'LLM returned empty response' }, { status: 500 })
    }

    // Parse the LLM response - extract JSON from the response
    let matches: MatchResult[] = []
    try {
      // Try to find JSON array in the response
      const jsonMatch = messageContent.match(/\[[\s\S]*\]/)
      if (jsonMatch) {
        matches = JSON.parse(jsonMatch[0])
      } else {
        matches = JSON.parse(messageContent)
      }
    } catch {
      console.error('Failed to parse LLM response:', messageContent)
      return NextResponse.json({ error: 'Failed to parse AI matching results' }, { status: 500 })
    }

    // Validate and sanitize matches
    const validMatches = matches
      .filter((m: MatchResult) => m.lostItemId && typeof m.matchScore === 'number' && m.reason)
      .map((m: MatchResult) => ({
        lostItemId: m.lostItemId,
        matchScore: Math.min(100, Math.max(0, Math.round(m.matchScore))),
        reason: m.reason,
      }))
      .sort((a: MatchResult, b: MatchResult) => b.matchScore - a.matchScore)
      .slice(0, 5)

    // Enrich matches with item data
    // SECURITY: Do NOT include verificationAnswer or contact details
    // Contact info requires verification first
    const enrichedMatches = await Promise.all(
      validMatches.map(async (match) => {
        const item = await db.lostItem.findUnique({
          where: { id: match.lostItemId },
        })
        return {
          ...match,
          item: item
            ? {
                id: item.id,
                title: item.title,
                description: item.description,
                category: item.category,
                location: item.location,
                dateFound: item.dateFound,
                imageUrl: item.imageUrl,
                // SECURITY: Contact info hidden until verification
                // User must click through to item detail & verify ownership
                hasVerification: !!item.verificationAnswer,
                verificationQuestion: item.verificationQuestion,
                reward: item.reward,
              }
            : null,
        }
      })
    )

    // Filter out matches where item wasn't found
    const finalMatches = enrichedMatches.filter((m) => m.item !== null)

    return NextResponse.json({ matches: finalMatches })
  } catch (error) {
    console.error('Error in AI matching:', error)
    return NextResponse.json({ error: 'Failed to perform AI matching' }, { status: 500 })
  }
}
