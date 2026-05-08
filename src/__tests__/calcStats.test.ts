import { describe, it, expect, vi } from 'vitest';
import { calcStats } from '../hooks/useConfig';
import type { UserConfig } from '../types';

/** テスト用のデフォルト設定 */
const baseConfig: UserConfig = {
  quitDate: '2026-05-01',
  cigarettesPerDay: 20,
  pricePerPack: 600,
  cigarettesPerPack: 20,
  tone: 'drill',
};

describe('calcStats', () => {
  it('禁煙0日目は全て0', () => {
    const now = new Date('2026-05-01T00:00:00').getTime();
    vi.setSystemTime(now);

    const stats = calcStats(baseConfig);
    expect(stats.days).toBe(0);
    expect(stats.cigarettesAvoided).toBe(0);
    expect(stats.moneySaved).toBe(0);
    expect(stats.minutesSaved).toBe(0);

    vi.useRealTimers();
  });

  it('禁煙1日で正しく計算される', () => {
    const now = new Date('2026-05-02T00:00:00').getTime();
    vi.setSystemTime(now);

    const stats = calcStats(baseConfig);
    expect(stats.days).toBe(1);
    expect(stats.cigarettesAvoided).toBe(20);
    // 20本 / 20本入り * 600円 = 600円
    expect(stats.moneySaved).toBe(600);
    // 20本 * 11分 = 220分
    expect(stats.minutesSaved).toBe(220);

    vi.useRealTimers();
  });

  it('禁煙30日で正しく計算される', () => {
    const now = new Date('2026-05-31T00:00:00').getTime();
    vi.setSystemTime(now);

    const stats = calcStats(baseConfig);
    expect(stats.days).toBe(30);
    expect(stats.cigarettesAvoided).toBe(600);
    expect(stats.moneySaved).toBe(18000);

    vi.useRealTimers();
  });

  it('未来の禁煙開始日は全て0', () => {
    const now = new Date('2026-04-30T00:00:00').getTime();
    vi.setSystemTime(now);

    const stats = calcStats(baseConfig);
    expect(stats.days).toBe(0);
    expect(stats.cigarettesAvoided).toBe(0);

    vi.useRealTimers();
  });

  it('1日10本・1箱500円で正しく計算される', () => {
    const now = new Date('2026-05-11T00:00:00').getTime();
    vi.setSystemTime(now);

    const config: UserConfig = {
      ...baseConfig,
      cigarettesPerDay: 10,
      pricePerPack: 500,
    };
    const stats = calcStats(config);
    expect(stats.days).toBe(10);
    expect(stats.cigarettesAvoided).toBe(100);
    // 100本 / 20本入り * 500円 = 2500円
    expect(stats.moneySaved).toBe(2500);

    vi.useRealTimers();
  });
});
