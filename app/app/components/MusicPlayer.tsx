'use client';

import { useEffect, useState, useRef } from 'react';

interface MusicState {
  isPlaying: boolean;
  currentSongIndex: number;
  volume: number;
}

// 音乐文件列表
const songs: string[] = [
  '/music/DAN DAN 心魅.mp3',
  '/music/献给你的罗曼蒂克.aac',
  '/music/魔柯不思议.mp3',
];

export default function MusicPlayer() {
  const [musicState, setMusicState] = useState<MusicState>({
    isPlaying: false, // 默认暂停，避免 hydration 错误
    currentSongIndex: 0,
    volume: 0.7,
  });
  const [showVolume, setShowVolume] = useState(false);
  const [mounted, setMounted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const hasTriedAutoPlay = useRef(false);

  // 组件挂载后读取状态并尝试自动播放
  useEffect(() => {
    setMounted(true);

    try {
      const savedState = localStorage.getItem('musicState');
      if (savedState) {
        const parsed = JSON.parse(savedState) as MusicState;
        setMusicState(parsed);
      }
    } catch (error) {
      console.error('Error reading music state:', error);
    }
  }, []);

  // 创建 audio 元素
  useEffect(() => {
    if (songs.length > 0 && !audioRef.current) {
      audioRef.current = new Audio(songs[0]);
      audioRef.current.volume = musicState.volume;

      // 监听播放结束，自动播放下一首
      audioRef.current.addEventListener('ended', handleNextSong);
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener('ended', handleNextSong);
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 尝试自动播放
  useEffect(() => {
    if (songs.length > 0 && audioRef.current) {
      // 更新音频源和音量
      audioRef.current.src = songs[musicState.currentSongIndex];
      audioRef.current.volume = musicState.volume;

      if (musicState.isPlaying) {
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {
            // 浏览器可能阻止自动播放，静默失败
            setMusicState(prev => ({ ...prev, isPlaying: false }));
          });
        }
      } else {
        audioRef.current.pause();
      }
    }

    // 保存状态到 localStorage
    try {
      localStorage.setItem('musicState', JSON.stringify(musicState));
    } catch (error) {
      console.error('Error saving music state:', error);
    }
  }, [musicState.currentSongIndex, musicState.isPlaying, musicState.volume]);

  // 页面加载时尝试自动播放
  useEffect(() => {
    if (!mounted) return;

    if (!hasTriedAutoPlay.current && audioRef.current && songs.length > 0) {
      hasTriedAutoPlay.current = true;
      audioRef.current.src = songs[musicState.currentSongIndex];
      audioRef.current.volume = musicState.volume;

      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setMusicState(prev => ({ ...prev, isPlaying: true }));
          })
          .catch(() => {
            // 浏览器阻止自动播放，等待用户交互
            setMusicState(prev => ({ ...prev, isPlaying: false }));
          });
      }
    }
  }, [mounted, musicState.currentSongIndex, musicState.volume]);

  const togglePlay = () => {
    setMusicState(prev => ({ ...prev, isPlaying: !prev.isPlaying }));
  };

  const handlePrevSong = () => {
    setMusicState(prev => ({
      ...prev,
      currentSongIndex: prev.currentSongIndex === 0 ? songs.length - 1 : prev.currentSongIndex - 1,
    }));
  };

  const handleNextSong = () => {
    setMusicState(prev => ({
      ...prev,
      currentSongIndex: (prev.currentSongIndex + 1) % songs.length,
    }));
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setMusicState(prev => ({ ...prev, volume: newVolume }));
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  // 如果没有音乐文件，显示提示按钮
  if (songs.length === 0) {
    return (
      <div className="fixed bottom-4 left-4 z-40">
        <div
          className="px-4 py-3 rounded-xl shadow-lg"
          style={{
            background: 'linear-gradient(135deg, #ff9500 0%, #e67300 100%)',
            boxShadow: '0 0 20px var(--dragon-orange-glow)',
          }}
          title="请将音乐文件放入 /public/music/ 目录"
        >
          <span className="text-2xl">🐲</span>
          <span className="text-sm font-bold text-white ml-2">无音乐</span>
        </div>
      </div>
    );
  }

  // 避免 hydration 错误，等待组件挂载
  if (!mounted) {
    return (
      <div className="fixed bottom-4 left-4 z-40">
        <button
          className="flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg"
          style={{
            background: 'linear-gradient(135deg, #ff9500 0%, #e67300 100%)',
            boxShadow: '0 0 20px var(--dragon-orange-glow)',
          }}
        >
          <span className="text-2xl">▶️</span>
        </button>
      </div>
    );
  }

  const currentSongName = songs[musicState.currentSongIndex]?.split('/').pop() || '';

  return (
    <div
      className="fixed bottom-4 left-4 z-40"
      onMouseEnter={() => setShowVolume(true)}
      onMouseLeave={() => setShowVolume(false)}
    >
      <div className="relative">
        {/* 音乐按钮 */}
        <button
          onClick={togglePlay}
          className="flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg transition-all duration-300 hover:scale-105"
          style={{
            background: musicState.isPlaying
              ? 'linear-gradient(135deg, var(--dragon-gold) 0%, var(--dragon-orange) 100%)'
              : 'linear-gradient(135deg, #ff9500 0%, #e67300 100%)',
            boxShadow: musicState.isPlaying
              ? '0 0 30px var(--dragon-orange-glow), 0 0 60px rgba(255, 215, 0, 0.4)'
              : '0 0 20px var(--dragon-orange-glow)',
            animation: musicState.isPlaying ? 'spin 3s linear infinite' : undefined,
          }}
        >
          {/* 龙珠星星图标 */}
          <span
            className="text-2xl"
            style={{
              animation: musicState.isPlaying ? 'pulse 1s ease-in-out infinite' : undefined,
            }}
          >
            {musicState.isPlaying ? '❚❚' : '▶️'}
          </span>

          {/* 歌曲名称 */}
          {showVolume && (
            <span className="text-sm font-bold text-white max-w-[120px] truncate">
              {currentSongName}
            </span>
          )}
        </button>

        {/* 控制面板 */}
        {showVolume && (
          <div
            className="absolute bottom-full left-0 mb-2 p-3 rounded-xl bg-[rgba(10,10,10,0.95)] backdrop-blur-xl border border-[var(--border-gold)]"
            style={{ minWidth: '180px' }}
          >
            {/* 歌曲控制 */}
            <div className="flex items-center justify-center gap-3 mb-3">
              <button
                onClick={handlePrevSong}
                className="text-white hover:text-[var(--dragon-gold)] transition-colors text-lg"
                title="上一首"
              >
                ⏮️
              </button>
              <span className="text-white text-xs font-bold">
                {musicState.currentSongIndex + 1} / {songs.length}
              </span>
              <button
                onClick={handleNextSong}
                className="text-white hover:text-[var(--dragon-gold)] transition-colors text-lg"
                title="下一首"
              >
                ⏭️
              </button>
            </div>

            {/* 音量控制 */}
            <div className="flex items-center gap-2">
              <span className="text-white text-sm">🔊</span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={musicState.volume}
                onChange={handleVolumeChange}
                className="flex-1 h-2 rounded-full appearance-none cursor-pointer"
                style={{
                  background: 'linear-gradient(to right, var(--dragon-gold), var(--dragon-orange))',
                }}
              />
              <span className="text-white text-xs w-8">
                {Math.round(musicState.volume * 100)}%
              </span>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.1);
          }
        }
      `}</style>
    </div>
  );
}
