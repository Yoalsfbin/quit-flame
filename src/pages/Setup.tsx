import { useState } from 'react';
import type { UserConfig, Tone } from '../types';
import { TONES } from '../types';

interface Props {
  onSave: (config: UserConfig) => void;
}

export function Setup({ onSave }: Props) {
  const today = new Date().toISOString().split('T')[0];
  const [quitDate, setQuitDate] = useState(today);
  const [cigarettesPerDay, setCigarettesPerDay] = useState(20);
  const [pricePerPack, setPricePerPack] = useState(600);
  const cigarettesPerPack = 20;
  const [tone, setTone] = useState<Tone>('drill');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ quitDate, cigarettesPerDay, pricePerPack, cigarettesPerPack, tone });
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="text-center space-y-2 pt-8">
        <h2 className="text-2xl font-light">
          <span className="text-primary">Quit</span>Flame
        </h2>
        <p className="text-text-muted text-sm">禁煙を始めよう</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm text-text-muted">禁煙開始日</label>
          <input
            type="date"
            value={quitDate}
            onChange={e => setQuitDate(e.target.value)}
            max={today}
            className="w-full p-4 bg-surface border border-border rounded-xl text-text
                       focus:outline-none focus:border-primary/50"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm text-text-muted">1日の本数</label>
            <input
              type="number"
              value={cigarettesPerDay}
              onChange={e => setCigarettesPerDay(Number(e.target.value))}
              min={1}
              className="w-full p-4 bg-surface border border-border rounded-xl text-text text-center
                         focus:outline-none focus:border-primary/50"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-text-muted">1箱の値段</label>
            <input
              type="number"
              value={pricePerPack}
              onChange={e => setPricePerPack(Number(e.target.value))}
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
              onClick={() => setTone(key)}
              className={`w-full p-4 rounded-xl border text-left transition-all duration-200 ${
                tone === key
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
          type="submit"
          className="w-full py-4 rounded-xl bg-primary text-white font-medium
                     hover:bg-primary-hover transition-all duration-200 text-lg"
        >
          始める
        </button>
      </form>
    </div>
  );
}
