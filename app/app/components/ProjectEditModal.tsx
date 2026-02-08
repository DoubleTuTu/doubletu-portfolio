'use client';

import { useState, useEffect, useRef } from 'react';

interface Project {
  id: string;
  emoji: string;
  title: string;
  catchphrase: string;
  imageUrl?: string;
}

interface ProjectEditModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

// 预设 emoji 列表（七龙珠相关/常用）
const PRESET_EMOJIS = [
  // 七龙珠相关（近似）
  '🐒', '🐲', '👽', '⚔', '🔧', '👦', '👨', '👴', '👹', '💪', '🧛',
  // 动作类
  '👊', '✊', '👋', '🙏', '💥', '⚡', '🔥', '🌟', '💫', '✨',
  // 其他常用
  '🎯', '🏆', '🎮', '💻', '🚀', '⭐', '🌙', '☀️', '🔮', '🎨',
];

export default function ProjectEditModal({
  project,
  isOpen,
  onClose,
  onSave,
}: ProjectEditModalProps) {
  const [emoji, setEmoji] = useState('');
  const [catchphrase, setCatchphrase] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 当 project 改变时更新表单值
  useEffect(() => {
    if (project) {
      setEmoji(project.emoji);
      setCatchphrase(project.catchphrase);
      setImageUrl(project.imageUrl || '');
    }
  }, [project]);

  // 图片上传处理
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 验证文件类型
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      alert('只支持 JPG、PNG、GIF、WebP 格式的图片');
      return;
    }

    // 验证文件大小
    const maxSize = 2 * 1024 * 1024; // 2MB
    if (file.size > maxSize) {
      alert('图片大小不能超过 2MB');
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload/image', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setImageUrl(data.imageUrl);
      } else {
        const error = await response.json();
        alert(`上传失败：${error.error || '未知错误'}`);
      }
    } catch (error) {
      alert(`上传失败：${error instanceof Error ? error.message : '未知错误'}`);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // 删除图片
  const handleRemoveImage = () => {
    setImageUrl('');
  };

  // 不显示时不渲染
  if (!isOpen || !project) return null;

  const handleSave = async () => {
    if (!emoji.trim() && !imageUrl) {
      alert('请输入 emoji 或上传图片');
      return;
    }
    if (!catchphrase.trim()) {
      alert('请输入口头禅');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/projects', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: project.id,
          emoji: emoji.trim(),
          catchphrase: catchphrase.trim(),
          imageUrl: imageUrl || undefined,
        }),
      });

      if (response.ok) {
        alert('保存成功！');
        onSave();
        onClose();
      } else {
        const error = await response.json();
        alert(`保存失败：${error.error || '未知错误'}`);
      }
    } catch (error) {
      alert(`保存失败：${error instanceof Error ? error.message : '未知错误'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
      onClick={onClose}
    >
      <div
        className="relative rounded-2xl p-6"
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-gold)',
          boxShadow: '0 20px 40px rgba(255, 107, 0, 0.3)',
          maxWidth: '500px',
          width: '90%',
          maxHeight: '80vh',
          overflow: 'auto',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 标题 */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-bangers font-bold text-2xl text-white">
            编辑项目
          </h2>
          <button
            onClick={onClose}
            className="text-white hover:text-[var(--dragon-gold)] transition-colors text-2xl"
            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
          >
            ✕
          </button>
        </div>

        {/* 表单 */}
        <div className="space-y-4">
          {/* 项目名称（只读） */}
          <div>
            <label className="block text-sm font-bold text-white mb-2">
              项目名称
            </label>
            <div
              className="px-4 py-2 rounded-lg"
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid var(--border-gold)',
                color: 'var(--text-secondary)',
              }}
            >
              {project.title}
            </div>
          </div>

          {/* 角色图片上传 */}
          <div>
            <label className="block text-sm font-bold text-white mb-2">
              角色图片（可选，优先于 Emoji）
            </label>

            {/* 图片预览 */}
            {imageUrl ? (
              <div className="mb-3 relative">
                <img
                  src={imageUrl}
                  alt="角色预览"
                  className="w-24 h-24 rounded-lg object-cover"
                  style={{ border: '2px solid var(--border-gold)' }}
                />
                <button
                  onClick={handleRemoveImage}
                  disabled={isUploading}
                  className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 text-white text-xs font-bold hover:bg-red-600 transition-colors"
                  style={{ cursor: isUploading ? 'not-allowed' : 'pointer' }}
                >
                  ✕
                </button>
              </div>
            ) : (
              <div className="mb-3">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/gif,image/webp"
                  onChange={handleImageUpload}
                  disabled={isUploading}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 border-dashed transition-all ${
                    isUploading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-orange-400'
                  }`}
                  style={{
                    borderColor: 'rgba(255, 215, 0, 0.3)',
                    color: 'var(--text-secondary)',
                  }}
                >
                  {isUploading ? '上传中...' : '📷 点击上传图片'}
                </label>
                <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
                  支持 JPG、PNG、GIF、WebP，最大 2MB
                </p>
              </div>
            )}
          </div>

          {/* Emoji */}
          <div>
            <label className="block text-sm font-bold text-white mb-2">
              Emoji（角色）
            </label>
            <input
              type="text"
              value={emoji}
              onChange={(e) => setEmoji(e.target.value)}
              className="w-full px-4 py-2 rounded-lg text-white mb-2"
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid var(--border-gold)',
                fontSize: '24px',
                textAlign: 'center',
              }}
              placeholder="🐒"
            />
            {/* 快速选择 */}
            <div
              className="flex flex-wrap gap-2 p-3 rounded-lg"
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 215, 0, 0.3)',
              }}
            >
              {PRESET_EMOJIS.map((presetEmoji) => (
                <button
                  key={presetEmoji}
                  onClick={() => setEmoji(presetEmoji)}
                  className="w-10 h-10 rounded-lg transition-all hover:scale-110 hover:bg-white/10"
                  style={{
                    background: emoji === presetEmoji ? 'rgba(255, 107, 0, 0.3)' : 'transparent',
                    border: emoji === presetEmoji ? '1px solid var(--dragon-gold)' : '1px solid transparent',
                    fontSize: '20px',
                    cursor: 'pointer',
                  }}
                  title={presetEmoji}
                >
                  {presetEmoji}
                </button>
              ))}
            </div>
          </div>

          {/* 口头禅 */}
          <div>
            <label className="block text-sm font-bold text-white mb-2">
              口头禅
            </label>
            <input
              type="text"
              value={catchphrase}
              onChange={(e) => setCatchphrase(e.target.value)}
              className="w-full px-4 py-2 rounded-lg text-white"
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid var(--border-gold)',
              }}
              placeholder="龟派气功！💥"
            />
          </div>
        </div>

        {/* 按钮 */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 px-4 py-2 rounded-lg font-zcool font-bold text-white transition-all"
            style={{
              background: 'rgba(255, 107, 0, 0.3)',
              border: '1px solid var(--border-gold)',
              cursor: isLoading ? 'not-allowed' : 'pointer',
            }}
          >
            取消
          </button>
          <button
            onClick={handleSave}
            disabled={isLoading}
            className="flex-1 px-4 py-2 rounded-lg font-zcool font-bold text-white transition-all"
            style={{
              background: isLoading
                ? 'rgba(255, 107, 0, 0.5)'
                : 'linear-gradient(135deg, var(--dragon-orange) 0%, #e67300 100%)',
              cursor: isLoading ? 'not-allowed' : 'pointer',
            }}
          >
            {isLoading ? '保存中...' : '保存'}
          </button>
        </div>
      </div>
    </div>
  );
}
