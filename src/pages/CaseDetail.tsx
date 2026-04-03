import { useParams, useNavigate } from 'react-router-dom';
import MobileLayout from '@/components/MobileLayout';
import { mockCases } from '@/data/mockData';
import { getPublisherForCase } from '@/data/publishers';
import PublisherBadge from '@/components/PublisherBadge';
import { ArrowLeft, Share2, MapPin, Phone, Shield, CheckCircle2, Clock, Link2 } from 'lucide-react';
import { toast } from 'sonner';

const CaseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const caseItem = mockCases.find((c) => c.id === id);

  if (!caseItem) {
    return (
      <MobileLayout hideTabBar>
        <div className="flex h-screen items-center justify-center text-muted-foreground">案例未找到</div>
      </MobileLayout>
    );
  }

  const remaining = caseItem.totalPoints - caseItem.earnedPoints;
  const progress = (caseItem.earnedPoints / caseItem.totalPoints) * 100;
  const publisher = getPublisherForCase(caseItem.id);

  return (
    <MobileLayout hideTabBar>
      {/* Header */}
      <div className="sticky top-0 z-40 flex items-center justify-between bg-card/95 px-4 py-3 backdrop-blur">
        <button onClick={() => navigate(-1)} className="rounded-full p-1">
          <ArrowLeft className="h-5 w-5 text-foreground" />
        </button>
        <span className="text-sm font-semibold text-foreground">案例详情</span>
        <button onClick={() => toast.success('链接已复制，快去分享吧！')} className="rounded-full p-1">
          <Share2 className="h-5 w-5 text-foreground" />
        </button>
      </div>

      <div className="px-4 pb-24">
        {/* Basic Info */}
        <div className="mt-2">
          <div className="flex items-center gap-2">
            {caseItem.isUrgent && (
              <span className="rounded bg-urgent/10 px-2 py-0.5 text-xs font-semibold text-urgent">紧急</span>
            )}
            <span className="rounded bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">{caseItem.status}</span>
            <span className="text-xs text-muted-foreground">{caseItem.animalType === '猫' ? '🐱' : '🐶'} {caseItem.animalType}</span>
          </div>
          <h1 className="mt-2 text-lg font-bold leading-snug text-foreground">{caseItem.title}</h1>
          <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="h-3.5 w-3.5" />
            {caseItem.location}
            {caseItem.distance && (
              <span className="text-primary/80">· 距您 {caseItem.distance}</span>
            )}
          </div>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{caseItem.description}</p>
          <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
            <Phone className="h-3 w-3" />
            {caseItem.contact}
          </div>
        </div>

        {/* Needs List (Core) */}
        <div className="mt-6 rounded-xl bg-card p-4 shadow-sm">
          <h2 className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
            📋 需求单
          </h2>
          <div className="mt-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">
                已获得 <span className="font-bold text-primary">{caseItem.earnedPoints}</span> 积分
              </span>
              <span className="text-muted-foreground">
                共需 <span className="font-bold">{caseItem.totalPoints}</span> 积分
              </span>
            </div>
            <div className="mt-1.5 h-3 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-gradient-to-r from-primary to-primary/70 transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="mt-1 text-center text-xs font-medium text-points">还差 {remaining} 积分</p>
          </div>

          <div className="mt-4 space-y-2">
            {caseItem.needs.map((need) => (
              <div
                key={need.id}
                className={`flex items-center justify-between rounded-lg px-3 py-2.5 ${
                  need.fulfilled ? 'bg-primary/5' : 'bg-muted'
                }`}
              >
                <div className="flex items-center gap-2">
                  {need.fulfilled ? (
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                  ) : (
                    <div className="h-4 w-4 rounded-full border-2 border-muted-foreground/30" />
                  )}
                  <span className={`text-sm ${need.fulfilled ? 'text-muted-foreground line-through' : 'text-foreground'}`}>
                    {need.name}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-semibold text-points">{need.points}分</span>
                  {need.fulfilled && need.claimedBy && (
                    <p className="text-[10px] text-muted-foreground">{need.claimedBy} 已认领</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-4 grid grid-cols-3 gap-2">
          <button
            onClick={() => toast.success('积分赠送功能即将上线')}
            className="flex flex-col items-center gap-1 rounded-xl bg-primary/10 p-3 transition-colors active:bg-primary/20"
          >
            <span className="text-xl">💝</span>
            <span className="text-xs font-medium text-primary">赠送积分</span>
          </button>
          <button
            onClick={() => toast.success('需求认领功能即将上线')}
            className="flex flex-col items-center gap-1 rounded-xl bg-accent/15 p-3 transition-colors active:bg-accent/25"
          >
            <span className="text-xl">✅</span>
            <span className="text-xs font-medium text-accent-foreground">认领需求</span>
          </button>
          <button
            onClick={() => toast.success('链接已复制，快去分享吧！')}
            className="flex flex-col items-center gap-1 rounded-xl bg-muted p-3 transition-colors active:bg-muted/80"
          >
            <span className="text-xl">📤</span>
            <span className="text-xs font-medium text-muted-foreground">帮忙转发</span>
          </button>
        </div>
        <p className="mt-2 text-center text-[10px] text-muted-foreground">
          赠送积分或认领需求后，求助人确认并上传凭证，你将获得公益积分记录
        </p>

        {/* Evidence Records */}
        <div className="mt-6 rounded-xl bg-card p-4 shadow-sm">
          <h2 className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
            <Shield className="h-4 w-4 text-primary" />
            关键凭证记录
          </h2>
          <div className="mt-3 space-y-3">
            {caseItem.evidences.map((ev) => (
              <div key={ev.id} className="rounded-lg bg-muted/50 p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-foreground">{ev.type}</span>
                    {ev.confirmed && (
                      <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[10px] text-primary">已确认</span>
                    )}
                  </div>
                  <span className="text-[10px] text-muted-foreground">{ev.uploadedAt}</span>
                </div>
                {/* Chain status placeholder */}
                <div className="mt-2 flex items-center gap-2 rounded bg-muted px-2 py-1.5">
                  {ev.chainStatus === 'stored' ? (
                    <>
                      <Link2 className="h-3 w-3 text-primary" />
                      <span className="text-[10px] text-primary">已存证</span>
                      <span className="ml-auto text-[10px] text-muted-foreground">ID: {ev.chainId}</span>
                    </>
                  ) : (
                    <>
                      <Clock className="h-3 w-3 text-muted-foreground" />
                      <span className="text-[10px] text-muted-foreground">存证处理中</span>
                    </>
                  )}
                </div>
                {ev.chainHash && (
                  <p className="mt-1 text-[10px] text-muted-foreground/60">Hash: {ev.chainHash}</p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div className="mt-6 rounded-xl bg-card p-4 shadow-sm">
          <h2 className="text-sm font-semibold text-foreground">📅 救助进展</h2>
          <div className="mt-3 space-y-0">
            {caseItem.timeline.map((t, i) => (
              <div key={i} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div
                    className={`h-2.5 w-2.5 rounded-full ${
                      t.type === 'milestone' ? 'bg-primary' : 'bg-muted-foreground/30'
                    }`}
                  />
                  {i < caseItem.timeline.length - 1 && <div className="h-8 w-px bg-border" />}
                </div>
                <div className="pb-3">
                  <p className="text-xs font-medium text-foreground">{t.content}</p>
                  <p className="mt-0.5 text-[10px] text-muted-foreground">{t.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Trust Enhancement Placeholder */}
        <div className="mt-6 rounded-xl border border-dashed border-border bg-muted/30 p-4">
          <h2 className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
            <Shield className="h-4 w-4 text-primary" />
            可信增强
          </h2>
          <div className="mt-3 space-y-2">
            <div className="flex items-center justify-between rounded-lg bg-muted px-3 py-2">
              <span className="text-xs text-muted-foreground">存证状态</span>
              <span className="rounded bg-primary/10 px-2 py-0.5 text-[10px] text-primary">部分已存证</span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-muted px-3 py-2">
              <span className="text-xs text-muted-foreground">关键节点记录</span>
              <span className="text-[10px] text-muted-foreground">{caseItem.timeline.length} 条</span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-muted px-3 py-2">
              <span className="text-xs text-muted-foreground">透明日志</span>
              <span className="text-[10px] text-muted-foreground">公开可查</span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-muted px-3 py-2">
              <span className="text-xs text-muted-foreground">认证标识</span>
              <span className="rounded bg-muted px-2 py-0.5 text-[10px] text-muted-foreground">待认证</span>
            </div>
          </div>
          <p className="mt-2 text-center text-[10px] text-muted-foreground">
            关键凭证将通过分布式存证技术增强可信度
          </p>
        </div>
      </div>

      {/* Fixed bottom action */}
      <div className="fixed bottom-0 left-1/2 z-50 w-full max-w-[430px] -translate-x-1/2 border-t border-border bg-card p-3 safe-bottom">
        <div className="flex gap-2">
          <button
            onClick={() => toast.success('积分赠送功能即将上线')}
            className="flex-1 rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground transition-colors active:bg-primary/90"
          >
            💝 赠送积分
          </button>
          <button
            onClick={() => toast.success('需求认领功能即将上线')}
            className="flex-1 rounded-xl bg-accent/20 py-3 text-sm font-semibold text-accent-foreground transition-colors active:bg-accent/30"
          >
            ✅ 认领需求
          </button>
        </div>
      </div>
    </MobileLayout>
  );
};

export default CaseDetail;
