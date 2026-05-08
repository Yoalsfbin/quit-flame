import { describe, it, expect } from 'vitest';
import { TRIGGERS, TONES, HEALTH_MILESTONES } from '../types';

describe('定数データの整合性', () => {
  it('全トリガーに日本語表示名がある', () => {
    const keys = Object.keys(TRIGGERS);
    expect(keys.length).toBe(6);
    for (const val of Object.values(TRIGGERS)) {
      expect(val.length).toBeGreaterThan(0);
    }
  });

  it('全トーンに名前と説明がある', () => {
    const keys = Object.keys(TONES);
    expect(keys.length).toBe(3);
    for (const tone of Object.values(TONES)) {
      expect(tone.name.length).toBeGreaterThan(0);
      expect(tone.description.length).toBeGreaterThan(0);
    }
  });

  it('健康マイルストーンが時間順に並んでいる', () => {
    for (let i = 1; i < HEALTH_MILESTONES.length; i++) {
      expect(HEALTH_MILESTONES[i].hours).toBeGreaterThan(HEALTH_MILESTONES[i - 1].hours);
    }
  });

  it('健康マイルストーンに全てタイトルと説明がある', () => {
    for (const m of HEALTH_MILESTONES) {
      expect(m.title.length).toBeGreaterThan(0);
      expect(m.description.length).toBeGreaterThan(0);
      expect(m.hours).toBeGreaterThan(0);
    }
  });
});
