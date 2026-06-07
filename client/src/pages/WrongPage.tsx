import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Trash2, RotateCcw, AlertCircle, ChevronRight } from 'lucide-react';
import { useStore } from '../store/useStore';
import { loadDays } from '../data';
import type { DayData } from '../types';

export default function WrongPage() {
  const { wrongQuestions, removeWrongQuestion, clearWrongQuestions } = useStore();
  const [daysList, setDaysList] = useState<DayData[]>([]);

  useEffect(() => {
    loadDays().then(d => setDaysList(d));
  }, []);

  // 按天分组错题
  const wrongByDay = wrongQuestions
    .map(wq => {
      const day = daysList.find(d => d.id === wq.dayId);
      const quiz = day?.quizzes.find(q => q.id === wq.quizId);
      return { ...wq, day, quiz };
    })
    .filter(w => w.quiz)
    .sort((a, b) => b.timestamp - a.timestamp);

  const groupedByDay = wrongByDay.reduce<Record<string, typeof wrongByDay>>((acc, w) => {
    if (!acc[w.dayId]) acc[w.dayId] = [];
    acc[w.dayId].push(w);
    return acc;
  }, {});

  return (
    <div className="max-w-lg mx-auto px-4 pt-6 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'var(--color-error-soft)' }}>
            <AlertCircle size={20} style={{ color: 'var(--color-error)' }} />
          </div>
          <h1 className="text-xl font-bold" style={{ color: 'var(--color-ink)', fontFamily: 'var(--fontFamilySerif)' }}>错题本</h1>
        </div>
        {wrongQuestions.length > 0 && (
          <button onClick={clearWrongQuestions} className="flex items-center gap-1 text-sm" style={{ color: 'var(--color-error)' }}>
            <Trash2 size={14} /> 清空
          </button>
        )}
      </div>

      {wrongQuestions.length === 0 ? (
        <div className="text-center py-20">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-4" style={{ background: 'var(--color-success-soft)' }}>
            <span className="text-4xl"> </span>
          </div>
          <h2 className="text-lg font-semibold mb-2" style={{ color: 'var(--color-ink)' }}>暂无错题</h2>
          <p className="text-sm mb-4" style={{ color: 'var(--color-ink-muted)' }}>继续保持，做题不出错！</p>
          <Link to="/" className="btn-primary inline-flex items-center gap-2">
            去学习 <ChevronRight size={16} />
          </Link>
        </div>
      ) : (
        <div className="space-y-4 pb-20">
          <div className="text-sm" style={{ color: 'var(--color-ink-muted)' }}>共 {wrongQuestions.length} 道错题</div>
          {Object.entries(groupedByDay).map(([dayId, items]) => {
            const day = daysList.find(d => d.id === dayId);
            return (
              <div key={dayId}>
                <div className="text-xs font-medium mb-2 px-1" style={{ color: 'var(--color-ink-muted)' }}>{day?.label || dayId}</div>
                <div className="space-y-2">
                  {items.map(w => (
                    <div key={w.compositeId} className="card animate-slide-up">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {w.quiz!.year && <span className="tag tag-primary">{w.quiz!.year} {w.quiz!.region}</span>}
                          <span className="text-xs" style={{ color: 'var(--color-error)' }}>答错选：{w.selectedAnswer}</span>
                        </div>
                        <button onClick={() => removeWrongQuestion(w.dayId, w.quizId)}
                          className="p-1.5 rounded-lg transition-colors" style={{ color: 'var(--color-ink-muted)' }} title="移除">
                          <Trash2 size={14} />
                        </button>
                      </div>
                      <p className="text-sm line-clamp-3 mb-3" style={{ color: 'var(--color-ink-secondary)' }}>{w.quiz!.question}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium" style={{ color: 'var(--color-success)' }}>正确答案：{w.quiz!.answer}</span>
                        <Link to={`/day/${w.dayId}`} className="flex items-center gap-1 text-xs" style={{ color: 'var(--color-primary)' }}>
                          <RotateCcw size={12} /> 重做
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
