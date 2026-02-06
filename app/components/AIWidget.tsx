'use client';

import { useState, useRef, useEffect } from 'react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface APIMessage {
  role: 'user' | 'assistant';
  content: string;
}

const STORAGE_KEY = 'chat-history';
const HEIGHT_STORAGE_KEY = 'chat-widget-height';

const DEFAULT_HEIGHT = 500;
const MIN_HEIGHT = 300;
const MAX_HEIGHT = 800;

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
  const [chatHeight, setChatHeight] = useState(DEFAULT_HEIGHT);
  const [isResizing, setIsResizing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatBoxRef = useRef<HTMLDivElement>(null);

  // 从 localStorage 加载聊天历史和高度
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        const historyMessages = parsed.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
        }));
        setMessages(historyMessages);
      }

      // 加载保存的高度
      const savedHeight = localStorage.getItem(HEIGHT_STORAGE_KEY);
      if (savedHeight) {
        const height = parseInt(savedHeight, 10);
        if (height >= MIN_HEIGHT && height <= MAX_HEIGHT) {
          setChatHeight(height);
        }
      }
    } catch (error) {
      console.error('Failed to load chat history:', error);
    }
  }, []);

  // 保存聊天历史到 localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch (error) {
      console.error('Failed to save chat history:', error);
    }
  }, [messages]);

  // 保存高度到 localStorage
  useEffect(() => {
    try {
      localStorage.setItem(HEIGHT_STORAGE_KEY, chatHeight.toString());
    } catch (error) {
      console.error('Failed to save chat height:', error);
    }
  }, [chatHeight]);

  // 自动滚动到底部
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // 处理拖拽调整大小
  useEffect(() => {
    if (!isResizing) return;

    const handleMouseMove = (e: MouseEvent) => {
      const newHeight = window.innerHeight - e.clientY;
      const clampedHeight = Math.max(MIN_HEIGHT, Math.min(MAX_HEIGHT, newHeight));
      setChatHeight(clampedHeight);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing]);

  // 处理触摸拖拽（移动端）
  useEffect(() => {
    if (!isResizing) return;

    const handleTouchMove = (e: TouchEvent) => {
      const newHeight = window.innerHeight - e.touches[0].clientY;
      const clampedHeight = Math.max(MIN_HEIGHT, Math.min(MAX_HEIGHT, newHeight));
      setChatHeight(clampedHeight);
    };

    const handleTouchEnd = () => {
      setIsResizing(false);
    };

    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', handleTouchEnd);

    return () => {
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isResizing]);

  // 显示 Toast 提示
  const showToastMsg = (msg: string) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  // 清空聊天历史
  const clearHistory = () => {
    setMessages([
      {
        id: 'welcome',
        role: 'assistant',
        content: '你好！我是 Double兔 的 AI 助手，有什么可以帮你的吗？',
        timestamp: new Date(),
      },
    ]);
    showToastMsg('聊天记录已清空');
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

    // 构建发送给 API 的历史记录（排除欢迎消息，只保留真实对话）
    const apiHistory: APIMessage[] = messages
      .filter((m) => m.id !== 'welcome')
      .map((m) => ({
        role: m.role,
        content: m.content,
      }));

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
      // 调用 API，发送历史记录
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: trimmedInput,
          history: apiHistory,
        }),
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
          ref={chatBoxRef}
          className="fixed z-50 rounded-2xl overflow-hidden backdrop-blur-xl flex flex-col"
          style={{
            bottom: 'clamp(16px, 3vw, 30px)',
            right: 'clamp(16px, 3vw, 30px)',
            left: 'clamp(16px, 3vw, auto)',
            width: 'clamp(280px, 90vw, 350px)',
            height: `${chatHeight}px`,
            background: 'var(--bg-card)',
            border: '1px solid var(--border-gold)',
            boxShadow: '0 20px 40px rgba(255, 107, 0, 0.3)',
          }}
        >
          {/* 拖拽调整大小手柄 */}
          <div
            onMouseDown={() => setIsResizing(true)}
            onTouchStart={() => setIsResizing(true)}
            className="cursor-ns-resize hover:bg-[var(--dragon-orange)]/20 transition-colors"
            style={{
              height: '8px',
              background: 'linear-gradient(135deg, var(--dragon-gold) 0%, var(--dragon-orange) 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            title="拖拽调整大小"
          >
            <div
              style={{
                width: '40px',
                height: '3px',
                background: 'rgba(0, 0, 0, 0.2)',
                borderRadius: '2px',
              }}
            />
          </div>

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
              onClick={clearHistory}
              className="text-white hover:text-[var(--dragon-gold)] transition-colors text-sm flex-shrink-0"
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}
              title="清空聊天记录"
            >
              🗑️
            </button>
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
            className="overflow-y-auto px-3 md:px-4 flex-1"
            style={{
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
