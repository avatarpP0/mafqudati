import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/favorites?sessionId=xxx
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get('sessionId')

    if (!sessionId) {
      return NextResponse.json(
        { error: 'sessionId is required' },
        { status: 400 }
      )
    }

    const favorites = await db.favorite.findMany({
      where: { sessionId },
      select: {
        id: true,
        itemType: true,
        itemId: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(favorites)
  } catch (error) {
    console.error('Error fetching favorites:', error)
    return NextResponse.json(
      { error: 'Failed to fetch favorites' },
      { status: 500 }
    )
  }
}

// POST /api/favorites - Add a favorite
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { itemType, itemId, sessionId } = body

    if (!itemType || !itemId || !sessionId) {
      return NextResponse.json(
        { error: 'itemType, itemId, and sessionId are required' },
        { status: 400 }
      )
    }

    if (!['lostItem', 'lostReport'].includes(itemType)) {
      return NextResponse.json(
        { error: 'itemType must be "lostItem" or "lostReport"' },
        { status: 400 }
      )
    }

    // Check if already favorited
    const existing = await db.favorite.findUnique({
      where: {
        itemType_itemId_sessionId: {
          itemType,
          itemId,
          sessionId,
        },
      },
    })

    if (existing) {
      return NextResponse.json(existing)
    }

    const favorite = await db.favorite.create({
      data: {
        itemType,
        itemId,
        sessionId,
      },
      select: {
        id: true,
        itemType: true,
        itemId: true,
        createdAt: true,
      },
    })

    return NextResponse.json(favorite, { status: 201 })
  } catch (error) {
    console.error('Error adding favorite:', error)
    return NextResponse.json(
      { error: 'Failed to add favorite' },
      { status: 500 }
    )
  }
}

// DELETE /api/favorites - Remove a favorite
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json()
    const { itemType, itemId, sessionId } = body

    if (!itemType || !itemId || !sessionId) {
      return NextResponse.json(
        { error: 'itemType, itemId, and sessionId are required' },
        { status: 400 }
      )
    }

    const existing = await db.favorite.findUnique({
      where: {
        itemType_itemId_sessionId: {
          itemType,
          itemId,
          sessionId,
        },
      },
    })

    if (!existing) {
      return NextResponse.json(
        { error: 'Favorite not found' },
        { status: 404 }
      )
    }

    await db.favorite.delete({
      where: {
        id: existing.id,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error removing favorite:', error)
    return NextResponse.json(
      { error: 'Failed to remove favorite' },
      { status: 500 }
    )
  }
}
