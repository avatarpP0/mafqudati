'use client'

import { useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Search,
  MapPin,
  Calendar,
  Eye,
  Package,
  Smartphone,
  FileText,
  Key,
  Shirt,
  Watch,
  Briefcase,
  Wallet,
  LayoutGrid,
  CheckCircle2,
  Clock,
  ArrowUp,
  Gift,
  AlertCircle,
  Sparkles,
  Shield,
} from 'lucide-react'
import { LostItem, LostReport, CATEGORIES, CATEGORY_COLORS, CATEGORY_GRADIENTS } from '@/lib/types'
import { PostItemDialog } from '@/components/lost-found/post-item-dialog'
import { PostLostReportDialog } from '@/components/lost-found/post-lost-report-dialog'
import { ItemDetailDialog } from '@/components/lost-found/item-detail-dialog'
import { AIMatchResults } from '@/components/lost-found/ai-match-results'
import { format } from 'date-fns'
import { ar } from 'date-fns/locale'

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  all: <LayoutGrid className="h-4 w-4" />,
  electronics: <Smartphone className="h-4 w-4" />,
  documents: <FileText className="h-4 w-4" />,
  keys: <Key className="h-4 w-4" />,
  clothing: <Shirt className="h-4 w-4" />,
  accessories: <Watch className="h-4 w-4" />,
  bags: <Briefcase className="h-4 w-4" />,
  wallets: <Wallet className="h-4 w-4" />,
  other: <Package className="h-4 w-4" />,
}

export default function HomePage() {
  const [items, setItems] = useState<LostItem[]>([])
  const [lostReports, setLostReports] = useState<LostReport[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedItem, setSelectedItem] = useState<LostItem | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)
  const [showScrollTop, setShowScrollTop] = useState(false)
  const [activeTab, setActiveTab] = useState('found')

  const fetchItems = useCallback(async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (selectedCategory !== 'all') params.set('category', selectedCategory)
      if (search) params.set('search', search)

      const res = await fetch(`/api/items?${params.toString()}`)
      if (res.ok) {
        const data = await res.json()
        setItems(data)
      }
    } catch (error) {
      console.error('Error fetching items:', error)
    } finally {
      setLoading(false)
    }
  }, [selectedCategory, search])

  const fetchLostReports = useCallback(async () => {
    try {
      const params = new URLSearchParams()
      if (selectedCategory !== 'all') params.set('category', selectedCategory)
      if (search) params.set('search', search)

      const res = await fetch(`/api/lost-reports?${params.toString()}`)
      if (res.ok) {
        const data = await res.json()
        setLostReports(data)
      }
    } catch (error) {
      console.error('Error fetching lost reports:', error)
    }
  }, [selectedCategory, search])

  useEffect(() => {
    fetchItems()
    fetchLostReports()
  }, [fetchItems, fetchLostReports])

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleItemClick = (item: LostItem) => {
    setSelectedItem(item)
    setDetailOpen(true)
  }

  const handleMatchClick = (itemId: string) => {
    const item = items.find((i) => i.id === itemId)
    if (item) {
      setSelectedItem(item)
      setDetailOpen(true)
    }
  }

  const formatDate = (dateStr: string) => {
    try {
      return format(new Date(dateStr), 'd MMMM yyyy', { locale: ar })
    } catch {
      return dateStr
    }
  }

  const foundCount = items.filter((i) => i.status === 'found').length
  const claimedCount = items.filter((i) => i.status === 'claimed').length

  return (
    <div className="min-h-screen flex flex-col bg-background" dir="rtl">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
                <Search className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-l from-amber-600 to-orange-600 bg-clip-text text-transparent">
                  مفقوداتي
                </h1>
                <p className="text-[10px] text-muted-foreground -mt-1">
                  اعثر على أشيائك المفقودة
                </p>
              </div>
            </div>

            <div className="hidden sm:flex items-center gap-2">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 dark:bg-amber-950/30">
                <Clock className="h-3.5 w-3.5 text-amber-600" />
                <span className="text-xs font-semibold text-amber-700 dark:text-amber-400">
                  {foundCount} متاح
                </span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-50 dark:bg-green-950/30">
                <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />
                <span className="text-xs font-semibold text-green-700 dark:text-green-400">
                  {claimedCount} تم الاسترجاع
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <PostLostReportDialog onReportAdded={fetchLostReports} />
              <PostItemDialog onItemAdded={fetchItems} />
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-bl from-amber-50 via-orange-50 to-rose-50 dark:from-amber-950/20 dark:via-orange-950/20 dark:to-rose-950/20 border-b">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-72 h-72 bg-amber-400 rounded-full blur-3xl" />
          <div className="absolute bottom-10 left-10 w-96 h-96 bg-orange-400 rounded-full blur-3xl" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 relative">
          <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
            <div className="flex-1 text-center lg:text-right">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight">
                  اعثر على{' '}
                  <span className="bg-gradient-to-l from-amber-600 to-orange-600 bg-clip-text text-transparent">
                    أشيائك المفقودة
                  </span>
                </h2>
                <p className="mt-4 text-lg text-muted-foreground max-w-lg mx-auto lg:mx-0">
                  مجتمع يساعد بعضه البعض لاستعادة الأشياء المفقودة. انشر الأشياء
                  التي وجدتها ليعثر عليها أصحابها.
                </p>
              </motion.div>

              {/* Search Bar */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="mt-6 max-w-xl mx-auto lg:mx-0"
              >
                <div className="relative">
                  <Search className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    placeholder="ابحث عن شيء مفقود..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pr-12 pl-4 h-12 text-base rounded-xl border-2 border-amber-200 dark:border-amber-800 focus:border-amber-400 dark:focus:border-amber-600 shadow-lg"
                  />
                </div>
              </motion.div>

              {/* Feature Pills */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mt-4 flex flex-wrap items-center justify-center lg:justify-start gap-2"
              >
                <Badge variant="outline" className="gap-1 text-xs bg-background/80">
                  <Shield className="h-3 w-3 text-amber-600" />
                  تحقق من الملكية
                </Badge>
                <Badge variant="outline" className="gap-1 text-xs bg-background/80">
                  <Sparkles className="h-3 w-3 text-purple-600" />
                  مطابقة ذكية بالذكاء الاصطناعي
                </Badge>
                <Badge variant="outline" className="gap-1 text-xs bg-background/80">
                  <MapPin className="h-3 w-3 text-blue-600" />
                  تحديد الموقع الجغرافي
                </Badge>
                <Badge variant="outline" className="gap-1 text-xs bg-background/80">
                  <Gift className="h-3 w-3 text-green-600" />
                  نظام المكافآت
                </Badge>
              </motion.div>
            </div>

            {/* Hero Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex-1 max-w-md w-full"
            >
              <div className="rounded-2xl overflow-hidden shadow-2xl shadow-amber-500/10 border-2 border-amber-200/50 dark:border-amber-800/50">
                <img
                  src="/hero-image.png"
                  alt="مفقوداتي - اعثر على أشيائك المفقودة"
                  className="w-full h-auto object-cover"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex items-center justify-between mb-6">
            <TabsList className="h-11">
              <TabsTrigger value="found" className="gap-1.5 px-4 text-sm">
                <Search className="h-4 w-4" />
                أشياء موجودة
              </TabsTrigger>
              <TabsTrigger value="lost" className="gap-1.5 px-4 text-sm">
                <AlertCircle className="h-4 w-4" />
                بلاغات الفقدان
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Category Filter */}
          <div className="mb-6">
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <Button
                  key={cat.id}
                  variant={selectedCategory === cat.id ? 'default' : 'outline'}
                  size="sm"
                  className={`gap-1.5 rounded-full transition-all ${
                    selectedCategory === cat.id
                      ? 'bg-amber-600 hover:bg-amber-700 text-white shadow-md shadow-amber-500/20'
                      : 'hover:bg-amber-50 dark:hover:bg-amber-950/30 hover:border-amber-300 dark:hover:border-amber-700'
                  }`}
                  onClick={() => setSelectedCategory(cat.id)}
                >
                  {CATEGORY_ICONS[cat.id]}
                  {cat.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Found Items Tab */}
          <TabsContent value="found">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Card key={i} className="overflow-hidden">
                    <Skeleton className="h-40 w-full" />
                    <CardContent className="p-4 space-y-3">
                      <Skeleton className="h-5 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-4 w-2/3" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : items.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-16"
              >
                <div className="mx-auto w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-4">
                  <Package className="h-10 w-10 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-2">لا توجد أشياء حالياً</h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  {search || selectedCategory !== 'all'
                    ? 'لم يتم العثور على نتائج مطابقة. جرب تغيير معايير البحث.'
                    : 'كن أول من ينشر شيئاً وجده! ساعد الآخرين في استعادة أشيائهم المفقودة.'}
                </p>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <AnimatePresence mode="popLayout">
                  {items.map((item, index) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                      <Card
                        className="overflow-hidden cursor-pointer group hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                        onClick={() => handleItemClick(item)}
                      >
                        {/* Card Image / Gradient Placeholder */}
                        <div className="relative h-40 overflow-hidden">
                          {item.imageUrl ? (
                            <img
                              src={item.imageUrl}
                              alt={item.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <div
                              className={`w-full h-full bg-gradient-to-br ${
                                CATEGORY_GRADIENTS[item.category] ||
                                CATEGORY_GRADIENTS.other
                              } flex items-center justify-center`}
                            >
                              <div className="text-white/80">
                                {CATEGORY_ICONS[item.category] || (
                                  <Package className="h-12 w-12" />
                                )}
                              </div>
                            </div>
                          )}

                          {/* Status Badge */}
                          <div className="absolute top-3 right-3">
                            <Badge
                              className={
                                item.status === 'claimed'
                                  ? 'bg-green-500/90 text-white backdrop-blur-sm'
                                  : 'bg-amber-500/90 text-white backdrop-blur-sm'
                              }
                            >
                              {item.status === 'claimed' ? (
                                <>
                                  <CheckCircle2 className="h-3 w-3 ml-1" />
                                  تم الاسترجاع
                                </>
                              ) : (
                                <>
                                  <Clock className="h-3 w-3 ml-1" />
                                  متاح
                                </>
                              )}
                            </Badge>
                          </div>

                          {/* Reward Badge */}
                          {item.reward && (
                            <div className="absolute top-3 left-3">
                              <Badge className="bg-green-500/90 text-white backdrop-blur-sm gap-1">
                                <Gift className="h-3 w-3" />
                                {item.reward}
                              </Badge>
                            </div>
                          )}

                          {/* Verification Badge */}
                          {item.hasVerification && (
                            <div className="absolute bottom-3 left-3">
                              <Badge className="bg-blue-500/90 text-white backdrop-blur-sm gap-1 text-[10px]">
                                <Shield className="h-3 w-3" />
                                تحقق
                              </Badge>
                            </div>
                          )}

                          {/* Category Badge */}
                          <div className="absolute bottom-3 right-3">
                            <Badge
                              className={`${CATEGORY_COLORS[item.category] || CATEGORY_COLORS.other} text-xs`}
                            >
                              {CATEGORIES.find((c) => c.id === item.category)
                                ?.label || item.category}
                            </Badge>
                          </div>
                        </div>

                        <CardContent className="p-4">
                          <h3 className="font-bold text-base mb-2 line-clamp-1 group-hover:text-primary transition-colors">
                            {item.title}
                          </h3>

                          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                            {item.description}
                          </p>

                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              <span className="line-clamp-1 max-w-[120px]">
                                {item.location}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              <span>{formatDate(item.dateFound)}</span>
                            </div>
                          </div>

                          <div className="mt-3 flex items-center justify-between">
                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                              <Eye className="h-3.5 w-3.5" />
                              <span>عرض التفاصيل</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </TabsContent>

          {/* Lost Reports Tab */}
          <TabsContent value="lost">
            {lostReports.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-16"
              >
                <div className="mx-auto w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-4">
                  <AlertCircle className="h-10 w-10 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-2">لا توجد بلاغات فقدان</h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  أبلغ عن شيء فقدته وسيساعدك الذكاء الاصطناعي في البحث عنه تلقائياً
                </p>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <AnimatePresence mode="popLayout">
                  {lostReports.map((report, index) => (
                    <motion.div
                      key={report.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                      <Card className="overflow-hidden border-red-200 dark:border-red-800">
                        <div className="h-2 bg-gradient-to-l from-red-400 to-orange-400" />
                        <CardContent className="p-4 space-y-3">
                          <div className="flex items-start justify-between gap-2">
                            <h3 className="font-bold text-base line-clamp-1">
                              {report.title}
                            </h3>
                            <Badge
                              className={
                                report.status === 'found'
                                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 shrink-0'
                                  : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 shrink-0'
                              }
                            >
                              {report.status === 'found' ? 'تم العثور' : 'مفقود'}
                            </Badge>
                          </div>

                          <Badge className={`${CATEGORY_COLORS[report.category] || CATEGORY_COLORS.other} text-xs`}>
                            {CATEGORIES.find((c) => c.id === report.category)?.label || report.category}
                          </Badge>

                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {report.description}
                          </p>

                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              <span className="line-clamp-1 max-w-[100px]">{report.location}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              <span>{formatDate(report.dateLost)}</span>
                            </div>
                          </div>

                          {report.reward && (
                            <div className="flex items-center gap-1.5 text-xs text-green-600 dark:text-green-400">
                              <Gift className="h-3.5 w-3.5" />
                              <span className="font-semibold">مكافأة: {report.reward}</span>
                            </div>
                          )}

                          {/* AI Match Button */}
                          <AIMatchResults
                            report={report}
                            onMatchClick={handleMatchClick}
                          />
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>

      {/* Item Detail Dialog */}
      <ItemDetailDialog
        item={selectedItem}
        open={detailOpen}
        onOpenChange={setDetailOpen}
        onItemClaimed={fetchItems}
      />

      {/* Scroll to Top */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={scrollToTop}
            className="fixed bottom-6 left-6 z-50 h-12 w-12 rounded-full bg-amber-600 hover:bg-amber-700 text-white shadow-lg shadow-amber-500/30 flex items-center justify-center transition-colors"
          >
            <ArrowUp className="h-5 w-5" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="bg-muted/50 border-t mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                <Search className="h-4 w-4 text-white" />
              </div>
              <span className="font-bold text-sm">مفقوداتي</span>
            </div>
            <p className="text-sm text-muted-foreground text-center">
              مجتمع يساعد بعضه البعض لاستعادة الأشياء المفقودة © {new Date().getFullYear()}
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
