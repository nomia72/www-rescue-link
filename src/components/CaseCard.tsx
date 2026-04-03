import { useNavigate } from 'react-router-dom';
import { CaseItem } from '@/data/mockData';
import { getPublisherForCase } from '@/data/publishers';
import { MapPin, Star } from 'lucide-react';
import { useState } from 'react';
import cat1 from '@/assets/cat1.jpg';
import dog1 from '@/assets/dog1.jpg';
import cat2 from '@/assets/cat2.jpg';
import dog2 from '@/assets/dog2.jpg';
import dog3 from '@/assets/dog3.jpg';

const caseImages: Record<string, string> = { '1': cat1, '2': dog1, '3': cat2, '4': dog2, '5': dog3 };
const caseNumbers: Record<string, number> = { '1': 241, '2': 242, '3': 243, '4': 244, '5': 245 };

const CaseCard = ({ caseItem }: { caseItem: CaseItem }) => {
  const navigate = useNavigate();
  const [followed, setFollowed] = useState(false);
  const imgSrc = caseImages[caseItem.id] || cat1;
  const publisher = getPublisherForCase(caseItem.id);
  const caseNo = caseNumbers[caseItem.id] || parseInt(caseItem.id);
  const formattedNo = String(caseNo).padStart(5, '0');

  const simpleLocation = caseItem.location
    .replace(/望京SOHO附近/, '朝阳区')
    .replace(/世纪公园附近/, '浦东新区')
    .replace(/棠下村/, '天河区')
    .replace(/北京市/, '').replace(/上海市/, '').replace(/广州市/, '').replace(/成都市/, '').replace(/深圳市/, '');

  // Need tags (unfulfilled)
  const needTags = caseItem.needs.filter((n) => !n.fulfilled).map((n) => n.name).slice(0, 3);
  const updateCount = caseItem.timeline.length;
  const evidenceCount = caseItem.evidences.length;

  const handleFollow = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFollowed(!followed);
  };

  return (
    <div className="mb-3 overflow-hidden rounded-2xl bg-card shadow-sm">
      <button
        onClick={() => navigate(`/case/${caseItem.id}`)}
        className="flex w-full text-left transition-transform active:scale-[0.99]"
      >
        {/* Left: Photo */}
        <div className="relative w-[30%] shrink-0 overflow-hidden">
          <img src={imgSrc} alt={caseItem.title} loading="lazy" className="h-full w-full object-cover" style={{ minHeight: '160px' }} />
          {caseItem.isUrgent && (
            <span className="absolute left-1.5 top-1.5 rounded-md bg-urgent px-2 py-0.5 text-[11px] font-bold text-urgent-foreground">紧急</span>
          )}
        </div>

        {/* Right: Info */}
        <div className="flex w-[70%] flex-col justify-between p-3">
          {/* Row 1: Case # + Tags + Star */}
          <div className="flex items-center justify-between">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[12px] font-medium text-muted-foreground">#{formattedNo}</span>
              <span className="rounded-md bg-accent/15 px-1.5 py-0.5 text-[11px] font-medium text-accent-foreground">{caseItem.status}</span>
              <span className="rounded-md bg-muted px-1.5 py-0.5 text-[11px] text-muted-foreground">
                {caseItem.animalType === '猫' ? '🐱' : '🐶'} {caseItem.animalType}
              </span>
            </div>
            <button onClick={handleFollow} className="shrink-0 p-1">
              <Star className={`h-4 w-4 transition-colors ${followed ? 'fill-points text-points' : 'text-muted-foreground/40'}`} />
            </button>
          </div>

          {/* Row 2: Title */}
          <h3 className="mt-1 line-clamp-1 text-[15px] font-bold leading-snug text-foreground">{caseItem.title}</h3>

          {/* Row 3: Summary */}
          <p className="mt-0.5 line-clamp-1 text-[12px] text-muted-foreground">{caseItem.description.slice(0, 50)}</p>

          {/* Row 4: Need tags */}
          {needTags.length > 0 && (
            <div className="mt-1.5 flex flex-wrap gap-1">
              {needTags.map((tag) => (
                <span key={tag} className="rounded bg-urgent/8 px-1.5 py-0.5 text-[10px] font-medium text-urgent">{tag}</span>
              ))}
            </div>
          )}

          {/* Row 5: Record info */}
          <div className="mt-1.5 flex items-center gap-2 text-[11px] text-muted-foreground">
            <span>已更新 {updateCount} 次</span>
            <span>·</span>
            <span>已上传 {evidenceCount} 份凭证</span>
            <span>·</span>
            <span>{caseItem.updatedAt}</span>
          </div>

          {/* Row 6: Publisher + location + CTA */}
          <div className="mt-1.5 flex items-center justify-between">
            <div className="flex items-center gap-1 text-[11px] text-muted-foreground min-w-0 truncate">
              {publisher && <span>{publisher.name}发起</span>}
              <span>·</span>
              <MapPin className="h-3 w-3 shrink-0" />
              <span className="truncate">{simpleLocation}{caseItem.distance ? ` · ${caseItem.distance}` : ''}</span>
            </div>
          </div>
        </div>
      </button>
    </div>
  );
};

export default CaseCard;
