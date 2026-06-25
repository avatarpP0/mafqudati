export interface LostItem {
  id: string
  title: string
  description: string
  category: string
  location: string
  dateFound: string
  imageUrl: string | null
  contactName: string
  contactPhone: string
  status: 'found' | 'claimed'
  createdAt: string
  updatedAt: string
}

export const CATEGORIES = [
  { id: 'all', label: 'الكل', icon: 'LayoutGrid' },
  { id: 'electronics', label: 'إلكترونيات', icon: 'Smartphone' },
  { id: 'documents', label: 'مستندات', icon: 'FileText' },
  { id: 'keys', label: 'مفاتيح', icon: 'Key' },
  { id: 'clothing', label: 'ملابس', icon: 'Shirt' },
  { id: 'accessories', label: 'إكسسوارات', icon: 'Watch' },
  { id: 'bags', label: 'حقائب', icon: 'Briefcase' },
  { id: 'wallets', label: 'محافظ', icon: 'Wallet' },
  { id: 'other', label: 'أخرى', icon: 'Package' },
] as const

export const CATEGORY_COLORS: Record<string, string> = {
  electronics: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  documents: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300',
  keys: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  clothing: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300',
  accessories: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
  bags: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  wallets: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
  other: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
}

export const CATEGORY_GRADIENTS: Record<string, string> = {
  electronics: 'from-blue-500 to-cyan-500',
  documents: 'from-amber-500 to-yellow-500',
  keys: 'from-yellow-400 to-orange-400',
  clothing: 'from-pink-500 to-rose-500',
  accessories: 'from-purple-500 to-violet-500',
  bags: 'from-green-500 to-emerald-500',
  wallets: 'from-orange-500 to-red-500',
  other: 'from-gray-500 to-slate-500',
}
