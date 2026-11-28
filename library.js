window.FT = window.FT || {};
FT.library = {
  categories: [
    { id: 'general', n: 'علوم الأغذية عامة' },
    { id: 'chem', n: 'كيمياء الأغذية' },
    { id: 'micro', n: 'الأحياء الدقيقة وسلامة الغذاء' },
    { id: 'eng', n: 'هندسة وعمليات التصنيع' },
    { id: 'dairy', n: 'الألبان' },
    { id: 'fish', n: 'الأسماك والمعلبات' },
    { id: 'plant', n: 'الفواكه والخضار والزيوت' },
    { id: 'meat', n: 'اللحوم والمخبوزات' },
    { id: 'analysis', n: 'التحليل والمخبر' },
    { id: 'quality', n: 'الجودة والتصميم والتعبئة' }
  ],

  // مراجع أجنبية معروفة (بيانات ببليوغرافية فقط - الكتب نفسها تُقتنى أو تُستعار قانونياً)
  books: [
    { id: 'e1', title: 'Food Chemistry', author: 'Belitz, Grosch, Schieberle', year: 'Springer', lang: 'en', cat: 'chem', note: 'مرجع شامل في كيمياء مكونات الغذاء.' },
    { id: 'e2', title: "Fennema's Food Chemistry", author: 'Damodaran & Parkin (eds.)', year: 'CRC Press', lang: 'en', cat: 'chem', note: 'المرجع الأكاديمي الأشهر في كيمياء الأغذية.' },
    { id: 'e3', title: 'Food Microbiology: Fundamentals and Frontiers', author: 'Doyle & Buchanan (eds.)', year: 'ASM Press', lang: 'en', cat: 'micro', note: 'الأحياء الدقيقة والممرضات في الغذاء.' },
    { id: 'e4', title: 'Modern Food Microbiology', author: 'James M. Jay', year: 'Springer', lang: 'en', cat: 'micro', note: 'كتاب جامعي أساسي.' },
    { id: 'e5', title: 'Introduction to Food Engineering', author: 'R. Paul Singh & Dennis R. Heldman', year: 'Academic Press', lang: 'en', cat: 'eng', note: 'موازين المادة والطاقة، انتقال الحرارة، التعقيم، التجفيف.' },
    { id: 'e6', title: 'Food Processing Technology: Principles and Practice', author: 'P. J. Fellows', year: 'Woodhead', lang: 'en', cat: 'eng', note: 'من أفضل المراجع لعمليات التصنيع والمعدات.' },
    { id: 'e7', title: 'Handbook of Food Engineering', author: 'Heldman & Lund (eds.)', year: 'CRC Press', lang: 'en', cat: 'eng', note: '' },
    { id: 'e8', title: 'Unit Operations in Food Processing', author: 'R. L. Earle', year: 'NZIFST', lang: 'en', cat: 'eng', note: 'متاح مجاناً عبر الناشر (انظر المصادر المفتوحة).' },
    { id: 'e9', title: 'Food Science', author: 'Potter & Hotchkiss', year: 'Springer', lang: 'en', cat: 'general', note: 'مدخل ممتاز للمبتدئين.' },
    { id: 'e10', title: 'Essentials of Food Science', author: 'Vickie A. Vaclavik', year: 'Springer', lang: 'en', cat: 'general', note: '' },
    { id: 'e11', title: 'Dairy Science and Technology', author: 'Walstra, Wouters, Geurts', year: 'CRC Press', lang: 'en', cat: 'dairy', note: 'المرجع الأساسي في علم وتكنولوجيا الألبان.' },
    { id: 'e12', title: 'Dairy Processing and Quality Assurance', author: 'Chandan, Kilara, Shah (eds.)', year: 'Wiley', lang: 'en', cat: 'dairy', note: 'تصنيع الألبان وضبط الجودة عملياً.' },
    { id: 'e13', title: 'Tamime and Robinson\'s Yoghurt: Science and Technology', author: 'Tamime & Robinson', year: 'Woodhead', lang: 'en', cat: 'dairy', note: 'مرجع متخصص بالزبادي واللبن.' },
    { id: 'e14', title: 'Cheese: Chemistry, Physics and Microbiology', author: 'Fox, McSweeney, Cogan, Guinee (eds.)', year: 'Elsevier', lang: 'en', cat: 'dairy', note: '' },
    { id: 'e15', title: 'Fish Canning Handbook', author: 'Leif Bratt (ed.)', year: 'Wiley-Blackwell', lang: 'en', cat: 'fish', note: 'تعليب الأسماك من الاستلام حتى التعقيم.' },
    { id: 'e16', title: 'Fish Processing Technology', author: 'G. M. Hall (ed.)', year: 'Blackie', lang: 'en', cat: 'fish', note: '' },
    { id: 'e17', title: 'Fruit Juice Processing Technology', author: 'Nagy, Chen, Shaw (eds.)', year: 'AgScience', lang: 'en', cat: 'plant', note: '' },
    { id: 'e18', title: 'Handbook of Fruits and Fruit Processing', author: 'Y. H. Hui et al. (eds.)', year: 'Blackwell', lang: 'en', cat: 'plant', note: '' },
    { id: 'e19', title: 'Olive Oil: Chemistry and Technology', author: 'Dimitrios Boskou (ed.)', year: 'AOCS Press', lang: 'en', cat: 'plant', note: '' },
    { id: 'e20', title: 'Principles of Meat Science', author: 'Aberle et al.', year: 'Kendall Hunt', lang: 'en', cat: 'meat', note: '' },
    { id: 'e21', title: 'Bakery Products: Science and Technology', author: 'Y. H. Hui (ed.)', year: 'Blackwell', lang: 'en', cat: 'meat', note: '' },
    { id: 'e22', title: 'Food Analysis', author: 'S. Suzanne Nielsen (ed.)', year: 'Springer', lang: 'en', cat: 'analysis', note: 'طرق تحليل الأغذية: رطوبة، رماد، بروتين، دهن...' },
    { id: 'e23', title: 'Food Analysis Laboratory Experiments', author: 'S. Suzanne Nielsen', year: 'Springer', lang: 'en', cat: 'analysis', note: 'دليل عملي للمخبر.' },
    { id: 'e24', title: 'Official Methods of Analysis of AOAC International', author: 'AOAC International', year: '', lang: 'en', cat: 'analysis', note: 'الطرق المعيارية المعتمدة عالمياً.' },
    { id: 'e25', title: 'Handbook of Food Preservation', author: 'M. Shafiur Rahman (ed.)', year: 'CRC Press', lang: 'en', cat: 'eng', note: '' },
    { id: 'e26', title: 'Food Additives', author: 'Branen, Davidson, Salminen, Thorngate (eds.)', year: 'Marcel Dekker', lang: 'en', cat: 'chem', note: '' },
    { id: 'e27', title: 'Food Plant Design', author: 'Lopez-Gomez & Barbosa-Canovas', year: 'CRC Press', lang: 'en', cat: 'quality', note: 'تصميم المصانع الغذائية: التخطيط والمعدات والخدمات.' },
    { id: 'e28', title: 'Food Process Design', author: 'Maroulis & Saravacos', year: 'Marcel Dekker', lang: 'en', cat: 'quality', note: '' },
    { id: 'e29', title: 'Principles of Food Sanitation', author: 'Norman G. Marriott', year: 'Springer', lang: 'en', cat: 'quality', note: 'النظافة والتعقيم في مصانع الأغذية.' },
    { id: 'e30', title: 'HACCP: A Practical Approach', author: 'Mortimore & Wallace', year: 'Springer', lang: 'en', cat: 'quality', note: '' },
    { id: 'e31', title: 'Food Packaging: Principles and Practice', author: 'Gordon L. Robertson', year: 'CRC Press', lang: 'en', cat: 'quality', note: '' }
  ],

  // مصادر مفتوحة / مستودعات (روابط رئيسية)
  sources: [
    { n: 'FAO Knowledge Repository', d: 'منشورات ووثائق الفاو (تقنية، أسماك، ألبان، سلامة غذاء) - مجانية.', u: 'https://openknowledge.fao.org', lang: 'en' },
    { n: 'Codex Alimentarius', d: 'المواصفات الدولية للأغذية (سردين، معجون بندورة، ألبان...).', u: 'https://www.fao.org/fao-who-codexalimentarius/en/', lang: 'en' },
    { n: 'FAO Fisheries & Aquaculture', d: 'أدلة تصنيع وحفظ الأسماك.', u: 'https://www.fao.org/fishery/', lang: 'en' },
    { n: 'FDA - Bacteriological Analytical Manual', d: 'الطرق المجهرية والميكروبيولوجية لتحليل الأغذية.', u: 'https://www.fda.gov/food/laboratory-methods-food/bacteriological-analytical-manual-bam', lang: 'en' },
    { n: 'Unit Operations in Food Processing (R.L. Earle)', d: 'كتاب هندسة عمليات متاح أونلاين.', u: 'https://nzifst.org.nz/resources/unitoperations/', lang: 'en' },
    { n: 'PubMed Central', d: 'أبحاث علمية مفتوحة.', u: 'https://pmc.ncbi.nlm.nih.gov', lang: 'en' },
    { n: 'Open Textbook Library', d: 'كتب جامعية مفتوحة.', u: 'https://open.umn.edu/opentextbooks/', lang: 'en' },
    { n: 'Internet Archive', d: 'استعارة كتب رقمية قانونياً.', u: 'https://archive.org', lang: 'en' },
    { n: 'DOAJ', d: 'دليل المجلات العلمية المفتوحة.', u: 'https://doaj.org', lang: 'en' },
    { n: 'دار المنظومة', d: 'قاعدة بيانات عربية للأبحاث والرسائل (غالباً باشتراك جامعي).', u: 'https://search.mandumah.com', lang: 'ar' },
    { n: 'بنك المعرفة المصري', d: 'مصادر عربية وأجنبية (يتطلب تسجيلاً).', u: 'https://www.ekb.eg', lang: 'ar' },
    { n: 'المنصة الجزائرية للمجلات العلمية ASJP', d: 'مجلات علمية عربية مفتوحة.', u: 'https://www.asjp.cerist.dz', lang: 'ar' },
    { n: 'المجلات الأكاديمية العراقية IASJ', d: 'مجلات علمية عراقية مفتوحة.', u: 'https://www.iasj.net', lang: 'ar' },
    { n: 'المنظمة العربية للتنمية الزراعية', d: 'منشورات زراعية وغذائية عربية.', u: 'https://www.aoad.org', lang: 'ar' },
    { n: 'الفاو بالعربية', d: 'منشورات الفاو المتوفرة بالعربية.', u: 'https://www.fao.org/ar', lang: 'ar' }
  ],

  // اختصارات بحث عربية
  arTopics: [
    'تكنولوجيا الأغذية',
    'تصنيع الألبان',
    'تعليب الأسماك',
    'كيمياء الأغذية',
    'ميكروبيولوجيا الأغذية',
    'تحليل الأغذية',
    'تصنيع الخضار والفواكه',
    'زيت الزيتون',
    'حفظ الأغذية',
    'مراقبة جودة الأغذية'
  ]
};
