'use client';

import { useState, useRef, useEffect } from 'react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function AIWidget() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: '你好！我是 Double兔 的 AI 助手，有什么可以帮你的吗？',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 自动滚动到底部
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // 显示 Toast 提示
  const showToastMsg = (msg: string) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  // 发送消息
  const handleSend = async () => {
    const trimmedInput = input.trim();
    if (!trimmedInput) {
      showToastMsg('请输入问题');
      return;
    }
    if (isLoading) {
      showToastMsg('正在发送中，请稍候');
      return;
    }

    // 添加用户消息
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: trimmedInput,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // 调用 API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: trimmedInput }),
      });

      if (!response.ok) {
        throw new Error('API 请求失败');
      }

      const data = await response.json();

      // 添加 AI 回复
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.reply || '抱歉，我暂时无法回答这个问题。',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      showToastMsg('网络异常，请稍后重试');
      // 添加错误消息
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '抱歉，网络异常，请稍后重试。',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Enter 发送
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* 展开状态 */}
      {isExpanded && (
        <div
          className="fixed z-50 rounded-2xl overflow-hidden backdrop-blur-xl transition-all duration-300"
          style={{
            bottom: 'clamp(16px, 3vw, 30px)',
            right: 'clamp(16px, 3vw, 30px)',
            left: 'clamp(16px, 3vw, auto)',
            width: 'clamp(280px, 90vw, 350px)',
            height: 'clamp(350px, 60vh, 450px)',
            background: 'var(--bg-card)',
            border: '1px solid var(--border-gold)',
            boxShadow: '0 20px 40px rgba(255, 107, 0, 0.3)',
          }}
        >
          {/* 头部 */}
          <div
            className="flex items-center gap-2 md:gap-3"
            style={{
              padding: '12px 16px',
              borderBottom: '1px solid var(--border-gold)',
            }}
          >
            <div
              className="rounded-full flex items-center justify-center flex-shrink-0"
              style={{
                width: 'clamp(32px, 10vw, 40px)',
                height: 'clamp(32px, 10vw, 40px)',
                background: 'linear-gradient(135deg, var(--dragon-orange) 0%, #e67300 100%)',
                fontSize: 'clamp(16px, 5vw, 20px)',
              }}
            >
              🐒
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-bangers font-bold text-base md:text-lg text-white truncate">AI 助手</div>
              <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>在线</div>
            </div>
            <button
              onClick={() => setIsExpanded(false)}
              className="text-white hover:text-[var(--dragon-gold)] transition-colors text-lg md:text-xl flex-shrink-0"
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}
            >
              ✕
            </button>
          </div>

          {/* 聊天区域 */}
          <div
            className="overflow-y-auto px-3 md:px-4"
            style={{
              height: 'calc(100% - clamp(120px, 30vw, 150px))',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px 12px'
            }}
          >
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-2 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                {message.role === 'assistant' && (
                  <div
                    className="rounded-full flex items-center justify-center flex-shrink-0"
                    style={{
                      width: '28px',
                      height: '28px',
                      background: 'linear-gradient(135deg, var(--dragon-orange) 0%, #e67300 100%)',
                      fontSize: '14px',
                    }}
                  >
                    🐒
                  </div>
                )}
                <div
                  className={`px-4 py-2 max-w-[80%] ${
                    message.role === 'user'
                      ? 'bg-blue-500 text-white rounded-2xl rounded-tr-sm'
                      : 'rounded-2xl rounded-tl-sm'
                  }`}
                  style={{
                    background: message.role === 'assistant' ? 'rgba(255, 107, 0, 0.2)' : undefined,
                    wordBreak: 'break-word',
                  }}
                >
                  <p className="text-sm" style={{ color: message.role === 'assistant' ? 'var(--text-primary)' : 'white' }}>
                    {message.content}
                  </p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-2">
                <div
                  className="rounded-full flex items-center justify-center flex-shrink-0"
                  style={{
                    width: '28px',
                    height: '28px',
                    background: 'linear-gradient(135deg, var(--dragon-orange) 0%, #e67300 100%)',
                    fontSize: '14px',
                  }}
                >
                  🐒
                </div>
                <div
                  className="px-4 py-2 rounded-2xl rounded-tl-sm"
                  style={{ background: 'rgba(255, 107, 0, 0.2)' }}
                >
                  <p className="text-sm" style={{ color: 'var(--text-primary)' }}>正在输入...</p>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* 输入区域 */}
          <div
            className="absolute bottom-0 left-0 right-0"
            style={{
              padding: '12px 16px',
              borderTop: '1px solid var(--border-gold)',
            }}
          >
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isLoading}
                placeholder="输入问题..."
                className="flex-1 px-3 md:px-4 py-2 rounded-full text-sm text-white focus:outline-none"
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid var(--border-gold)',
                }}
              />
              <button
                onClick={handleSend}
                disabled={isLoading}
                className="px-3 md:px-4 py-2 rounded-full text-sm font-bold text-white transition-all whitespace-nowrap"
                style={{
                  background: isLoading
                    ? 'rgba(255, 107, 0, 0.5)'
                    : 'linear-gradient(135deg, var(--dragon-orange) 0%, #e67300 100%)',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                }}
              >
                {isLoading ? '...' : '发送'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 收起状态 */}
      <div
        className="fixed z-50 cursor-pointer transition-transform duration-300 rounded-full flex items-center justify-center"
        style={{
          bottom: 'clamp(16px, 3vw, 30px)',
          right: 'clamp(16px, 3vw, 30px)',
          width: 'clamp(50px, 12vw, 60px)',
          height: 'clamp(50px, 12vw, 60px)',
          background: 'linear-gradient(135deg, var(--dragon-orange) 0%, #e67300 100%)',
          boxShadow: '0 0 30px var(--dragon-orange-glow)',
          fontSize: 'clamp(24px, 6vw, 32px)',
        }}
        onClick={() => setIsExpanded(!isExpanded)}
        onMouseEnter={(e) => { if (!isExpanded) e.currentTarget.style.transform = 'scale(1.15)'; }}
        onMouseLeave={(e) => { if (!isExpanded) e.currentTarget.style.transform = ''; }}
      >
        🐒
      </div>

      {/* Toast 提示 */}
      {showToast && (
        <div
          className="fixed z-[100] px-4 md:px-6 py-2 md:py-3 rounded-lg text-white text-xs md:text-sm"
          style={{
            bottom: 'clamp(80px, 20vw, 100px)',
            right: 'clamp(16px, 3vw, 30px)',
            left: 'clamp(16px, 3vw, auto)',
            maxWidth: 'calc(100vw - clamp(32px, 6vw, 60px))',
            background: 'rgba(204, 0, 0, 0.9)',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
            animation: 'fadeInOut 3s ease-in-out',
          }}
        >
          {toastMessage}
        </div>
      )}

      <style jsx>{`
        @keyframes fadeInOut {
          0% { opacity: 0; transform: translateY(10px); }
          10% { opacity: 1; transform: translateY(0); }
          90% { opacity: 1; transform: translateY(0); }
          100% { opacity: 0; transform: translateY(-10px); }
        }
      `}</style>
    </>
  );
}
