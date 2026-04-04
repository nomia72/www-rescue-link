import { useParams, useNavigate } from 'react-router-dom';
import MobileLayout from '@/components/MobileLayout';
import { mockCases } from '@/data/mockData';
import { getPublisherForCase } from '@/data/publishers';
import PublisherBadge from '@/components/PublisherBadge';
import { ArrowLeft, Share2, MapPin, Shield, CheckCircle2, Clock, Link2, AlertTriangle, Heart, ChevronRight, Star } from 'lucide-react';
import { toast } from 'sonner';
import { useState } from 'react';
import cat1 from '@/assets/cat1.jpg';
import dog1 from '@/assets/dog1.jpg';
import cat2 from '@/assets/cat2.jpg';
import dog2 from '@/assets/dog2.jpg';
import dog3 from '@/assets/dog3.jpg';

const caseImages: Record<string, string> = { '1': cat1, '2': dog1, '3': cat2, '4': dog2, '5': dog3 };
const caseNumbers: Record<string, number> = { '1': 241, '2': 242, '3': 243, '4': 244, '5': 245 };

const CaseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const caseItem = mockCases.find((c) => c.id === id);
  const [saved, setSaved] = useState(false);

  if (!caseItem) {
    return (
      <MobileLayout hideTabBar>
        <div className="flex h-screen items-center justify-center text-muted-foreground">个案未找到</div>
      </MobileLayout>
    );
  }

  const publisher = getPublisherForCase(caseItem.id);
  const imgSrc = caseImages[caseItem.id || '1'] || cat1;
  const caseNo = caseNumbers[caseItem.id] || parseInt(caseItem.id);
  const formattedNo = String(caseNo).padStart(5, '0');

  // Split needs by category
  const assistNeeds = caseItem.needs.filter((n) => n.category === 'assist');
  const collabNeeds = caseItem.needs.filter((n) => n.category === 'collab');
  const assistFulfilled = assistNeeds.filter((n) => n.fulfilled).length;
  const assistTotal = assistNeeds.length;

  // Merge timeline + evidences into unified record, sorted by date
  const records = [
    ...caseItem.timeline.map((t, i) => ({
      id: `t-${i}`,
      title: t.content,
      desc: '',
      time: t.date,
      tag: t.type === 'milestone' ? '基础记录' : '进展更新',
      isEvidence: false,
      chainStatus: undefined as string | undefined,
    })),
    ...caseItem.evidences.map((ev) => ({
      id: ev.id,
      title: ev.type.startsWith('已') ? ev.type : `已上传${ev.type}`,
      desc: ev.chainStatus === 'stored' ? '链上记录已生成' : '',
      time: ev.uploadedAt,
      tag: '关键凭证',
      isEvidence: true,
      chainStatus: ev.chainStatus,
    })),
  ].sort((a, b) => b.time.localeCompare(a.time));

  return (
    <MobileLayout hideTabBar>
      {/* A. Cover image with overlay buttons */}
      <div className="relative">
        <img src={imgSrc} alt={caseItem.title} className="h-56 w-full object-cover" />
        <div className="absolute left-3 top-3">
          <button onClick={() => navigate(-1)} className="rounded-full bg-black/30 p-2 backdrop-blur">
            <ArrowLeft className="h-5 w-5 text-white" />
          </button>
        </div>
        <div className="absolute right-3 top-3 flex gap-2">
          <button onClick={() => { setSaved(!saved); toast.success(saved ? '已取消收藏' : '已收藏'); }} className="rounded-full bg-black/30 p-2 backdrop-blur">
            <Star className={`h-5 w-5 ${saved ? 'fill-white text-white' : 'text-white'}`} />
          </button>
          <button onClick={() => toast.success('已生成分享内容')} className="rounded-full bg-black/30 p-2 backdrop-blur">
            <Share2 className="h-5 w-5 text-white" />
          </button>
        </div>
        {caseItem.isUrgent && (
          <div className="absolute left-3 bottom-3 flex items-center gap-1 rounded-lg bg-urgent px-2.5 py-1 shadow-md">
            <AlertTriangle className="h-3.5 w-3.5 text-urgent-foreground" />
            <span className="text-[13px] font-bold text-urgent-foreground">{caseItem.urgentNeed || '紧急'}</span>
          </div>
        )}
      </div>

      <div className="pb-20">
        <div className="px-4">
          {/* B. Case header */}
          <div className="mt-3 flex flex-wrap items-center gap-1.5">
            <span className="text-[12px] font-medium text-muted-foreground">#{formattedNo}</span>
            <span className="rounded-lg bg-primary/10 px-2 py-0.5 text-[12px] font-medium text-primary">{caseItem.status}</span>
            <span className="rounded-lg bg-muted px-2 py-0.5 text-[12px] text-muted-foreground">
              {caseItem.animalType === '猫' ? '🐱' : '🐶'} {caseItem.animalType}
            </span>
            {caseItem.isUrgent && (
              <span className="rounded-lg bg-urgent/10 px-2 py-0.5 text-[12px] font-medium text-urgent">较急</span>
            )}
          </div>

          <h1 className="mt-2 text-[20px] font-bold leading-snug text-foreground">{caseItem.title}</h1>

          <div className="mt-1.5 flex items-center gap-1 text-[13px] text-muted-foreground">
            {publisher && <span>{publisher.name}发起</span>}
            <span>·</span>
            <MapPin className="h-3.5 w-3.5 shrink-0" />
            <span>{caseItem.city}{caseItem.location.includes('朝阳') ? '朝阳区' : ''}</span>
            <span>· {caseItem.updatedAt}发布</span>
          </div>

          {/* C. Current situation */}
          <div className="mt-4 rounded-xl bg-card p-4 shadow-sm">
            <h2 className="text-[15px] font-semibold text-foreground">当前情况</h2>
            <p className="mt-2 text-[13px] leading-relaxed text-foreground">{caseItem.description}</p>
          </div>

          {/* D. Needs - split into two groups */}
          {/* D1. 可助力项目 */}
          {assistNeeds.length > 0 && (
            <div className="mt-3 rounded-xl bg-card p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <h2 className="text-[15px] font-semibold text-foreground">可助力项目</h2>
                <span className="text-[11px] text-muted-foreground">
                  已完成 {assistFulfilled}/{assistTotal} 项
                </span>
              </div>
              <p className="mt-0.5 text-[11px] text-muted-foreground">可通过助力值补足的物资与服务</p>
              <div className="mt-3 space-y-2.5">
                {assistNeeds.map((n) => (
                  <div key={n.id} className="flex items-start justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        {n.fulfilled ? (
                          <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-primary" />
                        ) : (
                          <div className="h-3.5 w-3.5 shrink-0 rounded-full border-2 border-muted-foreground/30" />
                        )}
                        <span className={`text-[13px] font-medium ${n.fulfilled ? 'text-primary/70 line-through' : 'text-foreground'}`}>
                          {n.name}
                        </span>
                      </div>
                      {n.desc && <p className="ml-5 mt-0.5 text-[11px] text-muted-foreground">{n.desc}</p>}
                    </div>
                    <span className={`shrink-0 rounded-md px-2 py-0.5 text-[11px] font-medium ${
                      n.fulfilled ? 'bg-primary/10 text-primary' : 'bg-urgent/8 text-urgent'
                    }`}>
                      {n.fulfilled ? '已完成' : '待助力'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* D2. 协作需求 */}
          {collabNeeds.length > 0 && (
            <div className="mt-3 rounded-xl bg-card p-4 shadow-sm">
              <h2 className="text-[15px] font-semibold text-foreground">协作需求</h2>
              <p className="mt-0.5 text-[11px] text-muted-foreground">需要真实接力与线下支持</p>
              <div className="mt-3 space-y-2.5">
                {collabNeeds.map((n) => (
                  <div key={n.id}>
                    <div className="flex items-center gap-1.5">
                      <div className="h-3.5 w-3.5 shrink-0 rounded-full border-2 border-accent/50" />
                      <span className="text-[13px] font-medium text-foreground">{n.name}</span>
                    </div>
                    {n.desc && <p className="ml-5 mt-0.5 text-[11px] text-muted-foreground">{n.desc}</p>}
                    <button
                      onClick={() => toast.success('已发送协助意向')}
                      className="ml-5 mt-1 rounded-md bg-muted px-2.5 py-1 text-[11px] font-medium text-foreground transition-colors active:bg-muted/80"
                    >
                      我可以帮忙
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* E. Timeline records */}
          <div className="mt-3 rounded-xl bg-card p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="flex items-center gap-1.5 text-[15px] font-semibold text-foreground">
                <Shield className="h-4 w-4 text-primary" />
                个案记录
              </h2>
              <span className="text-[11px] text-muted-foreground">按时间倒序</span>
            </div>
            <div className="mt-3 space-y-0">
              {records.map((r, i) => (
                <div key={r.id} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className={`mt-0.5 h-2.5 w-2.5 rounded-full ${r.isEvidence ? 'bg-accent' : 'bg-muted-foreground/30'}`} />
                    {i < records.length - 1 && <div className="h-10 w-px bg-border" />}
                  </div>
                  <div className="pb-4">
                    <p className="text-[13px] font-medium text-foreground">{r.title}</p>
                    <div className="mt-1 flex flex-wrap items-center gap-1.5">
                      <span className="text-[11px] text-muted-foreground">{r.time}</span>
                      <span className={`rounded px-1.5 py-0.5 text-[10px] font-medium ${
                        r.tag === '关键凭证' ? 'bg-accent/15 text-accent-foreground' : 'bg-muted text-muted-foreground'
                      }`}>{r.tag}</span>
                      {r.chainStatus === 'stored' && (
                        <span className="flex items-center gap-0.5 rounded bg-primary/10 px-1.5 py-0.5 text-[10px] text-primary">
                          <Link2 className="h-3 w-3" /> 已存证
                        </span>
                      )}
                      {r.chainStatus === 'pending' && (
                        <span className="flex items-center gap-0.5 text-[10px] text-muted-foreground">
                          <Clock className="h-3 w-3" /> 存证处理中
                        </span>
                      )}
                    </div>
                    {r.desc && <p className="mt-0.5 text-[11px] text-primary">{r.desc}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* F. Contact */}
          <div className="mt-3 rounded-xl bg-card p-4 shadow-sm">
            <h2 className="text-[15px] font-semibold text-foreground">联系方式</h2>
            <p className="mt-1 text-[13px] text-foreground">{caseItem.contact}</p>
          </div>

          {/* Publisher info */}
          {publisher && (
            <button
              onClick={() => navigate(`/publisher/${publisher.id}`)}
              className="mt-3 flex w-full items-center justify-between rounded-xl bg-muted/60 px-3 py-2.5"
            >
              <PublisherBadge publisher={publisher} size="md" showStats />
              <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground/40" />
            </button>
          )}
        </div>
      </div>

      {/* G. Fixed bottom bar - only 去助力 */}
      <div className="fixed bottom-0 left-1/2 z-50 w-full max-w-[430px] -translate-x-1/2 border-t border-border bg-card px-4 py-3 safe-bottom">
        <button
          onClick={() => toast.success('助力功能即将上线')}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-[15px] font-semibold text-primary-foreground transition-colors active:bg-primary/90"
        >
          <Heart className="h-4 w-4" />
          去助力
        </button>
      </div>
    </MobileLayout>
  );
};

export default CaseDetail;
