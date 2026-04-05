import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import MobileLayout from '@/components/MobileLayout';
import { ArrowLeft, CheckCircle2, Upload, X, Loader2, MapPin } from 'lucide-react';
import { publishCase, type PublishCaseInput } from '@/lib/publishCase';
import { toast } from 'sonner';

const needTags = ['送医', '检查', '治疗', '药品', '临时寄养', '运输', '物资', '寻找领养', '其他'];

const CreateCase = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [publishing, setPublishing] = useState(false);
  const [locating, setLocating] = useState(false);
  const [result, setResult] = useState<{ caseId: string; caseNo: number; txHash: string } | null>(null);

  const [form, setForm] = useState({
    title: '',
    animalType: '猫' as '猫' | '狗' | '其他',
    urgency: '一般' as '一般' | '较急' | '紧急',
    district: '',
    detailLocation: '',
    situation: '',
    needTags: [] as string[],
    needNote: '',
    contact: '',
  });
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const toggleNeedTag = (tag: string) => {
    setForm((prev) => ({
      ...prev,
      needTags: prev.needTags.includes(tag)
        ? prev.needTags.filter((t) => t !== tag)
        : [...prev.needTags, tag],
    }));
  };

  const handleGetLocation = async () => {
    if (!navigator.geolocation) {
      toast.error('浏览器不支持定位');
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&accept-language=zh`
          );
          const data = await res.json();
          const addr = data.address || {};
          const city = addr.city || addr.state || '';
          const district = addr.suburb || addr.district || addr.county || '';
          const filled = city && district ? `${city}${district}` : city || '定位成功';
          setForm((prev) => ({ ...prev, district: filled }));
        } catch {
          setForm((prev) => ({ ...prev, district: '上海市浦东新区' }));
        } finally {
          setLocating(false);
        }
      },
      () => {
        toast.error('定位失败，请手动填写');
        setLocating(false);
      },
      { timeout: 8000 }
    );
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const remaining = 3 - imageFiles.length;
    const toAdd = files.slice(0, remaining);
    setImageFiles((prev) => [...prev, ...toAdd]);
    toAdd.forEach((f) => {
      const reader = new FileReader();
      reader.onload = (ev) => setImagePreviews((prev) => [...prev, ev.target?.result as string]);
      reader.readAsDataURL(f);
    });
  };

  const removeImage = (idx: number) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== idx));
    setImagePreviews((prev) => prev.filter((_, i) => i !== idx));
  };

  const handlePublish = async () => {
    if (!form.title || !form.district) {
      toast.error('请填写标题和发现区域');
      return;
    }
    if (imageFiles.length === 0) {
      toast.error('请至少上传一张图片');
      return;
    }

    setPublishing(true);
    try {
      const location = form.detailLocation
        ? `${form.district} ${form.detailLocation}`
        : form.district;

      const input: PublishCaseInput = {
        title: form.title,
        animalType: form.animalType,
        urgency: form.urgency,
        location,
        city: form.district.includes('市') ? form.district.split('市')[0] + '市' : '上海',
        situation: form.situation,
        needTags: form.needTags,
        needNote: form.needNote,
        contact: form.contact,
        contactVisibility: '公开显示',
        imageFiles,
      };
      const res = await publishCase(input);
      setResult({
        caseId: res.caseItem.id,
        caseNo: res.caseNo,
        txHash: res.txHash,
      });
      toast.success('个案已发布');
    } catch (err: any) {
      console.error('[publish]', err);
      toast.error(err.message || '发布失败，请重试');
    } finally {
      setPublishing(false);
    }
  };

  // ─── Success screen ───
  if (result) {
    const formattedNo = String(result.caseNo).padStart(5, '0');
    const shortTx = result.txHash.slice(0, 10) + '…' + result.txHash.slice(-6);
    return (
      <MobileLayout hideTabBar>
        <div className="flex min-h-screen flex-col items-center justify-center px-6">
          <CheckCircle2 className="h-16 w-16 text-primary" />
          <h2 className="mt-4 text-lg font-bold text-foreground">个案已发布</h2>
          <div className="mt-4 w-full rounded-xl bg-card p-4 shadow-sm text-sm space-y-1.5">
            <p><span className="text-muted-foreground">案号：</span>#{formattedNo}</p>
            <div className="flex items-center gap-1">
              <span className="text-muted-foreground">链上存证：</span>
              <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[11px] font-medium text-primary">已上链</span>
            </div>
            <p className="text-[11px] text-muted-foreground break-all">TxHash: {shortTx}</p>
            <p className="text-muted-foreground text-xs mt-1">你现在可以继续补充进展或上传第一份关键凭证</p>
          </div>
          <div className="mt-6 flex w-full flex-col gap-2">
            <button onClick={() => navigate(`/case/${result.caseId}`)} className="w-full rounded-xl bg-primary py-3 text-sm font-medium text-primary-foreground">
              查看个案页
            </button>
            <button onClick={() => navigate('/add-record')} className="w-full rounded-xl bg-muted py-3 text-sm font-medium text-foreground">
              补充第一条进展
            </button>
            <button onClick={() => navigate('/')} className="w-full rounded-xl border border-border py-3 text-sm font-medium text-muted-foreground">
              返回首页
            </button>
          </div>
        </div>
      </MobileLayout>
    );
  }

  // ─── Form ───
  const inputCls = 'w-full rounded-lg border border-input bg-card px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring';

  return (
    <MobileLayout hideTabBar>
      <div className="sticky top-0 z-40 flex items-center gap-3 bg-card/95 px-4 py-3 backdrop-blur">
        <button onClick={() => navigate(-1)}><ArrowLeft className="h-5 w-5" /></button>
        <div>
          <span className="text-sm font-semibold">发起救助</span>
          <p className="text-[11px] text-muted-foreground">先发布关键信息，后续可以继续补充进展和凭证</p>
        </div>
      </div>

      <div className="px-4 pb-10 space-y-5">
        {/* 个案标题 */}
        <div>
          <label className="mb-1 block text-xs font-medium text-foreground">个案标题</label>
          <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="用一句话说明当前救助情况" className={inputCls} />
          <p className="mt-0.5 text-[11px] text-muted-foreground">例如：长宁区受伤橘猫急需送医</p>
        </div>

        {/* 动物类型 */}
        <div>
          <label className="mb-1 block text-xs font-medium text-foreground">动物类型</label>
          <div className="flex gap-2">
            {(['猫', '狗', '其他'] as const).map((t) => (
              <button key={t} onClick={() => setForm({ ...form, animalType: t })}
                className={`rounded-lg px-4 py-2 text-sm ${form.animalType === t ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}
              >{t}</button>
            ))}
          </div>
        </div>

        {/* 紧急程度 */}
        <div>
          <label className="mb-1 block text-xs font-medium text-foreground">紧急程度</label>
          <div className="flex gap-2">
            {(['一般', '较急', '紧急'] as const).map((u) => (
              <button key={u} onClick={() => setForm({ ...form, urgency: u })}
                className={`rounded-lg px-4 py-2 text-sm ${form.urgency === u ? (u === '紧急' ? 'bg-urgent text-urgent-foreground' : 'bg-primary text-primary-foreground') : 'bg-muted text-muted-foreground'}`}
              >{u}</button>
            ))}
          </div>
        </div>

        {/* 发现区域 */}
        <div>
          <label className="mb-1 block text-xs font-medium text-foreground">发现区域</label>
          <div className="flex gap-2">
            <input value={form.district} onChange={(e) => setForm({ ...form, district: e.target.value })}
              placeholder="例如：上海市长宁区" className={`${inputCls} flex-1`} />
            <button onClick={handleGetLocation} disabled={locating}
              className="flex items-center gap-1 whitespace-nowrap rounded-lg bg-primary/10 px-3 py-2 text-xs font-medium text-primary">
              {locating ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <MapPin className="h-3.5 w-3.5" />}
              {locating ? '定位中' : '获取定位'}
            </button>
          </div>
          <p className="mt-1 text-[11px] text-muted-foreground">将用于匹配附近可提供帮助的人，不会默认公开精确住址。</p>
        </div>

        {/* 具体位置 */}
        <div>
          <label className="mb-1 block text-xs font-medium text-foreground">具体位置<span className="ml-1 text-muted-foreground font-normal">（选填）</span></label>
          <input value={form.detailLocation} onChange={(e) => setForm({ ...form, detailLocation: e.target.value })}
            placeholder="例如：中山公园附近 / 某小区门口" className={inputCls} />
        </div>

        {/* 当前情况 */}
        <div>
          <label className="mb-1 block text-xs font-medium text-foreground">当前情况</label>
          <textarea value={form.situation} onChange={(e) => setForm({ ...form, situation: e.target.value })}
            placeholder="描述动物目前的状态、是否已临时安置、是否受伤等"
            className={inputCls} rows={4} />
        </div>

        {/* 当前需要 */}
        <div>
          <label className="mb-1 block text-xs font-medium text-foreground">当前需要</label>
          <div className="flex flex-wrap gap-2">
            {needTags.map((tag) => (
              <button key={tag} onClick={() => toggleNeedTag(tag)}
                className={`rounded-lg px-3 py-2 text-xs ${form.needTags.includes(tag) ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}
              >{tag}</button>
            ))}
          </div>
        </div>

        {/* 补充说明 */}
        <div>
          <label className="mb-1 block text-xs font-medium text-foreground">补充说明</label>
          <textarea value={form.needNote} onChange={(e) => setForm({ ...form, needNote: e.target.value })}
            placeholder="补充说明目前最缺什么、希望别人如何帮助你"
            className={inputCls} rows={3} />
        </div>

        {/* 联系方式 */}
        <div>
          <label className="mb-1 block text-xs font-medium text-foreground">联系方式</label>
          <input value={form.contact} onChange={(e) => setForm({ ...form, contact: e.target.value })}
            placeholder="微信号或手机号" className={inputCls} />
          <p className="mt-1 text-[11px] text-muted-foreground">该信息会展示在个案页，便于有意帮助的人联系你。请填写适合公开展示的联系方式。</p>
        </div>

        {/* 上传图片 */}
        <div>
          <label className="mb-1 block text-xs font-medium text-foreground">上传图片（1-3张）</label>
          <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden"
            onChange={handleImageSelect} />
          {imagePreviews.length > 0 && (
            <div className="flex gap-2 mb-2">
              {imagePreviews.map((src, i) => (
                <div key={i} className="relative h-24 w-24 rounded-lg overflow-hidden">
                  <img src={src} alt="" className="h-full w-full object-cover" />
                  <button onClick={() => removeImage(i)}
                    className="absolute right-1 top-1 rounded-full bg-black/50 p-0.5">
                    <X className="h-3 w-3 text-white" />
                  </button>
                  {i === 0 && (
                    <span className="absolute bottom-1 left-1 rounded bg-black/50 px-1 py-0.5 text-[9px] text-white">封面</span>
                  )}
                </div>
              ))}
            </div>
          )}
          {imageFiles.length < 3 && (
            <button onClick={() => fileInputRef.current?.click()}
              className="flex h-24 w-full items-center justify-center rounded-xl border-2 border-dashed border-border bg-muted/30">
              <div className="flex flex-col items-center gap-1 text-muted-foreground">
                <Upload className="h-6 w-6" />
                <span className="text-xs">点击上传图片，第一张将作为封面</span>
              </div>
            </button>
          )}
        </div>

        {/* 发布按钮 */}
        <button onClick={handlePublish} disabled={publishing}
          className="w-full rounded-xl bg-primary py-3.5 text-sm font-semibold text-primary-foreground transition-colors active:bg-primary/90 disabled:opacity-60 flex items-center justify-center gap-2">
          {publishing && <Loader2 className="h-4 w-4 animate-spin" />}
          {publishing ? '发布中…' : '发布救助'}
        </button>
      </div>
    </MobileLayout>
  );
};

export default CreateCase;
