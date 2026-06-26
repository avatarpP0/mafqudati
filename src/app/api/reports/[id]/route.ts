import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const report = await db.report.findUnique({ where: { id } })

    if (!report) {
      return NextResponse.json({ error: 'Report not found' }, { status: 404 })
    }

    await db.report.delete({ where: { id } })

    return NextResponse.json({ message: 'Report deleted successfully' })
  } catch (error) {
    console.error('Error deleting report:', error)
    return NextResponse.json({ error: 'Failed to delete report' }, { status: 500 })
  }
}
