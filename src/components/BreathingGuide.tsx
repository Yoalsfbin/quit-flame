import { useState, useEffect } from 'react';

/**
 * 呼吸法ガイド — 衝動モードで「深呼吸しろ」と言われた時に使える
 * 4秒吸って → 4秒止めて → 4秒吐くの「ボックスブリージング」
 */
export function BreathingGuide({ onClose }: { onClose: () => void }) {
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [count, setCount] = useState(4);
  const [cycles, setCycles] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCount(prev => {
        if (prev <= 1) {
          setPhase(p => {
            if (p === 'inhale') return 'hold';
            if (p === 'hold') return 'exhale';
            setCycles(c => c + 1);
            return 'inhale';
          });
          return 4;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const phaseText = { inhale: '吸って', hold: '止めて', exhale: '吐いて' };
  const phaseScale = { inhale: 'scale-110', hold: 'scale-110', exhale: 'scale-90' };

  return (
    <div className="fixed inset-0 bg-bg/90 flex items-center justify-center z-50 animate-fade-in">
      <div className="text-center space-y-8">
        {/* 呼吸の円 */}
        <div
          className={`w-40 h-40 rounded-full border-2 border-primary/40
                      flex items-center justify-center mx-auto
                      transition-transform duration-1000 ease-in-out
                      ${phaseScale[phase]}`}
          style={{
            background: `radial-gradient(circle, rgba(20,184,166,0.15) 0%, transparent 70%)`,
          }}
        >
          <div className="text-center">
            <div className="text-3xl font-light text-primary">{count}</div>
            <div className="text-sm text-text-muted">{phaseText[phase]}</div>
          </div>
        </div>

        <div className="text-xs text-text-muted">
          {cycles < 3 ? `${3 - cycles}サイクル残り` : '落ち着いた？'}
        </div>

        <button
          onClick={onClose}
          className="px-6 py-3 rounded-xl border border-border text-text-muted
                     hover:bg-surface transition text-sm min-h-[44px]"
        >
          {cycles >= 3 ? '戻る' : 'スキップ'}
        </button>
      </div>
    </div>
  );
}
