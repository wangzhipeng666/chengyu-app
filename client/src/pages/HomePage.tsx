import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { loadDays } from '../data';
import { Flame, Target, BookOpen, AlertCircle, ChevronRight, CheckCircle, Upload, Sparkles } from 'lucide-react';
import type { DayData } from '../types';

export default function HomePage() {
  const { todayCorrect, todayTotal, streak, wrongQuestions, getDayProgress } = useStore();
  const [days, setDays] = useState<DayData[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    loadDays()
      .then(d => setDays(d))
      .catch(() => setLoadError('学习数据加载失败，请确认服务端已启动'))
      .finally(() => setLoading(false));
  }, []);

  const accuracy = todayTotal > 0 ? Math.round((todayCorrect / todayTotal) * 100) : 0;

  return (
    <main className="page-shell home-page animate-fade-in">
      {/* Header */}
      <section className="home-hero">
        <div className="hero-copy">
          <div className="eyebrow"><Sparkles size={14} /> 每天积累一点</div>
          <h1>把高频词语<br />真正变成得分能力</h1>
          <p>按天精学、随手收藏、错题回练，让复习路径清晰可见。</p>
          <div className="hero-actions">
            <Link to={days[0] ? `/day/${days[0].id}` : '/dictionary'} className="btn-primary inline-flex items-center gap-2">
              <BookOpen size={17} /> 开始学习
            </Link>
            <Link to="/import" className="btn-secondary inline-flex items-center gap-2">
              <Upload size={17} /> 导入新笔记
            </Link>
          </div>
        </div>
        <div className="hero-seal" aria-hidden="true"><span>成</span><small>日积月累</small></div>
      </section>

      {/* Stats Cards */}
      <section className="stats-grid">
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
        <div className="stat-card stat-card-wide">
          <div className="stat-card-icon" style={{ background: 'var(--color-gold-soft)' }}>
            <BookOpen size={20} style={{ color: 'var(--color-gold)' }} />
          </div>
          <div className="stat-card-value">{days.length}<span className="text-sm font-normal" style={{ color: 'var(--color-ink-muted)' }}> 天</span></div>
          <div className="stat-card-label">已收录课程</div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="quick-grid">
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
        <Link to="/import" className="card quick-card flex items-center gap-4 group">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'var(--color-primary-soft)' }}>
            <Upload size={24} style={{ color: 'var(--color-primary)' }} />
          </div>
          <div className="flex-1">
            <div className="font-semibold" style={{ color: 'var(--color-ink)' }}>导入新笔记</div>
            <div className="text-sm" style={{ color: 'var(--color-ink-muted)' }}>上传 PDF，生成下一天内容</div>
          </div>
          <ChevronRight size={20} style={{ color: 'var(--color-ink-muted)' }} />
        </Link>
      </section>

      {/* Day List */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-3" style={{ color: 'var(--color-ink)', fontFamily: 'var(--fontFamilySerif)' }}>
          学习进度
        </h2>
        {loadError && <div className="status-banner error"><AlertCircle size={17} /><span>{loadError}</span></div>}
        {loading ? (
          <div className="day-grid" aria-label="正在加载学习数据">
            {[1, 2, 3, 4].map(item => <div key={item} className="card skeleton-card"><span /><span /><span /></div>)}
          </div>
        ) : <div className="day-grid">
          {days.map(day => {
            const progress = getDayProgress(day.id);
            const totalIdioms = day.groups?.reduce((sum, g) => sum + (g.idioms?.length || 0), 0) || 0;
            const totalWords = day.groups?.reduce((sum, g) => sum + (g.words?.length || 0), 0) || 0;
            const totalQuizzes = day.quizzes?.length || 0;

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
        </div>}
      </div>
    </main>
  );
}
