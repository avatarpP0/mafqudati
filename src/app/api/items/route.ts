import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'
import { sanitizeLostItems, sanitizeLostItem } from '@/lib/security'

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

    const items = await db.lostItem.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    })

    // SECURITY: Strip verificationAnswer from all items before sending to frontend
    const safeItems = sanitizeLostItems(items as unknown as Record<string, unknown>[])

    return NextResponse.json(safeItems)
  } catch (error) {
    console.error('Error fetching items:', error)
    return NextResponse.json({ error: 'Failed to fetch items' }, { status: 500 })
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
      dateFound,
      imageUrl,
      contactName,
      contactPhone,
      verificationQuestion,
      verificationAnswer,
      reward,
      latitude,
      longitude,
    } = body

    if (!title || !description || !category || !location || !dateFound || !contactName || !contactPhone) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    if (!verificationQuestion || !verificationAnswer) {
      return NextResponse.json({ error: 'Verification question and answer are required' }, { status: 400 })
    }

    const item = await db.lostItem.create({
      data: {
        title,
        description,
        category,
        location,
        dateFound: new Date(dateFound),
        imageUrl: imageUrl || null,
        contactName,
        contactPhone,
        status: 'found',
        verificationQuestion,
        verificationAnswer,
        reward: reward || null,
        latitude: latitude != null && latitude !== '' ? parseFloat(latitude) : null,
        longitude: longitude != null && longitude !== '' ? parseFloat(longitude) : null,
      },
    })

    // SECURITY: Strip verificationAnswer from response
    const safeItem = sanitizeLostItem(item as unknown as Record<string, unknown>)

    return NextResponse.json(safeItem, { status: 201 })
  } catch (error) {
    console.error('Error creating item:', error)
    return NextResponse.json({ error: 'Failed to create item' }, { status: 500 })
  }
}
