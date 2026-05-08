import { useState, useEffect, useCallback } from "react";
import type { UserConfig } from "../types";
import { MINUTES_LOST_PER_CIGARETTE, MS_PER_DAY, MS_PER_HOUR } from "../types";
import { getConfig, saveConfig } from "../db";

/** ユーザー設定の読み込み・保存を管理するフック */
export function useConfig() {
  const [config, setConfig] = useState<UserConfig | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getConfig().then((c) => {
      setConfig(c);
      setLoading(false);
    });
  }, []);

  const save = useCallback(async (c: UserConfig) => {
    await saveConfig(c);
    setConfig(c);
  }, []);

  return { config, loading, save };
}

/** 禁煙統計の計算結果 */
export interface QuitStats {
  /** 禁煙日数（整数） */
  days: number;
  /** 禁煙時間（整数） */
  hours: number;
  /** 回避した喫煙本数 */
  cigarettesAvoided: number;
  /** 節約金額（円） */
  moneySaved: number;
  /** 延びた寿命（分） */
  minutesSaved: number;
}

/** ユーザー設定から禁煙統計を算出 */
export function calcStats(config: UserConfig): QuitStats {
  // ローカル日付として扱う（UTCズレ防止）
  const start = new Date(config.quitDate + "T00:00:00");

  const now = Date.now();
  const elapsedMs = Math.max(0, now - start.getTime());
  const elapsedDays = elapsedMs / MS_PER_DAY;

  const days = Math.floor(elapsedDays);

  const cigarettesAvoided = days * config.cigarettesPerDay;

  const moneySaved = Math.floor(
    (cigarettesAvoided / config.cigarettesPerPack) * config.pricePerPack,
  );

  const minutesSaved = cigarettesAvoided * MINUTES_LOST_PER_CIGARETTE;

  return {
    days,
    hours: Math.floor(elapsedMs / MS_PER_HOUR),
    cigarettesAvoided,
    moneySaved,
    minutesSaved,
  };
}
