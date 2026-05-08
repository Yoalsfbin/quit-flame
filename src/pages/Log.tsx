import { useEffect, useState } from 'react';
import type { UrgeLog } from '../types';
import { TRIGGERS } from '../types';
import { getUrges, getUrgeStats } from '../db';

/** 衝動ログ画面 — いつ・どんな状況で吸いたくなったかの記録 */
export function Log() {
  const [urges, setUrges] = useState<UrgeLog[]>([]);
  const [stats, setStats] = useState({ total: 0, resisted: 0, triggerCounts: {} as Record<string, number> });

  useEffect(() => {
    getUrges().then(setUrges);
    getUrgeStats().then(setStats);
  }, []);

  /** タイムスタンプを "5/8 14:30" 形式にフォーマット */
  const formatDate = (ts: number) => {
    const d = new Date(ts);
    return `${d.getMonth() + 1}/${d.getDate()} ${d.getHours()}:${String(d.getMinutes()).padStart(2, '0')}`;
  };

  const topTrigger = Object.entries(stats.triggerCounts).sort((a, b) => b[1] - a[1])[0];

  return (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-xl font-light">衝動ログ</h2>

      {stats.total > 0 && (
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-surface rounded-xl border border-border p-4 text-center">
            <div className="text-2xl font-bold text-success">{stats.resisted}</div>
            <div className="text-xs text-text-muted">耐えた回数</div>
          </div>
          <div className="bg-surface rounded-xl border border-border p-4 text-center">
            <div className="text-2xl font-bold text-primary">
              {topTrigger ? TRIGGERS[topTrigger[0] as keyof typeof TRIGGERS] : '-'}
            </div>
            <div className="text-xs text-text-muted">最多トリガー</div>
          </div>
        </div>
      )}

      {urges.length === 0 ? (
        <p className="text-center text-text-muted py-12 text-sm">
          まだ記録がありません
        </p>
      ) : (
        <div className="space-y-2">
          {urges.slice(0, 50).map(u => (
            <div
              key={u.id}
              className="flex items-center justify-between p-3 bg-surface rounded-xl border border-border"
            >
              <div className="flex items-center gap-3">
                <span className={u.resisted ? 'text-success' : 'text-danger'}>
                  {u.resisted ? '💪' : '🚬'}
                </span>
                <div>
                  <div className="text-sm">{TRIGGERS[u.trigger]}</div>
                  <div className="text-xs text-text-muted">{formatDate(u.timestamp)}</div>
                </div>
              </div>
              <span className={`text-xs ${u.resisted ? 'text-success' : 'text-danger'}`}>
                {u.resisted ? '耐えた' : 'リセット'}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
