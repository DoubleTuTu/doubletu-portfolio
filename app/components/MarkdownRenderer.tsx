'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github-dark.css';

interface MarkdownRendererProps {
  content: string;
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <div className="markdown-content prose prose-invert max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={{
          // 标题样式
          h1: ({ node, ...props }) => (
            <h1
              className="font-bangers text-3xl md:text-4xl font-bold mt-8 mb-4 pb-2 border-b border-[var(--border-gold)]"
              style={{
                color: 'var(--dragon-gold)',
                letterSpacing: '1px',
              }}
              {...props}
            />
          ),
          h2: ({ node, ...props }) => (
            <h2
              className="font-bangers text-2xl md:text-3xl font-bold mt-6 mb-3"
              style={{
                color: 'var(--dragon-orange)',
                letterSpacing: '1px',
              }}
              {...props}
            />
          ),
          h3: ({ node, ...props }) => (
            <h3
              className="font-bangers text-xl md:text-2xl font-bold mt-5 mb-2"
              style={{ color: 'var(--text-primary)' }}
              {...props}
            />
          ),

          // 段落样式
          p: ({ node, ...props }) => (
            <p
              className="mb-4 leading-relaxed"
              style={{ color: 'var(--text-secondary)' }}
              {...props}
            />
          ),

          // 链接样式
          a: ({ node, ...props }) => (
            <a
              className="text-[var(--dragon-orange)] hover:text-[var(--dragon-gold)] underline transition-colors"
              {...props}
            />
          ),

          // 列表样式
          ul: ({ node, ...props }) => (
            <ul
              className="list-disc list-inside mb-4 space-y-2"
              style={{ color: 'var(--text-secondary)' }}
              {...props}
            />
          ),
          ol: ({ node, ...props }) => (
            <ol
              className="list-decimal list-inside mb-4 space-y-2"
              style={{ color: 'var(--text-secondary)' }}
              {...props}
            />
          ),

          // 代码块样式
          code: ({ node, inline, ...props }: any) =>
            inline ? (
              <code
                className="px-1.5 py-0.5 rounded text-sm"
                style={{
                  background: 'rgba(255, 107, 0, 0.2)',
                  color: 'var(--dragon-gold)',
                }}
                {...props}
              />
            ) : (
              <code
                className="block p-4 rounded-lg text-sm overflow-x-auto"
                style={{
                  background: 'rgba(20, 20, 20, 0.95)',
                  border: '1px solid var(--border-gold)',
                }}
                {...props}
              />
            ),

          // 引用样式
          blockquote: ({ node, ...props }) => (
            <blockquote
              className="border-l-4 pl-4 italic my-4"
              style={{
                borderColor: 'var(--dragon-orange)',
                color: 'var(--text-secondary)',
              }}
              {...props}
            />
          ),

          // 分隔线样式
          hr: ({ node, ...props }) => (
            <hr
              className="my-6 border-t"
              style={{ borderColor: 'var(--border-gold)' }}
              {...props}
            />
          ),

          // 图片样式
          img: ({ node, ...props }) => (
            <img
              className="rounded-lg my-4 max-w-full h-auto"
              style={{
                border: '1px solid var(--border-gold)',
              }}
              {...props}
            />
          ),

          // 表格样式
          table: ({ node, ...props }) => (
            <div className="overflow-x-auto my-4">
              <table
                className="min-w-full border-collapse rounded-lg overflow-hidden"
                style={{ border: '1px solid var(--border-gold)' }}
                {...props}
              />
            </div>
          ),
          thead: ({ node, ...props }) => (
            <thead
              style={{ background: 'rgba(255, 107, 0, 0.2)' }}
              {...props}
            />
          ),
          th: ({ node, ...props }) => (
            <th
              className="px-4 py-2 text-left font-bold"
              style={{
                color: 'var(--dragon-gold)',
                borderBottom: '1px solid var(--border-gold)',
              }}
              {...props}
            />
          ),
          td: ({ node, ...props }) => (
            <td
              className="px-4 py-2"
              style={{
                color: 'var(--text-secondary)',
                borderBottom: '1px solid var(--border-gold)',
              }}
              {...props}
            />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
