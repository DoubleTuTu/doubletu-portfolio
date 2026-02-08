'use client';

import { useState, useRef } from 'react';
import { DragonBall } from './';

interface ArticleUploaderProps {
  onUploadSuccess?: (article: any) => void;
}

type UploadMethod = 'file' | 'text';
type FileType = 'md' | 'docx';

const FILE_TYPE_INFO = {
  md: { name: 'Markdown', accept: '.md', icon: '📝' },
  docx: { name: 'Word', accept: '.docx', icon: '📄' },
};

export function ArticleUploader({ onUploadSuccess }: ArticleUploaderProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [uploadMethod, setUploadMethod] = useState<UploadMethod>('file');
  const [fileType, setFileType] = useState<FileType>('md');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      const fileExtension = `.${selectedFile.name.split('.').pop()}`;
      const acceptedExtensions = FILE_TYPE_INFO[fileType].accept;

      if (!acceptedExtensions.includes(fileExtension)) {
        setError(`仅支持 ${FILE_TYPE_INFO[fileType].name} (${acceptedExtensions}) 文件`);
        setFile(null);
        return;
      }

      setFile(selectedFile);
      setError('');
    }
  };

  const handleFileTypeChange = (newFileType: FileType) => {
    setFileType(newFileType);
    setFile(null);
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);

    try {
      let response;

      if (uploadMethod === 'file') {
        if (!file) {
          setError('请选择文件');
          setLoading(false);
          return;
        }

        const formData = new FormData();
        formData.append('file', file);
        formData.append('fileType', fileType);
        if (title) {
          formData.append('title', title);
        }

        response = await fetch('/api/articles/upload', {
          method: 'POST',
          body: formData,
        });
      } else {
        if (!title || !content) {
          setError('标题和内容不能为空');
          setLoading(false);
          return;
        }

        response = await fetch('/api/articles/upload', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ title, content }),
        });
      }

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || '上传失败');
      }

      const data = await response.json();
      setSuccess(true);
      onUploadSuccess?.(data.article);

      // 重置表单
      setTitle('');
      setContent('');
      setFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : '上传失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="relative p-6 rounded-lg border border-[var(--border-gold)]"
      style={{ background: 'var(--bg-card)' }}
    >
      {/* 龙珠装饰 */}
      <div className="absolute -top-4 -left-4 z-10">
        <DragonBall stars={7} className="w-12 h-12" />
      </div>

      <h2
        className="font-bangers text-2xl font-bold mb-6"
        style={{
          color: 'var(--dragon-gold)',
          letterSpacing: '1px',
        }}
      >
        上传文章
      </h2>

      {/* 上传方式选择 */}
      <div className="flex gap-4 mb-6">
        <button
          type="button"
          onClick={() => setUploadMethod('file')}
          className={`px-4 py-2 rounded-lg font-bold transition-all ${
            uploadMethod === 'file'
              ? 'text-black'
              : 'border border-[var(--border-gold)]'
          }`}
          style={{
            background:
              uploadMethod === 'file'
                ? 'var(--dragon-gold)'
                : 'transparent',
          }}
        >
          📁 文件上传
        </button>
        <button
          type="button"
          onClick={() => setUploadMethod('text')}
          className={`px-4 py-2 rounded-lg font-bold transition-all ${
            uploadMethod === 'text'
              ? 'text-black'
              : 'border border-[var(--border-gold)]'
          }`}
          style={{
            background:
              uploadMethod === 'text'
                ? 'var(--dragon-gold)'
                : 'transparent',
          }}
        >
          ✏️ 文本输入
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* 文件上传模式 */}
        {uploadMethod === 'file' && (
          <>
            {/* 文件类型选择 */}
            <div>
              <label className="block text-sm font-bold mb-2" style={{ color: 'var(--text-secondary)' }}>
                文件类型
              </label>
              <div className="flex gap-3">
                {Object.entries(FILE_TYPE_INFO).map(([key, info]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => handleFileTypeChange(key as FileType)}
                    className={`px-4 py-2 rounded-lg font-bold transition-all ${
                      fileType === key ? 'text-black' : 'border border-[var(--border-gold)]'
                    }`}
                    style={{
                      background: fileType === key ? 'var(--dragon-gold)' : 'transparent',
                    }}
                  >
                    {info.icon} {info.name}
                  </button>
                ))}
              </div>
            </div>

            {/* 标题输入 */}
            <div>
              <label className="block text-sm font-bold mb-2" style={{ color: 'var(--text-secondary)' }}>
                标题（可选，留空则从文件提取）
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-[var(--border-gold)] focus:border-[var(--dragon-gold)] outline-none transition-colors"
                style={{
                  background: 'var(--bg-deep)',
                  color: 'var(--text-primary)',
                }}
                placeholder={`留空则从 ${FILE_TYPE_INFO[fileType].name} 文件标题提取...`}
              />
            </div>

            {/* 文件上传 */}
            <div>
              <label className="block text-sm font-bold mb-2" style={{ color: 'var(--text-secondary)' }}>
                {FILE_TYPE_INFO[fileType].name} 文件
              </label>
              <input
                ref={fileInputRef}
                type="file"
                accept={FILE_TYPE_INFO[fileType].accept}
                onChange={handleFileChange}
                className="w-full px-4 py-2 rounded-lg border border-[var(--border-gold)] focus:border-[var(--dragon-gold)] outline-none transition-colors file:mr-4 file:py-1 file:px-4 file:rounded file:border-0 file:bg-[var(--dragon-orange)] file:text-white file:cursor-pointer"
                style={{
                  background: 'var(--bg-deep)',
                  color: 'var(--text-primary)',
                }}
              />
              {file && (
                <p className="mt-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                  已选择: {file.name}
                </p>
              )}
            </div>
          </>
        )}

        {/* 文本输入模式 */}
        {uploadMethod === 'text' && (
          <>
            <div>
              <label className="block text-sm font-bold mb-2" style={{ color: 'var(--text-secondary)' }}>
                文章标题
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full px-4 py-2 rounded-lg border border-[var(--border-gold)] focus:border-[var(--dragon-gold)] outline-none transition-colors"
                style={{
                  background: 'var(--bg-deep)',
                  color: 'var(--text-primary)',
                }}
                placeholder="输入文章标题..."
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2" style={{ color: 'var(--text-secondary)' }}>
                Markdown 内容
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                rows={12}
                className="w-full px-4 py-2 rounded-lg border border-[var(--border-gold)] focus:border-[var(--dragon-gold)] outline-none transition-colors font-mono text-sm"
                style={{
                  background: 'var(--bg-deep)',
                  color: 'var(--text-primary)',
                }}
                placeholder="输入 Markdown 内容..."
              />
            </div>
          </>
        )}

        {/* 错误提示 */}
        {error && (
          <div
            className="px-4 py-2 rounded-lg text-sm"
            style={{
              background: 'rgba(204, 0, 0, 0.2)',
              border: '1px solid #cc0000',
              color: '#ff6b6b',
            }}
          >
            ❌ {error}
          </div>
        )}

        {/* 成功提示 */}
        {success && (
          <div
            className="px-4 py-2 rounded-lg text-sm"
            style={{
              background: 'rgba(0, 204, 102, 0.2)',
              border: '1px solid #00cc66',
              color: '#6bffaa',
            }}
          >
            ✅ 文章上传成功！
          </div>
        )}

        {/* 提交按钮 */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-lg font-bangers font-bold text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            background: 'linear-gradient(135deg, var(--dragon-gold) 0%, var(--dragon-orange) 100%)',
            color: 'black',
            letterSpacing: '1px',
          }}
        >
          {loading ? '🔄 上传中...' : '🚀 上传文章'}
        </button>
      </form>
    </div>
  );
}
