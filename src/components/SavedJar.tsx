/**
 * 節約金額を「瓶に貯まるお金」として視覚化するコンポーネント
 * 金額が増えるほど瓶が満たされていく
 */
export function SavedJar({ amount }: { amount: number }) {
  // 目標: 10万円で満タン
  const TARGET = 100_000;
  const fillPercent = Math.min(100, (amount / TARGET) * 100);

  // 金額に応じたラベル
  const getReward = () => {
    if (amount < 1000) return null;
    if (amount < 5000) return 'ランチ数回分';
    if (amount < 10000) return '美味しいディナー1回分';
    if (amount < 30000) return '新しい服が買える';
    if (amount < 50000) return '旅行の足しになる';
    if (amount < 100000) return '家電が買える';
    return '海外旅行に行ける';
  };

  const reward = getReward();

  return (
    <div className="bg-surface rounded-xl border border-border p-4 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm text-text-muted">貯金箱</span>
        <span className="text-xs text-text-muted">{Math.round(fillPercent)}%</span>
      </div>

      {/* 瓶のビジュアル */}
      <div className="relative h-4 bg-border rounded-full overflow-hidden">
        <div
          className="absolute inset-y-0 left-0 rounded-full transition-all duration-1000 ease-out"
          style={{
            width: `${fillPercent}%`,
            background: 'linear-gradient(90deg, #14b8a6, #22c55e)',
          }}
        />
      </div>

      {/* ご褒美ラベル */}
      {reward && (
        <p className="text-xs text-text-muted text-center">
          💰 {reward}
        </p>
      )}
    </div>
  );
}
