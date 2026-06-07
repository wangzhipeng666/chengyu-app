import { useState, useMemo, useEffect } from 'react';
import { Heart, ChevronDown, ChevronUp, HeartOff } from 'lucide-react';
import { useStore } from '../store/useStore';
import { loadDays, getAllIdioms, getAllWords } from '../data';
import type { DayData } from '../types';

function FavoriteCard({ name, pronunciation, meaning, dayLabel, itemType, onRemove, children }: {
  name: string; pronunciation?: string; meaning: string; dayLabel: string; itemType: string; onRemove: () => void; children?: React.ReactNode;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="idiom-card animate-slide-up" style={itemType === 'word' ? { borderLeft: '3px solid var(--color-accent)' } : undefined}>
      <div className="idiom-card-header" onClick={() => setExpanded(!expanded)}>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold" style={{ color: 'var(--color-ink)', fontFamily: 'var(--fontFamilySerif)' }}>{name}</h3>
            {pronunciation && <span className="text-xs" style={{ color: 'var(--color-ink-muted)' }}>{pronunciation}</span>}
          </div>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs px-1.5 py-0.5 rounded" style={{
              background: itemType === 'idiom' ? 'var(--color-primary-soft)' : 'var(--color-accent-soft)',
              color: itemType === 'idiom' ? 'var(--color-primary)' : 'var(--color-accent)',
            }}>{itemType === 'idiom' ? '成语' : '实词'}</span>
            <span className="text-xs" style={{ color: 'var(--color-ink-muted)' }}>{dayLabel}</span>
          </div>
          <p className="text-sm mt-1 line-clamp-2" style={{ color: 'var(--color-ink-secondary)' }}>{meaning}</p>
        </div>
        <div className="flex items-center gap-2 ml-2">
          <button onClick={(e) => { e.stopPropagation(); onRemove(); }}
            className="p-1.5 rounded-lg transition-colors" style={{ background: 'var(--color-error-soft)' }}>
            <Heart size={18} style={{ color: 'var(--color-error)' }} fill="var(--color-error)" />
          </button>
          {expanded ? <ChevronUp size={18} style={{ color: 'var(--color-ink-muted)' }} /> : <ChevronDown size={18} style={{ color: 'var(--color-ink-muted)' }} />}
        </div>
      </div>
      {expanded && children}
    </div>
  );
}

export default function FavoritesPage() {
  const { favorites, removeFavorite } = useStore();
  const [daysList, setDaysList] = useState<DayData[]>([]);

  useEffect(() => {
    loadDays().then(d => setDaysList(d));
  }, []);

  const allIdioms = useMemo(() => getAllIdioms(), [daysList]);
  const allWords = useMemo(() => getAllWords(), [daysList]);

  const favoriteItems = favorites.map(f => {
    const day = daysList.find(d => d.id === f.dayId);
    if (f.itemType === 'idiom') {
      const found = allIdioms.find(i => i.dayId === f.dayId && i.idiom.id === f.itemId);
      return found ? { ...found, itemType: 'idiom' as const, dayLabel: day?.label || f.dayId } : null;
    } else {
      const found = allWords.find(w => w.dayId === f.dayId && w.word.id === f.itemId);
      return found ? { ...found, itemType: 'word' as const, dayLabel: day?.label || f.dayId } : null;
    }
  }).filter(Boolean);

  return (
    <div className="max-w-lg mx-auto px-4 pt-6 animate-fade-in">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'var(--color-error-soft)' }}>
          <Heart size={20} style={{ color: 'var(--color-error)' }} fill="var(--color-error)" />
        </div>
        <h1 className="text-xl font-bold" style={{ color: 'var(--color-ink)', fontFamily: 'var(--fontFamilySerif)' }}>我的收藏</h1>
      </div>

      {favoriteItems.length === 0 ? (
        <div className="text-center py-20">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-4" style={{ background: 'var(--color-hairline-light)' }}>
            <HeartOff size={32} style={{ color: 'var(--color-ink-muted)' }} />
          </div>
          <h2 className="text-lg font-semibold mb-2" style={{ color: 'var(--color-ink)' }}>暂无收藏</h2>
          <p className="text-sm" style={{ color: 'var(--color-ink-muted)' }}>在学习笔记中点击心形图标收藏</p>
        </div>
      ) : (
        <div className="space-y-3 pb-20">
          <div className="text-sm mb-2" style={{ color: 'var(--color-ink-muted)' }}>共 {favoriteItems.length} 个收藏</div>
          {favoriteItems.map(item => {
            if (!item) return null;
            if (item.itemType === 'idiom') {
              const { idiom, dayId, dayLabel } = item as { idiom: any; dayId: string; dayLabel: string };
              return (
                <FavoriteCard key={`${dayId}-${idiom.id}`} name={idiom.name} pronunciation={idiom.pronunciation}
                  meaning={idiom.meaning} dayLabel={dayLabel} itemType="idiom"
                  onRemove={() => removeFavorite(dayId, idiom.id)}>
                  <div className="idiom-card-content space-y-3 animate-slide-up">
                    {idiom.origin && <div className="mt-3"><div className="text-xs font-medium mb-1" style={{ color: 'var(--color-ink-muted)' }}>出处</div><div className="text-sm" style={{ color: 'var(--color-ink-secondary)' }}>{idiom.origin}</div></div>}
                    <div><div className="text-xs font-medium mb-1" style={{ color: 'var(--color-ink-muted)' }}>用法</div><div className="text-sm" style={{ color: 'var(--color-ink-secondary)' }}>{idiom.usage}</div></div>
                    {idiom.examples?.length > 0 && <div><div className="text-xs font-medium mb-1" style={{ color: 'var(--color-ink-muted)' }}>例句</div><ul className="space-y-1">{idiom.examples.map((ex: string, i: number) => <li key={i} className="text-sm leading-relaxed pl-3" style={{ color: 'var(--color-ink-secondary)', borderLeft: '2px solid var(--color-gold)' }}>{ex}</li>)}</ul></div>}
                    <div className="rounded-lg p-3" style={{ background: 'var(--color-warning-soft)' }}><div className="text-xs font-medium mb-1" style={{ color: 'var(--color-warning)' }}>记忆口诀</div><div className="text-sm" style={{ color: 'var(--color-ink-secondary)' }}>{idiom.tip}</div></div>
                    <div className="rounded-lg p-3" style={{ background: 'var(--color-hairline-light)' }}><div className="text-xs font-medium mb-1" style={{ color: 'var(--color-ink-muted)' }}>一句话总结</div><div className="text-sm font-medium" style={{ color: 'var(--color-ink)' }}>{idiom.oneLineSummary}</div></div>
                  </div>
                </FavoriteCard>
              );
            } else {
              const { word, dayId, dayLabel } = item as { word: any; dayId: string; dayLabel: string };
              return (
                <FavoriteCard key={`${dayId}-${word.id}`} name={word.name} pronunciation={word.pronunciation}
                  meaning={word.meaning} dayLabel={dayLabel} itemType="word"
                  onRemove={() => removeFavorite(dayId, word.id)}>
                  <div className="idiom-card-content space-y-3 animate-slide-up">
                    <div className="mt-3"><div className="text-xs font-medium mb-1" style={{ color: 'var(--color-ink-muted)' }}>使用语境</div><div className="text-sm" style={{ color: 'var(--color-ink-secondary)' }}>{word.usageContext}</div></div>
                    {word.examples?.length > 0 && <div><div className="text-xs font-medium mb-1" style={{ color: 'var(--color-ink-muted)' }}>例句</div><ul className="space-y-1">{word.examples.map((ex: any, i: number) => <li key={i} className="text-sm leading-relaxed pl-3" style={{ color: 'var(--color-ink-secondary)', borderLeft: '2px solid var(--color-accent)' }}>{ex.text}{ex.source && <span className="text-xs ml-1" style={{ color: 'var(--color-ink-muted)' }}>— {ex.source}</span>}</li>)}</ul></div>}
                    <div className="rounded-lg p-3" style={{ background: 'var(--color-hairline-light)' }}><div className="text-xs font-medium mb-1" style={{ color: 'var(--color-ink-muted)' }}>一句话总结</div><div className="text-sm font-medium" style={{ color: 'var(--color-ink)' }}>{word.oneLineSummary}</div></div>
                  </div>
                </FavoriteCard>
              );
            }
          })}
        </div>
      )}
    </div>
  );
}
