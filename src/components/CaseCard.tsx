import { useNavigate } from 'react-router-dom';
import { CaseItem } from '@/data/mockData';
import { getPublisherForCase } from '@/data/publishers';
import { MapPin, Star } from 'lucide-react';
import { toast } from 'sonner';
import { useState } from 'react';
import cat1 from '@/assets/cat1.jpg';
import dog1 from '@/assets/dog1.jpg';
import cat2 from '@/assets/cat2.jpg';
import dog2 from '@/assets/dog2.jpg';
import dog3 from '@/assets/dog3.jpg';

const caseImages: Record<string, string> = {
  '1': cat1,
  '2': dog1,
  '3': cat2,
  '4': dog2,
  '5': dog3,
};

const caseNumbers: Record<string, number> = {
  '1': 241,
  '2': 242,
  '3': 243,
  '4': 244,
  '5': 245,
};

const actionConfigs: Record<string, { primary: { label: string; icon: string }; secondary: { label: string; icon: string } }> = {
  emergency: { primary: { label: '立即联系', icon: '📞' }, secondary: { label: '生成转发内容', icon: '📋' } },
  supply: { primary: { label: '赠送积分', icon: '💝' }, secondary: { label: '生成转发内容', icon: '📋' } },
  foster: { primary: { label: '提供寄养', icon: '🏠' }, secondary: { label: '生成转发内容', icon: '📋' } },
  adopt: { primary: { label: '查看领养', icon: '💛' }, secondary: { label: '生成转发内容', icon: '📋' } },
  lost: { primary: { label: '提供线索', icon: '📍' }, secondary: { label: '生成转发内容', icon: '📋' } },
};

const CaseCard = ({ caseItem }: { caseItem: CaseItem }) => {
  const navigate = useNavigate();
  const [followed, setFollowed] = useState(false);
  const remaining = caseItem.totalPoints - caseItem.earnedPoints;
  const progress = (caseItem.earnedPoints / caseItem.totalPoints) * 100;
  const imgSrc = caseImages[caseItem.id] || cat1;
  const actions = actionConfigs[caseItem.helpType] || actionConfigs.supply;
  const publisher = getPublisherForCase(caseItem.id);
  const caseNo = caseNumbers[caseItem.id] || parseInt(caseItem.id);

  const handleAction = (e: React.MouseEvent, action: string) => {
    e.stopPropagation();
    if (action === '生成转发内容') {
      toast.success('转发内容已生成，可复制分享到社交平台');
    } else {
      toast.success(`${action}功能即将上线`);
    }
  };

  const handleFollow = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFollowed(!followed);
    toast.success(followed ? '已取消关注' : '已关注，将收到进展更新');
  };

  return (
    <div className="mb-3 overflow-hidden rounded-2xl bg-card shadow-sm">
      <button
        onClick={() => navigate(`/case/${caseItem.id}`)}
        className="flex w-full text-left transition-transform active:scale-[0.99]"
      >
        {/* Left: Animal Photo - 30% */}
        <div className="relative w-[30%] shrink-0 overflow-hidden">
          <img
            src={imgSrc}
            alt={caseItem.title}
            loading="lazy"
            className="h-full w-full object-cover"
            style={{ minHeight: '160px' }}
          />
          {caseItem.isUrgent && (
            <span className="absolute left-1.5 top-1.5 rounded-md bg-urgent px-2 py-0.5 text-[11px] font-bold text-urgent-foreground">
              紧急
            </span>
          )}
        </div>

        {/* Right: Info - 70% */}
        <div className="flex w-[70%] flex-col justify-between p-3">
          {/* Row 1: Case # + Tags + Follow Star */}
          <div className="flex items-center justify-between">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[12px] font-medium text-muted-foreground">#{caseNo}</span>
              <span className="rounded-md bg-accent/15 px-1.5 py-0.5 text-[11px] font-medium text-accent-foreground">
                {caseItem.status}
              </span>
              <span className="rounded-md bg-muted px-1.5 py-0.5 text-[11px] text-muted-foreground">
                {caseItem.animalType === '猫' ? '🐱' : '🐶'} {caseItem.animalType}
              </span>
            </div>
            <button onClick={handleFollow} className="shrink-0 p-1">
              <Star
                className={`h-4 w-4 transition-colors ${followed ? 'fill-points text-points' : 'text-muted-foreground/40'}`}
              />
            </button>
          </div>

          {/* Row 2: Title */}
          <h3 className="mt-1 line-clamp-1 text-[15px] font-bold leading-snug text-foreground">
            {caseItem.title}
          </h3>

          {/* Row 3: Location + Distance */}
          <div className="mt-1 flex items-center gap-1 text-[12px] text-muted-foreground">
            <MapPin className="h-3 w-3 shrink-0" />
            <span className="truncate">{caseItem.location}</span>
            {caseItem.distance && (
              <span className="shrink-0 font-medium text-accent-foreground">· {caseItem.distance}</span>
            )}
          </div>

          {/* Row 4: Points Progress */}
          <div className="mt-1.5">
            <div className="flex items-center justify-between text-[12px]">
              <span className="text-muted-foreground">
                已获 <span className="font-bold text-accent-foreground">{caseItem.earnedPoints}</span> / {caseItem.totalPoints}
              </span>
              <span className="font-medium text-urgent">还差 {remaining}</span>
            </div>
            <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-gradient-to-r from-accent to-points transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Row 5: Publisher + Updated time */}
          <div className="mt-1.5 flex items-center justify-between">
            {publisher ? (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/publisher/${publisher.id}`);
                }}
                className="flex items-center gap-1.5"
              >
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-accent/20 text-[10px]">
                  {publisher.type === 'shelter' ? '🏠' : '👤'}
                </div>
                <span className="text-[12px] text-muted-foreground">{publisher.name}</span>
                {publisher.certifiedShelter && (
                  <span className="rounded bg-accent/15 px-1 py-px text-[10px] font-medium text-accent-foreground">认证小院</span>
                )}
              </button>
            ) : (
              <span className="text-[11px] text-muted-foreground">{caseItem.updatedAt}</span>
            )}
            <span className="text-[11px] text-muted-foreground">{caseItem.updatedAt}</span>
          </div>
        </div>
      </button>

      {/* Row 6: Quick action buttons */}
      <div className="flex border-t border-border/50">
        <button
          onClick={(e) => handleAction(e, actions.primary.label)}
          className={`flex flex-1 items-center justify-center gap-1.5 py-2 text-[13px] font-medium transition-colors active:bg-muted ${
            caseItem.isUrgent ? 'text-urgent' : 'text-accent-foreground'
          }`}
        >
          <span>{actions.primary.icon}</span>
          {actions.primary.label}
        </button>
        <div className="w-px bg-border/50" />
        <button
          onClick={(e) => handleAction(e, actions.secondary.label)}
          className="flex flex-1 items-center justify-center gap-1.5 py-2 text-[13px] font-medium text-muted-foreground transition-colors active:bg-muted"
        >
          <span>{actions.secondary.icon}</span>
          {actions.secondary.label}
        </button>
      </div>
    </div>
  );
};

export default CaseCard;
