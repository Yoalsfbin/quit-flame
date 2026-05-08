import Dexie, { type Table } from 'dexie';
import type { UserConfig, UrgeLog } from './types';

/**
 * QuitFlame のローカルデータベース
 * すべてのデータはブラウザの IndexedDB に保存され、外部送信されない
 */
class QuitFlameDB extends Dexie {
  config!: Table<UserConfig & { id: number }>;
  urges!: Table<UrgeLog>;

  constructor() {
    super('quit-flame');
    this.version(1).stores({
      config: 'id',
      urges: '++id, timestamp, trigger',
    });
  }
}

export const db = new QuitFlameDB();

/** ユーザー設定を取得（未設定の場合は null） */
export async function getConfig(): Promise<UserConfig | null> {
  const row = await db.config.get(1);
  return row ?? null;
}

/** ユーザー設定を保存（upsert） */
export async function saveConfig(config: UserConfig): Promise<void> {
  await db.config.put({ ...config, id: 1 });
}

/** 衝動ログを1件追加 */
export async function logUrge(trigger: UrgeLog['trigger'], resisted: boolean): Promise<void> {
  await db.urges.add({ trigger, timestamp: Date.now(), resisted });
}

/** 衝動ログを全件取得（新しい順） */
export async function getUrges(): Promise<UrgeLog[]> {
  return db.urges.orderBy('timestamp').reverse().toArray();
}

/** 衝動ログの集計統計 */
export async function getUrgeStats() {
  const all = await db.urges.toArray();
  const resisted = all.filter(u => u.resisted).length;

  const triggerCounts: Record<string, number> = {};
  for (const u of all) {
    triggerCounts[u.trigger] = (triggerCounts[u.trigger] ?? 0) + 1;
  }

  return { total: all.length, resisted, triggerCounts };
}
