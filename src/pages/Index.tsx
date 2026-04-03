import { useNavigate } from 'react-router-dom';
import MobileLayout from '@/components/MobileLayout';
import { mockUser, mockCases } from '@/data/mockData';
import { Search, MapPin, Bell, Heart, Map, Package, ShoppingBag, SlidersHorizontal, X } from 'lucide-react';
import CaseCard from '@/components/CaseCard';
import { useState } from 'react';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerClose } from '@/components/ui/drawer';

const channels = [
  { label: '领养', path: '/channel/adoption', icon: Heart, bg: 'bg-[hsl(30,60%,95%)]', iconColor: 'text-[hsl(24,75%,50%)]', titleColor: 'text-[hsl(24,60%,35%)]' },
  { label: '寻宠地图', path: '/lost-pet-map', icon: Map, bg: 'bg-[hsl(38,65%,93%)]', iconColor: 'text-[hsl(35,80%,48%)]', titleColor: 'text-[hsl(35,55%,32%)]' },
  { label: '小院补给', path: '/channel/shelter', icon: Package, bg: 'bg-[hsl(25,55%,94%)]', iconColor: 'text-[hsl(20,70%,52%)]', titleColor: 'text-[hsl(20,50%,33%)]' },
  { label: '公益商城', path: '/shop', icon: ShoppingBag, bg: 'bg-[hsl(32,58%,94%)]', iconColor: 'text-[hsl(28,72%,50%)]', titleColor: 'text-[hsl(28,55%,33%)]' },
];

const Index = () => {
  const navigate = useNavigate();
  const [animalFilter, setAnimalFilter] = useState('全部');
  const [filterOpen, setFilterOpen] = useState(false);

  // Advanced filters
  const [statusFilter, setStatusFilter] = useState('全部');
  const [urgencyFilter, setUrgencyFilter] = useState('全部');
  const [rangeFilter, setRangeFilter] = useState('全部');
  const [sortBy, setSortBy] = useState('最新发布');

  const hasAdvancedFilter = statusFilter !== '全部' || urgencyFilter !== '全部' || rangeFilter !== '全部' || sortBy !== '最新发布';

  const totalCases = mockCases.length;

  const filteredCases = mockCases.filter((c) => {
    const animalMatch = animalFilter === '全部' ||
      (animalFilter === '猫' && c.animalType === '猫') ||
      (animalFilter === '狗' && c.animalType === '狗') ||
      (animalFilter === '其他' && c.animalType === '其他');
    const statusMatch = statusFilter === '全部' || c.status === statusFilter;
    const urgencyMatch = urgencyFilter === '全部' ||
      (urgencyFilter === '紧急' && c.isUrgent) ||
      (urgencyFilter === '较急' && c.isUrgent) ||
      (urgencyFilter === '一般' && !c.isUrgent);
    return animalMatch && statusMatch && urgencyMatch;
  });

  const allCases = [...filteredCases].sort((a, b) => (b.isUrgent ? 1 : 0) - (a.isUrgent ? 1 : 0));

  const resetAdvancedFilters = () => {
    setStatusFilter('全部');
    setUrgencyFilter('全部');
    setRangeFilter('全部');
    setSortBy('最新发布');
  };

  return (
    <MobileLayout>
      <div className="px-4">
        {/* A. Top bar */}
        <div className="mt-3 flex items-center gap-2">
          <button className="flex shrink-0 items-center gap-1 rounded-xl bg-card px-3 py-2.5 text-[13px] text-muted-foreground shadow-sm">
            <MapPin className="h-4 w-4" />
            北京
          </button>
          <div className="flex flex-1 items-center gap-2 rounded-xl bg-card px-3.5 py-2.5 shadow-sm">
            <Search className="h-4 w-4 text-muted-foreground" />
            <span className="text-[12px] text-muted-foreground">搜索案号、用户名、关键词…</span>
          </div>
          <button className="flex shrink-0 items-center justify-center rounded-xl bg-card p-2.5 shadow-sm">
            <Bell className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>

        {/* B. Light status bar - left aligned with prominent numbers */}
        <div className="mt-3 flex items-center gap-4 rounded-xl bg-card px-4 py-2.5 shadow-sm">
          <div className="flex items-baseline gap-1">
            <span className="text-[11px] text-muted-foreground">进行中</span>
            <span className="text-[18px] font-bold leading-none text-foreground">{totalCases}</span>
          </div>
          <div className="h-4 w-px bg-border" />
          <div className="flex items-baseline gap-1">
            <span className="text-[11px] text-muted-foreground">待补记录</span>
            <span className="text-[18px] font-bold leading-none text-foreground">3</span>
          </div>
          <div className="h-4 w-px bg-border" />
          <div className="flex items-baseline gap-1">
            <span className="text-[11px] text-muted-foreground">助力值</span>
            <span className="text-[18px] font-bold leading-none text-points">{mockUser.totalPoints}</span>
          </div>
        </div>

        {/* C. Quick entry channels - 4 cols, no sub text */}
        <div className="mt-3 grid grid-cols-4 gap-2">
          {channels.map((ch) => {
            const Icon = ch.icon;
            return (
              <button
                key={ch.label}
                onClick={() => navigate(ch.path)}
                className={`flex flex-col items-center gap-1.5 rounded-2xl ${ch.bg} px-2 py-3 shadow-sm ring-1 ring-black/[0.04] transition-transform active:scale-[0.97]`}
              >
                <Icon className={`h-5 w-5 shrink-0 ${ch.iconColor}`} strokeWidth={2.2} />
                <p className={`text-[13px] font-bold leading-tight ${ch.titleColor}`}>{ch.label}</p>
              </button>
            );
          })}
        </div>

        {/* D. Single filter row: animal type + filter icon */}
        <div className="mt-3 flex items-center gap-1.5">
          <div className="flex flex-1 gap-1.5 overflow-x-auto hide-scrollbar">
            {['全部', '猫', '狗', '其他'].map((f) => (
              <button
                key={f}
                onClick={() => setAnimalFilter(f)}
                className={`shrink-0 rounded-full px-3.5 py-1.5 text-[13px] font-medium transition-colors ${
                  animalFilter === f ? 'bg-primary text-primary-foreground' : 'bg-card text-muted-foreground shadow-sm'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
          <button
            onClick={() => setFilterOpen(true)}
            className={`relative flex shrink-0 items-center gap-1 rounded-full px-3 py-1.5 text-[13px] font-medium transition-colors ${
              hasAdvancedFilter ? 'bg-primary text-primary-foreground' : 'bg-card text-muted-foreground shadow-sm'
            }`}
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            筛选
            {hasAdvancedFilter && (
              <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-destructive" />
            )}
          </button>
        </div>

        {/* E. Case feed */}
        <div className="mt-3 pb-4">
          <h2 className="mb-2 text-[15px] font-semibold text-foreground">推荐救助个案</h2>
          {allCases.map((c) => (
            <CaseCard key={c.id} caseItem={c} />
          ))}
          {allCases.length === 0 && (
            <p className="py-8 text-center text-sm text-muted-foreground">暂无匹配的个案</p>
          )}
        </div>
      </div>

      {/* Filter Drawer */}
      <Drawer open={filterOpen} onOpenChange={setFilterOpen}>
        <DrawerContent>
          <DrawerHeader className="relative">
            <DrawerTitle className="text-[16px]">筛选条件</DrawerTitle>
            <DrawerClose className="absolute right-4 top-4">
              <X className="h-5 w-5 text-muted-foreground" />
            </DrawerClose>
          </DrawerHeader>
          <div className="px-5 pb-6 space-y-5">
            {/* Status */}
            <div>
              <p className="mb-2 text-[13px] font-medium text-foreground">状态</p>
              <div className="flex flex-wrap gap-2">
                {['全部', '待接应', '待送医', '治疗中', '待安置', '已完成'].map((f) => (
                  <button
                    key={f}
                    onClick={() => setStatusFilter(f)}
                    className={`rounded-full px-3 py-1.5 text-[12px] font-medium transition-colors ${
                      statusFilter === f ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>
            {/* Urgency */}
            <div>
              <p className="mb-2 text-[13px] font-medium text-foreground">紧急程度</p>
              <div className="flex flex-wrap gap-2">
                {['全部', '一般', '较急', '紧急'].map((f) => (
                  <button
                    key={f}
                    onClick={() => setUrgencyFilter(f)}
                    className={`rounded-full px-3 py-1.5 text-[12px] font-medium transition-colors ${
                      urgencyFilter === f ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>
            {/* Range */}
            <div>
              <p className="mb-2 text-[13px] font-medium text-foreground">范围</p>
              <div className="flex flex-wrap gap-2">
                {['全部', '附近', '全城'].map((f) => (
                  <button
                    key={f}
                    onClick={() => setRangeFilter(f)}
                    className={`rounded-full px-3 py-1.5 text-[12px] font-medium transition-colors ${
                      rangeFilter === f ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>
            {/* Sort */}
            <div>
              <p className="mb-2 text-[13px] font-medium text-foreground">排序</p>
              <div className="flex flex-wrap gap-2">
                {['最新发布', '最近更新', '离我最近'].map((f) => (
                  <button
                    key={f}
                    onClick={() => setSortBy(f)}
                    className={`rounded-full px-3 py-1.5 text-[12px] font-medium transition-colors ${
                      sortBy === f ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>
            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <button
                onClick={resetAdvancedFilters}
                className="flex-1 rounded-xl border border-border py-2.5 text-[14px] font-medium text-muted-foreground"
              >
                重置
              </button>
              <button
                onClick={() => setFilterOpen(false)}
                className="flex-1 rounded-xl bg-primary py-2.5 text-[14px] font-medium text-primary-foreground"
              >
                确认
              </button>
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    </MobileLayout>
  );
};

export default Index;
