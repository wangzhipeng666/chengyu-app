import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText } from 'lucide-react';
import { PDF_MAP } from '../pdfMap';

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
