import { useNavigate } from 'react-router-dom';
import MobileLayout from '@/components/MobileLayout';
import { mockUser, mockCases } from '@/data/mockData';
import { Search, MapPin, SlidersHorizontal, PawPrint, Heart, Map, Package } from 'lucide-react';
import CaseCard from '@/components/CaseCard';
import { useState } from 'react';

const channels = [
  { label: '领养', sub: '为它找一个家', path: '/channel/adoption', icon: Heart, bg: 'bg-[hsl(30,60%,95%)]', iconColor: 'text-[hsl(24,75%,50%)]', titleColor: 'text-[hsl(24,60%,35%)]' },
  { label: '寻宠地图', sub: '附近走失宠物', path: '/lost-pet-map', icon: Map, bg: 'bg-[hsl(38,65%,93%)]', iconColor: 'text-[hsl(35,80%,48%)]', titleColor: 'text-[hsl(35,55%,32%)]' },
  { label: '小院补给', sub: '支持流浪小院', path: '/channel/shelter', icon: Package, bg: 'bg-[hsl(25,55%,94%)]', iconColor: 'text-[hsl(20,70%,52%)]', titleColor: 'text-[hsl(20,50%,33%)]' },
];

const Index = () => {
  const navigate = useNavigate();
  const [animalFilter, setAnimalFilter] = useState('全部');
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [helpTypeFilter, setHelpTypeFilter] = useState('全部');

  const filteredCases = mockCases.filter((c) => {
    const animalMatch = animalFilter === '全部' || c.animalType === animalFilter;
    const helpMatch = helpTypeFilter === '全部' ||
      (helpTypeFilter === '紧急' && c.helpType === 'emergency') ||
      (helpTypeFilter === '物资' && c.helpType === 'supply') ||
      (helpTypeFilter === '寄养' && c.helpType === 'foster') ||
      (helpTypeFilter === '领养' && c.helpType === 'adopt') ||
      (helpTypeFilter === '寻宠' && c.helpType === 'lost');
    return animalMatch && helpMatch;
  });

  const allCases = [...filteredCases].sort((a, b) => (b.isUrgent ? 1 : 0) - (a.isUrgent ? 1 : 0));
  const urgentCount = mockCases.filter((c) => c.isUrgent).length;

  return (
    <MobileLayout>
      {/* Header */}
      <div className="bg-header-bg px-4 pb-3 pt-8">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[14px] text-header-fg/70">我的助力值</p>
            <div className="flex items-center gap-1.5">
              <PawPrint className="h-5 w-5 text-primary" strokeWidth={2.2} />
              <p className="text-3xl font-bold text-header-fg">{mockUser.totalPoints}</p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-[13px] text-header-fg/75">
            <div className="flex flex-col items-center">
              <span className="text-lg font-semibold text-header-fg">{mockUser.helpsGiven}</span>
              <span>次助力</span>
            </div>
            <div className="h-7 w-px bg-header-fg/15" />
            <div className="flex flex-col items-center">
              <span className="text-lg font-semibold text-header-fg">6</span>
              <span>个案</span>
            </div>
            <div className="h-7 w-px bg-header-fg/15" />
            <div className="flex flex-col items-center">
              <span className="text-lg font-semibold text-header-fg">3</span>
              <span>项认领</span>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4">
        {/* Search & Location */}
        <div className="mt-3 flex items-center gap-2">
          <button className="flex shrink-0 items-center gap-1 rounded-xl bg-card px-3 py-2.5 text-[13px] text-muted-foreground shadow-sm">
            <MapPin className="h-4 w-4" />
            北京
          </button>
          <div className="flex flex-1 items-center gap-2 rounded-xl bg-card px-3.5 py-2.5 shadow-sm">
            <Search className="h-4 w-4 text-muted-foreground" />
            <span className="text-[12px] text-muted-foreground">搜索救助个案编号、地点、用户名、关键词...</span>
          </div>
        </div>

        {/* Emergency banner removed — urgent cases surface via sort priority */}

        {/* Channels — lightweight entry cards */}
        <div className="mt-3 grid grid-cols-3 gap-2">
          {channels.map((ch) => {
            const Icon = ch.icon;
            return (
              <button
                key={ch.label}
                onClick={() => navigate(ch.path)}
                className={`flex flex-col items-center gap-1.5 rounded-2xl ${ch.bg} px-2 py-3 shadow-sm ring-1 ring-black/[0.04] transition-transform active:scale-[0.97]`}
              >
                <Icon className={`h-6 w-6 shrink-0 ${ch.iconColor}`} strokeWidth={2.2} />
                <div className="text-center">
                  <p className={`text-[14px] font-bold leading-tight ${ch.titleColor}`}>{ch.label}</p>
                  <p className="mt-0.5 text-[10px] leading-tight text-muted-foreground/70">{ch.sub}</p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Filters */}
        <div className="mt-3 flex items-center gap-2">
          <div className="flex flex-1 gap-0.5 rounded-xl bg-muted p-0.5">
            {['全部', '猫', '狗', '其他'].map((f) => (
              <button
                key={f}
                onClick={() => setAnimalFilter(f)}
                className={`flex-1 rounded-lg px-2 py-1.5 text-[13px] font-medium transition-colors ${
                  animalFilter === f ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
          <button
            onClick={() => setShowFilterPanel(!showFilterPanel)}
            className={`flex items-center gap-1 rounded-xl px-3 py-1.5 text-[13px] font-medium transition-colors ${
              showFilterPanel || helpTypeFilter !== '全部'
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground'
            }`}
          >
            <SlidersHorizontal className="h-4 w-4" />
            筛选
          </button>
        </div>

        {/* Filter Panel */}
        {showFilterPanel && (
          <div className="mt-2 rounded-xl bg-card p-3 shadow-sm">
            <p className="mb-2 text-[12px] font-medium text-muted-foreground">救助需求</p>
            <div className="flex flex-wrap gap-1.5">
              {['全部', '紧急', '物资', '寄养', '领养', '寻宠'].map((f) => (
                <button
                  key={f}
                  onClick={() => setHelpTypeFilter(f)}
                  className={`rounded-lg px-3 py-1.5 text-[13px] font-medium transition-colors ${
                    helpTypeFilter === f ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Cases Stream */}
        <div className="mt-3 pb-4">
          <h2 className="mb-2 text-[15px] font-semibold text-foreground">🐾 推荐救助个案</h2>
          {allCases.map((c) => (
            <CaseCard key={c.id} caseItem={c} />
          ))}
        </div>
      </div>
    </MobileLayout>
  );
};

export default Index;
