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
};

interface PdfModalProps {
  dayId: string;
  onClose: () => void;
}

export default function PdfModal({ dayId, onClose }: PdfModalProps) {
  const pdf = PDF_MAP[dayId];

  if (!pdf) return null;

  return (
    <div
      className="animate-fade-in"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--color-canvas)',
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3 shrink-0"
        style={{
          background: 'var(--color-canvas-card)',
          borderBottom: '1px solid var(--color-hairline)',
        }}
      >
        <button onClick={onClose} className="flex items-center gap-1 btn-ghost">
          <ArrowLeft size={20} />
          <span className="text-sm">返回</span>
        </button>
        <h1 className="text-sm font-semibold" style={{ color: 'var(--color-ink)' }}>
          {pdf.title}
        </h1>
        <a
          href={pdf.file}
          download
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium"
          style={{ background: 'var(--color-primary-soft)', color: 'var(--color-primary)' }}
        >
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
