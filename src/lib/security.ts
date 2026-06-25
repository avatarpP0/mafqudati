import { db } from '@/lib/db'

// In-memory rate limiter for verification attempts
// Key: `${itemId}:${ip}`, Value: { attempts: number, lockedUntil: number }
const verificationAttempts = new Map<string, { attempts: number; lockedUntil: number }>()

const MAX_ATTEMPTS = 3
const LOCK_DURATION_MS = 15 * 60 * 1000 // 15 minutes lock

export function getRateLimitKey(itemId: string, ip: string): string {
  return `${itemId}:${ip}`
}

export function checkRateLimit(itemId: string, ip: string): { allowed: boolean; remainingAttempts: number; lockedUntil: number | null } {
  const key = getRateLimitKey(itemId, ip)
  const record = verificationAttempts.get(key)
  const now = Date.now()

  // Clean up expired entries periodically
  if (verificationAttempts.size > 10000) {
    for (const [k, v] of verificationAttempts) {
      if (v.lockedUntil < now) {
        verificationAttempts.delete(k)
      }
    }
  }

  if (!record) {
    return { allowed: true, remainingAttempts: MAX_ATTEMPTS, lockedUntil: null }
  }

  // If lock has expired, reset
  if (record.lockedUntil && record.lockedUntil < now) {
    verificationAttempts.delete(key)
    return { allowed: true, remainingAttempts: MAX_ATTEMPTS, lockedUntil: null }
  }

  // If locked
  if (record.lockedUntil && record.lockedUntil >= now) {
    return { allowed: false, remainingAttempts: 0, lockedUntil: record.lockedUntil }
  }

  const remaining = MAX_ATTEMPTS - record.attempts
  if (remaining <= 0) {
    // Lock them
    const lockedUntil = now + LOCK_DURATION_MS
    record.lockedUntil = lockedUntil
    return { allowed: false, remainingAttempts: 0, lockedUntil }
  }

  return { allowed: true, remainingAttempts: remaining, lockedUntil: null }
}

export function recordFailedAttempt(itemId: string, ip: string): void {
  const key = getRateLimitKey(itemId, ip)
  const record = verificationAttempts.get(key) || { attempts: 0, lockedUntil: 0 }
  record.attempts += 1

  if (record.attempts >= MAX_ATTEMPTS) {
    record.lockedUntil = Date.now() + LOCK_DURATION_MS
  }

  verificationAttempts.set(key, record)
}

export function clearRateLimit(itemId: string, ip: string): void {
  const key = getRateLimitKey(itemId, ip)
  verificationAttempts.delete(key)
}

// Strip sensitive fields from LostItem before sending to frontend
// CRITICAL: verificationAnswer must NEVER be sent to the client
export function sanitizeLostItem(item: Record<string, unknown>) {
  const { verificationAnswer, ...safeItem } = item
  return {
    ...safeItem,
    hasVerification: !!verificationAnswer,
  }
}

export function sanitizeLostItems(items: Record<string, unknown>[]) {
  return items.map(sanitizeLostItem)
}
