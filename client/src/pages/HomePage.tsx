import { Link } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { days } from '../data';
import { Flame, Target, BookOpen, AlertCircle, ChevronRight, CheckCircle } from 'lucide-react';

export default function HomePage() {
  const { todayCorrect, todayTotal, streak, wrongQuestions, getDayProgress } = useStore();

  const accuracy = todayTotal > 0 ? Math.round((todayCorrect / todayTotal) * 100) : 0;

  return (
    <div className="max-w-lg mx-auto px-4 pt-6 animate-fade-in">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4" style={{ background: 'var(--color-primary-soft)' }}>
          <span className="text-3xl"> </span>
        </div>
        <h1 className="text-2xl font-bold mb-2" style={{ fontFamily: 'var(--fontFamilySerif)', color: 'var(--color-ink)' }}>
          成语学习助手
        </h1>
        <p className="text-sm" style={{ color: 'var(--color-ink-muted)' }}>
          粉笔千词计划 · 高频成语精讲
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="stat-card">
          <div className="stat-card-icon" style={{ background: 'var(--color-primary-soft)' }}>
            <Flame size={20} style={{ color: 'var(--color-primary)' }} />
          </div>
          <div className="stat-card-value">
            {streak} <span className="text-sm font-normal" style={{ color: 'var(--color-ink-muted)' }}>天</span>
          </div>
          <div className="stat-card-label">连续学习</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon" style={{ background: 'var(--color-accent-soft)' }}>
            <Target size={20} style={{ color: 'var(--color-accent)' }} />
          </div>
          <div className="stat-card-value">
            {accuracy}<span className="text-sm font-normal" style={{ color: 'var(--color-ink-muted)' }}>%</span>
          </div>
          <div className="stat-card-label">今日正确率</div>
          {todayTotal > 0 && (
            <div className="text-xs mt-1" style={{ color: 'var(--color-ink-muted)' }}>
              {todayCorrect}/{todayTotal} 题
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="space-y-3 mb-6">
        <Link to="/dictionary" className="card flex items-center gap-4 group">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'var(--color-gold-soft)' }}>
            <BookOpen size={24} style={{ color: 'var(--color-gold)' }} />
          </div>
          <div className="flex-1">
            <div className="font-semibold" style={{ color: 'var(--color-ink)' }}>全部词典</div>
            <div className="text-sm" style={{ color: 'var(--color-ink-muted)' }}>查看所有成语和实词</div>
          </div>
          <ChevronRight size={20} style={{ color: 'var(--color-ink-muted)' }} />
        </Link>
        <Link to="/wrong" className="card flex items-center gap-4 group">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'var(--color-error-soft)' }}>
            <AlertCircle size={24} style={{ color: 'var(--color-error)' }} />
          </div>
          <div className="flex-1">
            <div className="font-semibold" style={{ color: 'var(--color-ink)' }}>错题本</div>
            <div className="text-sm" style={{ color: 'var(--color-ink-muted)' }}>
              {wrongQuestions.length > 0 ? `${wrongQuestions.length} 道错题待复习` : '暂无错题，继续保持！'}
            </div>
          </div>
          <ChevronRight size={20} style={{ color: 'var(--color-ink-muted)' }} />
        </Link>
      </div>

      {/* Day List */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-3" style={{ color: 'var(--color-ink)', fontFamily: 'var(--fontFamilySerif)' }}>
          学习进度
        </h2>
        <div className="space-y-3">
          {days.map(day => {
            const progress = getDayProgress(day.id);
            const totalIdioms = day.groups.reduce((sum, g) => sum + (g.idioms?.length || 0), 0);
            const totalWords = day.groups.reduce((sum, g) => sum + (g.words?.length || 0), 0);
            const totalQuizzes = day.quizzes.length;

            return (
              <Link
                key={day.id}
                to={`/day/${day.id}`}
                className="card flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{
                      background: progress.reviewed ? 'var(--color-accent-soft)' : progress.learned ? 'var(--color-primary-soft)' : 'var(--color-hairline-light)',
                    }}>
                    {progress.reviewed ? (
                      <CheckCircle size={22} style={{ color: 'var(--color-accent)' }} />
                    ) : progress.learned ? (
                      <BookOpen size={22} style={{ color: 'var(--color-primary)' }} />
                    ) : (
                      <BookOpen size={22} style={{ color: 'var(--color-ink-muted)' }} />
                    )}
                  </div>
                  <div>
                    <div className="font-semibold" style={{ color: 'var(--color-ink)' }}>{day.label}</div>
                    <div className="text-xs" style={{ color: 'var(--color-ink-muted)' }}>
                      {totalIdioms > 0 && `成语 ${totalIdioms}个`}
                      {totalIdioms > 0 && totalWords > 0 && ' · '}
                      {totalWords > 0 && `实词 ${totalWords}个`}
                      {(totalIdioms > 0 || totalWords > 0) && totalQuizzes > 0 && ' · '}
                      {totalQuizzes > 0 && `题目 ${totalQuizzes}道`}
                    </div>
                    <div className="flex gap-1.5 mt-1">
                      {progress.learned && <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: 'var(--color-primary-soft)', color: 'var(--color-primary)' }}>已学习</span>}
                      {progress.reviewed && <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: 'var(--color-accent-soft)', color: 'var(--color-accent)' }}>已复习</span>}
                      {!progress.learned && <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: 'var(--color-hairline-light)', color: 'var(--color-ink-muted)' }}>未学习</span>}
                    </div>
                  </div>
                </div>
                <ChevronRight size={20} style={{ color: 'var(--color-ink-muted)' }} />
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
