import { useParams, useNavigate } from 'react-router-dom';
import MobileLayout from '@/components/MobileLayout';
import { mockCases } from '@/data/mockData';
import { getPublisherForCase } from '@/data/publishers';
import PublisherBadge from '@/components/PublisherBadge';
import { ArrowLeft, Share2, MapPin, Phone, Shield, CheckCircle2, Clock, Link2, AlertTriangle, MessageCircle, Heart, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
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

const CaseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const caseItem = mockCases.find((c) => c.id === id);

  if (!caseItem) {
    return (
      <MobileLayout hideTabBar>
        <div className="flex h-screen items-center justify-center text-muted-foreground">个案未找到</div>
      </MobileLayout>
    );
  }

  const remaining = caseItem.totalPoints - caseItem.earnedPoints;
  const progress = (caseItem.earnedPoints / caseItem.totalPoints) * 100;
  const publisher = getPublisherForCase(caseItem.id);
  const imgSrc = caseImages[caseItem.id || '1'] || cat1;
  const caseNo = caseNumbers[caseItem.id] || parseInt(caseItem.id);
  const formattedNo = String(caseNo).padStart(5, '0');

  // Categorize needs
  const urgentNeeds = caseItem.needs.filter((n) => n.name.includes('紧急') || n.name.includes('送医') || n.name.includes('手术'));
  const currentNeeds = caseItem.needs.filter((n) => !urgentNeeds.includes(n) && !n.name.includes('恢复') && !n.name.includes('术后') && !n.name.includes('康复'));
  const laterNeeds = caseItem.needs.filter((n) => n.name.includes('恢复') || n.name.includes('术后') || n.name.includes('康复'));

  // Structured situation info
  const situationItems = [
    { label: '发现地点', value: caseItem.location },
    { label: '伤情描述', value: caseItem.description.slice(0, 40) + (caseItem.description.length > 40 ? '...' : '') },
    { label: '当前安置', value: caseItem.description.includes('安置') ? '已临时安置' : caseItem.description.includes('医院') || caseItem.description.includes('治疗') ? '已送医' : '待安置' },
    { label: '志愿者看护', value: caseItem.description.includes('志愿者') ? '有志愿者在场' : '暂无' },
    ...(caseItem.urgentNeed ? [{ label: '当前最急', value: caseItem.urgentNeed }] : []),
  ];

  const simpleLocation = caseItem.location
    .replace(/望京SOHO附近/, '')
    .replace(/世纪公园附近/, '')
    .replace(/棠下村/, '')
    .replace(/北京市/, '')
    .replace(/上海市/, '')
    .replace(/广州市/, '')
    .replace(/成都市/, '')
    .replace(/深圳市/, '');

  return (
    <MobileLayout hideTabBar>
      {/* Header */}
      <div className="sticky top-0 z-40 flex items-center justify-between bg-card/95 px-4 py-3 backdrop-blur">
        <button onClick={() => navigate(-1)} className="rounded-full p-1">
          <ArrowLeft className="h-5 w-5 text-foreground" />
        </button>
        <span className="text-[15px] font-semibold text-foreground">个案 #{formattedNo}</span>
        <button onClick={() => toast.success('链接已复制，快去分享吧！')} className="rounded-full p-1">
          <Share2 className="h-5 w-5 text-foreground" />
        </button>
      </div>

      <div className="pb-28">
        {/* ===== SECTION 1: Hero Image + Overview ===== */}
        <div className="relative">
          <img src={imgSrc} alt={caseItem.title} className="h-52 w-full object-cover" />
          {caseItem.isUrgent && (
            <div className="absolute left-3 top-3 flex items-center gap-1 rounded-lg bg-urgent px-2.5 py-1 shadow-md">
              <AlertTriangle className="h-3.5 w-3.5 text-urgent-foreground" />
              <span className="text-[13px] font-bold text-urgent-foreground">{caseItem.urgentNeed || '紧急'}</span>
            </div>
          )}
        </div>

        <div className="px-4">
          {/* Tags */}
          <div className="mt-3 flex flex-wrap items-center gap-1.5">
            <span className="rounded-lg bg-primary/10 px-2 py-0.5 text-[12px] font-medium text-primary">{caseItem.status}</span>
            <span className="rounded-lg bg-muted px-2 py-0.5 text-[12px] text-muted-foreground">
              {caseItem.animalType === '猫' ? '🐱' : '🐶'} {caseItem.animalType}
            </span>
          </div>

          {/* Title */}
          <h1 className="mt-2 text-[20px] font-bold leading-snug text-foreground">{caseItem.title}</h1>

          {/* Location + Distance */}
          <div className="mt-1.5 flex items-center gap-1 text-[13px] text-muted-foreground">
            <MapPin className="h-3.5 w-3.5 shrink-0" />
            <span>{simpleLocation}</span>
            {caseItem.distance && (
              <span className="text-primary/80">· 距您 {caseItem.distance}</span>
            )}
          </div>

          {/* Publisher */}
          {publisher && (
            <button
              onClick={() => navigate(`/publisher/${publisher.id}`)}
              className="mt-3 flex w-full items-center justify-between rounded-xl bg-muted/60 px-3 py-2.5"
            >
              <PublisherBadge publisher={publisher} size="md" showStats />
              <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground/40" />
            </button>
          )}

          {/* ===== PRIMARY ACTION: Contact + Share ===== */}
          <div className="mt-4 flex gap-2">
            <button
              onClick={() => toast.success(`联系方式：${caseItem.contact}`)}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary py-3 text-[15px] font-semibold text-primary-foreground transition-colors active:bg-primary/90"
            >
              <Phone className="h-4 w-4" />
              立即联系
            </button>
            <button
              onClick={() => toast.success('转发内容已生成，可复制分享到社交平台')}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-muted py-3 text-[15px] font-medium text-foreground transition-colors active:bg-muted/80"
            >
              <Share2 className="h-4 w-4" />
              生成转发内容
            </button>
          </div>

          {/* ===== SECTION 2: Structured Situation ===== */}
          <div className="mt-5 rounded-xl bg-card p-4 shadow-sm">
            <h2 className="text-[15px] font-semibold text-foreground">📋 现场情况</h2>
            <div className="mt-3 space-y-2">
              {situationItems.map((item) => (
                <div key={item.label} className="flex gap-3">
                  <span className="w-[72px] shrink-0 text-[13px] text-muted-foreground">{item.label}</span>
                  <span className={`text-[13px] ${item.label === '当前最急' ? 'font-semibold text-urgent' : 'text-foreground'}`}>
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* ===== SECTION 3: Needs List (Prioritized) ===== */}
          <div className="mt-4 rounded-xl bg-card p-4 shadow-sm">
            <h2 className="text-[15px] font-semibold text-foreground">📝 需求单</h2>
            {/* Progress */}
            <div className="mt-3">
              <div className="flex items-center justify-between text-[13px]">
                <span className="text-muted-foreground">
                  已获得 <span className="font-bold text-accent-foreground">{caseItem.earnedPoints}</span> 助力值
                </span>
                <span className="text-muted-foreground">
                  共需 <span className="font-bold">{caseItem.totalPoints}</span>
                </span>
              </div>
              <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-accent to-points transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="mt-1 text-right text-[12px] font-medium text-urgent">还差 {remaining}</p>
            </div>

            {/* Urgent needs */}
            {urgentNeeds.length > 0 && (
              <div className="mt-3">
                <p className="text-[12px] font-semibold text-urgent">🔴 当前最急</p>
                <div className="mt-1.5 space-y-1.5">
                  {urgentNeeds.map((need) => (
                    <NeedRow key={need.id} need={need} highlight />
                  ))}
                </div>
              </div>
            )}

            {/* Current needs */}
            {currentNeeds.length > 0 && (
              <div className="mt-3">
                <p className="text-[12px] font-medium text-muted-foreground">当前阶段</p>
                <div className="mt-1.5 space-y-1.5">
                  {currentNeeds.map((need) => (
                    <NeedRow key={need.id} need={need} />
                  ))}
                </div>
              </div>
            )}

            {/* Later needs */}
            {laterNeeds.length > 0 && (
              <div className="mt-3">
                <p className="text-[12px] font-medium text-muted-foreground">后续支持</p>
                <div className="mt-1.5 space-y-1.5">
                  {laterNeeds.map((need) => (
                    <NeedRow key={need.id} need={need} />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ===== SECTION 4: How to Help ===== */}
          <div className="mt-4 rounded-xl bg-card p-4 shadow-sm">
            <h2 className="text-[15px] font-semibold text-foreground">🤝 如何帮助</h2>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {[
                { emoji: '💝', label: '赠送助力值', desc: '用助力值支持个案', action: '助力值赠送功能即将上线' },
                { emoji: '✅', label: '认领需求', desc: '直接认领具体需求', action: '需求认领功能即将上线' },
                { emoji: '📤', label: '帮忙转发', desc: '分享到朋友圈或群聊', action: '转发内容已生成' },
                { emoji: '💡', label: '提供线索', desc: '提供资源或信息', action: '线索提交功能即将上线' },
              ].map((item) => (
                <button
                  key={item.label}
                  onClick={() => toast.success(item.action)}
                  className="flex flex-col items-center gap-1 rounded-xl bg-muted/60 px-3 py-3 transition-colors active:bg-muted"
                >
                  <span className="text-xl">{item.emoji}</span>
                  <span className="text-[13px] font-medium text-foreground">{item.label}</span>
                  <span className="text-[11px] text-muted-foreground">{item.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* ===== SECTION 5: Key Records / Timeline ===== */}
          <div className="mt-4 rounded-xl bg-card p-4 shadow-sm">
            <h2 className="flex items-center gap-1.5 text-[15px] font-semibold text-foreground">
              <Shield className="h-4 w-4 text-primary" />
              关键记录
            </h2>
            <div className="mt-3 space-y-0">
              {caseItem.timeline.map((t, i) => (
                <div key={i} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div
                      className={`mt-0.5 h-2.5 w-2.5 rounded-full ${
                        t.type === 'milestone' ? 'bg-primary' : t.type === 'evidence' ? 'bg-accent' : 'bg-muted-foreground/30'
                      }`}
                    />
                    {i < caseItem.timeline.length - 1 && <div className="h-8 w-px bg-border" />}
                  </div>
                  <div className="pb-3">
                    <p className="text-[13px] font-medium text-foreground">{t.content}</p>
                    <p className="mt-0.5 text-[11px] text-muted-foreground">{t.date}</p>
                  </div>
                </div>
              ))}

              {/* Evidence placeholders in timeline */}
              {caseItem.evidences.map((ev) => (
                <div key={ev.id} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="mt-0.5 h-2.5 w-2.5 rounded-full bg-accent" />
                  </div>
                  <div className="pb-3">
                    <div className="flex items-center gap-2">
                      <p className="text-[13px] font-medium text-foreground">{ev.type}</p>
                      {ev.confirmed && (
                        <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[10px] text-primary">已确认</span>
                      )}
                    </div>
                    <div className="mt-1 flex items-center gap-1.5">
                      {ev.chainStatus === 'stored' ? (
                        <>
                          <Link2 className="h-3 w-3 text-primary" />
                          <span className="text-[11px] text-primary">已存证</span>
                        </>
                      ) : (
                        <>
                          <Clock className="h-3 w-3 text-muted-foreground" />
                          <span className="text-[11px] text-muted-foreground">存证处理中</span>
                        </>
                      )}
                    </div>
                    <p className="mt-0.5 text-[11px] text-muted-foreground">{ev.uploadedAt}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ===== FIXED BOTTOM BAR ===== */}
      <div className="fixed bottom-0 left-1/2 z-50 w-full max-w-[430px] -translate-x-1/2 border-t border-border bg-card px-4 py-3 safe-bottom">
        <div className="flex gap-2">
          <button
            onClick={() => toast.success(`联系方式：${caseItem.contact}`)}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary py-3 text-[15px] font-semibold text-primary-foreground transition-colors active:bg-primary/90"
          >
            <Phone className="h-4 w-4" />
            立即联系
          </button>
          <button
            onClick={() => toast.success('转发内容已生成')}
            className="flex items-center justify-center gap-1.5 rounded-xl bg-muted px-4 py-3 text-[14px] font-medium text-foreground transition-colors active:bg-muted/80"
          >
            <Share2 className="h-4 w-4" />
            转发
          </button>
          <button
            onClick={() => toast.success('助力值赠送功能即将上线')}
            className="flex items-center justify-center gap-1.5 rounded-xl bg-accent/15 px-4 py-3 text-[14px] font-medium text-accent-foreground transition-colors active:bg-accent/25"
          >
            <Heart className="h-4 w-4" />
            助力
          </button>
        </div>
      </div>
    </MobileLayout>
  );
};

// Sub-component for need rows
const NeedRow = ({ need, highlight = false }: { need: { id: string; name: string; points: number; fulfilled: boolean; claimedBy?: string }; highlight?: boolean }) => (
  <div
    className={`flex items-center justify-between rounded-lg px-3 py-2 ${
      need.fulfilled ? 'bg-primary/5' : highlight ? 'bg-urgent/5 ring-1 ring-urgent/10' : 'bg-muted'
    }`}
  >
    <div className="flex items-center gap-2">
      {need.fulfilled ? (
        <CheckCircle2 className="h-4 w-4 text-primary" />
      ) : (
        <div className={`h-4 w-4 rounded-full border-2 ${highlight ? 'border-urgent/50' : 'border-muted-foreground/30'}`} />
      )}
      <span className={`text-[13px] ${need.fulfilled ? 'text-muted-foreground line-through' : highlight ? 'font-medium text-foreground' : 'text-foreground'}`}>
        {need.name}
      </span>
    </div>
    <div className="text-right">
      <span className={`text-[12px] font-semibold ${highlight ? 'text-urgent' : 'text-points'}`}>{need.points}分</span>
      {need.fulfilled && need.claimedBy && (
        <p className="text-[10px] text-muted-foreground">{need.claimedBy} 已认领</p>
      )}
    </div>
  </div>
);

export default CaseDetail;
