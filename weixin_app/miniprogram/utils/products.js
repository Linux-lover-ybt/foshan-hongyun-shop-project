/**
 * 文创商城商品数据 - 基于真实佛山文创产品
 * 图片随小程序包发布，路径格式: /images/products/product-编号.webp
 */

// 本地 WebP 商品图路径
const PRODUCT_IMAGE_BASE = '/images/products/';

const PRODUCTS = [
  // ===== 限时秒杀 =====
  {
    id: 1,
    name: '桑塘栖月图',
    category: '文创画册',
    image: PRODUCT_IMAGE_BASE + 'product-01.webp',
    images: [PRODUCT_IMAGE_BASE + 'product-01.webp'],
    description: '桑基鱼塘月色如画，岭南水乡诗意长卷',
    detail: '以佛山桑基鱼塘为灵感，描绘月下岭南水乡的静谧画卷。采用高精度数码印刷，艺术微喷工艺，色彩还原度高。含精美画框，可直接悬挂。尺寸：60×40cm，画芯采用310g博物馆级纯棉无酸纸。',
    price: 168.00,
    originalPrice: 258.00,
    pointsPrice: 840,
    stock: 30,
    rating: 4.9,
    sales: 680,
    specs: [
      { name: '尺寸', values: ['60×40cm', '80×60cm', '100×70cm'] }
    ],
    tags: ['秒杀', '包邮'],
    brand: '佛山文创',
    origin: '广东佛山',
    section: 'flash',
    reviews: [
      { user: '画意人生', avatar: '🎨', rating: 5, content: '月色太美了，挂在客厅特别有韵味', time: '3天前' },
      { user: '岭南人家', avatar: '🏠', rating: 5, content: '水乡气息扑面而来，很有佛山味道', time: '1周前' }
    ]
  },
  {
    id: 2,
    name: '粤港韶年图',
    category: '文创画册',
    image: PRODUCT_IMAGE_BASE + 'product-02.webp',
    images: [PRODUCT_IMAGE_BASE + 'product-02.webp'],
    description: '粤港双城岁月长卷，湾区故事尽在其中',
    detail: '以粤港两地标志性建筑和文化符号为素材，绘就双城记忆长卷。融合传统工笔与现代设计，展现湾区百年风华。高精度艺术微喷，博物馆级纸张。尺寸：120×30cm 长卷。',
    price: 198.00,
    originalPrice: 328.00,
    pointsPrice: 990,
    stock: 20,
    rating: 4.8,
    sales: 520,
    specs: [
      { name: '款式', values: ['长卷款', '框画款'] }
    ],
    tags: ['秒杀', '限量'],
    brand: '佛山文创',
    origin: '广东佛山',
    section: 'flash',
    reviews: [
      { user: '收藏家老陈', avatar: '🖼️', rating: 5, content: '长卷气势恢宏，值得收藏', time: '5天前' }
    ]
  },
  {
    id: 3,
    name: '雄狮挂件',
    category: '纪念品',
    image: PRODUCT_IMAGE_BASE + 'product-03.webp',
    images: [PRODUCT_IMAGE_BASE + 'product-03.webp'],
    description: '醒狮造型挂件，锌合金精铸，威风凛凛',
    detail: '以佛山醒狮为原型，锌合金压铸成型，手工打磨抛光。电镀古铜色，质感厚重。尺寸约5×4cm，配仿皮挂绳和精美礼盒。汽车钥匙、包包挂饰皆宜。',
    price: 58.00,
    originalPrice: 88.00,
    pointsPrice: 290,
    stock: 80,
    rating: 4.7,
    sales: 1200,
    specs: [
      { name: '款式', values: ['古铜色', '亮金色', '银色'] }
    ],
    tags: ['秒杀', '热销'],
    brand: '佛山文创',
    origin: '广东佛山',
    section: 'flash',
    reviews: [
      { user: '车主阿伟', avatar: '🚗', rating: 5, content: '挂在车钥匙上超有范，做工精细', time: '2天前' },
      { user: '醒狮迷', avatar: '🦁', rating: 5, content: '威武霸气，佛山特色十足', time: '1周前' }
    ]
  },
  {
    id: 4,
    name: '岭绣凝章',
    category: '手工艺品',
    image: PRODUCT_IMAGE_BASE + 'product-04.webp',
    images: [PRODUCT_IMAGE_BASE + 'product-04.webp'],
    description: '岭南刺绣凝于方寸，非遗技艺珍藏徽章',
    detail: '将岭南刺绣的精美纹样浓缩于徽章之上，采用真丝刺绣工艺，每一针都蕴含匠心。直径4cm，锌合金底座，电镀金色边框。配收藏证书，限量发行。可别于衣帽、包袋之上。',
    price: 78.00,
    originalPrice: 128.00,
    pointsPrice: 390,
    stock: 50,
    rating: 4.9,
    sales: 890,
    specs: [
      { name: '图案', values: ['牡丹纹', '瑞兽纹', '祥云纹'] }
    ],
    tags: ['秒杀', '非遗'],
    brand: '佛山文创',
    origin: '广东佛山',
    section: 'flash',
    reviews: [
      { user: '刺绣爱好者', avatar: '🪡', rating: 5, content: '真丝刺绣太精致了，非遗之美', time: '4天前' }
    ]
  },

  // ===== 新品推荐 =====
  {
    id: 5,
    name: '祖庙岁华',
    category: '文创画册',
    image: PRODUCT_IMAGE_BASE + 'product-05.webp',
    images: [PRODUCT_IMAGE_BASE + 'product-05.webp'],
    description: '祖庙四季更替，岁华流转中的岭南信仰',
    detail: '以佛山祖庙四季景色为主题，春祭、夏庙、秋醮、冬福，四季轮转中的岭南信仰图景。采用宣纸微喷工艺，古法手工装裱。附中英双语文化解读手册。尺寸：50×50cm。',
    price: 188.00,
    originalPrice: 268.00,
    pointsPrice: 940,
    stock: 25,
    rating: 4.9,
    sales: 320,
    specs: [
      { name: '款式', values: ['四季全套', '单季选款'] }
    ],
    tags: ['新品', '限量'],
    brand: '佛山文创',
    origin: '广东佛山',
    section: 'new',
    reviews: [
      { user: '文化学者', avatar: '📚', rating: 5, content: '四季祖庙，每一帧都是信仰的沉淀', time: '1天前' }
    ]
  },
  {
    id: 6,
    name: '香纱古邑',
    category: '手工艺品',
    image: PRODUCT_IMAGE_BASE + 'product-06.webp',
    images: [PRODUCT_IMAGE_BASE + 'product-06.webp'],
    description: '香云纱遇上古邑佛山，非遗织物的当代新生',
    detail: '选用正宗顺德香云纱，手工裁剪缝制。融入佛山古邑建筑纹样，传统与现代的完美碰撞。可用作茶席、桌旗、壁挂。尺寸：180×35cm。附香云纱保养指南。',
    price: 328.00,
    originalPrice: 468.00,
    pointsPrice: 1640,
    stock: 15,
    rating: 5.0,
    sales: 180,
    specs: [
      { name: '颜色', values: ['暮烟棕', '黛青蓝', '琥珀红'] }
    ],
    tags: ['新品', '非遗'],
    brand: '佛山文创',
    origin: '广东佛山',
    section: 'new',
    reviews: [
      { user: '茶道爱好者', avatar: '🍵', rating: 5, content: '做茶席太雅了，香云纱的质感绝了', time: '2天前' }
    ]
  },
  {
    id: 7,
    name: '通草盈芳',
    category: '手工艺品',
    image: PRODUCT_IMAGE_BASE + 'product-07.webp',
    images: [PRODUCT_IMAGE_BASE + 'product-07.webp'],
    description: '通草画盈满芳华，岭南花卉的百年绘法',
    detail: '传承百年通草画技艺，以通脱木茎髓为纸，植物颜料手绘岭南花卉。每幅均为画师亲笔，独一无二。配实木画框，尺寸：25×25cm。附通草画文化介绍卡。',
    price: 258.00,
    originalPrice: 388.00,
    pointsPrice: 1290,
    stock: 18,
    rating: 4.8,
    sales: 210,
    specs: [
      { name: '花卉', values: ['木棉', '白兰', '鸡蛋花'] }
    ],
    tags: ['新品', '非遗'],
    brand: '佛山文创',
    origin: '广东佛山',
    section: 'new',
    reviews: [
      { user: '艺术收藏', avatar: '🏛️', rating: 5, content: '通草画太珍贵了，百年技艺值得传承', time: '3天前' }
    ]
  },
  {
    id: 8,
    name: '南风窑光',
    category: '陶瓷陶艺',
    image: PRODUCT_IMAGE_BASE + 'product-08.webp',
    images: [PRODUCT_IMAGE_BASE + 'product-08.webp'],
    description: '南风古灶窑火不灭，五百年薪传的窑变之光',
    detail: '取材南风古灶窑变釉色，手工拉坯烧制。每件窑变效果独一无二，釉面流淌如光影交错。可用作花器或摆件。高约18cm，口径约8cm。附匠人签名和窑变证书。',
    price: 288.00,
    originalPrice: 398.00,
    pointsPrice: 1440,
    stock: 12,
    rating: 5.0,
    sales: 150,
    specs: [
      { name: '釉色', values: ['窑变红', '窑变蓝', '窑变绿'] }
    ],
    tags: ['新品', '手工'],
    brand: '佛山文创',
    origin: '广东佛山',
    section: 'new',
    reviews: [
      { user: '陶艺爱好者', avatar: '🏺', rating: 5, content: '窑变效果绝美，每一件都是孤品', time: '1天前' }
    ]
  },

  // ===== 排行榜 =====
  {
    id: 9,
    name: '樵山雾织',
    category: '手工艺品',
    image: PRODUCT_IMAGE_BASE + 'product-09.webp',
    images: [PRODUCT_IMAGE_BASE + 'product-09.webp'],
    description: '西樵山雾中织锦，山岚云海的丝缕缠绵',
    detail: '以西樵山云海雾景为灵感，真丝手工织锦。经纬之间再现山岚流转，雾霭升腾。可作壁挂装饰或丝巾佩戴。尺寸：90×90cm。附织锦技艺说明卡。',
    price: 358.00,
    originalPrice: 498.00,
    pointsPrice: 1790,
    stock: 10,
    rating: 4.9,
    sales: 980,
    specs: [
      { name: '款式', values: ['壁挂款', '丝巾款'] }
    ],
    tags: ['热销', '手工'],
    brand: '佛山文创',
    origin: '广东佛山',
    section: 'hot',
    reviews: [
      { user: '织锦收藏', avatar: '🧶', rating: 5, content: '雾景织锦太有意境了，西樵山的魂', time: '3天前' }
    ]
  },
  {
    id: 10,
    name: '秋色揽笺',
    category: '文具',
    image: PRODUCT_IMAGE_BASE + 'product-10.webp',
    images: [PRODUCT_IMAGE_BASE + 'product-10.webp'],
    description: '佛山秋色揽于笺上，非遗秋色赛会的纸间记忆',
    detail: '以佛山秋色巡游为题材，创作精美信笺套装。含20张手绘信笺+10个配套信封+1支钢笔。信笺采用100g进口纸张，双面印刷。附秋色文化解读册。',
    price: 68.00,
    originalPrice: 98.00,
    pointsPrice: 340,
    stock: 60,
    rating: 4.7,
    sales: 1560,
    specs: [
      { name: '套装', values: ['标准套装', '典藏套装'] }
    ],
    tags: ['热销', '包邮'],
    brand: '佛山文创',
    origin: '广东佛山',
    section: 'hot',
    reviews: [
      { user: '手账达人', avatar: '✍️', rating: 5, content: '秋色信笺太美了，写信都有仪式感', time: '2天前' }
    ]
  },
  {
    id: 11,
    name: '银耳清行',
    category: '生活用品',
    image: PRODUCT_IMAGE_BASE + 'product-11.webp',
    images: [PRODUCT_IMAGE_BASE + 'product-11.webp'],
    description: '银饰耳环清雅出行，岭南花丝镶嵌工艺',
    detail: '采用传统花丝镶嵌工艺，925纯银打造。以岭南花卉为造型，线条流畅清雅。耳钩为防过敏材质，舒适佩戴。配珠宝盒和保养布。尺寸约2×1.5cm。',
    price: 138.00,
    originalPrice: 198.00,
    pointsPrice: 690,
    stock: 35,
    rating: 4.8,
    sales: 2100,
    specs: [
      { name: '花型', values: ['白兰', '素馨', '茉莉'] }
    ],
    tags: ['热销', '手工'],
    brand: '佛山文创',
    origin: '广东佛山',
    section: 'hot',
    reviews: [
      { user: '饰品控', avatar: '💍', rating: 5, content: '花丝工艺太精致，清雅脱俗', time: '1天前' }
    ]
  },

  // ===== 综合区 =====
  {
    id: 12,
    name: '古灶留烬',
    category: '陶瓷陶艺',
    image: PRODUCT_IMAGE_BASE + 'product-12.webp',
    images: [PRODUCT_IMAGE_BASE + 'product-12.webp'],
    description: '古灶薪火留余烬，石湾陶艺的千年传承',
    detail: '以石湾古灶为灵感，手工陶制香插。造型古朴，釉面保留柴烧自然落灰效果。底部刻有匠人印记。高约8cm，口径约3cm。配檀香线香20支。',
    price: 128.00,
    originalPrice: 188.00,
    pointsPrice: 640,
    stock: 40,
    rating: 4.7,
    sales: 760,
    specs: [
      { name: '釉色', values: ['柴烧原色', '灰釉', '酱釉'] }
    ],
    tags: ['手工', '包邮'],
    brand: '佛山文创',
    origin: '广东佛山',
    section: 'general',
    reviews: [
      { user: '香道爱好者', avatar: '🧘', rating: 5, content: '古灶造型太有意境了，焚香静心', time: '5天前' }
    ]
  },
  {
    id: 13,
    name: '季华陶记',
    category: '陶瓷陶艺',
    image: PRODUCT_IMAGE_BASE + 'product-13.webp',
    images: [PRODUCT_IMAGE_BASE + 'product-13.webp'],
    description: '季华园畔陶艺笔记，记录石湾陶的前世今生',
    detail: '石湾陶文化主题笔记本，封面为手绘陶艺纹样浮雕工艺。内页192页，含陶艺知识科普、佛山陶历史年表。100g道林纸，书写流畅。A5尺寸，附书签带。',
    price: 55.00,
    originalPrice: 79.00,
    pointsPrice: 275,
    stock: 100,
    rating: 4.6,
    sales: 920,
    specs: [
      { name: '封面', values: ['青釉款', '红釉款'] }
    ],
    tags: ['包邮', '文化'],
    brand: '佛山文创',
    origin: '广东佛山',
    section: 'general',
    reviews: [
      { user: '陶艺学生', avatar: '🎓', rating: 5, content: '边学陶艺边做笔记，内容很专业', time: '1周前' }
    ]
  },
  {
    id: 14,
    name: '寸武藏香',
    category: '生活用品',
    image: PRODUCT_IMAGE_BASE + 'product-14.webp',
    images: [PRODUCT_IMAGE_BASE + 'product-14.webp'],
    description: '方寸之间藏武与香，咏春元素的随身香盒',
    detail: '融合咏春拳木人桩造型设计的随身香盒。锌合金材质，古铜色电镀。内置天然植物香料，缓缓释放清香。尺寸约5×3×1.5cm，磁吸开合。配替换香片3片。',
    price: 89.00,
    originalPrice: 128.00,
    pointsPrice: 445,
    stock: 55,
    rating: 4.8,
    sales: 640,
    specs: [
      { name: '香型', values: ['檀香', '沉香', '白茶'] }
    ],
    tags: ['手工', '文化'],
    brand: '佛山文创',
    origin: '广东佛山',
    section: 'general',
    reviews: [
      { user: '武术爱好者', avatar: '🥋', rating: 5, content: '木人桩造型太酷了，随身带香很方便', time: '3天前' }
    ]
  },
  {
    id: 15,
    name: '武藏岭南书',
    category: '文具',
    image: PRODUCT_IMAGE_BASE + 'product-15.webp',
    images: [PRODUCT_IMAGE_BASE + 'product-15.webp'],
    description: '武藏岭南之书，佛山武术文化典藏册',
    detail: '佛山武术文化主题典藏册，收录咏春、蔡李佛、龙形拳等拳种历史与招式图解。硬壳精装，160g铜版纸全彩印刷。128页，中英双语。附武术名家签章卡。',
    price: 98.00,
    originalPrice: 148.00,
    pointsPrice: 490,
    stock: 45,
    rating: 4.8,
    sales: 580,
    specs: [
      { name: '版本', values: ['中文版', '中英双语版'] }
    ],
    tags: ['限量', '文化'],
    brand: '佛山文创',
    origin: '广东佛山',
    section: 'general',
    reviews: [
      { user: '功夫迷', avatar: '🥋', rating: 5, content: '佛山武术大全，收藏必入', time: '2天前' }
    ]
  },
  {
    id: 16,
    name: '狮陶寻粤',
    category: '纪念品',
    image: PRODUCT_IMAGE_BASE + 'product-16.webp',
    images: [PRODUCT_IMAGE_BASE + 'product-16.webp'],
    description: '醒狮与陶艺寻粤记，双非遗联名冰箱贴',
    detail: '醒狮×石湾陶双非遗联名冰箱贴。石湾陶土手工捏塑，釉下彩绘。背面强力磁铁。每个约6×5cm，厚约1.5cm。4款造型：红狮、金狮、黑狮、彩狮。',
    price: 45.00,
    originalPrice: 68.00,
    pointsPrice: 225,
    stock: 120,
    rating: 4.7,
    sales: 3200,
    specs: [
      { name: '造型', values: ['红狮', '金狮', '黑狮', '彩狮'] }
    ],
    tags: ['热销', '包邮'],
    brand: '佛山文创',
    origin: '广东佛山',
    section: 'general',
    reviews: [
      { user: '旅游纪念', avatar: '✈️', rating: 5, content: '双非遗联名，太有收藏价值了', time: '1天前' }
    ]
  },
  {
    id: 17,
    name: '狮鸣樵岭',
    category: '文创画册',
    image: PRODUCT_IMAGE_BASE + 'product-17.webp',
    images: [PRODUCT_IMAGE_BASE + 'product-17.webp'],
    description: '醒狮长鸣西樵岭，岭南精神的艺术再现',
    detail: '以西樵山与醒狮为主题的工笔画作品。宣纸印刷，古法手工装裱。画中醒狮立于山巅，气势恢宏。尺寸：80×50cm。附文化解读手册。可悬挂或收藏。',
    price: 228.00,
    originalPrice: 338.00,
    pointsPrice: 1140,
    stock: 20,
    rating: 4.9,
    sales: 380,
    specs: [
      { name: '装裱', values: ['卷轴装裱', '框画装裱'] }
    ],
    tags: ['限量', '手工'],
    brand: '佛山文创',
    origin: '广东佛山',
    section: 'general',
    reviews: [
      { user: '国画收藏', avatar: '🖼️', rating: 5, content: '工笔细腻，醒狮气势磅礴', time: '4天前' }
    ]
  },
  {
    id: 18,
    name: '石湾朴造',
    category: '陶瓷陶艺',
    image: PRODUCT_IMAGE_BASE + 'product-18.webp',
    images: [PRODUCT_IMAGE_BASE + 'product-18.webp'],
    description: '石湾朴拙之造，回归陶艺本真的手作茶器',
    detail: '石湾陶土手工拉坯，不施釉，保留原始陶土质感。自然肌理，朴拙之美。可用作茶杯或笔筒。高约9cm，口径约7cm，容量约200ml。附匠人签名卡。',
    price: 108.00,
    originalPrice: 158.00,
    pointsPrice: 540,
    stock: 35,
    rating: 4.6,
    sales: 420,
    specs: [
      { name: '器型', values: ['直筒杯', '收口杯', '宽口杯'] }
    ],
    tags: ['手工', '包邮'],
    brand: '佛山文创',
    origin: '广东佛山',
    section: 'general',
    reviews: [
      { user: '茶客老李', avatar: '🍵', rating: 4, content: '朴拙有味道，喝茶别有一番风味', time: '1周前' }
    ]
  },
  {
    id: 19,
    name: '禅城叙集',
    category: '文创画册',
    image: PRODUCT_IMAGE_BASE + 'product-19.webp',
    images: [PRODUCT_IMAGE_BASE + 'product-19.webp'],
    description: '禅城故事叙集成册，佛山禅城人文风物志',
    detail: '佛山禅城人文风物主题画册，收录祖庙、梁园、岭南天地等12处地标。手绘水彩风格，中英双语注释。120g特种纸印刷，精装线装。96页，尺寸21×21cm。',
    price: 78.00,
    originalPrice: 118.00,
    pointsPrice: 390,
    stock: 70,
    rating: 4.8,
    sales: 780,
    specs: [
      { name: '版本', values: ['标准版', '签名版'] }
    ],
    tags: ['文化', '包邮'],
    brand: '佛山文创',
    origin: '广东佛山',
    section: 'general',
    reviews: [
      { user: '旅行者', avatar: '🗺️', rating: 5, content: '手绘太美了，了解禅城的好读物', time: '2天前' }
    ]
  },
  {
    id: 20,
    name: '陶叙南湾',
    category: '陶瓷陶艺',
    image: PRODUCT_IMAGE_BASE + 'product-20.webp',
    images: [PRODUCT_IMAGE_BASE + 'product-20.webp'],
    description: '陶叙南湾故事，石湾陶艺的前世今生图鉴',
    detail: '石湾陶艺文化主题图鉴画册，从明代至今的石湾陶发展历程。含200+高清陶艺作品图片，工艺大师访谈录。精装硬壳，200g铜版纸。208页，大开本。',
    price: 158.00,
    originalPrice: 228.00,
    pointsPrice: 790,
    stock: 30,
    rating: 4.9,
    sales: 290,
    specs: [
      { name: '版本', values: ['普通版', '典藏版'] }
    ],
    tags: ['限量', '文化'],
    brand: '佛山文创',
    origin: '广东佛山',
    section: 'general',
    reviews: [
      { user: '陶艺研究者', avatar: '🏺', rating: 5, content: '内容详实，图片精美，陶艺必读', time: '5天前' }
    ]
  }
];

// 优惠券数据
const COUPONS = [
  { id: 1, name: '新人专享', discount: 20, threshold: 99, desc: '满99减20', color: '#e54545', type: 'cash' },
  { id: 2, name: '品类券', discount: 10, threshold: 59, desc: '满59减10', color: '#ff6b6b', type: 'cash' },
  { id: 3, name: '包邮券', discount: 0, threshold: 0, desc: '全场包邮', color: '#ff8c00', type: 'shipping' },
  { id: 4, name: '积分加倍', discount: 2, threshold: 0, desc: '积分翻2倍', color: '#8e44ad', type: 'points' }
];

// 获取所有商品
function getAllProducts() {
  return PRODUCTS;
}

// 按ID获取商品
function getProductById(id) {
  return PRODUCTS.find(p => p.id === id);
}

// 按分类获取商品
function getProductsByCategory(category) {
  if (category === '全部') {
    return PRODUCTS;
  }
  return PRODUCTS.filter(p => p.category === category);
}

// 获取所有分类
function getAllCategories() {
  const categories = new Set(PRODUCTS.map(p => p.category));
  return ['全部'].concat(Array.from(categories));
}

// 获取优惠券
function getCoupons() {
  return COUPONS;
}

// 获取限时秒杀商品
function getFlashProducts(limit) {
  return PRODUCTS.filter(p => p.section === 'flash').slice(0, limit || 4);
}

// 获取热门商品（排行榜）
function getHotProducts(limit) {
  const hotOrder = ['岭绣凝章', '樵山雾织', '秋色揽笺', '银耳清行', '香纱古邑', '通草盈芳'];
  const hot = hotOrder.map(name => PRODUCTS.find(p => p.name === name)).filter(Boolean);
  return hot.slice(0, limit || 6);
}

// 获取新品
function getNewProducts(limit) {
  return PRODUCTS.filter(p => p.section === 'new').slice(0, limit || 4);
}

// 搜索商品
function searchProducts(keyword) {
  const key = keyword.toLowerCase().trim();
  if (!key) return PRODUCTS;
  return PRODUCTS.filter(p =>
    p.name.toLowerCase().includes(key) ||
    p.category.toLowerCase().includes(key) ||
    p.description.toLowerCase().includes(key) ||
    p.tags.some(t => t.includes(key))
  );
}

// CDN缓存
let cdnCache = {};

// 启动时清空缓存，避免旧格式残留
cdnCache = {};

// 批量将 cloud:// 链接转成 CDN HTTP 链接（更快）
function resolveCDNUrls(products) {
  return Promise.resolve(products || []);
  const cloudFiles = [];
  products.forEach(function(p) {
    if (p.image && p.image.startsWith('cloud://') && !cdnCache[p.image]) {
      cloudFiles.push(p.image);
    }
    if (p.images) {
      p.images.forEach(function(img) {
        if (img.startsWith('cloud://') && !cdnCache[img]) {
          cloudFiles.push(img);
        }
      });
    }
  });

  if (cloudFiles.length === 0) {
    var hasCached = products.some(function(p) { return p.image && cdnCache[p.image]; });
    if (hasCached) {
      return Promise.resolve(products.map(function(p) { return applyCDN(p); }));
    }
    return Promise.resolve(products);
  }

  return new Promise(function(resolve) {
    Promise.resolve({
      fileList: cloudFiles,
      success: function(res) {
        console.log('[CDN] getTempFileURL返回:', JSON.stringify(res.fileList.slice(0, 2)));
        res.fileList.forEach(function(f) {
          console.log('[CDN] 文件:', f.fileID, '状态:', f.status, '临时URL:', f.tempFileURL);
          if (f.status === 0) {
            cdnCache[f.fileID] = f.tempFileURL;
          }
        });
        // 检查缓存是否生效
        console.log('[CDN] 缓存数量:', Object.keys(cdnCache).length, '请求数量:', cloudFiles.length);
        console.log('[CDN] 示例缓存key:', cloudFiles[0], '是否有缓存:', !!cdnCache[cloudFiles[0]]);
        resolve(products.map(function(p) { return applyCDN(p); }));
      },
      fail: function(err) {
        console.error('[CDN] getTempFileURL失败:', err);
        resolve(products);
      }
    });
  });
}

function applyCDN(product) {
  const p = Object.assign({}, product);
  if (p.image && cdnCache[p.image]) {
    // 对CDN URL中的中文路径进行编码
    p.image = encodeChineseUrl(cdnCache[p.image]);
  }
  if (p.images) {
    p.images = p.images.map(function(img) {
      if (cdnCache[img]) {
        return encodeChineseUrl(cdnCache[img]);
      }
      return img;
    });
  }
  return p;
}

// 对URL中中文路径部分进行编码
function encodeChineseUrl(url) {
  // 只编码路径中的中文，保留协议和域名
  try {
    var match = url.match(/^(https?:\/\/[^\/]+\/)(.*)$/);
    if (match && match[2]) {
      var pathParts = match[2].split('/');
      var encodedParts = pathParts.map(function(part) {
        return encodeURIComponent(decodeURIComponent(part));
      });
      return match[1] + encodedParts.join('/');
    }
  } catch(e) {}
  return url;
}

function clearCDNCache() {
  cdnCache = {};
}

module.exports = {
  getAllProducts,
  getProductById,
  getProductsByCategory,
  getAllCategories,
  getCoupons,
  getFlashProducts,
  getHotProducts,
  getNewProducts,
  searchProducts,
  resolveCDNUrls,
  clearCDNCache
};

