import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { UserConfig, Tone } from '../types';
import { TONES } from '../types';
import { getMessage } from '../data/messages';
import { saveConfig, logUrge } from '../db';

interface Props {
  config: UserConfig;
  onSave: (config: UserConfig) => void;
}

export function Settings({ config, onSave }: Props) {
  const navigate = useNavigate();
  const [localConfig, setLocalConfig] = useState(config);
  const [resetStep, setResetStep] = useState(0); // 0=none, 1=first warning, 2=second warning, 3=done
  const [resetMessage, setResetMessage] = useState<{ main: string; sub: string } | null>(null);

  const handleSave = async () => {
    await saveConfig(localConfig);
    onSave(localConfig);
    navigate('/');
  };

  const handleReset = async () => {
    if (resetStep === 0) {
      // First attempt: show warning in current tone
      setResetMessage(getMessage(localConfig.tone, 'random', 1));
      setResetStep(1);
    } else if (resetStep === 1) {
      // Second attempt: stronger message
      setResetMessage({
        main: 'それでも本当にリセットするのか？',
        sub: `${Math.floor((Date.now() - new Date(localConfig.quitDate).getTime()) / 86400000)}日分の努力が消える。記録は残る。でも覚悟があるなら、もう一度押せ。`,
      });
      setResetStep(2);
    } else if (resetStep === 2) {
      // Third attempt: execute reset
      await logUrge('random', false);
      const today = new Date().toISOString().split('T')[0];
      const newConfig = { ...localConfig, quitDate: today };
      await saveConfig(newConfig);
      onSave(newConfig);
      setResetStep(3);
    }
  };

  if (resetStep === 3) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] animate-fade-in">
        <div className="text-center space-y-4">
          <div className="text-4xl">🔥</div>
          <p className="text-xl font-light">大丈夫。また始めよう。</p>
          <p className="text-text-muted text-sm">戻ってきたこと自体がすごいこと。</p>
          <button
            onClick={() => navigate('/')}
            className="mt-4 px-8 py-3 rounded-xl bg-primary/10 border border-primary/30
                       text-primary hover:bg-primary/20 transition"
          >
            ホームへ
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-xl font-light">設定</h2>

      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm text-text-muted">禁煙開始日</label>
          <input
            type="date"
            value={localConfig.quitDate}
            onChange={e => setLocalConfig({ ...localConfig, quitDate: e.target.value })}
            className="w-full p-4 bg-surface border border-border rounded-xl text-text
                       focus:outline-none focus:border-primary/50"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm text-text-muted">1日の本数</label>
            <input
              type="number"
              value={localConfig.cigarettesPerDay}
              onChange={e => setLocalConfig({ ...localConfig, cigarettesPerDay: Number(e.target.value) })}
              min={1}
              className="w-full p-4 bg-surface border border-border rounded-xl text-text text-center
                         focus:outline-none focus:border-primary/50"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-text-muted">1箱の値段</label>
            <input
              type="number"
              value={localConfig.pricePerPack}
              onChange={e => setLocalConfig({ ...localConfig, pricePerPack: Number(e.target.value) })}
              min={1}
              className="w-full p-4 bg-surface border border-border rounded-xl text-text text-center
                         focus:outline-none focus:border-primary/50"
            />
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-sm text-text-muted">トーン</label>
          {(Object.entries(TONES) as [Tone, typeof TONES.drill][]).map(([key, val]) => (
            <button
              key={key}
              type="button"
              onClick={() => setLocalConfig({ ...localConfig, tone: key })}
              className={`w-full p-4 rounded-xl border text-left transition-all duration-200 ${
                localConfig.tone === key
                  ? 'bg-primary/10 border-primary/50 text-primary'
                  : 'bg-surface border-border text-text hover:bg-surface-hover'
              }`}
            >
              <div className="font-medium">{val.name}</div>
              <div className="text-sm text-text-muted">{val.description}</div>
            </button>
          ))}
        </div>

        <button
          onClick={handleSave}
          className="w-full py-4 rounded-xl bg-primary text-white font-medium
                     hover:bg-primary-hover transition-all duration-200"
        >
          保存
        </button>
      </div>

      {/* Reset section */}
      <div className="border-t border-border pt-6 space-y-3">
        <p className="text-sm text-text-muted">吸ってしまった場合</p>

        {resetMessage && (
          <div className="bg-surface rounded-xl border border-danger/20 p-5 space-y-2 animate-shake">
            <p className="font-bold text-danger">{resetMessage.main}</p>
            <p className="text-sm text-text-muted">{resetMessage.sub}</p>
          </div>
        )}

        <button
          onClick={handleReset}
          className={`w-full py-3 rounded-xl border text-sm transition-all duration-200 ${
            resetStep === 0
              ? 'border-border text-text-muted hover:border-danger/30 hover:text-danger'
              : resetStep === 1
              ? 'border-danger/30 text-danger hover:bg-danger/10'
              : 'border-danger bg-danger/10 text-danger font-medium'
          }`}
        >
          {resetStep === 0
            ? 'カウンターをリセット'
            : resetStep === 1
            ? 'それでもリセットする'
            : '最終確認 — 本当にリセットする'}
        </button>

        {resetStep > 0 && (
          <button
            onClick={() => { setResetStep(0); setResetMessage(null); }}
            className="w-full py-2 text-sm text-text-muted hover:text-success transition"
          >
            やっぱりやめる（偉い）
          </button>
        )}
      </div>

      {/* Full data reset */}
      <div className="border-t border-border pt-6 space-y-3">
        <p className="text-sm text-text-muted">全データ消去</p>
        <button
          onClick={async () => {
            if (window.confirm('すべてのデータ（設定・衝動ログ）を完全に消去します。\nこの操作は元に戻せません。\n\n本当に消去しますか？')) {
              if (window.confirm('最終確認です。本当に全データを消去しますか？')) {
                const { db } = await import('../db');
                await db.delete();
                window.location.reload();
              }
            }
          }}
          className="w-full py-3 rounded-xl border border-border text-xs text-text-muted
                     hover:border-danger/30 hover:text-danger transition"
        >
          全データを消去する
        </button>
      </div>
    </div>
  );
}
