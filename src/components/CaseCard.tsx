import { useNavigate } from 'react-router-dom';
import { CaseItem } from '@/data/mockData';
import { getPublisherForCase } from '@/data/publishers';
import PublisherBadge from '@/components/PublisherBadge';
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

const actionConfigs: Record<string, { primary: { label: string; icon: string }; secondary: { label: string; icon: string } }> = {
  emergency: { primary: { label: '立即联系', icon: '📞' }, secondary: { label: '帮忙转发', icon: '📤' } },
  supply: { primary: { label: '赠送积分', icon: '💝' }, secondary: { label: '认领物资', icon: '📦' } },
  foster: { primary: { label: '提供寄养', icon: '🏠' }, secondary: { label: '帮忙转发', icon: '📤' } },
  adopt: { primary: { label: '查看领养', icon: '💛' }, secondary: { label: '帮忙扩散', icon: '📤' } },
  lost: { primary: { label: '提供线索', icon: '📍' }, secondary: { label: '帮忙扩散', icon: '📤' } },
};

const CaseCard = ({ caseItem }: { caseItem: CaseItem }) => {
  const navigate = useNavigate();
  const [followed, setFollowed] = useState(false);
  const remaining = caseItem.totalPoints - caseItem.earnedPoints;
  const progress = (caseItem.earnedPoints / caseItem.totalPoints) * 100;
  const needsCount = caseItem.needs.length;
  const imgSrc = caseImages[caseItem.id] || cat1;
  const actions = actionConfigs[caseItem.helpType] || actionConfigs.supply;
  const publisher = getPublisherForCase(caseItem.id);

  const handleAction = (e: React.MouseEvent, action: string) => {
    e.stopPropagation();
    toast.success(`${action}功能即将上线`);
  };

  const handleFollow = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFollowed(!followed);
    toast.success(followed ? '已取消关注' : '已关注，将收到进展更新');
  };

  return (
    <div className="mb-2.5 overflow-hidden rounded-xl bg-card shadow-sm">
      <button
        onClick={() => navigate(`/case/${caseItem.id}`)}
        className="flex w-full gap-2.5 p-2.5 text-left transition-transform active:scale-[0.99]"
      >
        {/* Left: Animal Photo */}
        <div className="relative h-[82px] w-[82px] shrink-0 overflow-hidden rounded-lg">
          <img
            src={imgSrc}
            alt={caseItem.title}
            loading="lazy"
            width={82}
            height={82}
            className="h-full w-full object-cover"
          />
          {caseItem.isUrgent && (
            <span className="absolute left-1 top-1 rounded bg-urgent px-1.5 py-0.5 text-[9px] font-bold text-urgent-foreground">
              紧急
            </span>
          )}
        </div>

        {/* Right: Info */}
        <div className="flex min-w-0 flex-1 flex-col justify-between">
          {/* Row 1: Tags + Follow */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-1">
              <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-medium text-primary">
                {caseItem.status}
              </span>
              <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">
                {caseItem.animalType === '猫' ? '🐱' : '🐶'} {caseItem.animalType}
              </span>
            </div>
            <button
              onClick={handleFollow}
              className="ml-1 shrink-0 p-0.5"
            >
              <Star
                className={`h-3.5 w-3.5 transition-colors ${followed ? 'fill-points text-points' : 'text-muted-foreground/40'}`}
              />
            </button>
          </div>

          {/* Title */}
          <h3 className="mt-0.5 line-clamp-1 text-[13px] font-semibold leading-snug text-foreground">
            {caseItem.title}
          </h3>

          {/* Urgent need callout */}
          {caseItem.isUrgent && caseItem.urgentNeed && (
            <p className="text-[10px] font-semibold text-urgent">{caseItem.urgentNeed}</p>
          )}

          {/* Location + Distance */}
          <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
            <MapPin className="h-2.5 w-2.5 shrink-0" />
            <span className="truncate">{caseItem.location}</span>
            {caseItem.distance && (
              <span className="shrink-0 text-primary/80">· {caseItem.distance}</span>
            )}
          </div>

          {/* Points Progress */}
          <div className="mt-0.5">
            <div className="flex items-center justify-between text-[10px]">
              <span className="text-muted-foreground">
                <span className="font-semibold text-primary">{caseItem.earnedPoints}</span>/{caseItem.totalPoints} 积分
              </span>
              <span className="font-medium text-points">差 {remaining}</span>
            </div>
            <div className="mt-0.5 h-1 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-gradient-to-r from-primary to-primary/70 transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Footer */}
          <div className="mt-0.5 flex items-center justify-between text-[9px]">
            <span className="text-muted-foreground">
              {caseItem.updatedAt} · 需求单 {needsCount} 项
            </span>
          </div>
        </div>
      </button>

      {/* Quick action buttons */}
      <div className="flex border-t border-border/50">
        <button
          onClick={(e) => handleAction(e, actions.primary.label)}
          className={`flex flex-1 items-center justify-center gap-1 py-1.5 text-[11px] font-medium transition-colors active:bg-muted ${
            caseItem.isUrgent ? 'text-urgent' : 'text-primary'
          }`}
        >
          <span>{actions.primary.icon}</span>
          {actions.primary.label}
        </button>
        <div className="w-px bg-border/50" />
        <button
          onClick={(e) => handleAction(e, actions.secondary.label)}
          className="flex flex-1 items-center justify-center gap-1 py-1.5 text-[11px] font-medium text-muted-foreground transition-colors active:bg-muted"
        >
          <span>{actions.secondary.icon}</span>
          {actions.secondary.label}
        </button>
      </div>
    </div>
  );
};

export default CaseCard;
