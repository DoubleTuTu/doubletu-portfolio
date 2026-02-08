import fs from 'fs/promises';
import path from 'path';

// 数据类型定义
export interface Project {
  id: string;
  emoji: string;
  title: string;
  description: string;
  link: string;
  catchphrase: string;
  imageUrl?: string; // 角色图片 URL（可选，优先级高于 emoji）
}

interface ProjectsData {
  projects: Project[];
}

// 数据文件路径
const DATA_FILE_PATH = path.join(process.cwd(), 'app', 'data', 'projects.json');

/**
 * 获取所有项目
 */
export async function getAllProjects(): Promise<Project[]> {
  try {
    const data = await fs.readFile(DATA_FILE_PATH, 'utf-8');
    const parsed: ProjectsData = JSON.parse(data);
    return parsed.projects || [];
  } catch (error) {
    console.error('Error reading projects data:', error);
    return [];
  }
}

/**
 * 根据 ID 获取单个项目
 */
export async function getProjectById(id: string): Promise<Project | null> {
  const projects = await getAllProjects();
  return projects.find(p => p.id === id) || null;
}

/**
 * 更新项目的 emoji、口头禅和图片
 */
export async function updateProject(
  id: string,
  updates: { emoji?: string; catchphrase?: string; imageUrl?: string }
): Promise<Project | null> {
  const projects = await getAllProjects();
  const projectIndex = projects.findIndex(p => p.id === id);

  if (projectIndex === -1) {
    return null; // 项目不存在
  }

  // 更新字段
  if (updates.emoji !== undefined) {
    projects[projectIndex].emoji = updates.emoji;
  }
  if (updates.catchphrase !== undefined) {
    projects[projectIndex].catchphrase = updates.catchphrase;
  }
  if (updates.imageUrl !== undefined) {
    projects[projectIndex].imageUrl = updates.imageUrl;
  }

  await saveProjects(projects);
  return projects[projectIndex];
}

/**
 * 保存项目到文件
 */
async function saveProjects(projects: Project[]): Promise<void> {
  const data: ProjectsData = { projects };
  await fs.writeFile(DATA_FILE_PATH, JSON.stringify(data, null, 2), 'utf-8');
}
