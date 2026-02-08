'use client';

import { useState, useEffect } from 'react';
import { DragonBall, Navbar } from '../../components';
import ProjectEditModal from '../../components/ProjectEditModal';
import type { Project } from '../../lib/projects';

export default function ProjectsAdminPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 获取项目列表
  const fetchProjects = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/projects');
      if (response.ok) {
        const data = await response.json();
        setProjects(data.projects || []);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // 打开编辑弹窗
  const handleEdit = (project: Project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  // 关闭弹窗
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProject(null);
  };

  // 保存后刷新列表
  const handleSave = () => {
    fetchProjects();
  };

  return (
    <main className="min-h-screen relative">
      {/* 能量光晕背景 */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div
          className="absolute inset-0 animate-energy-pulse"
          style={{
            background: `
              radial-gradient(circle at 20% 20%, var(--dragon-orange-glow) 0%, transparent 40%),
              radial-gradient(circle at 80% 80%, rgba(255, 215, 0, 0.15) 0%, transparent 40%),
              radial-gradient(circle at 50% 50%, rgba(255, 107, 0, 0.1) 0%, transparent 60%)
            `,
          }}
        />
      </div>

      {/* 七颗龙珠装饰 */}
      <DragonBall stars={1} style={{ top: '10%', left: '5%' }} />
      <DragonBall stars={2} style={{ top: '20%', right: '8%' }} />
      <DragonBall stars={3} style={{ top: '60%', left: '3%' }} />
      <DragonBall stars={4} style={{ top: '70%', right: '5%' }} />
      <DragonBall stars={5} style={{ top: '40%', left: '92%' }} />
      <DragonBall stars={6} style={{ top: '85%', left: '10%' }} />
      <DragonBall stars={7} style={{ top: '50%', right: '3%' }} />

      {/* 导航栏 */}
      <Navbar />

      {/* 主内容 */}
      <div
        className="relative z-10 mx-auto px-4 sm:px-6 md:px-10"
        style={{
          maxWidth: '1000px',
          paddingTop: 'clamp(80px, 15vh, 120px)',
          paddingBottom: '60px'
        }}
      >
        {/* 页面标题 */}
        <div className="text-center mb-12">
          <h1 className="font-bangers font-bold text-4xl md:text-5xl text-white mb-4">
            项目管理
          </h1>
          <p className="text-sm md:text-base" style={{ color: 'var(--text-secondary)' }}>
            快速修改项目的 emoji 和口头禅
          </p>
        </div>

        {/* 项目列表 */}
        {loading ? (
          <div className="text-center py-12">
            <p style={{ color: 'var(--text-secondary)' }}>加载中...</p>
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-12">
            <p style={{ color: 'var(--text-secondary)' }}>暂无项目</p>
          </div>
        ) : (
          <div className="space-y-4">
            {projects.map((project) => (
              <div
                key={project.id}
                className="project-item rounded-xl p-4 md:p-6"
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-gold)',
                  backdropFilter: 'blur(10px)',
                }}
              >
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  {/* Emoji/图片 */}
                  {project.imageUrl ? (
                    <img
                      src={project.imageUrl}
                      alt={project.title}
                      className="w-14 h-14 rounded-lg object-cover flex-shrink-0"
                      style={{ minWidth: '56px', border: '1px solid var(--border-gold)' }}
                    />
                  ) : (
                    <div
                      className="text-4xl md:text-5xl flex-shrink-0"
                      style={{ minWidth: '60px', textAlign: 'center' }}
                    >
                      {project.emoji}
                    </div>
                  )}

                  {/* 项目信息 */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-zcool font-bold text-xl text-white mb-1">
                      {project.title}
                    </h3>
                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                      {project.catchphrase}
                    </p>
                    <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)', wordBreak: 'break-all' }}>
                      {project.link}
                    </p>
                  </div>

                  {/* 编辑按钮 */}
                  <div className="flex-shrink-0">
                    <button
                      onClick={() => handleEdit(project)}
                      className="px-4 py-2 rounded-lg font-zcool font-bold text-sm transition-all hover:scale-105"
                      style={{
                        background: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)',
                        color: '#fff',
                        border: 'none',
                        cursor: 'pointer',
                      }}
                    >
                      ✏️ 编辑
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 编辑弹窗 */}
      <ProjectEditModal
        project={selectedProject}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSave}
      />

      {/* 底部版权 */}
      <footer className="text-center py-8 text-[var(--text-secondary)] text-xs relative z-10 border-t border-[var(--border-gold)]">
        七龙珠角色仅用于个人展示，非商业用途
      </footer>
    </main>
  );
}
