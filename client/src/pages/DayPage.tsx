import { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft, ArrowUp, ChevronDown, ChevronUp, Heart, Check, X,
  Shuffle, RotateCcw, BookOpen, FileText, FileDown
} from 'lucide-react';
import { useStore, quizKey } from '../store/useStore';
import { getDay } from '../data';
import PdfModal from '../components/PdfModal';
import { isGradableQuiz } from '../quizUtils';
import type { Idiom, Word, Quiz, DayData } from '../types';

// 高亮例句中的关键词
function HighlightText({ text, keyword }: { text: string | { text: string; source?: string }; keyword: string }) {
  const str = typeof text === 'string' ? text : text?.text ?? '';
  if (!keyword) return <>{str}</>;
  const parts = str.split(new RegExp(`(${keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'g'));
  return (
    <>
      {parts.map((part, i) =>
        part === keyword ? (
          <strong key={i} style={{ color: 'var(--color-primary)', fontWeight: 600 }}>{part}</strong>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
}

function StructuredDetailText({ text }: { text: string }) {
  const lines = text
    .replace(/【([^】]+)】/g, '\n$1：')
    .replace(/(?<!\d)(?=\d+[.、](?:释义|语义|侧重|语境|用法|例句|搭配|感情色彩))/g, '\n')
    .replace(/(?=（\d+）)/g, '\n')
    .split('\n')
    .map(line => line.trim())
    .filter(Boolean);

  return (
    <div className="space-y-1.5">
      {lines.map((line, index) => (
        <p key={index} className="text-sm leading-relaxed" style={{ color: 'var(--color-ink-secondary)' }}>
          {line}
        </p>
      ))}
    </div>
  );
}

// ============================================
// 成语卡片
// ============================================
function IdiomCard({ idiom, dayId }: { idiom: Idiom; dayId: string }) {
  const [expanded, setExpanded] = useState(false);
  const { addFavorite, removeFavorite, isFavorite } = useStore();
  const fav = isFavorite(dayId, idiom.id);

  return (
    <div className="idiom-card animate-slide-up">
      <div className="idiom-card-header" role="button" tabIndex={0} aria-expanded={expanded} onClick={() => setExpanded(!expanded)} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); setExpanded(!expanded); } }}>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold" style={{ color: 'var(--color-ink)', fontFamily: 'var(--fontFamilySerif)' }}>
              {idiom.name}
            </h3>
            {idiom.pronunciation && (
              <span className="text-xs" style={{ color: 'var(--color-ink-muted)' }}>{idiom.pronunciation}</span>
            )}
          </div>
          <p className="text-sm mt-1" style={{ color: 'var(--color-ink-secondary)' }}>
            {idiom.meaning}
          </p>
        </div>
        <div className="flex items-center gap-2 ml-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (fav) {
                removeFavorite(dayId, idiom.id);
              } else {
                addFavorite(dayId, idiom.id, 'idiom');
              }
            }}
            className="p-1.5 rounded-lg transition-colors"
            style={{ background: fav ? 'var(--color-error-soft)' : 'transparent' }}
          >
            <Heart size={18} style={{ color: fav ? 'var(--color-error)' : 'var(--color-ink-muted)' }} fill={fav ? 'var(--color-error)' : 'none'} />
          </button>
          {expanded ? <ChevronUp size={18} style={{ color: 'var(--color-ink-muted)' }} /> : <ChevronDown size={18} style={{ color: 'var(--color-ink-muted)' }} />}
        </div>
      </div>

      {expanded && (
        <div className="idiom-card-content space-y-3 animate-slide-up">
          {idiom.origin && (
            <div className="mt-3">
              <div className="text-xs font-medium mb-1" style={{ color: 'var(--color-ink-muted)' }}>出处</div>
              <div className="text-sm" style={{ color: 'var(--color-ink-secondary)' }}>{idiom.origin}</div>
            </div>
          )}
          {idiom.usage && (
            <div>
              <div className="text-xs font-medium mb-1" style={{ color: 'var(--color-ink-muted)' }}>用法</div>
              <StructuredDetailText text={idiom.usage} />
            </div>
          )}
          {idiom.structure && (
            <div>
              <div className="text-xs font-medium mb-1" style={{ color: 'var(--color-ink-muted)' }}>结构特点</div>
              <div className="text-sm" style={{ color: 'var(--color-ink-secondary)' }}>{idiom.structure}</div>
            </div>
          )}
          {idiom.collocations && idiom.collocations.length > 0 && (
            <div>
              <div className="text-xs font-medium mb-1" style={{ color: 'var(--color-ink-muted)' }}>常见搭配</div>
              <div className="flex flex-wrap gap-1">
                {idiom.collocations.map((col, i) => (
                  <span key={i} className="tag tag-primary">{col}</span>
                ))}
              </div>
            </div>
          )}
          {idiom.examples && idiom.examples.length > 0 && (
            <div>
              <div className="text-xs font-medium mb-1" style={{ color: 'var(--color-ink-muted)' }}>例句</div>
              <ul className="space-y-1">
                {idiom.examples.map((ex, i) => (
                  <li key={i} className="text-sm leading-relaxed pl-3" style={{ color: 'var(--color-ink-secondary)', borderLeft: '2px solid var(--color-gold)' }}>
                    <HighlightText text={ex} keyword={idiom.name} />
                  </li>
                ))}
              </ul>
            </div>
          )}
          {idiom.tip && (
            <div className="rounded-lg p-3" style={{ background: 'var(--color-warning-soft)' }}>
              <div className="text-xs font-medium mb-1" style={{ color: 'var(--color-warning)' }}>记忆口诀</div>
              <div className="text-sm" style={{ color: 'var(--color-ink-secondary)' }}>{idiom.tip}</div>
            </div>
          )}
          {idiom.oneLineSummary && (
            <div className="rounded-lg p-3" style={{ background: 'var(--color-hairline-light)' }}>
              <div className="text-xs font-medium mb-1" style={{ color: 'var(--color-ink-muted)' }}>一句话总结</div>
              <div className="text-sm font-medium" style={{ color: 'var(--color-ink)' }}>{idiom.oneLineSummary}</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ============================================
// 实词卡片
// ============================================
function WordCard({ word, dayId }: { word: Word; dayId: string }) {
  const [expanded, setExpanded] = useState(false);
  const { addFavorite, removeFavorite, isFavorite } = useStore();
  const fav = isFavorite(dayId, word.id);

  return (
    <div className="idiom-card animate-slide-up" style={{ borderLeft: '3px solid var(--color-accent)' }}>
      <div className="idiom-card-header" role="button" tabIndex={0} aria-expanded={expanded} onClick={() => setExpanded(!expanded)} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); setExpanded(!expanded); } }}>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold" style={{ color: 'var(--color-ink)', fontFamily: 'var(--fontFamilySerif)' }}>
              {word.name}
            </h3>
            {word.pronunciation && (
              <span className="text-xs" style={{ color: 'var(--color-ink-muted)' }}>{word.pronunciation}</span>
            )}
          </div>
          <p className="text-sm mt-1" style={{ color: 'var(--color-ink-secondary)' }}>
            {word.meaning}
          </p>
        </div>
        <div className="flex items-center gap-2 ml-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (fav) {
                removeFavorite(dayId, word.id);
              } else {
                addFavorite(dayId, word.id, 'word');
              }
            }}
            className="p-1.5 rounded-lg transition-colors"
            style={{ background: fav ? 'var(--color-error-soft)' : 'transparent' }}
          >
            <Heart size={18} style={{ color: fav ? 'var(--color-error)' : 'var(--color-ink-muted)' }} fill={fav ? 'var(--color-error)' : 'none'} />
          </button>
          {expanded ? <ChevronUp size={18} style={{ color: 'var(--color-ink-muted)' }} /> : <ChevronDown size={18} style={{ color: 'var(--color-ink-muted)' }} />}
        </div>
      </div>

      {expanded && (
        <div className="idiom-card-content space-y-3 animate-slide-up">
          {word.usageContext && (
            <div className="mt-3">
              <div className="text-xs font-medium mb-1" style={{ color: 'var(--color-ink-muted)' }}>使用语境</div>
              <StructuredDetailText text={word.usageContext} />
            </div>
          )}
          {word.examples.length > 0 && (
            <div>
              <div className="text-xs font-medium mb-1" style={{ color: 'var(--color-ink-muted)' }}>例句</div>
              <ul className="space-y-1">
                {word.examples.map((ex, i) => (
                  <li key={i} className="text-sm leading-relaxed pl-3" style={{ color: 'var(--color-ink-secondary)', borderLeft: '2px solid var(--color-accent)' }}>
                    <HighlightText text={ex.text} keyword={word.name} />
                    {ex.source && <span className="text-xs ml-1" style={{ color: 'var(--color-ink-muted)' }}>— {ex.source}</span>}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {word.notes && (
            <div className="rounded-lg p-3" style={{ background: 'var(--color-error-soft)' }}>
              <div className="text-xs font-medium mb-1" style={{ color: 'var(--color-error)' }}>注意事项</div>
              <StructuredDetailText text={word.notes} />
            </div>
          )}
          {word.analysisAngles.length > 0 && (
            <div>
              <div className="text-xs font-medium mb-2" style={{ color: 'var(--color-ink-muted)' }}>辨析角度</div>
              <div className="space-y-2">
                {word.analysisAngles.map((angle, i) => (
                  <div key={i} className="rounded-lg p-2" style={{ background: 'var(--color-primary-soft)' }}>
                    <div className="text-xs font-medium" style={{ color: 'var(--color-primary)' }}>{angle.dimension}</div>
                    <div className="text-sm mt-0.5" style={{ color: 'var(--color-ink-secondary)' }}>{angle.description}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {word.oneLineSummary && (
            <div className="rounded-lg p-3" style={{ background: 'var(--color-hairline-light)' }}>
              <div className="text-xs font-medium mb-1" style={{ color: 'var(--color-ink-muted)' }}>一句话总结</div>
              <div className="text-sm font-medium" style={{ color: 'var(--color-ink)' }}>{word.oneLineSummary}</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ============================================
// 答题组件
// ============================================
function QuizSection({ dayId, quizzes }: { dayId: string; quizzes: Quiz[] }) {
  const { addWrongQuestion, removeWrongQuestion, recordAnswer, markQuizCompleted, completedQuizzes, markDayReviewed } = useStore();
  const availableQuizzes = useMemo(
    () => quizzes.filter(isGradableQuiz),
    [quizzes]
  );
  const [currentIndex, setCurrentIndex] = useState(() => {
    const firstUncompleted = availableQuizzes.findIndex(q => !completedQuizzes.includes(quizKey(dayId, q.id)));
    return firstUncompleted >= 0 ? firstUncompleted : 0;
  });
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const quiz = availableQuizzes[currentIndex];
  const isCorrect = selectedAnswer === quiz?.answer;
  const allCompleted = availableQuizzes.length > 0 && availableQuizzes.every(q => completedQuizzes.includes(quizKey(dayId, q.id)));

  const handleSubmit = useCallback(() => {
    if (!selectedAnswer || !quiz) return;
    setIsSubmitted(true);
    recordAnswer(isCorrect);
    if (!isCorrect) {
      addWrongQuestion(dayId, quiz.id, selectedAnswer);
    } else {
      removeWrongQuestion(dayId, quiz.id);
    }
  }, [selectedAnswer, quiz, isCorrect, dayId, recordAnswer, addWrongQuestion, removeWrongQuestion]);

  const handleNext = useCallback(() => {
    if (quiz) markQuizCompleted(dayId, quiz.id);
    if (currentIndex < availableQuizzes.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setIsSubmitted(false);
    } else {
      markDayReviewed(dayId);
    }
  }, [currentIndex, availableQuizzes.length, quiz, dayId, markQuizCompleted, markDayReviewed]);

  const handleRetry = useCallback(() => {
    setSelectedAnswer(null);
    setIsSubmitted(false);
  }, []);

  const handleRandom = useCallback(() => {
    const randomIndex = Math.floor(Math.random() * availableQuizzes.length);
    setCurrentIndex(randomIndex);
    setSelectedAnswer(null);
    setIsSubmitted(false);
  }, [availableQuizzes.length]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isSubmitted) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleNext(); }
        return;
      }
      if (e.key >= '1' && e.key <= '4') {
        const index = parseInt(e.key) - 1;
        if (quiz?.options[index]) setSelectedAnswer(quiz.options[index].label);
      }
      if (e.key === 'Enter') { e.preventDefault(); handleSubmit(); }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSubmitted, quiz, handleSubmit, handleNext]);

  if (allCompleted) {
    return (
      <div className="text-center py-16">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-4" style={{ background: 'var(--color-success-soft)' }}>
          <span className="text-4xl"> </span>
        </div>
        <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--color-ink)' }}>恭喜完成所有题目！</h2>
        <p className="text-sm mb-6" style={{ color: 'var(--color-ink-muted)' }}>共完成 {availableQuizzes.length} 道题</p>
        <button onClick={() => { setCurrentIndex(0); setSelectedAnswer(null); setIsSubmitted(false); }} className="btn-primary inline-flex items-center gap-2">
          <RotateCcw size={18} /> 重新开始
        </button>
      </div>
    );
  }

  if (!quiz && quizzes.length > 0) {
    return (
      <div className="space-y-4">
        <div className="status-banner" style={{ color: 'var(--color-warning)', background: 'var(--color-warning-soft)' }}>
          本日题目已导入，答案与解析待后续笔记补充；当前仅供查看，暂不支持判分。
        </div>
        {quizzes.map((pendingQuiz, index) => (
          <article key={pendingQuiz.id} className="card">
            <div className="flex items-center justify-between gap-3 mb-3">
              <span className="text-sm font-semibold" style={{ color: 'var(--color-primary)' }}>第 {index + 1} 题</span>
              {pendingQuiz.year && <span className="tag tag-warning">{pendingQuiz.year} {pendingQuiz.region}</span>}
            </div>
            <p className="text-sm leading-relaxed whitespace-pre-line mb-4" style={{ color: 'var(--color-ink)' }}>{pendingQuiz.question}</p>
            <div className="space-y-2">
              {pendingQuiz.options.map(option => (
                <div key={option.label} className="option-btn" style={{ cursor: 'default' }}>
                  <div className="flex items-start gap-3"><span className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium" style={{ background: 'var(--color-hairline-light)' }}>{option.label}</span><span>{option.text}</span></div>
                </div>
              ))}
            </div>
          </article>
        ))}
      </div>
    );
  }

  if (!quiz) return <div className="text-center py-16" style={{ color: 'var(--color-ink-muted)' }}>暂无题目</div>;

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <button onClick={handleRandom} className="p-2 rounded-lg" style={{ color: 'var(--color-ink-muted)' }} title="随机题目">
            <Shuffle size={18} />
          </button>
          <span className="text-sm" style={{ color: 'var(--color-ink-muted)' }}>{currentIndex + 1} / {availableQuizzes.length}</span>
        </div>
        {quiz.year && <span className="tag tag-primary">{quiz.year} {quiz.region}</span>}
      </div>

      <div className="progress-bar mb-4">
        <div className="progress-bar-fill" style={{ width: `${((currentIndex + 1) / availableQuizzes.length) * 100}%` }} />
      </div>

      <div className="card mb-4">
        <div className="leading-relaxed whitespace-pre-line" style={{ color: 'var(--color-ink)', fontSize: '15px' }}>
          {quiz.question}
        </div>
      </div>

      <div className="space-y-2 mb-4">
        {quiz.options.map((option) => {
          const isSelected = selectedAnswer === option.label;
          const isAnswer = option.label === quiz.answer;
          let className = 'option-btn';
          if (isSubmitted) {
            if (isAnswer) className += ' correct';
            else if (isSelected && !isAnswer) className += ' wrong';
            else className += ' opacity-50';
          } else if (isSelected) className += ' selected';

          return (
            <button key={option.label} onClick={() => !isSubmitted && setSelectedAnswer(option.label)} disabled={isSubmitted} className={className}>
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium"
                  style={{
                    background: isSubmitted && isAnswer ? 'var(--color-success)' : isSubmitted && isSelected && !isAnswer ? 'var(--color-error)' : 'var(--color-hairline-light)',
                    color: isSubmitted && (isAnswer || (isSelected && !isAnswer)) ? 'white' : 'var(--color-ink-secondary)'
                  }}>
                  {isSubmitted && isAnswer ? <Check size={14} /> : isSubmitted && isSelected && !isAnswer ? <X size={14} /> : option.label}
                </span>
                <span style={{ color: 'var(--color-ink)', fontSize: '15px' }}>{option.text}</span>
              </div>
            </button>
          );
        })}
      </div>

      <div className="flex gap-2 mb-4">
        {!isSubmitted ? (
          <button onClick={handleSubmit} disabled={!selectedAnswer}
            className={`flex-1 py-3 rounded-xl font-medium transition-all ${selectedAnswer ? 'btn-primary' : ''}`}
            style={!selectedAnswer ? { background: 'var(--color-hairline)', color: 'var(--color-ink-muted)' } : {}}>
            提交答案
          </button>
        ) : (
          <div className="flex gap-2 w-full">
            <button onClick={handleRetry} className="flex-1 py-3 rounded-xl font-medium btn-ghost" style={{ background: 'var(--color-hairline-light)' }}>重做</button>
            <button onClick={handleNext}
              className={`flex-1 py-3 rounded-xl font-medium transition-all ${currentIndex >= availableQuizzes.length - 1 ? '' : 'btn-primary'}`}
              style={currentIndex >= availableQuizzes.length - 1 ? { background: 'var(--color-hairline)', color: 'var(--color-ink-muted)' } : {}}>
              {currentIndex >= availableQuizzes.length - 1 ? '完成' : '下一题'}
            </button>
          </div>
        )}
      </div>

      {isSubmitted && (
        <div className="card mb-4 animate-slide-up">
          <div className="flex items-center gap-2 mb-3" style={{ color: isCorrect ? 'var(--color-success)' : 'var(--color-error)' }}>
            {isCorrect ? <Check size={20} /> : <X size={20} />}
            <span className="font-semibold">{isCorrect ? '回答正确！' : '回答错误'}</span>
            {!isCorrect && <span className="text-sm" style={{ color: 'var(--color-ink-muted)' }}>正确答案：{quiz.answer}</span>}
          </div>
          <div className="space-y-3 text-sm">
            {Object.entries(quiz.analysis).map(([key, value]) => {
              const colonIndex = value.indexOf('：');
              const title = colonIndex > -1 ? value.substring(0, colonIndex) : key;
              const content = colonIndex > -1 ? value.substring(colonIndex + 1) : value;
              return (
                <div key={key}>
                  <div className="font-medium mb-1" style={{ color: 'var(--color-ink)' }}>{title}</div>
                  <div className="leading-relaxed" style={{ color: 'var(--color-ink-secondary)' }}>{content}</div>
                </div>
              );
            })}
          </div>
          {quiz.tips && quiz.tips.length > 0 && (
            <div className="mt-4 pt-3" style={{ borderTop: '1px solid var(--color-hairline-light)' }}>
              <div className="font-medium mb-2" style={{ color: 'var(--color-ink)' }}>知识点总结</div>
              <ul className="space-y-1">
                {quiz.tips.map((tip, i) => (
                  <li key={i} className="text-sm leading-relaxed" style={{ color: 'var(--color-ink-secondary)' }}>· {tip}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ============================================
// 天数详情页
// ============================================
function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);
  useEffect(() => {
    const handler = () => setIsDesktop(window.innerWidth >= 1024);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);
  return isDesktop;
}

export default function DayPage() {
  const { dayId } = useParams();
  const navigate = useNavigate();
  const isDesktop = useIsDesktop();
  const { markDayLearned } = useStore();
  const [activeTab, setActiveTab] = useState<'notes' | 'quiz'>('notes');
  const [typeFilter, setTypeFilter] = useState<'all' | 'idiom' | 'word'>('all');
  const [showBackTop, setShowBackTop] = useState(false);
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [day, setDay] = useState<DayData | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handler = () => setShowBackTop(window.scrollY > 400);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  useEffect(() => {
    if (dayId) {
      getDay(dayId).then(d => setDay(d)).finally(() => setLoading(false));
    }
  }, [dayId]);

  useEffect(() => {
    if (day) markDayLearned(day.id);
  }, [day, markDayLearned]);

  if (loading) {
    return <main className="page-shell"><div className="learning-skeleton"><span /><span /><span /><span /></div></main>;
  }

  if (!day) {
    return (
      <div className="max-w-lg mx-auto px-4 pt-6 animate-fade-in">
        <div className="text-center py-20">
          <p style={{ color: 'var(--color-ink-muted)' }}>未找到该天数据</p>
          <Link to="/" className="mt-4 inline-block text-sm" style={{ color: 'var(--color-primary)' }}>返回首页</Link>
        </div>
      </div>
    );
  }

  const hasIdioms = day.groups.some(g => g.idioms && g.idioms.length > 0);
  const hasWords = day.groups.some(g => g.words && g.words.length > 0);
  const totalIdioms = day.groups.reduce((sum, group) => sum + (group.idioms?.length || 0), 0);
  const totalWords = day.groups.reduce((sum, group) => sum + (group.words?.length || 0), 0);
  const totalQuizzes = day.quizzes.length;

  const filteredGroups = day.groups.map(group => {
    if (typeFilter === 'all') return group;
    if (typeFilter === 'idiom') return { ...group, words: undefined };
    if (typeFilter === 'word') return { ...group, idioms: undefined };
    return group;
  }).filter(g => (g.idioms && g.idioms.length > 0) || (g.words && g.words.length > 0));

  return (
    <main className="page-shell learning-page min-h-screen animate-fade-in">
      {/* Header */}
      <div className="learning-header">
        <button onClick={() => navigate('/')} className="flex items-center gap-1 btn-ghost">
          <ArrowLeft size={20} />
          <span className="text-sm">返回</span>
        </button>
        <div className="learning-title"><span>每日精学</span><h1>{day.label}</h1></div>
        <button
          onClick={() => isDesktop ? navigate(`/pdf/${day.id}`) : setShowPdfModal(true)}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
          style={{ background: 'var(--color-primary-soft)', color: 'var(--color-primary)' }}
        >
          <FileDown size={14} />
          笔记
        </button>
      </div>

      <section className="learning-overview">
        <div><span>成语</span><strong>{totalIdioms}</strong></div>
        <div><span>实词</span><strong>{totalWords}</strong></div>
        <div><span>练习</span><strong>{totalQuizzes}</strong></div>
        <p>{day.summary || '先理解词义和使用语境，再通过练习巩固。'}</p>
      </section>

      {/* Tabs */}
      <div className="learning-tabs">
        <button
          onClick={() => setActiveTab('notes')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'notes' ? 'shadow-sm' : ''
          }`}
          style={{
            background: activeTab === 'notes' ? 'var(--color-canvas-card)' : 'transparent',
            color: activeTab === 'notes' ? 'var(--color-primary)' : 'var(--color-ink-muted)',
          }}
        >
          <BookOpen size={16} /> 笔记
        </button>
        <button
          onClick={() => setActiveTab('quiz')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'quiz' ? 'shadow-sm' : ''
          }`}
          style={{
            background: activeTab === 'quiz' ? 'var(--color-canvas-card)' : 'transparent',
            color: activeTab === 'quiz' ? 'var(--color-primary)' : 'var(--color-ink-muted)',
          }}
        >
          <FileText size={16} /> 练习
        </button>
      </div>

      {/* Notes Tab */}
      {activeTab === 'notes' && (
        <div className="learning-content pb-20">
          {/* Type filter */}
          {(hasIdioms && hasWords) && (
            <div className="flex gap-2">
              {[
                { key: 'all' as const, label: '全部' },
                { key: 'idiom' as const, label: '成语' },
                { key: 'word' as const, label: '实词' },
              ].map(opt => (
                <button
                  key={opt.key}
                  onClick={() => setTypeFilter(opt.key)}
                  className="px-4 py-1.5 rounded-full text-sm font-medium transition-all"
                  style={{
                    background: typeFilter === opt.key ? 'var(--color-primary)' : 'var(--color-hairline-light)',
                    color: typeFilter === opt.key ? 'var(--color-on-primary)' : 'var(--color-ink-secondary)',
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}

          {filteredGroups.map(group => (
            <section key={group.id} className="learning-group">
              <div className="group-heading"><span>{String(filteredGroups.indexOf(group) + 1).padStart(2, '0')}</span><h3>{group.name}</h3><small>{(group.idioms?.length || 0) + (group.words?.length || 0)} 词</small></div>
              <div className="space-y-3">
                {group.idioms?.map(idiom => (
                  <IdiomCard key={idiom.id} idiom={idiom} dayId={day.id} />
                ))}
                {group.words?.map(word => (
                  <WordCard key={word.id} word={word} dayId={day.id} />
                ))}
              </div>
              {group.summary && (
                <div className="mt-3 p-4 rounded-xl" style={{ background: 'var(--color-canvas-warm)', border: '1px solid var(--color-hairline-light)' }}>
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <span className="text-xs"> </span>
                    <span className="text-xs font-semibold" style={{ color: 'var(--color-primary)' }}>小结</span>
                  </div>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--color-ink-secondary)' }}>{group.summary}</p>
                </div>
              )}
            </section>
          ))}
        </div>
      )}

      {/* Quiz Tab */}
      {activeTab === 'quiz' && (
        <div className="quiz-shell pb-20">
          <QuizSection key={day.id} dayId={day.id} quizzes={day.quizzes} />
        </div>
      )}

      {/* Back to top button */}
      {showBackTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-24 right-5 w-11 h-11 rounded-full flex items-center justify-center shadow-lg transition-all animate-fade-in"
          style={{ background: 'var(--color-primary)', color: 'var(--color-on-primary)', zIndex: 40 }}
        >
          <ArrowUp size={20} />
        </button>
      )}

      {/* PDF Modal */}
      {showPdfModal && (
        <PdfModal dayId={day.id} onClose={() => setShowPdfModal(false)} />
      )}
    </main>
  );
}
