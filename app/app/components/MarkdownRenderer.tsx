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
    <div
      className="markdown-content prose prose-invert max-w-none"
      style={{
        lineHeight: '1.8',
      }}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={{
          // 标题样式 - 使用七龙珠主题渐变
          h1: ({ node, ...props }) => (
            <h1
              className="font-bangers text-3xl md:text-4xl font-bold mt-8 mb-6 pb-3 animate-fade-in-up"
              style={{
                background: 'linear-gradient(135deg, var(--dragon-gold) 0%, var(--dragon-orange) 50%, #ff4444 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                letterSpacing: '2px',
                borderBottom: '1px solid var(--border-gold)',
                textShadow: '0 0 20px var(--dragon-orange-glow)',
              }}
              {...props}
            />
          ),
          h2: ({ node, ...props }) => (
            <h2
              className="font-bangers text-2xl md:text-3xl font-bold mt-8 mb-4 animate-fade-in-up"
              style={{
                color: 'var(--dragon-orange)',
                letterSpacing: '1.5px',
                position: 'relative',
                paddingLeft: '16px',
              }}
              {...props}
            >
              <style jsx>{`
                h2::before {
                  content: '▌';
                  position: absolute;
                  left: 0;
                  color: var(--dragon-gold);
                }
              `}</style>
              {props.children}
            </h2>
          ),
          h3: ({ node, ...props }) => (
            <h3
              className="font-zcool text-xl md:text-2xl font-bold mt-6 mb-3"
              style={{
                color: 'var(--text-primary)',
                letterSpacing: '1px',
              }}
              {...props}
            />
          ),

          // 段落样式 - 增强可读性
          p: ({ node, ...props }) => (
            <p
              className="mb-5 leading-loose"
              style={{
                color: 'var(--text-secondary)',
                fontSize: 'clamp(14px, 1.5vw, 16px)',
              }}
              {...props}
            />
          ),

          // 链接样式 - 龙珠风格
          a: ({ node, ...props }) => (
            <a
              className="relative inline-block transition-all duration-300 hover:scale-105"
              style={{
                color: 'var(--dragon-orange)',
                textDecoration: 'underline',
                textDecorationColor: 'var(--dragon-gold)',
                textUnderlineOffset: '4px',
              }}
              {...props}
            />
          ),

          // 列表样式 - 添加龙珠风格标记
          ul: ({ node, ...props }) => (
            <ul
              className="list-none mb-5 space-y-3"
              style={{ color: 'var(--text-secondary)' }}
              {...props}
            />
          ),
          li: ({ node, ...props }) => (
            <li
              className="relative pl-6"
              style={{ display: 'list-item' }}
              {...props}
            >
              <style jsx>{`
                li::before {
                  content: '◆';
                  position: absolute;
                  left: 0;
                  color: var(--dragon-gold);
                  font-size: 0.5em;
                  top: 0.4em;
                }
              `}</style>
              {props.children}
            </li>
          ),
          ol: ({ node, ...props }) => (
            <ol
              className="list-decimal list-inside mb-5 space-y-3"
              style={{
                color: 'var(--text-secondary)',
                paddingLeft: '20px',
              }}
              {...props}
            />
          ),

          // 代码块样式 - 龙珠主题
          code: ({ node, inline, ...props }: any) =>
            inline ? (
              <code
                className="px-2 py-1 rounded text-sm font-mono transition-all hover:scale-105 inline-block"
                style={{
                  background: 'rgba(255, 107, 0, 0.15)',
                  color: 'var(--dragon-gold)',
                  border: '1px solid var(--border-gold)',
                }}
                {...props}
              />
            ) : (
              <code
                className="block p-5 rounded-lg text-sm overflow-x-auto font-mono my-5"
                style={{
                  background: 'rgba(10, 10, 10, 0.98)',
                  border: '1px solid var(--border-gold)',
                  boxShadow: '0 4px 20px rgba(255, 107, 0, 0.1)',
                }}
                {...props}
              />
            ),

          // 引用样式 - 龙珠主题
          blockquote: ({ node, ...props }) => (
            <blockquote
              className="border-l-4 pl-5 py-3 my-5 rounded-r-lg italic"
              style={{
                borderLeftColor: 'var(--dragon-orange)',
                background: 'rgba(255, 107, 0, 0.05)',
                color: 'var(--text-secondary)',
              }}
              {...props}
            />
          ),

          // 分隔线样式 - 龙珠能量效果
          hr: ({ node, ...props }) => (
            <hr
              className="my-8 border-t"
              style={{
                borderColor: 'var(--border-gold)',
                backgroundImage: 'linear-gradient(90deg, transparent, var(--dragon-gold), transparent)',
                borderWidth: '2px',
              }}
              {...props}
            />
          ),

          // 图片样式 - 添加光晕效果
          img: ({ node, ...props }) => (
            <img
              className="rounded-lg my-6 max-w-full h-auto transition-transform hover:scale-105"
              style={{
                border: '1px solid var(--border-gold)',
                boxShadow: '0 4px 20px rgba(255, 107, 0, 0.2)',
              }}
              {...props}
            />
          ),

          // 表格样式 - 龙珠主题
          table: ({ node, ...props }) => (
            <div className="overflow-x-auto my-6 rounded-lg overflow-hidden">
              <table
                className="min-w-full border-collapse"
                style={{ border: '1px solid var(--border-gold)' }}
                {...props}
              />
            </div>
          ),
          thead: ({ node, ...props }) => (
            <thead
              style={{
                background: 'linear-gradient(135deg, rgba(255, 107, 0, 0.3), rgba(255, 215, 0, 0.2))',
              borderBottom: '2px solid var(--dragon-gold)',
              color: 'var(--dragon-gold)',
              fontWeight: 'bold',
              letterSpacing: '1px',
              }}
              {...props}
            />
          ),
          th: ({ node, ...props }) => (
            <th
              className="px-4 py-3 text-left"
              style={{
                borderBottom: '1px solid var(--border-gold)',
                padding: '12px 16px',
              }}
              {...props}
            />
          ),
          td: ({ node, ...props }) => (
            <td
              className="px-4 py-3"
              style={{
                color: 'var(--text-secondary)',
                borderBottom: '1px solid var(--border-gold)',
                padding: '12px 16px',
              }}
              {...props}
            />
          ),

          // 强调样式
          strong: ({ node, ...props }) => (
            <strong
              style={{
                color: 'var(--dragon-gold)',
                fontWeight: 'bold',
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
