import { ArrowLeft, FileText } from 'lucide-react';
import { PDF_MAP } from '../pdfMap';

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
