import { useNavigate } from 'react-router-dom';
import MobileLayout from '@/components/MobileLayout';
import { mockUser, mockCases } from '@/data/mockData';
import { Search, MapPin, ChevronRight, Heart, PawPrint, Package, AlertTriangle, SlidersHorizontal } from 'lucide-react';
import CaseCard from '@/components/CaseCard';
import { useState } from 'react';

const channels = [
  { label: '领养', icon: Heart, path: '/channel/adoption', color: 'bg-accent/15 text-accent-foreground' },
  { label: '寻宠地图', icon: PawPrint, path: '/lost-pet-map', color: 'bg-accent/15 text-accent-foreground' },
  { label: '小院补给', icon: Package, path: '/channel/shelter', color: 'bg-secondary text-secondary-foreground' },
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
            <p className="text-[14px] text-header-fg/70 flex items-center gap-1">🐾 我的助力值</p>
            <p className="text-3xl font-bold text-header-fg">{mockUser.totalPoints}</p>
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
        <button
          onClick={() => navigate('/help-center')}
          className="mt-2 flex w-full items-center gap-2 rounded-xl bg-header-accent/60 px-3.5 py-2"
        >
          <span className="text-[13px] text-header-fg/80">🌟 今日可参与 3 项助力</span>
          <ChevronRight className="ml-auto h-4 w-4 text-header-fg/50" />
        </button>
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
            <span className="text-[12px] text-muted-foreground">搜索个案编号、地点、用户名、关键词...</span>
          </div>
        </div>

        {/* Emergency Banner */}
        {urgentCount > 0 && (
          <button
            onClick={() => navigate('/channel/emergency')}
            className="mt-3 flex w-full items-center gap-3 rounded-2xl bg-urgent/8 px-3.5 py-3 ring-1 ring-urgent/20 transition-colors active:bg-urgent/15"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-urgent/15">
              <AlertTriangle className="h-5 w-5 text-urgent" />
            </div>
            <div className="flex-1 text-left">
              <p className="text-[14px] font-semibold text-urgent">紧急求助</p>
              <p className="text-[12px] text-urgent/70">{urgentCount} 个个案需要快速接力</p>
            </div>
            <ChevronRight className="h-4 w-4 text-urgent/50" />
          </button>
        )}

        {/* Channels - no subtitles */}
        <div className="mt-3 grid grid-cols-3 gap-2">
          {channels.map((ch) => (
            <button
              key={ch.label}
              onClick={() => navigate(ch.path)}
              className="flex items-center justify-center gap-2 rounded-2xl bg-card px-3 py-3 shadow-sm transition-transform active:scale-[0.97]"
            >
              <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${ch.color}`}>
                <ch.icon className="h-4.5 w-4.5" strokeWidth={1.8} />
              </div>
              <p className="text-[14px] font-semibold text-foreground">{ch.label}</p>
            </button>
          ))}
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
