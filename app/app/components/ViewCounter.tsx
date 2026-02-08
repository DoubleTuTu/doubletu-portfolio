'use client';

import { useEffect, useState } from 'react';

interface ViewCounterProps {
  slug: string;
  initialCount: number;
}

export function ViewCounter({ slug, initialCount }: ViewCounterProps) {
  const [count, setCount] = useState(initialCount);
  const [hasIncremented, setHasIncremented] = useState(false);

  useEffect(() => {
    // 只在首次挂载时增加阅读量
    if (!hasIncremented) {
      fetch('/api/articles/view', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug }),
      })
        .then(res => res.json())
        .then(data => {
          if (data.viewCount !== undefined) {
            setCount(data.viewCount);
          }
        })
        .catch(console.error)
        .finally(() => {
          setHasIncremented(true);
        });
    }
  }, [slug, hasIncremented]);

  return (
    <span className="flex items-center gap-1">
      👁 阅读量：{count}
    </span>
  );
}
