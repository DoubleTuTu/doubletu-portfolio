import { NextRequest, NextResponse } from 'next/server';

// System Prompt 告知 AI 助手的项目信息
const SYSTEM_PROMPT = `你是 Double兔 作品集的 AI 助手。请专业、简洁、友好地回答访客问题。

站点信息：
- 站长：Double兔，VibeCoding 爱好者，用七龙珠的热情敲代码
- 联系方式：QQ/微信 118071452

项目列表：
1. 极简记账本 - 简洁高效的记账工具
2. 个人工具主页 - 常用工具集合
3. 极简海报编辑器 - 快速创建海报
4. AI 漫剧剧本 - 一键生成 AI 漫剧剧本
5. 自由画布 AI 对话 - 多模型 AI 对话工具

回答风格：专业、简洁、友好，不要使用动漫角色语气。`;

// 从环境变量读取配置
const API_KEY = process.env.VOLC_ENGINE_API_KEY;
const ENDPOINT = process.env.VOLC_ENGINE_ENDPOINT || 'https://ark.cn-beijing.volces.com/api/v3';
const MODEL = process.env.VOLC_ENGINE_MODEL || 'doubao-seed-1-6-lite-251015';

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();

    // 验证输入
    if (!message || typeof message !== 'string' || message.trim() === '') {
      return NextResponse.json(
        { error: '消息不能为空' },
        { status: 400 }
      );
    }

    // 验证 API 配置
    if (!API_KEY) {
      return NextResponse.json(
        { error: 'API 配置缺失，请检查环境变量' },
        { status: 500 }
      );
    }

    // 调用火山引擎 API（使用标准对话格式）
    const response = await fetch(`${ENDPOINT}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          {
            role: 'system',
            content: SYSTEM_PROMPT,
          },
          {
            role: 'user',
            content: message,
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Volc Engine API error:', errorText);
      return NextResponse.json(
        { error: 'AI 服务暂时不可用，请稍后重试' },
        { status: 500 }
      );
    }

    const data = await response.json();

    // 提取 AI 回复
    const reply = data.choices?.[0]?.message?.content || '抱歉，我暂时无法回答这个问题。';

    return NextResponse.json({
      reply,
    });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: '服务器错误，请稍后重试' },
      { status: 500 }
    );
  }
}
