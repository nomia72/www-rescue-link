import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MobileLayout from '@/components/MobileLayout';
import { ArrowLeft, CheckCircle2, Upload } from 'lucide-react';

const needTags = ['送医', '检查', '治疗', '药品', '临时寄养', '运输', '物资', '寻找领养', '其他'];

const CreateCase = () => {
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    title: '',
    animalType: '猫',
    urgency: '一般',
    location: '',
    situation: '',
    needTags: [] as string[],
    needNote: '',
    contact: '',
    contactVisibility: '公开显示',
  });

  const toggleNeedTag = (tag: string) => {
    setForm((prev) => ({
      ...prev,
      needTags: prev.needTags.includes(tag)
        ? prev.needTags.filter((t) => t !== tag)
        : [...prev.needTags, tag],
    }));
  };

  if (submitted) {
    return (
      <MobileLayout hideTabBar>
        <div className="flex min-h-screen flex-col items-center justify-center px-6">
          <CheckCircle2 className="h-16 w-16 text-primary" />
          <h2 className="mt-4 text-lg font-bold text-foreground">个案已发布</h2>
          <div className="mt-4 w-full rounded-xl bg-card p-4 shadow-sm text-sm space-y-1">
            <p><span className="text-muted-foreground">案号：</span>#00241</p>
            <p className="text-muted-foreground text-xs mt-1">你现在可以继续补充进展或上传第一份关键凭证</p>
          </div>
          <div className="mt-6 flex w-full flex-col gap-2">
            <button onClick={() => navigate('/case/1')} className="w-full rounded-xl bg-primary py-3 text-sm font-medium text-primary-foreground">
              查看个案页
            </button>
            <button onClick={() => navigate('/add-record')} className="w-full rounded-xl bg-muted py-3 text-sm font-medium text-foreground">
              补充第一条进展
            </button>
            <button onClick={() => navigate('/add-record')} className="w-full rounded-xl bg-accent/15 py-3 text-sm font-medium text-accent-foreground">
              上传第一份凭证
            </button>
          </div>
        </div>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout hideTabBar>
      <div className="sticky top-0 z-40 flex items-center gap-3 bg-card/95 px-4 py-3 backdrop-blur">
        <button onClick={() => navigate(-1)}><ArrowLeft className="h-5 w-5" /></button>
        <div>
          <span className="text-sm font-semibold">发起救助</span>
          <p className="text-[11px] text-muted-foreground">先发布关键信息，后续可以继续补充进展和凭证</p>
        </div>
      </div>
      <div className="px-4 pb-10">
        {/* Module 1: Basic info */}
        <div className="mt-4 space-y-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-foreground">个案标题</label>
            <input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="用一句话说明当前救助情况"
              className="w-full rounded-lg border border-input bg-card px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <p className="mt-0.5 text-[11px] text-muted-foreground">例如：朝阳区受伤橘猫急需送医</p>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-foreground">动物类型</label>
            <div className="flex gap-2">
              {['猫', '狗', '其他'].map((t) => (
                <button
                  key={t}
                  onClick={() => setForm({ ...form, animalType: t })}
                  className={`rounded-lg px-4 py-2 text-sm ${form.animalType === t ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}
                >{t}</button>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-foreground">紧急程度</label>
            <div className="flex gap-2">
              {['一般', '较急', '紧急'].map((u) => (
                <button
                  key={u}
                  onClick={() => setForm({ ...form, urgency: u })}
                  className={`rounded-lg px-4 py-2 text-sm ${form.urgency === u ? (u === '紧急' ? 'bg-urgent text-urgent-foreground' : 'bg-primary text-primary-foreground') : 'bg-muted text-muted-foreground'}`}
                >{u}</button>
              ))}
            </div>
            <p className="mt-0.5 text-[11px] text-muted-foreground">用于帮助其他人快速判断优先级</p>
          </div>
        </div>

        {/* Module 2: Location & situation */}
        <div className="mt-6 space-y-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-foreground">发现地点</label>
            <input
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              placeholder="城市 + 区域 + 更具体的位置"
              className="w-full rounded-lg border border-input bg-card px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <p className="mt-0.5 text-[11px] text-muted-foreground">例如：北京 · 朝阳区 · 某地铁站附近</p>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-foreground">当前情况</label>
            <textarea
              value={form.situation}
              onChange={(e) => setForm({ ...form, situation: e.target.value })}
              placeholder="描述动物目前的状态、是否已临时安置、是否受伤、是否已送医等"
              className="w-full rounded-lg border border-input bg-card px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              rows={5}
            />
          </div>
        </div>

        {/* Module 3: Needs */}
        <div className="mt-6 space-y-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-foreground">当前需要</label>
            <div className="flex flex-wrap gap-2">
              {needTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => toggleNeedTag(tag)}
                  className={`rounded-lg px-3 py-2 text-xs ${form.needTags.includes(tag) ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}
                >{tag}</button>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-foreground">补充说明</label>
            <textarea
              value={form.needNote}
              onChange={(e) => setForm({ ...form, needNote: e.target.value })}
              placeholder="补充说明目前最缺什么、希望别人如何帮助你"
              className="w-full rounded-lg border border-input bg-card px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              rows={3}
            />
          </div>
        </div>

        {/* Module 4: Contact */}
        <div className="mt-6 space-y-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-foreground">联系方式</label>
            <input
              value={form.contact}
              onChange={(e) => setForm({ ...form, contact: e.target.value })}
              placeholder="微信号或手机号"
              className="w-full rounded-lg border border-input bg-card px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-foreground">联系方式展示方式</label>
            <div className="flex gap-2">
              {['公开显示', '仅对已助力用户显示'].map((v) => (
                <button
                  key={v}
                  onClick={() => setForm({ ...form, contactVisibility: v })}
                  className={`rounded-lg px-3 py-2 text-xs ${form.contactVisibility === v ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}
                >{v}</button>
              ))}
            </div>
          </div>
        </div>

        {/* Module 5: Upload cover */}
        <div className="mt-6">
          <label className="mb-1 block text-xs font-medium text-foreground">上传图片</label>
          <div className="flex h-32 items-center justify-center rounded-xl border-2 border-dashed border-border bg-muted/30">
            <div className="flex flex-col items-center gap-2 text-muted-foreground">
              <Upload className="h-8 w-8" />
              <span className="text-xs">上传 1-3 张图片，第一张将作为个案封面</span>
            </div>
          </div>
          <p className="mt-0.5 text-[11px] text-muted-foreground">建议包含动物当前照片或现场照片</p>
        </div>

        {/* Submit */}
        <p className="mt-6 text-center text-[11px] text-muted-foreground">发布后将生成一个可持续更新的个案页</p>
        <button
          onClick={() => { if (form.title && form.location) setSubmitted(true); }}
          className="mt-2 w-full rounded-xl bg-primary py-3.5 text-sm font-semibold text-primary-foreground transition-colors active:bg-primary/90"
        >
          发布个案
        </button>
      </div>
    </MobileLayout>
  );
};

export default CreateCase;
