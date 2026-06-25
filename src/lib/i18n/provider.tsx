'use client'

import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { Locale, translations, TranslationKey } from './translations'

interface I18nContextType {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (key: TranslationKey, replacements?: Record<string, string | number>) => string
  dir: 'rtl' | 'ltr'
}

const I18nContext = createContext<I18nContextType | null>(null)

function getInitialLocale(): Locale {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('locale')
    if (saved === 'ar' || saved === 'en') return saved
  }
  return 'ar'
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(getInitialLocale)

  useEffect(() => {
    document.documentElement.lang = locale
    document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr'
  }, [locale])

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale)
    localStorage.setItem('locale', newLocale)
  }, [])

  const t = useCallback((key: TranslationKey, replacements?: Record<string, string | number>): string => {
    let text = translations[locale][key] || translations.ar[key] || key
    if (replacements) {
      for (const [k, v] of Object.entries(replacements)) {
        text = text.replace(`{${k}}`, String(v))
      }
    }
    return text
  }, [locale])

  const dir = locale === 'ar' ? 'rtl' : 'ltr'

  return (
    <I18nContext.Provider value={{ locale, setLocale, t, dir }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n() {
  const context = useContext(I18nContext)
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider')
  }
  return context
}
