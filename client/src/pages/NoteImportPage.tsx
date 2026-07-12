import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, FileText, Loader2, CheckCircle, AlertCircle } from 'lucide-react';

interface DayData {
  id: string;
  label: string;
  date?: string;
  summary?: string;
  groups: any[];
  quizzes: any[];
}

export default function NoteImportPage() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [step, setStep] = useState<'upload' | 'extract' | 'parse' | 'confirm' | 'done'>('upload');
  const [file, setFile] = useState<File | null>(null);
  const [dayNumber, setDayNumber] = useState(20);
  const [extractedText, setExtractedText] = useState('');
  const [parsedData, setParsedData] = useState<DayData | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
      setError('');
    } else {
      setError('请选择 PDF 文件');
    }
  };

  const handleExtract = async () => {
    if (!file) return;

    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/notes/extract', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('文本提取失败');
      }

      const data = await response.json();
      setExtractedText(data.text);
      setStep('extract');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleParse = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/notes/parse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: extractedText, dayNumber }),
      });

      if (!response.ok) {
        throw new Error('解析失败');
      }

      const data = await response.json();
      setParsedData(data.dayData);
      setStep('parse');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async (overwrite = false) => {
    if (!parsedData) return;

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/notes/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dayData: parsedData, overwrite }),
      });

      if (!response.ok) {
        const data = await response.json();
        if (data.error && data.error.includes('已存在')) {
          if (confirm('该天数数据已存在，是否覆盖？')) {
            return handleConfirm(true);
          }
          throw new Error('已取消');
        }
        throw new Error(data.error || '保存失败');
      }

      setStep('done');
    } catch (err: any) {
      if (err.message !== '已取消') {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUploadPdf = async () => {
    if (!file) return;

    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/notes/upload-pdf', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('PDF 上传失败');
      }

      alert('PDF 已上传到 public/pdfs/ 目录');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 pt-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate(-1)} className="btn-ghost p-2">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-bold" style={{ color: 'var(--color-ink)' }}>
          导入笔记
        </h1>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center gap-2 mb-6 text-sm">
        {['上传', '提取', '解析', '确认'].map((label, i) => {
          const steps = ['upload', 'extract', 'parse', 'confirm', 'done'];
          const currentIdx = steps.indexOf(step);
          const isActive = i === currentIdx;
          const isDone = i < currentIdx;

          return (
            <div key={label} className="flex items-center gap-2">
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium"
                style={{
                  background: isDone ? 'var(--color-accent)' : isActive ? 'var(--color-primary)' : 'var(--color-bg-muted)',
                  color: isDone || isActive ? 'white' : 'var(--color-ink-muted)',
                }}
              >
                {isDone ? '✓' : i + 1}
              </div>
              <span style={{ color: isActive ? 'var(--color-primary)' : 'var(--color-ink-muted)' }}>
                {label}
              </span>
              {i < 3 && <span style={{ color: 'var(--color-ink-muted)' }}>→</span>}
            </div>
          );
        })}
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-center gap-2 p-3 mb-4 rounded-lg" style={{ background: '#fef2f2', color: '#dc2626' }}>
          <AlertCircle size={16} />
          <span className="text-sm">{error}</span>
        </div>
      )}

      {/* Step 1: Upload */}
      {step === 'upload' && (
        <div className="card p-6">
          <div
            className="border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors"
            style={{ borderColor: 'var(--color-hairline)' }}
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload size={32} className="mx-auto mb-3" style={{ color: 'var(--color-ink-muted)' }} />
            <p className="text-sm" style={{ color: 'var(--color-ink-muted)' }}>
              点击选择 PDF 文件
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>

          {file && (
            <div className="mt-4 flex items-center gap-3 p-3 rounded-lg" style={{ background: 'var(--color-bg-muted)' }}>
              <FileText size={20} style={{ color: 'var(--color-primary)' }} />
              <span className="text-sm flex-1 truncate">{file.name}</span>
              <button
                onClick={() => setFile(null)}
                className="text-sm"
                style={{ color: 'var(--color-ink-muted)' }}
              >
                移除
              </button>
            </div>
          )}

          <div className="mt-4">
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-ink)' }}>
              天数
            </label>
            <input
              type="number"
              value={dayNumber}
              onChange={(e) => setDayNumber(parseInt(e.target.value) || 20)}
              min={1}
              className="w-full px-3 py-2 rounded-lg border text-sm"
              style={{ borderColor: 'var(--color-hairline)' }}
            />
          </div>

          <button
            onClick={handleExtract}
            disabled={!file || loading}
            className="btn-primary w-full mt-4"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 size={16} className="animate-spin" />
                提取中...
              </span>
            ) : (
              '提取文本'
            )}
          </button>
        </div>
      )}

      {/* Step 2: Extracted Text */}
      {step === 'extract' && (
        <div className="card p-6">
          <h2 className="text-lg font-semibold mb-3" style={{ color: 'var(--color-ink)' }}>
            提取的文本
          </h2>
          <textarea
            value={extractedText}
            onChange={(e) => setExtractedText(e.target.value)}
            className="w-full h-64 px-3 py-2 rounded-lg border text-sm font-mono"
            style={{ borderColor: 'var(--color-hairline)' }}
          />
          <div className="flex gap-3 mt-4">
            <button onClick={() => setStep('upload')} className="btn-secondary flex-1">
              返回
            </button>
            <button onClick={handleParse} disabled={loading} className="btn-primary flex-1">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 size={16} className="animate-spin" />
                  解析中...
                </span>
              ) : (
                'AI 解析'
              )}
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Parsed Data Preview */}
      {step === 'parse' && parsedData && (
        <div className="card p-6">
          <h2 className="text-lg font-semibold mb-3" style={{ color: 'var(--color-ink)' }}>
            解析结果
          </h2>
          <div className="space-y-2 text-sm">
            <p><strong>天数：</strong>{parsedData.label}</p>
            <p><strong>分组数：</strong>{parsedData.groups.length}</p>
            <p><strong>题目数：</strong>{parsedData.quizzes.length}</p>
            {parsedData.summary && <p><strong>小结：</strong>{parsedData.summary}</p>}
          </div>

          <div className="mt-4 max-h-48 overflow-y-auto text-xs p-3 rounded-lg" style={{ background: 'var(--color-bg-muted)' }}>
            <pre className="whitespace-pre-wrap">{JSON.stringify(parsedData, null, 2)}</pre>
          </div>

          <div className="flex gap-3 mt-4">
            <button onClick={() => setStep('extract')} className="btn-secondary flex-1">
              返回
            </button>
            <button onClick={handleUploadPdf} disabled={loading} className="btn-secondary flex-1">
              上传 PDF
            </button>
            <button onClick={() => handleConfirm()} disabled={loading} className="btn-primary flex-1">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 size={16} className="animate-spin" />
                  保存中...
                </span>
              ) : (
                '确认保存'
              )}
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Done */}
      {step === 'done' && (
        <div className="card p-6 text-center">
          <CheckCircle size={48} className="mx-auto mb-4" style={{ color: 'var(--color-accent)' }} />
          <h2 className="text-lg font-semibold mb-2" style={{ color: 'var(--color-ink)' }}>
            导入成功
          </h2>
          <p className="text-sm mb-4" style={{ color: 'var(--color-ink-muted)' }}>
            第 {dayNumber} 天的笔记已成功导入
          </p>
          <div className="flex gap-3">
            <button onClick={() => navigate('/')} className="btn-secondary flex-1">
              返回首页
            </button>
            <button onClick={() => navigate(`/day/day-${dayNumber}`)} className="btn-primary flex-1">
              查看内容
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
