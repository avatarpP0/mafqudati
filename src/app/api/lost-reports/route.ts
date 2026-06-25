import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const status = searchParams.get('status')

    const where: Record<string, unknown> = {}

    if (category && category !== 'all') {
      where.category = category
    }

    if (status) {
      where.status = status
    }

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } },
        { location: { contains: search } },
      ]
    }

    const reports = await db.lostReport.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(reports)
  } catch (error) {
    console.error('Error fetching lost reports:', error)
    return NextResponse.json({ error: 'Failed to fetch lost reports' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      title,
      description,
      category,
      location,
      dateLost,
      contactName,
      contactPhone,
      reward,
    } = body

    if (!title || !description || !category || !location || !dateLost || !contactName || !contactPhone) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const report = await db.lostReport.create({
      data: {
        title,
        description,
        category,
        location,
        dateLost: new Date(dateLost),
        contactName,
        contactPhone,
        reward: reward || null,
        status: 'active',
      },
    })

    return NextResponse.json(report, { status: 201 })
  } catch (error) {
    console.error('Error creating lost report:', error)
    return NextResponse.json({ error: 'Failed to create lost report' }, { status: 500 })
  }
}
