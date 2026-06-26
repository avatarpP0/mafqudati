import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST() {
  try {
    // Use Prisma's raw SQL to create tables since prisma db push
    // doesn't work in serverless environments
    console.log('Creating tables using raw SQL...')

    await db.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "LostItem" (
        "id" TEXT NOT NULL,
        "title" TEXT NOT NULL,
        "description" TEXT NOT NULL,
        "category" TEXT NOT NULL,
        "location" TEXT NOT NULL,
        "dateFound" TIMESTAMP(3) NOT NULL,
        "imageUrl" TEXT,
        "contactName" TEXT NOT NULL,
        "contactPhone" TEXT NOT NULL,
        "status" TEXT NOT NULL DEFAULT 'found',
        "verificationQuestion" TEXT,
        "verificationAnswer" TEXT,
        "reward" TEXT,
        "latitude" DOUBLE PRECISION,
        "longitude" DOUBLE PRECISION,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "LostItem_pkey" PRIMARY KEY ("id")
      );
    `)

    await db.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "LostReport" (
        "id" TEXT NOT NULL,
        "title" TEXT NOT NULL,
        "description" TEXT NOT NULL,
        "category" TEXT NOT NULL,
        "location" TEXT NOT NULL,
        "dateLost" TIMESTAMP(3) NOT NULL,
        "contactName" TEXT NOT NULL,
        "contactPhone" TEXT NOT NULL,
        "reward" TEXT,
        "status" TEXT NOT NULL DEFAULT 'active',
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "LostReport_pkey" PRIMARY KEY ("id")
      );
    `)

    console.log('Tables created successfully!')

    // Clear existing data
    await db.lostItem.deleteMany()
    await db.lostReport.deleteMany()

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
        verificationQuestion: 'ما هو لون غطاء الهاتف؟',
        verificationAnswer: 'بني',
        reward: '٥٠٠ جنيه',
        latitude: 30.0392,
        longitude: 31.2089,
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
        verificationQuestion: 'ما هو اسم البنك المكتوب على البطاقة؟',
        verificationAnswer: 'البنك الأهلي',
        reward: '١٠٠ جنيه',
        latitude: 30.0131,
        longitude: 31.2085,
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
        verificationQuestion: 'ما هو لون العلامة المعلقة مع المفتاح؟',
        verificationAnswer: 'أزرق',
        reward: null,
        latitude: 29.9602,
        longitude: 31.2569,
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
        verificationQuestion: 'ما هو اسم الجامعة المكتوب على الكتب؟',
        verificationAnswer: 'جامعة القاهرة',
        reward: '٢٠٠ جنيه',
        latitude: 30.0444,
        longitude: 31.2625,
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
        verificationQuestion: 'ما هو الاسم المكتوب على الجواز؟',
        verificationAnswer: 'محمد حسين',
        reward: null,
        latitude: 30.1219,
        longitude: 31.4056,
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
        verificationQuestion: 'ما هو نوع الساعة؟',
        verificationAnswer: 'كاسيو',
        reward: '٣٠٠ جنيه',
        latitude: 30.0561,
        longitude: 31.2243,
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
        verificationQuestion: 'ما هو الماركة المكتوبة على الجاكيت؟',
        verificationAnswer: 'زارا',
        reward: null,
        latitude: 30.0591,
        longitude: 31.2202,
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
        verificationQuestion: 'ما هو لون إطار النظارة؟',
        verificationAnswer: 'أسود',
        reward: '١٥٠ جنيه',
        latitude: 30.0444,
        longitude: 31.2357,
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
        verificationQuestion: 'ما هو لون الحقيبة المحملة باللابتوب؟',
        verificationAnswer: 'أسود',
        reward: '١٠٠٠ جنيه',
        latitude: 30.0266,
        longitude: 31.2746,
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
        verificationQuestion: 'ما هو الاسم المكتوب على الرخصة؟',
        verificationAnswer: 'علي حسن',
        reward: null,
        latitude: 30.0306,
        longitude: 31.2063,
      },
      {
        title: 'قطة رمادية صغيرة',
        description: 'قطة رمادية صغيرة بعمر حوالي 3 أشهر مع ياقة زهراء. وجدتها بالقرب من حديقة الأزهر تبدو ضائعة. ودودة جداً وتقترب من الناس.',
        category: 'pets',
        location: 'حديقة الأزهر - القاهرة',
        dateFound: new Date('2025-03-09'),
        imageUrl: null,
        contactName: 'ليلى أحمد',
        contactPhone: '01551112233',
        status: 'found',
        verificationQuestion: 'ما هو لون ياقة القطة؟',
        verificationAnswer: 'زهراء',
        reward: null,
        latitude: 30.0444,
        longitude: 31.2625,
      },
      {
        title: 'كلب بني صغير',
        description: 'كلب بني صغير من نوع شيه تزو مع ربطة عنق زرقاء. وجدته يتجول بالقرب من نادي الجزيرة. هادئ وودود ويبدو أنه منزل.',
        category: 'pets',
        location: 'نادي الجزيرة - الزمالك',
        dateFound: new Date('2025-03-10'),
        imageUrl: null,
        contactName: 'مريم خالد',
        contactPhone: '01223344556',
        status: 'found',
        verificationQuestion: 'ما هو نوع الكلب؟',
        verificationAnswer: 'شيه تزو',
        reward: '٥٠٠ جنيه',
        latitude: 30.0561,
        longitude: 31.2243,
      },
    ]

    for (const item of items) {
      await db.lostItem.create({ data: item })
    }

    const lostReports = [
      {
        title: 'فقدت هاتف سامسونج جالكسي S24 أزرق',
        description: 'فقدت هاتف سامسونج جالكسي S24 لون أزرق مع غطاء شفاف. فقدته في محطة المترو يوم الخميس الماضي. الهاتف يحتوي على صور عائلية مهمة.',
        category: 'electronics',
        location: 'محطة المترو - الدقي',
        dateLost: new Date('2025-03-01'),
        contactName: 'محمود عبدالرحمن',
        contactPhone: '01055512345',
        reward: '١٠٠٠ جنيه',
        status: 'active',
      },
      {
        title: 'ضاعت محفظتي البنية',
        description: 'محفظة جلدية بنية اللون تحتوي على بطاقات شخصية وبطاقة بنك مصر. ضاعت مني في مول العرب أمس.',
        category: 'wallets',
        location: 'مول العرب - الدور الأرضي',
        dateLost: new Date('2025-03-02'),
        contactName: 'منى السيد',
        contactPhone: '01166678901',
        reward: '٢٠٠ جنيه',
        status: 'active',
      },
      {
        title: 'فقدت حقيبتي الجامعية',
        description: 'حقيبة ظهر سوداء من نوع أديداس تحتوي على لابتوب ديل وكتب كلية الهندسة. فقدتها في منطقة الأزهر.',
        category: 'bags',
        location: 'حديقة الأزهر - القاهرة',
        dateLost: new Date('2025-02-27'),
        contactName: 'أحمد حسام',
        contactPhone: '01277789012',
        reward: '٥٠٠ جنيه',
        status: 'active',
      },
      {
        title: 'مفقود مفتاح سيارة هيونداي',
        description: 'مفتاح سيارة هيونداي مع علامة مفتاح حمراء. فقدته في موقف السيارات بالمعادي. السيارة موديل 2023.',
        category: 'keys',
        location: 'المعادي - شارع 9',
        dateLost: new Date('2025-03-03'),
        contactName: 'كريم يوسف',
        contactPhone: '01088890123',
        reward: null,
        status: 'active',
      },
      {
        title: 'فقدت جواز سفري الأخضر',
        description: 'جواز سفر مصري أخضر اللون. فقدته في مطار القاهرة الصالة 3. جوازي يحتوي على تأشيرات مهمة.',
        category: 'documents',
        location: 'مطار القاهرة الدولي - الصالة 3',
        dateLost: new Date('2025-03-04'),
        contactName: 'هاجر محمود',
        contactPhone: '01199901234',
        reward: '٢٠٠٠ جنيه',
        status: 'active',
      },
      {
        title: 'فقدت قطتي البيضاء',
        description: 'قطة بيضاء ناعمة بعمر سنة مع ياقة حمراء وجرس. فقدتها في منطقة المعادي. اسمها نسمة وتستجيب لاسمها.',
        category: 'pets',
        location: 'المعادي - شارع 9',
        dateLost: new Date('2025-03-08'),
        contactName: 'نورهان محمد',
        contactPhone: '01144556677',
        reward: '١٠٠٠ جنيه',
        status: 'active',
      },
    ]

    for (const report of lostReports) {
      await db.lostReport.create({ data: report })
    }

    return NextResponse.json({
      success: true,
      message: `Setup complete! Created tables and seeded ${items.length} found items and ${lostReports.length} lost reports.`,
    })
  } catch (error) {
    console.error('Setup error:', error)
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    )
  }
}
