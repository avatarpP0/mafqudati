import { db } from './src/lib/db'

async function seed() {
  // Check if data already exists
  const existing = await db.lostItem.count()
  if (existing > 0) {
    console.log('Database already has data, skipping seed.')
    return
  }

  const items = [
    {
      title: 'هاتف آيفون 15 برو ماكس أسود',
      description: 'هاتف آيفون 15 برو ماكس لون أسود مع غطاء جلدي بني. وجدته على كرسي في محطة المترو. الشاشة مغلقة بكلمة مرور.',
      category: 'electronics',
      location: 'محطة المترو - الدقي',
      dateFound: new Date('2025-03-01'),
      imageUrl: null,
      contactName: 'أحمد محمد',
      contactPhone: '01012345678',
      status: 'found',
    },
    {
      title: 'محفظة جلدية سوداء',
      description: 'محفظة جلدية سوداء تحتوي على بطاقات بنكية وبطاقة هوية. وجدتها على الأرض بجوار كشك الصحف في المركز التجاري.',
      category: 'wallets',
      location: 'مول العرب - الدور الأرضي',
      dateFound: new Date('2025-03-02'),
      imageUrl: null,
      contactName: 'سارة أحمد',
      contactPhone: '01123456789',
      status: 'found',
    },
    {
      title: 'مفتاح سيارة تويوتا',
      description: 'مفتاح سيارة تويوتا مع علامة مفتاح زرقاء. وجدته في موقف السيارات بجوار السوبر ماركت.',
      category: 'keys',
      location: 'موقف سيارات كارفور - المعادي',
      dateFound: new Date('2025-03-03'),
      imageUrl: null,
      contactName: 'محمد علي',
      contactPhone: '01234567890',
      status: 'found',
    },
    {
      title: 'حقيبة ظهر زرقاء',
      description: 'حقيبة ظهر زرقاء من نوع نايك تحتوي على كتب جامعية ودفاتر. وجدتها على مقعد في الحديقة العامة.',
      category: 'bags',
      location: 'حديقة الأزهر - القاهرة',
      dateFound: new Date('2025-02-28'),
      imageUrl: null,
      contactName: 'فاطمة حسن',
      contactPhone: '01098765432',
      status: 'found',
    },
    {
      title: 'جواز سفر مصري',
      description: 'جواز سفر مصري باسم موجود على الأرض في صالة الانتظار بالمطار. يرجى التواصل لاسترجاعه.',
      category: 'documents',
      location: 'مطار القاهرة الدولي - الصالة 3',
      dateFound: new Date('2025-03-04'),
      imageUrl: null,
      contactName: 'خالد إبراهيم',
      contactPhone: '01187654321',
      status: 'found',
    },
    {
      title: 'ساعة يد ذهبية',
      description: 'ساعة يد ذهبية أنيقة من نوع كاسيو. وجدتها في صالة الألعاب الرياضية على أحد الأجهزة.',
      category: 'accessories',
      location: 'نادي الجزيرة الرياضي',
      dateFound: new Date('2025-03-05'),
      imageUrl: null,
      contactName: 'ياسمين عبدالله',
      contactPhone: '01276543210',
      status: 'claimed',
    },
    {
      title: 'جاكيت شتوي رمادي',
      description: 'جاكيت شتوي رمادي كبير الحجم من نوع زارا. وجدته معلقاً على كرسي في المقهى.',
      category: 'clothing',
      location: 'مقهى بيتزا - زمالك',
      dateFound: new Date('2025-03-02'),
      imageUrl: null,
      contactName: 'عمر حسين',
      contactPhone: '01065432109',
      status: 'found',
    },
    {
      title: 'نظارة طبية سوداء',
      description: 'نظارة طبية سوداء بإطار سميك. وجدتها على طاولة في المكتبة العامة.',
      category: 'accessories',
      location: 'المكتبة المركزية - وسط البلد',
      dateFound: new Date('2025-03-06'),
      imageUrl: null,
      contactName: 'نور الدين',
      contactPhone: '01154321098',
      status: 'found',
    },
    {
      title: 'لابتوب HP فضي',
      description: 'لابتوب HP فضي اللون في حقيبة سوداء. وجدته في قاعة المحاضرات بالجامعة.',
      category: 'electronics',
      location: 'جامعة القاهرة - كلية الهندسة',
      dateFound: new Date('2025-03-07'),
      imageUrl: null,
      contactName: 'منى السيد',
      contactPhone: '01243210987',
      status: 'found',
    },
    {
      title: 'بطاقة رخصة قيادة',
      description: 'بطاقة رخصة قيادة مصرية وجدتها على الرصيف بجوار كوبري الجامعة.',
      category: 'documents',
      location: 'كوبري الجامعة - الدقي',
      dateFound: new Date('2025-03-08'),
      imageUrl: null,
      contactName: 'حسن محمود',
      contactPhone: '01032109876',
      status: 'found',
    },
  ]

  for (const item of items) {
    await db.lostItem.create({ data: item })
  }

  console.log(`✅ Seeded ${items.length} items successfully!`)
}

seed()
  .catch(console.error)
  .finally(() => db.$disconnect())
