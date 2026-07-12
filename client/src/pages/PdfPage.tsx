import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText } from 'lucide-react';

const PDF_MAP: Record<string, { file: string; title: string }> = {
  'day-1': { file: '/pdfs/day1.pdf', title: '第1天笔记 - 夏雨' },
  'day-2': { file: '/pdfs/day2.pdf', title: '第2天笔记 - 姜然' },
  'day-3': { file: '/pdfs/day3.pdf', title: '第3天笔记 - 夏雨' },
  'day-4': { file: '/pdfs/day4.pdf', title: '第4天笔记 - 夏雨' },
  'day-5': { file: '/pdfs/day5.pdf', title: '第5天笔记 - 刘柏衡' },
  'day-6': { file: '/pdfs/day6.pdf', title: '第6天笔记 - 辛然' },
  'day-7': { file: '/pdfs/day7.pdf', title: '第7天笔记 - 江雅' },
  'day-8': { file: '/pdfs/day8.pdf', title: '第8天笔记 - 李玟冰' },
  'day-9': { file: '/pdfs/day9.pdf', title: '第9天笔记 - 刘柏衡' },
  'day-10': { file: '/pdfs/day10.pdf', title: '第10天笔记 - 辛然' },
  'day-11': { file: '/pdfs/day11.pdf', title: '第11天笔记 - 辛然' },
  'day-12': { file: '/pdfs/day12.pdf', title: '第12天笔记 - 李玟冰' },
  'day-13': { file: '/pdfs/day13.pdf', title: '第13天笔记 - 辛然' },
  'day-14': { file: '/pdfs/day14.pdf', title: '第14天笔记 - 辛然' },
  'day-15': { file: '/pdfs/day15.pdf', title: '第15天笔记 - 闫洪泉' },
  'day-16': { file: '/pdfs/day16.pdf', title: '第16天笔记 - 闫洪泉' },
  'day-17': { file: '/pdfs/day17.pdf', title: '第17天笔记 - 闫洪泉' },
  'day-18': { file: '/pdfs/day18.pdf', title: '第18天笔记 - 张琳卉' },
  'day-19': { file: '/pdfs/day19.pdf', title: '第19天笔记 - 张琳卉' },
  'day-20': { file: '/pdfs/2026.07.02+粉笔千词计划·1000词精讲训练营（20）+安妮+（笔记）（粉笔千词计划·1000词精讲训练营）.pdf', title: '第20天笔记 - 安妮' },
  'day-21': { file: '/pdfs/2026.07.03+粉笔千词计划·1000词精讲训练营（21）+安妮+（笔记）（粉笔千词计划·1000词精讲训练营）.pdf', title: '第21天笔记 - 安妮' },
  'day-22': { file: '/pdfs/2026.07.06+粉笔千词计划·1000词精讲训练营（22）+司琦（笔记）（粉笔千词计划·1000词精讲训练营）.pdf', title: '第22天笔记 - 司琦' },
  'day-23': { file: '/pdfs/2026.07.07+粉笔千词计划·1000词精讲训练营（23）+张琳卉（笔记）（粉笔千词计划·1000词精讲训练营）.pdf', title: '第23天笔记 - 张琳卉' },
  'day-24': { file: '/pdfs/2026.07.08+粉笔千词计划·1000词精讲训练营（24）+张琳卉（笔记）（粉笔千词计划·1000词精讲训练营）.pdf', title: '第24天笔记 - 张琳卉' },
};

export default function PdfPage() {
  const { dayId } = useParams();
  const navigate = useNavigate();
  const pdf = dayId ? PDF_MAP[dayId] : undefined;

  if (!pdf) {
    return (
      <div className="max-w-lg mx-auto px-4 pt-6 animate-fade-in">
        <div className="text-center py-20">
          <p style={{ color: 'var(--color-ink-muted)' }}>未找到该天的笔记文件</p>
          <button onClick={() => navigate('/')} className="mt-4 text-sm" style={{ color: 'var(--color-primary)' }}>返回首页</button>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in" style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 shrink-0" style={{ background: 'var(--color-canvas-card)', borderBottom: '1px solid var(--color-hairline)' }}>
        <button onClick={() => navigate(-1)} className="flex items-center gap-1 btn-ghost">
          <ArrowLeft size={20} />
          <span className="text-sm">返回</span>
        </button>
        <h1 className="text-sm font-semibold" style={{ color: 'var(--color-ink)' }}>{pdf.title}</h1>
        <a href={pdf.file} download className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium" style={{ background: 'var(--color-primary-soft)', color: 'var(--color-primary)' }}>
          <FileText size={14} />
          下载
        </a>
      </div>

      {/* PDF */}
      <embed
        src={pdf.file}
        type="application/pdf"
        className="flex-1 w-full"
        style={{ border: 'none' }}
      />
    </div>
  );
}
