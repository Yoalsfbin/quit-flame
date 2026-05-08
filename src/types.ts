/** 励ましメッセージのトーン */
export type Tone = 'drill' | 'friend' | 'doctor';

/** 喫煙衝動のトリガー（きっかけ） */
export type Trigger = 'stress' | 'bored' | 'drinking' | 'after_meal' | 'morning' | 'random';

/** 禁煙フェーズ: early=0-7日, mid=8-30日, late=31日以降 */
export type Phase = 'early' | 'mid' | 'late';

/** ユーザー設定（IndexedDBに永続化） */
export interface UserConfig {
  /** 禁煙開始日（ISO形式: "2026-05-08"） */
  quitDate: string;
  /** 禁煙前の1日の喫煙本数 */
  cigarettesPerDay: number;
  /** 1箱の価格（円） */
  pricePerPack: number;
  /** 1箱あたりの本数 */
  cigarettesPerPack: number;
  /** 選択中のメッセージトーン */
  tone: Tone;
}

/** 衝動ログの1レコード */
export interface UrgeLog {
  id?: number;
  /** 衝動のトリガー */
  trigger: Trigger;
  /** 記録日時（Unix timestamp） */
  timestamp: number;
  /** 耐えたかどうか */
  resisted: boolean;
}

/** 健康回復のマイルストーン */
export interface HealthMilestone {
  /** 禁煙開始からの経過時間（時間単位） */
  hours: number;
  /** マイルストーンのタイトル */
  title: string;
  /** 補足説明 */
  description: string;
}

/** トリガーの日本語表示名 */
export const TRIGGERS: Record<Trigger, string> = {
  stress: 'ストレス',
  bored: '暇',
  drinking: '飲み会',
  after_meal: '食後',
  morning: '朝イチ',
  random: 'なんとなく',
};

/** トーンの定義 */
export const TONES: Record<Tone, { name: string; description: string }> = {
  drill: { name: '鬼教官', description: '容赦なし。甘えを許さない。' },
  friend: { name: '毒舌の親友', description: '厳しいけど愛がある。' },
  doctor: { name: '冷静な医者', description: '事実で殴る。感情抜き。' },
};

/**
 * 禁煙後の健康回復タイムライン
 * 出典: WHO, American Cancer Society 等の公開情報に基づく一般的な目安
 */
export const HEALTH_MILESTONES: HealthMilestone[] = [
  { hours: 0.33, title: '血圧・心拍数が正常化', description: '血管が広がり始めている' },
  { hours: 8, title: '血中酸素レベル正常化', description: '一酸化炭素レベルが半減' },
  { hours: 24, title: '心臓発作リスク低下開始', description: '一酸化炭素が体内から排出' },
  { hours: 48, title: '味覚・嗅覚が回復し始める', description: '神経末端が再生を開始' },
  { hours: 72, title: 'ニコチンが体内から消失', description: '気管支が弛緩し呼吸が楽に' },
  { hours: 336, title: '睡眠の質が改善', description: '2週間 — 血液循環が改善' },
  { hours: 720, title: '肺機能が改善し始める', description: '1ヶ月 — 咳や息切れが減少' },
  { hours: 2160, title: '肺機能が最大30%回復', description: '3ヶ月 — 運動が楽になる' },
  { hours: 4320, title: '心臓病リスクが半減', description: '6ヶ月' },
  { hours: 8760, title: '肺がんリスクが半減', description: '1年' },
];

/** 1本あたりの寿命短縮（分）— 医学研究の一般的な推計値 */
export const MINUTES_LOST_PER_CIGARETTE = 11;

/** ミリ秒→日数の変換定数 */
export const MS_PER_DAY = 86_400_000;
export const MS_PER_HOUR = 3_600_000;
