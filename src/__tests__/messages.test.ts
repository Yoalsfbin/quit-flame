import { describe, it, expect } from 'vitest';
import { getMessage } from '../data/messages';
import type { Tone, Trigger } from '../types';

const TONES: Tone[] = ['drill', 'friend', 'doctor'];
const TRIGGERS: Trigger[] = ['stress', 'bored', 'drinking', 'after_meal', 'morning', 'random'];

describe('getMessage', () => {
  it('全トーン×全トリガー×全フェーズでメッセージが返る', () => {
    for (const tone of TONES) {
      for (const trigger of TRIGGERS) {
        for (const days of [1, 15, 60]) {
          const msg = getMessage(tone, trigger, days);
          expect(msg).toBeDefined();
          expect(msg.main).toBeTruthy();
          expect(msg.sub).toBeTruthy();
        }
      }
    }
  });

  it('early（0-7日）のメッセージが返る', () => {
    const msg = getMessage('drill', 'stress', 3);
    expect(msg.main.length).toBeGreaterThan(0);
  });

  it('mid（8-30日）のメッセージが返る', () => {
    const msg = getMessage('friend', 'bored', 20);
    expect(msg.main.length).toBeGreaterThan(0);
  });

  it('late（31日以降）のメッセージが返る', () => {
    const msg = getMessage('doctor', 'drinking', 90);
    expect(msg.main.length).toBeGreaterThan(0);
  });

  it('同じ条件で複数回呼んでもクラッシュしない', () => {
    for (let i = 0; i < 100; i++) {
      const msg = getMessage('drill', 'random', 5);
      expect(msg).toBeDefined();
    }
  });
});
