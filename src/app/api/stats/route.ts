import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    // Fetch all lost items and lost reports
    const lostItems = await db.lostItem.findMany({
      select: {
        category: true,
        location: true,
        status: true,
        createdAt: true,
        latitude: true,
        longitude: true,
      },
    })

    const lostReports = await db.lostReport.findMany({
      select: {
        category: true,
        location: true,
        status: true,
        createdAt: true,
      },
    })

    // 1. Category Distribution - combine items and reports
    const categoryMap = new Map<string, number>()
    for (const item of lostItems) {
      categoryMap.set(item.category, (categoryMap.get(item.category) || 0) + 1)
    }
    for (const report of lostReports) {
      categoryMap.set(report.category, (categoryMap.get(report.category) || 0) + 1)
    }
    const categoryDistribution = Array.from(categoryMap.entries())
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => b.count - a.count)

    // 2. Monthly Trend - last 12 months
    const now = new Date()
    const monthNames = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
    ]
    const monthlyMap = new Map<string, { found: number; lost: number }>()

    // Initialize last 12 months
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
      const label = `${monthNames[d.getMonth()]} ${d.getFullYear()}`
      monthlyMap.set(key, { found: 0, lost: 0 })
    }

    for (const item of lostItems) {
      const d = new Date(item.createdAt)
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
      const existing = monthlyMap.get(key)
      if (existing) {
        existing.found += 1
      }
    }

    for (const report of lostReports) {
      const d = new Date(report.createdAt)
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
      const existing = monthlyMap.get(key)
      if (existing) {
        existing.lost += 1
      }
    }

    const monthlyTrend = Array.from(monthlyMap.entries()).map(([key, val]) => {
      const [year, month] = key.split('-')
      const monthIndex = parseInt(month) - 1
      return {
        month: `${monthNames[monthIndex]} ${year}`,
        found: val.found,
        lost: val.lost,
      }
    })

    // 3. Location Heatmap - group by coordinates
    const locationCoordMap = new Map<string, { lat: number; lng: number; count: number; location: string }>()
    for (const item of lostItems) {
      if (item.latitude != null && item.longitude != null) {
        const key = `${item.latitude.toFixed(3)},${item.longitude.toFixed(3)}`
        const existing = locationCoordMap.get(key)
        if (existing) {
          existing.count += 1
        } else {
          locationCoordMap.set(key, {
            lat: item.latitude,
            lng: item.longitude,
            count: 1,
            location: item.location,
          })
        }
      }
    }

    const locationHeatmap = Array.from(locationCoordMap.values())

    // 4. Status Distribution
    const statusMap = new Map<string, number>()
    for (const item of lostItems) {
      statusMap.set(item.status, (statusMap.get(item.status) || 0) + 1)
    }
    for (const report of lostReports) {
      const reportStatus = report.status === 'active' ? 'active' : report.status
      statusMap.set(reportStatus, (statusMap.get(reportStatus) || 0) + 1)
    }
    const statusDistribution = Array.from(statusMap.entries())
      .map(([status, count]) => ({ status, count }))
      .sort((a, b) => b.count - a.count)

    // 5. Top Locations
    const locationMap = new Map<string, number>()
    for (const item of lostItems) {
      locationMap.set(item.location, (locationMap.get(item.location) || 0) + 1)
    }
    for (const report of lostReports) {
      locationMap.set(report.location, (locationMap.get(report.location) || 0) + 1)
    }
    const topLocations = Array.from(locationMap.entries())
      .map(([location, count]) => ({ location, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)

    return NextResponse.json({
      categoryDistribution,
      monthlyTrend,
      locationHeatmap,
      statusDistribution,
      topLocations,
    })
  } catch (error) {
    console.error('Error fetching stats:', error)
    return NextResponse.json({ error: 'Failed to fetch statistics' }, { status: 500 })
  }
}
