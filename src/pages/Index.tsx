import { useNavigate } from 'react-router-dom';
import MobileLayout from '@/components/MobileLayout';
import { mockUser, mockCases } from '@/data/mockData';
import { Search, MapPin, Bell, Heart, Map, Package } from 'lucide-react';
import CaseCard from '@/components/CaseCard';
import { useState } from 'react';

const channels = [
  { label: '领养', sub: '看看谁在等一个家', path: '/channel/adoption', icon: Heart, bg: 'bg-[hsl(30,60%,95%)]', iconColor: 'text-[hsl(24,75%,50%)]', titleColor: 'text-[hsl(24,60%,35%)]' },
  { label: '寻宠地图', sub: '查看附近走失线索', path: '/lost-pet-map', icon: Map, bg: 'bg-[hsl(38,65%,93%)]', iconColor: 'text-[hsl(35,80%,48%)]', titleColor: 'text-[hsl(35,55%,32%)]' },
  { label: '小院补给', sub: '支持长期照护需求', path: '/channel/shelter', icon: Package, bg: 'bg-[hsl(25,55%,94%)]', iconColor: 'text-[hsl(20,70%,52%)]', titleColor: 'text-[hsl(20,50%,33%)]' },
];

const Index = () => {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState('全部');
  const [auxFilter, setAuxFilter] = useState('全部');

  const totalCases = mockCases.length;

  const filteredCases = mockCases.filter((c) => {
    const statusMatch = statusFilter === '全部' || c.status === statusFilter;
    const auxMatch = auxFilter === '全部' ||
      (auxFilter === '紧急' && c.isUrgent) ||
      (auxFilter === '猫' && c.animalType === '猫') ||
      (auxFilter === '狗' && c.animalType === '狗') ||
      (auxFilter === '其他' && c.animalType === '其他') ||
      auxFilter === '附近';
    return statusMatch && auxMatch;
  });

  const allCases = [...filteredCases].sort((a, b) => (b.isUrgent ? 1 : 0) - (a.isUrgent ? 1 : 0));

  return (
    <MobileLayout>
      <div className="px-4">
        {/* A. Top bar: Location + Search + Notification */}
        <div className="mt-3 flex items-center gap-2">
          <button className="flex shrink-0 items-center gap-1 rounded-xl bg-card px-3 py-2.5 text-[13px] text-muted-foreground shadow-sm">
            <MapPin className="h-4 w-4" />
            北京
          </button>
          <div className="flex flex-1 items-center gap-2 rounded-xl bg-card px-3.5 py-2.5 shadow-sm">
            <Search className="h-4 w-4 text-muted-foreground" />
            <span className="text-[12px] text-muted-foreground">搜索案号、地点、关键词…</span>
          </div>
          <button className="flex shrink-0 items-center justify-center rounded-xl bg-card p-2.5 shadow-sm">
            <Bell className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>

        {/* B. Light status bar */}
        <div className="mt-3 flex items-center justify-between rounded-xl bg-card px-4 py-2.5 shadow-sm">
          <div className="flex items-center gap-1 text-[13px]">
            <span className="text-muted-foreground">进行中个案</span>
            <span className="font-bold text-foreground">{totalCases}</span>
          </div>
          <div className="h-4 w-px bg-border" />
          <div className="flex items-center gap-1 text-[13px]">
            <span className="text-muted-foreground">待补记录</span>
            <span className="font-bold text-foreground">3</span>
          </div>
          <div className="h-4 w-px bg-border" />
          <div className="flex items-center gap-1 text-[13px]">
            <span className="text-muted-foreground">我的助力值</span>
            <span className="font-bold text-points">{mockUser.totalPoints}</span>
          </div>
        </div>

        {/* C. Quick entry channels */}
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

        {/* D. Primary filter: status */}
        <div className="mt-3 flex gap-0.5 overflow-x-auto rounded-xl bg-muted p-0.5 hide-scrollbar">
          {['全部', '待接应', '待送医', '治疗中', '待安置', '已完成'].map((f) => (
            <button
              key={f}
              onClick={() => setStatusFilter(f)}
              className={`shrink-0 rounded-lg px-3 py-1.5 text-[13px] font-medium transition-colors ${
                statusFilter === f ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* E. Secondary filter: urgency + animal + nearby */}
        <div className="mt-2 flex gap-1.5 overflow-x-auto hide-scrollbar">
          {['全部', '紧急', '猫', '狗', '附近'].map((f) => (
            <button
              key={f}
              onClick={() => setAuxFilter(f)}
              className={`shrink-0 rounded-full px-3 py-1 text-[12px] font-medium transition-colors ${
                auxFilter === f ? 'bg-primary text-primary-foreground' : 'bg-card text-muted-foreground shadow-sm'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* F. Case feed */}
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
    </MobileLayout>
  );
};

export default Index;
