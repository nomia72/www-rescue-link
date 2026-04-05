import { useNavigate } from 'react-router-dom';
import MobileLayout from '@/components/MobileLayout';
import { mockAdoptions } from '@/data/mockData';
import { ArrowLeft } from 'lucide-react';
import CaseCard from '@/components/CaseCard';

const Adoption = () => {
  const navigate = useNavigate();

  return (
    <MobileLayout hideTabBar>
      <div className="sticky top-0 z-40 flex items-center gap-3 bg-card/95 px-4 py-3 backdrop-blur">
        <button onClick={() => navigate(-1)}><ArrowLeft className="h-5 w-5" /></button>
        <span className="text-sm font-semibold">💛 领养专区</span>
      </div>
      <div className="px-4 pb-6">
        {mockAdoptions.map((a) => (
          <CaseCard key={a.id} caseItem={a} />
        ))}
      </div>
    </MobileLayout>
  );
};

export default Adoption;
