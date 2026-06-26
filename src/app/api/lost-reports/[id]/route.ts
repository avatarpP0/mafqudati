import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    const data: Record<string, unknown> = {}

    if (body.title !== undefined) data.title = body.title
    if (body.description !== undefined) data.description = body.description
    if (body.category !== undefined) data.category = body.category
    if (body.location !== undefined) data.location = body.location
    if (body.dateLost !== undefined) data.dateLost = new Date(body.dateLost)
    if (body.contactName !== undefined) data.contactName = body.contactName
    if (body.contactPhone !== undefined) data.contactPhone = body.contactPhone
    if (body.reward !== undefined) data.reward = body.reward
    if (body.status !== undefined) {
      if (!['active', 'found', 'closed'].includes(body.status)) {
        return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
      }
      data.status = body.status
    }

    const report = await db.lostReport.update({
      where: { id },
      data,
    })

    return NextResponse.json(report)
  } catch (error) {
    console.error('Error updating lost report:', error)
    return NextResponse.json({ error: 'Failed to update lost report' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await db.lostReport.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting lost report:', error)
    return NextResponse.json({ error: 'Failed to delete lost report' }, { status: 500 })
  }
}
