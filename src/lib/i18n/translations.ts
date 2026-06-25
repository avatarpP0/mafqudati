export type Locale = 'ar' | 'en'

export const translations = {
  ar: {
    // App
    appName: 'مفقوداتي',
    appTagline: 'اعثر على أشيائك المفقودة',
    appDescription: 'مجتمع يساعد بعضه البعض لاستعادة الأشياء المفقودة. انشر الأشياء التي وجدتها ليعثر عليها أصحابها.',

    // Hero
    heroTitle1: 'اعثر على',
    heroTitle2: 'أشيائك المفقودة',

    // Feature pills
    featureVerification: 'تحقق من الملكية',
    featureAI: 'مطابقة ذكية بالذكاء الاصطناعي',
    featureMap: 'تحديد الموقع الجغرافي',
    featureReward: 'نظام المكافآت',

    // Header
    available: 'متاح',
    recovered: 'تم الاسترجاع',

    // Tabs
    tabFound: 'أشياء موجودة',
    tabLost: 'بلاغات الفقدان',

    // Categories
    catAll: 'الكل',
    catElectronics: 'إلكترونيات',
    catDocuments: 'مستندات',
    catKeys: 'مفاتيح',
    catClothing: 'ملابس',
    catAccessories: 'إكسسوارات',
    catBags: 'حقائب',
    catWallets: 'محافظ',
    catPets: 'حيوانات أليفة',
    catOther: 'أخرى',

    // Status
    statusAvailable: 'متاح',
    statusClaimed: 'تم الاسترجاع',
    statusLost: 'مفقود',
    statusFound: 'تم العثور',

    // Buttons
    btnReportFound: 'أبلغ عن شيء موجود',
    btnReportLost: 'أبلغ عن شيء مفقود',
    btnSearchAI: 'بحث عن تطابقات بالذكاء الاصطناعي',
    btnSearchingAI: 'جاري البحث بالذكاء الاصطناعي...',
    btnViewDetails: 'عرض التفاصيل',
    btnClaim: 'هذا الشيء لي - أريد استرجاعه',
    btnClaiming: 'جاري التأكيد...',
    btnPublish: 'نشر البلاغ',
    btnPublishing: 'جاري النشر...',
    btnPublishLost: 'نشر بلاغ الفقدان',
    btnPublishingLost: 'جاري النشر والبحث عن تطابقات...',

    // Search
    searchPlaceholder: 'ابحث عن شيء مفقود...',

    // Post Found Dialog
    postFoundTitle: 'أبلغ عن شيء وجدته',
    labelTitle: 'عنوان الشيء *',
    labelDescription: 'الوصف *',
    labelCategory: 'التصنيف *',
    labelLocation: 'مكان الوجود *',
    labelDateFound: 'تاريخ الوجود *',
    labelImageUrl: 'رابط الصورة (اختياري)',
    labelImageGen: 'الصورة (اختياري - أدخل رابط أو ولّد صورة)',
    imageGenerated: 'تم توليد الصورة بنجاح!',
    btnGenerateImage: 'توليد صورة',
    labelContactName: 'اسمك *',
    labelContactPhone: 'رقم الهاتف *',
    phTitle: 'مثال: هاتف آيفون أسود',
    phDescription: 'صف الشيء الذي وجدته بالتفصيل...',
    phLocation: 'مثال: محطة المترو - الدقي',
    phContactName: 'اسمك الكامل',
    phContactPhone: '01xxxxxxxxx',

    // Map
    labelMap: 'تحديد الموقع على الخريطة (اختياري)',
    mapClickPrompt: 'انقر على الخريطة لتحديد الموقع',
    mapLoading: 'جاري تحميل الخريطة...',
    mapLocationLabel: 'موقع العثور على الخريطة',

    // Verification
    labelVerification: 'سؤال التحقق (لمنع الاحتيال) *',
    verificationDesc: 'اطرح سؤالاً لا يعرف إجابته إلا المالك الحقيقي. لن تظهر بيانات التواصل إلا بعد الإجابة الصحيحة.',
    phVerificationQ: 'مثال: ما هي العلامة المميزة في خلفية الهاتف؟',
    phVerificationA: 'الإجابة الصحيحة',
    verifyTitle: 'تحقق من الملكية',
    verifyDesc: 'يجب الإجابة على سؤال التحقق لعرض بيانات التواصل مع العاثر',
    verifyQuestion: 'السؤال:',
    verifyPlaceholder: 'اكتب إجابتك هنا...',
    verifyAttemptsLeft: 'متبقي {count} من {max} محاولات',
    verifyWrongAnswer: 'الإجابة غير صحيحة. متبقي {count} محاولة.',
    verifyWrongAnswerOne: 'الإجابة غير صحيحة. متبقي محاولة واحدة.',
    verifyLocked: 'تم حظر المحاولات',
    verifyLockedDesc: 'تم تجاوز الحد الأقصى للمحاولات (3 محاولات). يرجى المحاولة بعد 15 دقيقة.',
    verifySuccess: 'تم التحقق بنجاح! يمكنك الآن رؤية بيانات التواصل',
    verifyBadge: 'تحقق',
    verifyContactRevealed: 'تم الكشف عن بيانات التواصل بعد التحقق من الملكية',
    verifyNoQuestion: 'بيانات التواصل متاحة مباشرة - لم يحدد العاثر سؤال تحقق',
    verifyError: 'يرجى إدخال إجابة السؤال',

    // Reward
    labelReward: 'مكافأة مالية (اختياري)',
    rewardDesc: 'يمكنك رصد مكافأة تشجيعية لمن يعثر على الشيء',
    rewardDescLost: 'رصد مكافأة تشجيعية يزيد من فرص استرجاع الشيء',
    phReward: 'مثال: 200 جنيه',
    phRewardLost: 'مثال: 500 جنيه',
    rewardLabel: 'مكافأة مقدمة',
    rewardBadge: 'مكافأة',

    // Reward Terms
    rewardTermsTitle: 'تنويه قانوني حول المكافآت',
    rewardTermsText: 'المكافأة المذكورة هي التزام أخلاقي من المالك، وليست التزاماً قانونياً ملزماً للمنصة. موقع مفقوداتي يتوسط فقط في التواصل بين الطرفين ولا يتحمل أي مسؤولية عن تنفيذ أو عدم تنفيذ المكافأة. أي تعاملات مالية تتم بين الطرفين هي مسؤوليتهما الشخصية بالكامل. المنصة غير مسؤولة عن أي نزاعات مالية قد تنشأ.',

    // Post Lost Dialog
    postLostTitle: 'أبلغ عن شيء فقدته',
    labelLostTitle: 'عنوان الشيء المفقود *',
    labelLostDescription: 'الوصف التفصيلي *',
    labelLostLocation: 'آخر مكان كان فيه *',
    labelDateLost: 'تاريخ الفقدان *',
    phLostTitle: 'مثال: هاتف آيفون 15 برو ماكس أسود',
    phLostDescription: 'صف الشيء المفقود بالتفصيل: اللون، العلامات المميزة، المحتوى...',
    phLostLocation: 'مثال: محطة المترو - الدقي',

    // Item Detail
    detailTitle: 'تفاصيل الشيء',
    detailPlace: 'المكان',
    detailDateFound: 'تاريخ الوجود',
    detailDateLost: 'تاريخ الفقدان',
    detailReporterName: 'اسم المبلغ',
    detailPhone: 'رقم الهاتف',
    detailPostedAt: 'تم النشر في',
    detailAvailableForReturn: 'متاح للاسترجاع',

    // AI Match
    matchSuccessTitle: 'تم العثور على تطابقات!',
    matchSuccessDesc: 'وجدنا {count} تطابق محتمل',
    matchNoResults: 'لا توجد تطابقات حالياً',
    matchNoResultsDesc: 'سيتم إعلامك عند ظهور أشياء مطابقة',
    matchError: 'حدث خطأ أثناء البحث عن تطابقات',
    matchClickToVerify: 'انقر لعرض التفاصيل والتحقق من الملكية',
    matchPotential: 'تطابق محتمل',
    matchHigh: 'تطابق عالي',
    matchMedium: 'تطابق متوسط',
    matchPotentialLabel: 'تطابق محتمل',

    // Empty states
    emptyFoundTitle: 'لا توجد أشياء حالياً',
    emptyFoundDesc: 'كن أول من ينشر شيئاً وجده! ساعد الآخرين في استعادة أشيائهم المفقودة.',
    emptyFiltered: 'لم يتم العثور على نتائج مطابقة. جرب تغيير معايير البحث.',
    emptyLostTitle: 'لا توجد بلاغات فقدان',
    emptyLostDesc: 'أبلغ عن شيء فقدته وسيساعدك الذكاء الاصطناعي في البحث عنه تلقائياً',

    // Toasts
    toastPublished: 'تم بنجاح',
    toastPublishedDesc: 'تم نشر الشيء المفقود بنجاح',
    toastPublishError: 'حدث خطأ أثناء نشر الشيء المفقود',
    toastReportPublished: 'تم بنجاح',
    toastReportPublishedDesc: 'تم نشر بلاغ الفقدان. سيقوم النظام بالبحث تلقائياً عن تطابقات.',
    toastReportError: 'حدث خطأ أثناء نشر بلاغ الفقدان',
    toastVerified: 'تم التحقق بنجاح!',
    toastVerifiedDesc: 'يمكنك الآن رؤية بيانات التواصل',
    toastWrongAnswer: 'إجابة خاطئة',
    toastWrongAnswerDesc: 'الإجابة غير صحيحة. حاول مرة أخرى.',
    toastRateLimited: 'تم حظر المحاولات',
    toastVerifyError: 'حدث خطأ أثناء التحقق',
    toastClaimed: 'تم بنجاح',
    toastClaimedDesc: 'تم تأكيد استرجاع الشيء. شكراً لك!',
    toastClaimError: 'حدث خطأ أثناء تحديث الحالة',

    // Footer
    footerText: 'مجتمع يساعد بعضه البعض لاستعادة الأشياء المفقودة',

    // Stats
    statTotalItems: 'إجمالي البلاغات',
    statRecovered: 'تم استرجاعها',
    statAvailable: 'متاحة للاسترجاع',
    statReports: 'بلاغات الفقدان',

    // Share
    btnShare: 'مشاركة',
    shareCopied: 'تم نسخ الرابط!',

    // Dark Mode
    toggleDark: 'الوضع الداكن',
    toggleLight: 'الوضع الفاتح',
  },

  en: {
    // App
    appName: 'Mafqudati',
    appTagline: 'Find your lost belongings',
    appDescription: 'A community helping each other recover lost items. Post items you found so their owners can reclaim them.',

    // Hero
    heroTitle1: 'Find Your',
    heroTitle2: 'Lost Belongings',

    // Feature pills
    featureVerification: 'Ownership Verification',
    featureAI: 'AI Smart Matching',
    featureMap: 'Geolocation',
    featureReward: 'Reward System',

    // Header
    available: 'Available',
    recovered: 'Recovered',

    // Tabs
    tabFound: 'Found Items',
    tabLost: 'Lost Reports',

    // Categories
    catAll: 'All',
    catElectronics: 'Electronics',
    catDocuments: 'Documents',
    catKeys: 'Keys',
    catClothing: 'Clothing',
    catAccessories: 'Accessories',
    catBags: 'Bags',
    catWallets: 'Wallets',
    catPets: 'Pets',
    catOther: 'Other',

    // Status
    statusAvailable: 'Available',
    statusClaimed: 'Claimed',
    statusLost: 'Lost',
    statusFound: 'Found',

    // Buttons
    btnReportFound: 'Report Found Item',
    btnReportLost: 'Report Lost Item',
    btnSearchAI: 'Search AI Matches',
    btnSearchingAI: 'AI is searching...',
    btnViewDetails: 'View Details',
    btnClaim: 'This is mine - I want to claim it',
    btnClaiming: 'Confirming...',
    btnPublish: 'Publish Report',
    btnPublishing: 'Publishing...',
    btnPublishLost: 'Publish Lost Report',
    btnPublishingLost: 'Publishing & searching for matches...',

    // Search
    searchPlaceholder: 'Search for a lost item...',

    // Post Found Dialog
    postFoundTitle: 'Report a Found Item',
    labelTitle: 'Item Title *',
    labelDescription: 'Description *',
    labelCategory: 'Category *',
    labelLocation: 'Location Found *',
    labelDateFound: 'Date Found *',
    labelImageUrl: 'Image URL (optional)',
    labelImageGen: 'Image (optional - enter URL or generate)',
    imageGenerated: 'Image generated successfully!',
    btnGenerateImage: 'Generate Image',
    labelContactName: 'Your Name *',
    labelContactPhone: 'Phone Number *',
    phTitle: 'e.g.: Black iPhone',
    phDescription: 'Describe the item you found in detail...',
    phLocation: 'e.g.: Metro Station - Dokki',
    phContactName: 'Your full name',
    phContactPhone: '01xxxxxxxxx',

    // Map
    labelMap: 'Pick location on map (optional)',
    mapClickPrompt: 'Click on the map to set location',
    mapLoading: 'Loading map...',
    mapLocationLabel: 'Found location on map',

    // Verification
    labelVerification: 'Verification Question (Anti-Fraud) *',
    verificationDesc: 'Ask a question only the real owner would know. Contact details will only be shown after a correct answer.',
    phVerificationQ: 'e.g.: What distinctive mark is on the back of the phone?',
    phVerificationA: 'Correct Answer',
    verifyTitle: 'Verify Ownership',
    verifyDesc: 'Answer the verification question to reveal the finder\'s contact details',
    verifyQuestion: 'Question:',
    verifyPlaceholder: 'Type your answer here...',
    verifyAttemptsLeft: '{count} of {max} attempts remaining',
    verifyWrongAnswer: 'Incorrect answer. {count} attempt(s) remaining.',
    verifyWrongAnswerOne: 'Incorrect answer. 1 attempt remaining.',
    verifyLocked: 'Attempts Blocked',
    verifyLockedDesc: 'Maximum attempts exceeded (3). Please try again after 15 minutes.',
    verifySuccess: 'Verification successful! You can now see the contact details',
    verifyBadge: 'Verified',
    verifyContactRevealed: 'Contact details revealed after ownership verification',
    verifyNoQuestion: 'Contact details available directly - finder did not set a verification question',
    verifyError: 'Please enter an answer to the question',

    // Reward
    labelReward: 'Reward (optional)',
    rewardDesc: 'You can offer a reward to encourage the finder',
    rewardDescLost: 'Offering a reward increases chances of recovering your item',
    phReward: 'e.g.: 200 EGP',
    phRewardLost: 'e.g.: 500 EGP',
    rewardLabel: 'Reward Offered',
    rewardBadge: 'Reward',

    // Reward Terms
    rewardTermsTitle: 'Legal Disclaimer - Rewards',
    rewardTermsText: 'The mentioned reward is a moral commitment from the owner, not a legally binding obligation for the platform. Mafqudati only facilitates communication between parties and bears no responsibility for the execution or non-execution of the reward. Any financial transactions between the parties are their personal responsibility entirely. The platform is not responsible for any financial disputes that may arise.',

    // Post Lost Dialog
    postLostTitle: 'Report a Lost Item',
    labelLostTitle: 'Lost Item Title *',
    labelLostDescription: 'Detailed Description *',
    labelLostLocation: 'Last Known Location *',
    labelDateLost: 'Date Lost *',
    phLostTitle: 'e.g.: Black iPhone 15 Pro Max',
    phLostDescription: 'Describe the lost item in detail: color, distinctive marks, contents...',
    phLostLocation: 'e.g.: Metro Station - Dokki',

    // Item Detail
    detailTitle: 'Item Details',
    detailPlace: 'Location',
    detailDateFound: 'Date Found',
    detailDateLost: 'Date Lost',
    detailReporterName: 'Reporter Name',
    detailPhone: 'Phone',
    detailPostedAt: 'Posted on',
    detailAvailableForReturn: 'Available for return',

    // AI Match
    matchSuccessTitle: 'Matches Found!',
    matchSuccessDesc: 'Found {count} potential match(es)',
    matchNoResults: 'No matches currently',
    matchNoResultsDesc: 'You will be notified when matching items appear',
    matchError: 'Error searching for matches',
    matchClickToVerify: 'Click to view details and verify ownership',
    matchPotential: 'potential match(es)',
    matchHigh: 'High Match',
    matchMedium: 'Medium Match',
    matchPotentialLabel: 'Potential Match',

    // Empty states
    emptyFoundTitle: 'No items currently',
    emptyFoundDesc: 'Be the first to report a found item! Help others recover their belongings.',
    emptyFiltered: 'No matching results found. Try changing your search criteria.',
    emptyLostTitle: 'No lost reports',
    emptyLostDesc: 'Report a lost item and AI will automatically search for matches',

    // Toasts
    toastPublished: 'Success',
    toastPublishedDesc: 'Found item published successfully',
    toastPublishError: 'Error publishing found item',
    toastReportPublished: 'Success',
    toastReportPublishedDesc: 'Lost report published. The system will automatically search for matches.',
    toastReportError: 'Error publishing lost report',
    toastVerified: 'Verification Successful!',
    toastVerifiedDesc: 'You can now see the contact details',
    toastWrongAnswer: 'Wrong Answer',
    toastWrongAnswerDesc: 'The answer is incorrect. Try again.',
    toastRateLimited: 'Attempts Blocked',
    toastVerifyError: 'Error during verification',
    toastClaimed: 'Success',
    toastClaimedDesc: 'Item claimed successfully. Thank you!',
    toastClaimError: 'Error updating item status',

    // Footer
    footerText: 'A community helping each other recover lost belongings',

    // Stats
    statTotalItems: 'Total Reports',
    statRecovered: 'Recovered',
    statAvailable: 'Available for Return',
    statReports: 'Lost Reports',

    // Share
    btnShare: 'Share',
    shareCopied: 'Link copied!',

    // Dark Mode
    toggleDark: 'Dark Mode',
    toggleLight: 'Light Mode',
  },
} as const

export type TranslationKey = keyof typeof translations.ar
