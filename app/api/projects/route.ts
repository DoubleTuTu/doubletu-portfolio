import { NextRequest, NextResponse } from 'next/server';
import {
  getAllProjects,
  updateProject,
} from '../../lib/projects';

/**
 * GET /api/projects - 获取项目列表
 */
export async function GET(request: NextRequest) {
  try {
    const projects = await getAllProjects();
    return NextResponse.json({ projects });
  } catch (error) {
    console.error('Get projects error:', error);
    return NextResponse.json(
      { error: '获取项目失败' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/projects - 更新项目
 */
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, emoji, catchphrase, imageUrl } = body;

    if (!id) {
      return NextResponse.json(
        { error: '缺少项目 ID' },
        { status: 400 }
      );
    }

    if (!emoji && !catchphrase && !imageUrl) {
      return NextResponse.json(
        { error: '请提供要更新的字段（emoji、catchphrase 或 imageUrl）' },
        { status: 400 }
      );
    }

    const updatedProject = await updateProject(id, { emoji, catchphrase, imageUrl });

    if (!updatedProject) {
      return NextResponse.json(
        { error: '项目不存在' },
        { status: 404 }
      );
    }

    return NextResponse.json({ project: updatedProject });
  } catch (error) {
    console.error('Update project error:', error);
    return NextResponse.json(
      { error: '更新项目失败' },
      { status: 500 }
    );
  }
}
