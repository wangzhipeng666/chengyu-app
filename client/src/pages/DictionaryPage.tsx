import { useState, useMemo, useEffect, useDeferredValue, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Search, Heart, ChevronDown, ChevronUp, BookOpen, ArrowUp, X, SlidersHorizontal } from 'lucide-react';
import { useStore } from '../store/useStore';
import { loadDays } from '../data';
import type { Idiom, Word, DayData } from '../types';

// 高亮例句中的关键词
function HighlightText({ text, keyword }: { text: string; keyword: string }) {
  if (!keyword) return <>{text}</>;
  const parts = text.split(new RegExp(`(${keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'g'));
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
            <h3 className="text-lg font-bold" style={{ color: 'var(--color-ink)', fontFamily: 'var(--fontFamilySerif)' }}>{idiom.name}</h3>
            {idiom.pronunciation && <span className="text-xs" style={{ color: 'var(--color-ink-muted)' }}>{idiom.pronunciation}</span>}
          </div>
          <p className="text-sm mt-1" style={{ color: 'var(--color-ink-secondary)' }}>{idiom.meaning}</p>
        </div>
        <div className="flex items-center gap-2 ml-2">
          <button onClick={(e) => {
            e.stopPropagation();
            if (fav) {
              removeFavorite(dayId, idiom.id);
            } else {
              addFavorite(dayId, idiom.id, 'idiom');
            }
          }}
            className="p-1.5 rounded-lg transition-colors" style={{ background: fav ? 'var(--color-error-soft)' : 'transparent' }}>
            <Heart size={18} style={{ color: fav ? 'var(--color-error)' : 'var(--color-ink-muted)' }} fill={fav ? 'var(--color-error)' : 'none'} />
          </button>
          {expanded ? <ChevronUp size={18} style={{ color: 'var(--color-ink-muted)' }} /> : <ChevronDown size={18} style={{ color: 'var(--color-ink-muted)' }} />}
        </div>
      </div>
      {expanded && (
        <div className="idiom-card-content space-y-3 animate-slide-up">
          {idiom.origin && <div className="mt-3"><div className="text-xs font-medium mb-1" style={{ color: 'var(--color-ink-muted)' }}>出处</div><div className="text-sm" style={{ color: 'var(--color-ink-secondary)' }}>{idiom.origin}</div></div>}
          {idiom.usage && <div><div className="text-xs font-medium mb-1" style={{ color: 'var(--color-ink-muted)' }}>用法</div><div className="text-sm" style={{ color: 'var(--color-ink-secondary)' }}>{idiom.usage}</div></div>}
          {idiom.structure && <div><div className="text-xs font-medium mb-1" style={{ color: 'var(--color-ink-muted)' }}>结构特点</div><div className="text-sm" style={{ color: 'var(--color-ink-secondary)' }}>{idiom.structure}</div></div>}
          {idiom.collocations && idiom.collocations.length > 0 && <div><div className="text-xs font-medium mb-1" style={{ color: 'var(--color-ink-muted)' }}>常见搭配</div><div className="flex flex-wrap gap-1">{idiom.collocations.map((col, i) => <span key={i} className="tag tag-primary">{col}</span>)}</div></div>}
          {idiom.examples && idiom.examples.length > 0 && <div><div className="text-xs font-medium mb-1" style={{ color: 'var(--color-ink-muted)' }}>例句</div><ul className="space-y-1">{idiom.examples.map((ex, i) => <li key={i} className="text-sm leading-relaxed pl-3" style={{ color: 'var(--color-ink-secondary)', borderLeft: '2px solid var(--color-gold)' }}><HighlightText text={ex} keyword={idiom.name} /></li>)}</ul></div>}
          {idiom.tip && <div className="rounded-lg p-3" style={{ background: 'var(--color-warning-soft)' }}><div className="text-xs font-medium mb-1" style={{ color: 'var(--color-warning)' }}>记忆口诀</div><div className="text-sm" style={{ color: 'var(--color-ink-secondary)' }}>{idiom.tip}</div></div>}
          {idiom.oneLineSummary && <div className="rounded-lg p-3" style={{ background: 'var(--color-hairline-light)' }}><div className="text-xs font-medium mb-1" style={{ color: 'var(--color-ink-muted)' }}>一句话总结</div><div className="text-sm font-medium" style={{ color: 'var(--color-ink)' }}>{idiom.oneLineSummary}</div></div>}
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
            <h3 className="text-lg font-bold" style={{ color: 'var(--color-ink)', fontFamily: 'var(--fontFamilySerif)' }}>{word.name}</h3>
            {word.pronunciation && <span className="text-xs" style={{ color: 'var(--color-ink-muted)' }}>{word.pronunciation}</span>}
          </div>
          <p className="text-sm mt-1" style={{ color: 'var(--color-ink-secondary)' }}>{word.meaning}</p>
        </div>
        <div className="flex items-center gap-2 ml-2">
          <button onClick={(e) => {
            e.stopPropagation();
            if (fav) {
              removeFavorite(dayId, word.id);
            } else {
              addFavorite(dayId, word.id, 'word');
            }
          }}
            className="p-1.5 rounded-lg transition-colors" style={{ background: fav ? 'var(--color-error-soft)' : 'transparent' }}>
            <Heart size={18} style={{ color: fav ? 'var(--color-error)' : 'var(--color-ink-muted)' }} fill={fav ? 'var(--color-error)' : 'none'} />
          </button>
          {expanded ? <ChevronUp size={18} style={{ color: 'var(--color-ink-muted)' }} /> : <ChevronDown size={18} style={{ color: 'var(--color-ink-muted)' }} />}
        </div>
      </div>
      {expanded && (
        <div className="idiom-card-content space-y-3 animate-slide-up">
          {word.usageContext && <div className="mt-3"><div className="text-xs font-medium mb-1" style={{ color: 'var(--color-ink-muted)' }}>使用语境</div><div className="text-sm" style={{ color: 'var(--color-ink-secondary)' }}>{word.usageContext}</div></div>}
          {word.examples.length > 0 && <div><div className="text-xs font-medium mb-1" style={{ color: 'var(--color-ink-muted)' }}>例句</div><ul className="space-y-1">{word.examples.map((ex, i) => <li key={i} className="text-sm leading-relaxed pl-3" style={{ color: 'var(--color-ink-secondary)', borderLeft: '2px solid var(--color-accent)' }}><HighlightText text={ex.text} keyword={word.name} />{ex.source && <span className="text-xs ml-1" style={{ color: 'var(--color-ink-muted)' }}>— {ex.source}</span>}</li>)}</ul></div>}
          {word.notes && <div className="rounded-lg p-3" style={{ background: 'var(--color-error-soft)' }}><div className="text-xs font-medium mb-1" style={{ color: 'var(--color-error)' }}>注意事项</div><div className="text-sm" style={{ color: 'var(--color-ink-secondary)' }}>{word.notes}</div></div>}
          {word.analysisAngles.length > 0 && <div><div className="text-xs font-medium mb-2" style={{ color: 'var(--color-ink-muted)' }}>辨析角度</div><div className="space-y-2">{word.analysisAngles.map((angle, i) => <div key={i} className="rounded-lg p-2" style={{ background: 'var(--color-primary-soft)' }}><div className="text-xs font-medium" style={{ color: 'var(--color-primary)' }}>{angle.dimension}</div><div className="text-sm mt-0.5" style={{ color: 'var(--color-ink-secondary)' }}>{angle.description}</div></div>)}</div></div>}
          {word.oneLineSummary && <div className="rounded-lg p-3" style={{ background: 'var(--color-hairline-light)' }}><div className="text-xs font-medium mb-1" style={{ color: 'var(--color-ink-muted)' }}>一句话总结</div><div className="text-sm font-medium" style={{ color: 'var(--color-ink)' }}>{word.oneLineSummary}</div></div>}
        </div>
      )}
    </div>
  );
}

// ============================================
// 词典页面
// ============================================
export default function DictionaryPage() {
  const { dayId } = useParams();
  const [search, setSearch] = useState('');
  const [activeDay, setActiveDay] = useState(dayId || 'all');
  const [activeGroup, setActiveGroup] = useState('all');
  const [typeFilter, setTypeFilter] = useState<'all' | 'idiom' | 'word'>('all');
  const [showBackTop, setShowBackTop] = useState(false);
  const [showGroupPicker, setShowGroupPicker] = useState(false);
  const [showDayPicker, setShowDayPicker] = useState(false);
  const [daysList, setDaysList] = useState<DayData[]>([]);
  const [loading, setLoading] = useState(true);
  const [resultLimit, setResultLimit] = useState(60);
  const deferredSearch = useDeferredValue(search);
  const toolbarRef = useRef<HTMLElement>(null);

  useEffect(() => {
    loadDays().then(d => setDaysList(d)).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const handler = () => setShowBackTop(window.scrollY > 400);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  useEffect(() => {
    const closePickers = (event: MouseEvent) => {
      if (!toolbarRef.current?.contains(event.target as Node)) {
        setShowDayPicker(false);
        setShowGroupPicker(false);
      }
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setShowDayPicker(false);
        setShowGroupPicker(false);
      }
    };
    document.addEventListener('mousedown', closePickers);
    document.addEventListener('keydown', closeOnEscape);
    return () => {
      document.removeEventListener('mousedown', closePickers);
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, []);

  const allIdioms = useMemo(
    () => daysList.flatMap(day =>
      day.groups.flatMap(group =>
        (group.idioms || []).map(idiom => ({ idiom, dayId: day.id, groupName: group.name }))
      )
    ),
    [daysList]
  );
  const allWords = useMemo(
    () => daysList.flatMap(day =>
      day.groups.flatMap(group =>
        (group.words || []).map(word => ({ word, dayId: day.id, groupName: group.name }))
      )
    ),
    [daysList]
  );

  // Collect all groups from filtered days
  const allGroups = useMemo(() => {
    const groupSet = new Map<string, string>(); // id -> name
    for (const day of daysList) {
      if (activeDay !== 'all' && day.id !== activeDay) continue;
      for (const group of day.groups) {
        const hasContent = (group.idioms && group.idioms.length > 0) || (group.words && group.words.length > 0);
        if (hasContent) groupSet.set(group.id, group.name);
      }
    }
    return Array.from(groupSet.entries()).map(([id, name]) => ({ id, name }));
  }, [activeDay, daysList]);

  const filteredIdioms = useMemo(() => {
    let result = allIdioms;
    if (activeDay !== 'all') result = result.filter(i => i.dayId === activeDay);
    if (activeGroup !== 'all') result = result.filter(i => {
      for (const day of daysList) {
        if (day.id !== i.dayId) continue;
        const group = day.groups.find(g => g.id === activeGroup);
        if (group?.idioms?.some(idiom => idiom.id === i.idiom.id)) return true;
      }
      return false;
    });
    if (typeFilter === 'word') return [];
    if (deferredSearch.trim()) {
      const q = deferredSearch.trim().toLowerCase();
      result = result.filter(i =>
        i.idiom.name.toLowerCase().includes(q) ||
        i.idiom.meaning.toLowerCase().includes(q) ||
        (i.idiom.oneLineSummary || '').toLowerCase().includes(q)
      );
    }
    return result;
  }, [allIdioms, activeDay, activeGroup, deferredSearch, typeFilter, daysList]);

  const filteredWords = useMemo(() => {
    let result = allWords;
    if (activeDay !== 'all') result = result.filter(w => w.dayId === activeDay);
    if (activeGroup !== 'all') result = result.filter(w => {
      for (const day of daysList) {
        if (day.id !== w.dayId) continue;
        const group = day.groups.find(g => g.id === activeGroup);
        if (group?.words?.some(word => word.id === w.word.id)) return true;
      }
      return false;
    });
    if (typeFilter === 'idiom') return [];
    if (deferredSearch.trim()) {
      const q = deferredSearch.trim().toLowerCase();
      result = result.filter(w =>
        w.word.name.toLowerCase().includes(q) ||
        w.word.meaning.toLowerCase().includes(q) ||
        (w.word.oneLineSummary || '').toLowerCase().includes(q)
      );
    }
    return result;
  }, [allWords, activeDay, activeGroup, deferredSearch, typeFilter, daysList]);

  const hasIdioms = daysList.some(d => d.groups.some(g => g.idioms && g.idioms.length > 0));
  const hasWords = daysList.some(d => d.groups.some(g => g.words && g.words.length > 0));
  const totalResults = filteredIdioms.length + filteredWords.length;
  const visibleIdioms = filteredIdioms.slice(0, resultLimit);
  const visibleWords = filteredWords.slice(0, Math.max(0, resultLimit - visibleIdioms.length));
  const visibleResults = visibleIdioms.length + visibleWords.length;

  return (
    <main className="page-shell dictionary-page animate-fade-in">
      <div className="dictionary-heading">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'var(--color-primary-soft)' }}>
          <BookOpen size={20} style={{ color: 'var(--color-primary)' }} />
        </div>
        <div><span>随查随记</span><h1>成语实词库</h1><p>跨天检索全部成语与实词，点击卡片查看完整辨析。</p></div>
      </div>

      <section className="dictionary-toolbar" ref={toolbarRef}>
      <div className="relative dictionary-search">
        <div className="relative">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--color-ink-muted)' }} />
          <input
            type="text"
            placeholder="搜索词语、释义或一句话总结…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input pr-10"
            style={{
              paddingLeft: '40px',
              background: 'var(--color-canvas-warm)',
              border: '1.5px solid transparent',
              borderRadius: 'var(--radius-full)',
              boxShadow: 'var(--shadow-sm)',
            }}
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full flex items-center justify-center transition-colors"
              style={{ background: 'var(--color-hairline-light)', color: 'var(--color-ink-muted)' }}
            >
              <X size={13} />
            </button>
          )}
        </div>
      </div>

      <div className="filter-label"><SlidersHorizontal size={14} /> 筛选范围</div>

      {/* Day Tabs - Collapsible */}
      <div className="filter-control">
        <button
          onClick={() => { setShowDayPicker(!showDayPicker); setShowGroupPicker(false); }}
          aria-expanded={showDayPicker}
          aria-haspopup="listbox"
          className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all w-full text-left"
          style={{ background: 'var(--color-canvas-warm)', border: '1px solid var(--color-hairline-light)', color: activeDay !== 'all' ? 'var(--color-primary)' : 'var(--color-ink-secondary)' }}
        >
          <span className="text-xs opacity-60">天数</span>
          <span className="flex-1 truncate">{activeDay === 'all' ? '全部天数' : daysList.find(d => d.id === activeDay)?.label}</span>
          <ChevronDown size={14} style={{ transform: showDayPicker ? 'rotate(180deg)' : '', transition: 'transform 0.2s' }} />
        </button>
        {showDayPicker && (
          <div className="picker-panel animate-slide-up" role="listbox" aria-label="选择天数">
            <button onClick={() => { setActiveDay('all'); setActiveGroup('all'); setShowDayPicker(false); }}
              className="px-3 py-2 rounded-lg text-xs font-medium text-left transition-all"
              style={{ background: activeDay === 'all' ? 'var(--color-primary)' : 'transparent', color: activeDay === 'all' ? 'white' : 'var(--color-ink-secondary)' }}>
              全部天数
            </button>
            {daysList.map(day => (
              <button key={day.id} onClick={() => { setActiveDay(day.id); setActiveGroup('all'); setShowDayPicker(false); }}
                className="px-3 py-2 rounded-lg text-xs font-medium text-left transition-all truncate"
                style={{ background: activeDay === day.id ? 'var(--color-primary)' : 'transparent', color: activeDay === day.id ? 'white' : 'var(--color-ink-secondary)' }}>
                {day.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Group Filter */}
      {allGroups.length > 1 && (
        <div className="filter-control">
          <button
            onClick={() => { setShowGroupPicker(!showGroupPicker); setShowDayPicker(false); }}
            aria-expanded={showGroupPicker}
            aria-haspopup="listbox"
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all w-full text-left"
            style={{ background: 'var(--color-canvas-warm)', border: '1px solid var(--color-hairline-light)', color: activeGroup !== 'all' ? 'var(--color-accent)' : 'var(--color-ink-secondary)' }}
          >
            <span className="text-xs opacity-60">分组</span>
            <span className="flex-1 truncate">{activeGroup === 'all' ? '全部分组' : allGroups.find(g => g.id === activeGroup)?.name?.replace(/[""]/g, '')}</span>
            <ChevronDown size={14} style={{ transform: showGroupPicker ? 'rotate(180deg)' : '', transition: 'transform 0.2s' }} />
          </button>
          {showGroupPicker && (
            <div className="picker-panel animate-slide-up" role="listbox" aria-label="选择分组">
              <button onClick={() => { setActiveGroup('all'); setShowGroupPicker(false); }}
                className="px-3 py-2 rounded-lg text-xs font-medium text-left transition-all"
                style={{ background: activeGroup === 'all' ? 'var(--color-accent)' : 'transparent', color: activeGroup === 'all' ? 'white' : 'var(--color-ink-secondary)' }}>
                全部分组
              </button>
              {allGroups.map(g => (
                <button key={g.id} onClick={() => { setActiveGroup(g.id); setShowGroupPicker(false); }}
                  className="px-3 py-2 rounded-lg text-xs font-medium text-left transition-all truncate"
                  style={{ background: activeGroup === g.id ? 'var(--color-accent)' : 'transparent', color: activeGroup === g.id ? 'white' : 'var(--color-ink-secondary)' }}>
                  {g.name.replace(/[""]/g, '')}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Type Tabs */}
      {(hasIdioms && hasWords) && (
        <div className="flex gap-2 mb-4">
          {[
            { key: 'all' as const, label: '全部' },
            { key: 'idiom' as const, label: '成语' },
            { key: 'word' as const, label: '实词' },
          ].map(opt => (
            <button key={opt.key} onClick={() => setTypeFilter(opt.key)}
              className="px-3 py-1.5 rounded-full text-xs font-medium transition-all"
              style={{ background: typeFilter === opt.key ? 'var(--color-accent)' : 'var(--color-hairline-light)', color: typeFilter === opt.key ? 'white' : 'var(--color-ink-secondary)' }}>
              {opt.label}
            </button>
          ))}
        </div>
      )}
      </section>

      <div className="result-summary"><span>{loading ? '正在整理词典…' : `找到 ${totalResults} 个词条`}</span>{deferredSearch && <small>关键词：{deferredSearch}</small>}</div>

      {/* Results */}
      <div className="dictionary-results pb-20">
        {loading ? <div className="dictionary-loading">{[1,2,3,4].map(item => <div key={item} className="card skeleton-card"><span /><span /><span /></div>)}</div> : filteredIdioms.length === 0 && filteredWords.length === 0 ? (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4" style={{ background: 'var(--color-hairline-light)' }}>
              <Search size={24} style={{ color: 'var(--color-ink-muted)' }} />
            </div>
            <p style={{ color: 'var(--color-ink-muted)' }}>没有找到匹配的内容</p>
          </div>
        ) : (
          <>
            {visibleIdioms.map(item => (
              <IdiomCard key={`${item.dayId}-${item.idiom.id}`} idiom={item.idiom} dayId={item.dayId} />
            ))}
            {visibleWords.map(item => (
              <WordCard key={`${item.dayId}-${item.word.id}`} word={item.word} dayId={item.dayId} />
            ))}
            {visibleResults < totalResults && (
              <button className="load-more-card" onClick={() => setResultLimit(limit => limit + 60)}>
                再显示 60 个 <span>当前 {visibleResults} / {totalResults}</span>
              </button>
            )}
          </>
        )}
      </div>

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
    </main>
  );
}
