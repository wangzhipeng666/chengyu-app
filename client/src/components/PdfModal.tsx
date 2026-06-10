import { ArrowLeft, FileText } from 'lucide-react';

const PDF_MAP: Record<string, { file: string; title: string }> = {
  'day-1': { file: '/pdfs/day1.pdf', title: '第1天笔记 - 夏雨' },
  'day-2': { file: '/pdfs/day2.pdf', title: '第2天笔记 - 姜然' },
  'day-3': { file: '/pdfs/day3.pdf', title: '第3天笔记 - 夏雨' },
  'day-4': { file: '/pdfs/day4.pdf', title: '第4天笔记 - 夏雨' },
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
