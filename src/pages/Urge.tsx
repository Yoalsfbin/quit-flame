import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { UserConfig, Trigger } from '../types';
import { TRIGGERS } from '../types';
import { getMessage } from '../data/messages';
import { logUrge } from '../db';
import { calcStats } from '../hooks/useConfig';
import { BreathingGuide } from '../components/BreathingGuide';

interface Props {
  config: UserConfig;
}

export function Urge({ config }: Props) {
  const navigate = useNavigate();
  const [step, setStep] = useState<'trigger' | 'message'>('trigger');
  const [trigger, setTrigger] = useState<Trigger | null>(null);
  const [message, setMessage] = useState<{ main: string; sub: string } | null>(null);
  const [celebrated, setCelebrated] = useState(false);
  const [showBreathing, setShowBreathing] = useState(false);
  const stats = calcStats(config);

  const selectTrigger = (t: Trigger) => {
    setTrigger(t);
    setMessage(getMessage(config.tone, t, stats.days));
    setStep('message');
  };

  const handleResisted = async () => {
    if (trigger) await logUrge(trigger, true);
    setCelebrated(true);
    setTimeout(() => navigate('/'), 2000);
  };

  const handleAnotherOne = () => {
    if (trigger) setMessage(getMessage(config.tone, trigger, stats.days));
  };

  if (celebrated) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] animate-celebrate">
        <div className="text-center space-y-4">
          <div className="text-6xl">💪</div>
          <p className="text-xl text-primary font-medium">勝った。</p>
          <p className="text-text-muted text-sm">また1つ乗り越えた。</p>
        </div>
      </div>
    );
  }

  if (step === 'trigger') {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="text-center space-y-2 pt-4">
          <p className="text-xl font-light">何がきっかけ？</p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {(Object.entries(TRIGGERS) as [Trigger, string][]).map(([key, label]) => (
            <button
              key={key}
              onClick={() => selectTrigger(key)}
              className="p-5 bg-surface rounded-xl border border-border
                         hover:bg-surface-hover hover:border-primary/30
                         transition-all duration-200 text-lg min-h-[64px]"
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {message && (
        <div className="bg-surface rounded-2xl border border-primary/20 p-6 sm:p-8 space-y-4 mt-4">
          <p className="text-xl sm:text-2xl font-bold leading-relaxed animate-shake">
            {message.main}
          </p>
          <p className="text-text-muted leading-relaxed">
            {message.sub}
          </p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={handleResisted}
          className="py-4 rounded-xl bg-success/10 border border-success/30
                     text-success font-medium hover:bg-success/20 transition-all duration-200
                     min-h-[56px]"
        >
          耐えた 💪
        </button>
        <button
          onClick={handleAnotherOne}
          className="py-4 rounded-xl bg-primary/10 border border-primary/30
                     text-primary font-medium hover:bg-primary/20 transition-all duration-200
                     min-h-[56px]"
        >
          もう1発
        </button>
      </div>

      {/* 呼吸法ガイドへのリンク */}
      <button
        onClick={() => setShowBreathing(true)}
        className="w-full py-3 text-sm text-text-muted hover:text-primary transition"
      >
        深呼吸する（4秒呼吸法）
      </button>

      {showBreathing && <BreathingGuide onClose={() => setShowBreathing(false)} />}
    </div>
  );
}
