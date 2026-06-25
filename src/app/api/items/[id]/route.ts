import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    // Verification action: check answer against verificationAnswer
    if (body.action === 'verify') {
      const item = await db.lostItem.findUnique({ where: { id } })

      if (!item) {
        return NextResponse.json({ error: 'Item not found' }, { status: 404 })
      }

      if (!item.verificationAnswer) {
        return NextResponse.json({ error: 'No verification question set for this item' }, { status: 400 })
      }

      const providedAnswer = (body.answer || '').trim().toLowerCase()
      const correctAnswer = item.verificationAnswer.trim().toLowerCase()
      const verified = providedAnswer === correctAnswer

      return NextResponse.json({ verified })
    }

    // Status update action
    const { status } = body

    if (!status || !['found', 'claimed'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
    }

    const item = await db.lostItem.update({
      where: { id },
      data: { status },
    })

    return NextResponse.json(item)
  } catch (error) {
    console.error('Error updating item:', error)
    return NextResponse.json({ error: 'Failed to update item' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await db.lostItem.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting item:', error)
    return NextResponse.json({ error: 'Failed to delete item' }, { status: 500 })
  }
}
