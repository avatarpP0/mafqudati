import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  try {
    const reports = await db.report.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        lostItem: { select: { id: true, title: true, category: true } },
        lostReport: { select: { id: true, title: true, category: true } },
      },
    })

    return NextResponse.json(reports)
  } catch (error) {
    console.error('Error fetching reports:', error)
    return NextResponse.json({ error: 'Failed to fetch reports' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { itemType, itemId, reason, details } = body

    if (!itemType || !itemId || !reason) {
      return NextResponse.json(
        { error: 'Missing required fields: itemType, itemId, reason' },
        { status: 400 }
      )
    }

    if (!['lostItem', 'lostReport'].includes(itemType)) {
      return NextResponse.json(
        { error: 'Invalid itemType. Must be "lostItem" or "lostReport"' },
        { status: 400 }
      )
    }

    if (!['fake', 'inappropriate', 'wrong_info', 'other'].includes(reason)) {
      return NextResponse.json(
        { error: 'Invalid reason. Must be one of: fake, inappropriate, wrong_info, other' },
        { status: 400 }
      )
    }

    // Verify the referenced item exists
    if (itemType === 'lostItem') {
      const item = await db.lostItem.findUnique({ where: { id: itemId } })
      if (!item) {
        return NextResponse.json({ error: 'Referenced lost item not found' }, { status: 404 })
      }
    } else {
      const report = await db.lostReport.findUnique({ where: { id: itemId } })
      if (!report) {
        return NextResponse.json({ error: 'Referenced lost report not found' }, { status: 404 })
      }
    }

    const report = await db.report.create({
      data: {
        itemType,
        itemId,
        reason,
        details: details || null,
      },
    })

    return NextResponse.json(report, { status: 201 })
  } catch (error) {
    console.error('Error creating report:', error)
    return NextResponse.json({ error: 'Failed to create report' }, { status: 500 })
  }
}
