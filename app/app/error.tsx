'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0a0a0a] text-white gap-6">
      <h2 className="font-bangers text-4xl bg-gradient-to-r from-[#ffd700] to-[#ff6b00] bg-clip-text text-transparent">
        出错了！
      </h2>
      <p className="text-[var(--text-secondary)]">能量不足，请稍后重试</p>
      <button
        onClick={reset}
        className="px-6 py-3 rounded-full font-bold text-white"
        style={{
          background: 'linear-gradient(135deg, #ff6b00 0%, #e67300 100%)',
          boxShadow: '0 0 20px rgba(255, 107, 0, 0.6)',
        }}
      >
        重新加载
      </button>
    </div>
  );
}
