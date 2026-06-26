import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)

  const title = searchParams.get('title') || 'مفقوداتي'
  const category = searchParams.get('category') || ''
  const location = searchParams.get('location') || ''

  const categoryLabels: Record<string, string> = {
    electronics: 'إلكترونيات',
    documents: 'مستندات',
    keys: 'مفاتيح',
    clothing: 'ملابس',
    accessories: 'إكسسوارات',
    bags: 'حقائب',
    wallets: 'محافظ',
    pets: 'حيوانات أليفة',
    other: 'أخرى',
  }

  const categoryDisplay = categoryLabels[category] || category

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#0f0f23',
          padding: '40px 60px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background decorative circles */}
        <div
          style={{
            position: 'absolute',
            top: '-100px',
            right: '-100px',
            width: '400px',
            height: '400px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(245,158,11,0.12) 0%, transparent 70%)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-80px',
            left: '-80px',
            width: '350px',
            height: '350px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(245,158,11,0.08) 0%, transparent 70%)',
          }}
        />

        {/* Top branding bar */}
        <div
          style={{
            position: 'absolute',
            top: '0',
            left: '0',
            right: '0',
            height: '6px',
            background: 'linear-gradient(to right, #f59e0b, #d97706, #f59e0b)',
          }}
        />

        {/* Main content card */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '24px',
            maxWidth: '900px',
            width: '100%',
          }}
        >
          {/* App name branding */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '8px',
            }}
          >
            {/* Pin icon */}
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#f59e0b"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <span
              style={{
                fontSize: '24px',
                color: '#f59e0b',
                fontWeight: 700,
                letterSpacing: '0.02em',
              }}
            >
              مفقوداتي | Mafqudati
            </span>
          </div>

          {/* Title */}
          <div
            style={{
              fontSize: title.length > 40 ? '36px' : '48px',
              fontWeight: 800,
              color: '#ffffff',
              textAlign: 'center',
              lineHeight: 1.3,
              maxWidth: '800px',
              direction: 'rtl',
            }}
          >
            {title}
          </div>

          {/* Category & Location row */}
          {(categoryDisplay || location) && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '20px',
                direction: 'rtl',
              }}
            >
              {/* Category badge */}
              {categoryDisplay && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    backgroundColor: 'rgba(245,158,11,0.15)',
                    border: '1px solid rgba(245,158,11,0.3)',
                    borderRadius: '999px',
                    padding: '8px 20px',
                  }}
                >
                  {/* Tag icon */}
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z" />
                    <path d="M7 7h.01" />
                  </svg>
                  <span
                    style={{
                      fontSize: '18px',
                      color: '#f59e0b',
                      fontWeight: 600,
                    }}
                  >
                    {categoryDisplay}
                  </span>
                </div>
              )}

              {/* Location */}
              {location && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    backgroundColor: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    borderRadius: '999px',
                    padding: '8px 20px',
                  }}
                >
                  {/* MapPin icon */}
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#a3a3a3"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  <span
                    style={{
                      fontSize: '18px',
                      color: '#d4d4d4',
                      fontWeight: 500,
                    }}
                  >
                    {location}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Divider */}
          <div
            style={{
              width: '120px',
              height: '2px',
              background: 'linear-gradient(to right, transparent, #f59e0b, transparent)',
              marginTop: '8px',
            }}
          />

          {/* Tagline */}
          <div
            style={{
              fontSize: '20px',
              color: '#9ca3af',
              textAlign: 'center',
              direction: 'rtl',
            }}
          >
            مجتمع يساعد بعضه البعض لاستعادة الأشياء المفقودة
          </div>
        </div>

        {/* Bottom accent bar */}
        <div
          style={{
            position: 'absolute',
            bottom: '0',
            left: '0',
            right: '0',
            height: '6px',
            background: 'linear-gradient(to right, #f59e0b, #d97706, #f59e0b)',
          }}
        />
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  )
}
