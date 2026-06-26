import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'
import { sanitizeLostItem, checkRateLimit, recordFailedAttempt, clearRateLimit } from '@/lib/security'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    // Verification action: check answer against verificationAnswer
    // SECURITY: Answer is compared ONLY on backend, never sent to frontend
    if (body.action === 'verify') {
      const item = await db.lostItem.findUnique({ where: { id } })

      if (!item) {
        return NextResponse.json({ error: 'Item not found' }, { status: 404 })
      }

      if (!item.verificationAnswer) {
        return NextResponse.json({ error: 'No verification question set for this item' }, { status: 400 })
      }

      // SECURITY: Rate limiting - max 3 attempts per IP per item
      const clientIp = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
        || request.headers.get('x-real-ip')
        || 'unknown'

      const rateLimit = checkRateLimit(id, clientIp)

      if (!rateLimit.allowed) {
        const remainingMinutes = rateLimit.lockedUntil
          ? Math.ceil((rateLimit.lockedUntil - Date.now()) / 60000)
          : 15

        return NextResponse.json({
          verified: false,
          rateLimited: true,
          remainingAttempts: 0,
          message: `تم تجاوز الحد الأقصى للمحاولات. يرجى المحاولة بعد ${remainingMinutes} دقيقة.`,
        }, { status: 429 })
      }

      const providedAnswer = (body.answer || '').trim().toLowerCase()
      const correctAnswer = item.verificationAnswer.trim().toLowerCase()
      const verified = providedAnswer === correctAnswer

      if (verified) {
        // Clear rate limit on success
        clearRateLimit(id, clientIp)
        return NextResponse.json({
          verified: true,
          remainingAttempts: rateLimit.remainingAttempts,
        })
      } else {
        // Record failed attempt
        recordFailedAttempt(id, clientIp)
        const newRemaining = rateLimit.remainingAttempts - 1

        return NextResponse.json({
          verified: false,
          rateLimited: newRemaining <= 0,
          remainingAttempts: newRemaining,
          message: newRemaining > 0
            ? `الإجابة غير صحيحة. متبقي ${newRemaining} محاولة${newRemaining === 1 ? ' واحدة' : ''}.`
            : 'تم تجاوز الحد الأقصى للمحاولات (3). يرجى المحاولة بعد 15 دقيقة.',
        })
      }
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

    // SECURITY: Strip verificationAnswer from response
    const safeItem = sanitizeLostItem(item as unknown as Record<string, unknown>)

    return NextResponse.json(safeItem)
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
