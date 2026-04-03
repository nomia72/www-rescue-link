export interface CaseItem {
  id: string;
  title: string;
  animalType: '猫' | '狗' | '其他';
  status: string;
  location: string;
  city: string;
  distance?: string;
  updatedAt: string;
  totalPoints: number;
  earnedPoints: number;
  isUrgent: boolean;
  image: string;
  description: string;
  contact: string;
  helpType: 'emergency' | 'supply' | 'foster' | 'adopt' | 'lost';
  urgentNeed?: string;
  needs: NeedItem[];
  timeline: TimelineItem[];
  evidences: EvidenceItem[];
}

export interface NeedItem {
  id: string;
  name: string;
  points: number;
  fulfilled: boolean;
  claimedBy?: string;
}

export interface TimelineItem {
  date: string;
  content: string;
  type: 'update' | 'milestone' | 'evidence';
}

export interface EvidenceItem {
  id: string;
  type: string;
  uploadedAt: string;
  confirmed: boolean;
  chainStatus?: 'pending' | 'stored' | 'not_stored';
  chainHash?: string;
  chainId?: string;
}

export interface ShopItem {
  id: string;
  name: string;
  price: string;
  points: number;
  image: string;
  category: string;
}

export interface GuideItem {
  id: string;
  title: string;
  summary: string;
  points: number;
  readTime: string;
  category: string;
}

export interface LostPetClue {
  id: string;
  petId: string;
  photo: string;
  time: string;
  location: string;
  lat: number;
  lng: number;
  note: string;
  status: '待确认' | '已采纳' | '已排除';
  submitter: string;
  points: number;
}

export const mockUser = {
  name: '小明',
  avatar: '',
  totalPoints: 600,
  todayEarned: 35,
  todayRemaining: 65,
  level: '爱心守护者',
  badges: ['初心救助者', '积分先锋', '传播之星'],
  casesPublished: 3,
  casesFollowed: 8,
  helpsGiven: 12,
};

export const mockCases: CaseItem[] = [
  {
    id: '1',
    title: '朝阳区受伤橘猫急需送医',
    animalType: '猫',
    status: '待送医',
    location: '北京市朝阳区望京SOHO附近',
    city: '北京',
    distance: '1.2km',
    updatedAt: '10分钟前',
    totalPoints: 500,
    earnedPoints: 320,
    isUrgent: true,
    image: '',
    description: '在望京SOHO停车场发现一只受伤的橘猫，右前腿疑似骨折，精神萎靡，需要尽快送医治疗。目前暂时安置在纸箱中，有志愿者在现场看护。',
    contact: '微信：rescue_bj_001',
    helpType: 'emergency',
    urgentNeed: '急需送医',
    needs: [
      { id: 'n1', name: '紧急送医', points: 200, fulfilled: false },
      { id: 'n2', name: '医疗费用', points: 150, fulfilled: false },
      { id: 'n3', name: '术后猫粮', points: 80, fulfilled: true, claimedBy: '爱心用户A' },
      { id: 'n4', name: '恢复期寄养', points: 70, fulfilled: false },
    ],
    timeline: [
      { date: '2026-04-03 14:30', content: '发现受伤橘猫，拍照记录现场情况', type: 'milestone' },
      { date: '2026-04-03 14:45', content: '志愿者到达现场，提供临时安置', type: 'update' },
      { date: '2026-04-03 15:00', content: '发布救助信息，等待送医资源', type: 'update' },
    ],
    evidences: [
      { id: 'e1', type: '现场照片', uploadedAt: '2026-04-03 14:32', confirmed: true, chainStatus: 'stored', chainHash: '0xab3f...7e2d', chainId: 'AVX-2026-0403-001' },
      { id: 'e2', type: '志愿者到场记录', uploadedAt: '2026-04-03 14:48', confirmed: true, chainStatus: 'pending' },
    ],
  },
  {
    id: '2',
    title: '流浪狗妈妈带4只幼崽需要寄养',
    animalType: '狗',
    status: '待安置',
    location: '上海市浦东新区世纪公园附近',
    city: '上海',
    distance: '3.8km',
    updatedAt: '1小时前',
    totalPoints: 800,
    earnedPoints: 450,
    isUrgent: false,
    image: '',
    description: '世纪公园附近发现一只流浪狗妈妈带着4只幼崽，狗妈妈已经做过绝育（耳标），幼崽大约3周大。需要临时寄养家庭。',
    contact: '微信：rescue_sh_002',
    helpType: 'foster',
    needs: [
      { id: 'n5', name: '狗粮（幼犬）', points: 120, fulfilled: false },
      { id: 'n6', name: '驱虫药', points: 80, fulfilled: true, claimedBy: '爱心用户B' },
      { id: 'n7', name: '寄养家庭', points: 300, fulfilled: false },
      { id: 'n8', name: '基础体检', points: 200, fulfilled: false },
      { id: 'n9', name: '保暖垫子', points: 100, fulfilled: true, claimedBy: '爱心用户C' },
    ],
    timeline: [
      { date: '2026-04-02 09:00', content: '发现狗妈妈和幼崽', type: 'milestone' },
      { date: '2026-04-02 11:00', content: '确认狗妈妈已绝育', type: 'update' },
      { date: '2026-04-03 08:00', content: '驱虫药已认领', type: 'update' },
    ],
    evidences: [
      { id: 'e3', type: '现场照片', uploadedAt: '2026-04-02 09:05', confirmed: true, chainStatus: 'stored', chainHash: '0xcd5e...9a1b', chainId: 'AVX-2026-0402-003' },
    ],
  },
  {
    id: '3',
    title: '社区猫绝育计划 · 第12期',
    animalType: '猫',
    status: '治疗中',
    location: '广州市天河区棠下村',
    city: '广州',
    distance: '5.4km',
    updatedAt: '3小时前',
    totalPoints: 1200,
    earnedPoints: 900,
    isUrgent: false,
    image: '',
    description: '棠下村社区猫TNR计划第12期，本期目标绝育8只社区猫。目前已完成5只，还需要3个绝育名额的资源支持。',
    contact: '微信：tnr_gz_012',
    helpType: 'supply',
    needs: [
      { id: 'n10', name: '绝育名额 x3', points: 450, fulfilled: false },
      { id: 'n11', name: '术后护理用品', points: 150, fulfilled: false },
      { id: 'n12', name: '猫粮补给', points: 200, fulfilled: true, claimedBy: '爱心用户D' },
      { id: 'n13', name: '志愿者协助', points: 100, fulfilled: true, claimedBy: '爱心用户E' },
      { id: 'n14', name: '运输笼具', points: 80, fulfilled: true, claimedBy: '爱心用户F' },
    ],
    timeline: [
      { date: '2026-03-28', content: '第12期TNR计划启动', type: 'milestone' },
      { date: '2026-04-01', content: '完成前5只绝育手术', type: 'milestone' },
      { date: '2026-04-03', content: '猫粮和笼具已到位', type: 'update' },
    ],
    evidences: [
      { id: 'e4', type: '医院单据', uploadedAt: '2026-04-01 16:00', confirmed: true, chainStatus: 'stored', chainHash: '0xef12...3c4d', chainId: 'AVX-2026-0401-005' },
      { id: 'e5', type: '术后照片', uploadedAt: '2026-04-01 18:00', confirmed: true, chainStatus: 'stored', chainHash: '0x1234...5678', chainId: 'AVX-2026-0401-006' },
      { id: 'e6', type: '物资签收照片', uploadedAt: '2026-04-03 10:00', confirmed: false, chainStatus: 'pending' },
    ],
  },
  {
    id: '4',
    title: '被弃养泰迪寻找新家',
    animalType: '狗',
    status: '待安置',
    location: '成都市锦江区',
    city: '成都',
    distance: '8.1km',
    updatedAt: '昨天',
    totalPoints: 300,
    earnedPoints: 280,
    isUrgent: false,
    image: '',
    description: '一只约2岁的泰迪被主人弃养在小区门口，已完成体检和疫苗接种，性格温顺亲人，适合有经验的领养人。',
    contact: '微信：adopt_cd_004',
    helpType: 'adopt',
    needs: [
      { id: 'n15', name: '领养审核', points: 50, fulfilled: false },
      { id: 'n16', name: '寄养过渡', points: 150, fulfilled: true, claimedBy: '爱心用户G' },
      { id: 'n17', name: '狗粮', points: 100, fulfilled: true, claimedBy: '爱心用户H' },
    ],
    timeline: [
      { date: '2026-03-30', content: '发现被弃养泰迪', type: 'milestone' },
      { date: '2026-04-01', content: '完成体检和疫苗接种', type: 'milestone' },
      { date: '2026-04-02', content: '发布领养信息', type: 'update' },
    ],
    evidences: [
      { id: 'e7', type: '体检报告', uploadedAt: '2026-04-01 14:00', confirmed: true, chainStatus: 'stored', chainHash: '0xaaaa...bbbb', chainId: 'AVX-2026-0401-010' },
    ],
  },
  {
    id: '5',
    title: '高速路边发现受伤流浪犬',
    animalType: '狗',
    status: '治疗中',
    location: '深圳市南山区',
    city: '深圳',
    distance: '2.3km',
    updatedAt: '2小时前',
    totalPoints: 600,
    earnedPoints: 150,
    isUrgent: true,
    image: '',
    description: '高速路边发现一只受伤的中型犬，后腿有明显外伤，已送至宠物医院。目前正在治疗中，需要医疗费用和术后护理支持。',
    contact: '微信：rescue_sz_005',
    helpType: 'emergency',
    urgentNeed: '急需接力',
    needs: [
      { id: 'n18', name: '手术费用', points: 300, fulfilled: false },
      { id: 'n19', name: '住院护理', points: 150, fulfilled: false },
      { id: 'n20', name: '术后药品', points: 80, fulfilled: false },
      { id: 'n21', name: '康复期狗粮', points: 70, fulfilled: false },
    ],
    timeline: [
      { date: '2026-04-03 10:00', content: '在高速路边发现受伤流浪犬', type: 'milestone' },
      { date: '2026-04-03 11:30', content: '成功救出并送医', type: 'milestone' },
      { date: '2026-04-03 13:00', content: '开始手术治疗', type: 'update' },
    ],
    evidences: [
      { id: 'e8', type: '医院收治记录', uploadedAt: '2026-04-03 11:35', confirmed: true, chainStatus: 'pending' },
    ],
  },
];

export const mockLostPets = [
  { id: 'l1', type: '猫', name: '橘子', location: '北京市海淀区中关村', lostDate: '2026-04-01', features: '橘色短毛，脖子有蓝色项圈', contact: '微信：find_pet_001', lat: 39.984, lng: 116.316 },
  { id: 'l2', type: '狗', name: '豆豆', location: '上海市徐汇区衡山路', lostDate: '2026-03-30', features: '白色比熊，左耳有棕色斑', contact: '微信：find_pet_002', lat: 31.214, lng: 121.448 },
  { id: 'l3', type: '猫', name: '小黑', location: '广州市越秀区东山口', lostDate: '2026-04-02', features: '全黑短毛猫，绿色眼睛', contact: '微信：find_pet_003', lat: 23.129, lng: 113.280 },
];

export const mockClues: LostPetClue[] = [
  { id: 'c1', petId: 'l1', photo: '', time: '2026-04-02 15:30', location: '海淀区五道口地铁站附近', lat: 39.992, lng: 116.338, note: '看到一只橘猫在垃圾桶旁边觅食，脖子好像有项圈', status: '已采纳', submitter: '热心市民A', points: 15 },
  { id: 'c2', petId: 'l1', photo: '', time: '2026-04-03 08:15', location: '海淀区清华东路', lat: 39.998, lng: 116.332, note: '早上遛弯看到一只橘猫从绿化带跑过', status: '待确认', submitter: '热心市民B', points: 10 },
  { id: 'c3', petId: 'l1', photo: '', time: '2026-04-03 11:40', location: '海淀区学院路', lat: 39.988, lng: 116.350, note: '在小区门口发现疑似走失橘猫，已拍照', status: '待确认', submitter: '热心市民C', points: 10 },
  { id: 'c4', petId: 'l2', photo: '', time: '2026-04-01 19:00', location: '徐汇区复兴西路', lat: 31.210, lng: 121.440, note: '看到一只白色小狗在路边徘徊', status: '已采纳', submitter: '热心市民D', points: 15 },
];

export const mockAdoptions = [
  { id: 'a1', type: '猫', name: '花花', age: '约1岁', gender: '母', location: '北京', status: '可领养', features: '三花猫，已绝育已免疫', character: '亲人粘人' },
  { id: 'a2', type: '狗', name: '旺财', age: '约3岁', gender: '公', location: '上海', status: '可领养', features: '中华田园犬，已绝育', character: '温顺听话' },
  { id: 'a3', type: '猫', name: '雪球', age: '约6个月', gender: '公', location: '成都', status: '待审核', features: '白色长毛，蓝眼睛', character: '活泼好动' },
];

export const mockShelterNeeds = [
  { id: 's1', shelter: '朝阳流浪猫救助小院', location: '北京', needs: ['猫粮 50斤', '猫砂 20袋', '驱虫药 30支'], points: 400, urgency: '日常' },
  { id: 's2', shelter: '浦东爱心狗狗之家', location: '上海', needs: ['狗粮 80斤', '笼子 5个', '垫子 10个'], points: 600, urgency: '紧缺' },
  { id: 's3', shelter: '天河社区猫TNR基地', location: '广州', needs: ['绝育名额 10个', '术后恢复用品', '志愿者'], points: 800, urgency: '日常' },
];

export const mockShopItems: ShopItem[] = [
  { id: 'sh1', name: '它援定制帆布袋', price: '¥39', points: 15, image: '', category: '文创' },
  { id: 'sh2', name: '流浪猫明信片套装', price: '¥25', points: 10, image: '', category: '文创' },
  { id: 'sh3', name: '公益猫粮捐赠包', price: '¥49', points: 25, image: '', category: '公益' },
  { id: 'sh4', name: '它援联名T恤', price: '¥89', points: 35, image: '', category: '文创' },
  { id: 'sh5', name: '流浪动物日历', price: '¥35', points: 15, image: '', category: '文创' },
  { id: 'sh6', name: '公益狗粮捐赠包', price: '¥59', points: 30, image: '', category: '公益' },
];

export const mockGuides: GuideItem[] = [
  { id: 'g1', title: '发现流浪动物怎么办？', summary: '新手救助第一步指南', points: 10, readTime: '3分钟', category: '入门' },
  { id: 'g2', title: '如何安全捕捉受伤流浪猫', summary: '工具准备与操作要点', points: 10, readTime: '5分钟', category: '技能' },
  { id: 'g3', title: '送医前的急救处理', summary: '基础伤口处理与保温方法', points: 15, readTime: '4分钟', category: '技能' },
  { id: 'g4', title: '寄养须知：给临时家庭的建议', summary: '寄养前需要准备什么', points: 10, readTime: '5分钟', category: '寄养' },
  { id: 'g5', title: '负责任的领养：你准备好了吗？', summary: '领养前的自我评估', points: 10, readTime: '6分钟', category: '领养' },
];

export const helpActions = [
  { id: 'h1', name: '分享救助案例', desc: '将案例分享到朋友圈或群聊', points: 5, icon: '📤', daily: true },
  { id: 'h2', name: '阅读救助指南', desc: '学习一篇救助知识文章', points: 10, icon: '📖', daily: true },
  { id: 'h3', name: '邀请新用户', desc: '邀请朋友加入它援', points: 20, icon: '👥', daily: false },
  { id: 'h4', name: '逛逛公益商城', desc: '购买公益商品获得积分', points: 15, icon: '🛍️', daily: true },
  { id: 'h5', name: '提供寄养线索', desc: '知道可以寄养的家庭？告诉我们', points: 15, icon: '🏠', daily: false },
  { id: 'h6', name: '提供领养线索', desc: '帮助流浪动物找到新家', points: 15, icon: '💛', daily: false },
  { id: 'h7', name: '志愿协助', desc: '参与现场救助或运输', points: 30, icon: '🤝', daily: false },
  { id: 'h8', name: '上传可信凭证', desc: '为案例补充真实记录', points: 10, icon: '📋', daily: true },
];

export const caseHelpActions = [
  { id: 'ch1', name: '赠送积分', desc: '把积分赠送给需要帮助的案例', icon: '💝' },
  { id: 'ch2', name: '认领需求', desc: '直接认领案例中的具体需求', icon: '✅' },
  { id: 'ch3', name: '查看待助案例', desc: '浏览正在等待帮助的救助案例', icon: '👀' },
];
