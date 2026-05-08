import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import type { UserConfig } from '../types';
import { HEALTH_MILESTONES } from '../types';
import { calcStats } from '../hooks/useConfig';
import { getUrgeStats } from '../db';
import { LungProgress } from '../components/LungProgress';
import { SavedJar } from '../components/SavedJar';

interface Props {
  config: UserConfig;
}

/** 数値のカウントアップアニメーション */
function AnimatedNumber({ value, suffix = '' }: { value: number; suffix?: string }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    const duration = 1000;
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      setDisplay(Math.floor(eased * value));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [value]);
  return <span>{display.toLocaleString()}{suffix}</span>;
}

/** ホーム画面 — 禁煙ダッシュボード */
export function Home({ config }: Props) {
  const navigate = useNavigate();
  const stats = calcStats(config);
  const [resistedCount, setResistedCount] = useState(0);

  useEffect(() => {
    getUrgeStats().then(s => setResistedCount(s.resisted));
  }, []);

  /** 分数を「N分」「N時間」「N日」に変換 */
  const formatTime = (minutes: number) => {
    if (minutes < 60) return `${minutes}分`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}時間`;
    const days = Math.floor(hours / 24);
    return `${days}日`;
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Day counter */}
      <div className="text-center space-y-2 pt-4">
        <div className="text-6xl sm:text-7xl font-bold text-primary animate-count-up">
          <AnimatedNumber value={stats.days} />
        </div>
        <p className="text-text-muted">日目</p>
      </div>

      {/* Lung recovery visualization */}
      <LungProgress days={stats.days} />

      {/* Stats cards */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-surface rounded-xl border border-border p-4 text-center space-y-1">
          <div className="text-xl font-semibold text-success">
            <AnimatedNumber value={stats.moneySaved} suffix="円" />
          </div>
          <div className="text-xs text-text-muted">節約</div>
        </div>
        <div className="bg-surface rounded-xl border border-border p-4 text-center space-y-1">
          <div className="text-xl font-semibold text-gold">
            <AnimatedNumber value={stats.cigarettesAvoided} suffix="本" />
          </div>
          <div className="text-xs text-text-muted">回避</div>
        </div>
        <div className="bg-surface rounded-xl border border-border p-4 text-center space-y-1">
          <div className="text-xl font-semibold text-primary">
            {formatTime(stats.minutesSaved)}
          </div>
          <div className="text-xs text-text-muted">寿命+</div>
        </div>
      </div>

      {/* Saved money jar */}
      <SavedJar amount={stats.moneySaved} />

      {/* Urge button */}
      <button
        onClick={() => navigate('/urge')}
        className="w-full py-5 rounded-2xl bg-primary/10 border-2 border-primary/40
                   text-primary text-xl font-bold
                   hover:bg-primary/20 transition-all duration-300
                   animate-pulse-glow min-h-[64px]"
      >
        吸いたい！
      </button>

      {/* Resisted count */}
      {resistedCount > 0 && (
        <div className="text-center text-sm text-text-muted">
          衝動に <span className="text-primary font-medium">{resistedCount}回</span> 勝った
        </div>
      )}

      {/* Health timeline */}
      <div className="space-y-3">
        <h3 className="text-sm text-text-muted font-medium">体の回復</h3>
        <div className="space-y-2">
          {HEALTH_MILESTONES.map((m, i) => {
            const achieved = stats.hours >= m.hours;
            return (
              <div
                key={i}
                className={`flex items-start gap-3 p-3 rounded-xl border transition-all duration-500 ${
                  achieved
                    ? 'bg-success/5 border-success/20'
                    : 'bg-surface border-border opacity-50'
                }`}
              >
                <span className="text-lg mt-0.5">{achieved ? '✅' : '🔲'}</span>
                <div>
                  <div className={`text-sm font-medium ${achieved ? 'text-success' : 'text-text-muted'}`}>
                    {m.title}
                  </div>
                  <div className="text-xs text-text-muted">{m.description}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Navigation */}
      <div className="grid grid-cols-2 gap-3 pb-4">
        <button
          onClick={() => navigate('/log')}
          className="p-4 bg-surface rounded-xl border border-border
                     hover:bg-surface-hover transition text-sm text-text-muted"
        >
          衝動ログ
        </button>
        <button
          onClick={() => navigate('/settings')}
          className="p-4 bg-surface rounded-xl border border-border
                     hover:bg-surface-hover transition text-sm text-text-muted"
        >
          設定
        </button>
      </div>
    </div>
  );
}
