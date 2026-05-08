/**
 * 肺の回復度をビジュアルで表現するコンポーネント
 * 禁煙日数に応じて煙が薄くなり、肺が澄んでいく
 */
export function LungProgress({ days }: { days: number }) {
  // 0日=100%(煙だらけ) → 90日=0%(クリア) の線形補間
  const smokeOpacity = Math.max(0, 1 - days / 90);
  // 肺の色: グレー → ティール
  const lungHealth = Math.min(1, days / 90);

  return (
    <div className="relative w-full h-32 rounded-2xl overflow-hidden bg-surface border border-border">
      {/* 背景グラデーション: 回復度に応じて変化 */}
      <div
        className="absolute inset-0 transition-all duration-1000"
        style={{
          background: `linear-gradient(180deg,
            rgba(20,184,166,${lungHealth * 0.15}) 0%,
            rgba(20,184,166,${lungHealth * 0.05}) 100%)`,
        }}
      />

      {/* 煙のアニメーション（日数が経つほど薄くなる） */}
      {smokeOpacity > 0.01 && (
        <>
          <div
            className="smoke-particle"
            style={{ '--delay': '0s', '--x': '20%', opacity: smokeOpacity } as React.CSSProperties}
          />
          <div
            className="smoke-particle"
            style={{ '--delay': '1.5s', '--x': '50%', opacity: smokeOpacity } as React.CSSProperties}
          />
          <div
            className="smoke-particle"
            style={{ '--delay': '3s', '--x': '75%', opacity: smokeOpacity } as React.CSSProperties}
          />
        </>
      )}

      {/* 中央テキスト */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
        <div className="text-3xl">
          {days < 3 ? '🫁' : days < 14 ? '💨' : days < 30 ? '🌤' : days < 90 ? '☀️' : '✨'}
        </div>
        <div className="text-xs text-text-muted mt-1">
          {days < 3
            ? '解毒中...'
            : days < 14
            ? '回復し始めている'
            : days < 30
            ? '呼吸が楽になってきた'
            : days < 90
            ? '肺機能が改善中'
            : 'きれいな肺を取り戻した'}
        </div>
        <div className="text-xs font-medium mt-1" style={{ color: `rgba(20,184,166,${0.3 + lungHealth * 0.7})` }}>
          回復度 {Math.round(lungHealth * 100)}%
        </div>
      </div>
    </div>
  );
}
