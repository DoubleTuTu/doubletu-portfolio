import { NextRequest, NextResponse } from 'next/server';
import { getAllArticles } from '../../lib/articles';

// System Prompt - 注入灵魂
const SYSTEM_PROMPT = `你是 Double兔 作品集的 AI 助手，代表站长 Double兔 与访客对话。

## 站长信息
- 名字：Double兔
- 身份：VibeCoding 爱好者，用七龙珠的热情敲代码
- 性格：热情、专业、幽默、友好
- 联系方式：QQ/微信 118071452
- GitHub：https://github.com/DoubleTuTu

## 项目信息（七龙珠角色主题）

### 1. 极简记账本 🐒（孙悟空）
- 描述：简洁高效的记账工具
- 口头禅：龟派气功！💥
- 链接：https://minimal-ledger.vercel.app/
- 特点：极简设计、快速记账、数据统计

### 2. 个人工具主页 🔥（贝吉塔）
- 描述：常用工具集合网站
- 口头禅：终极闪光！⚡
- 链接：待上线
- 特点：一站式工具导航

### 3. 极简海报编辑器 🧚（比克）
- 描述：快速创建海报的编辑器
- 口头禅：魔贯光杀炮！🌿
- 链接：待上线
- 特点：拖拽编辑、模板丰富

### 4. AI 漫剧剧本 ⚔️（特兰克斯）
- 描述：一键生成 AI 漫剧剧本
- 口头禅：燃烧攻击！🔥
- 链接：待上线
- 特点：AI 生成、创意无限

### 5. 自由画布 AI 对话 💎（布尔玛）
- 描述：多模型 AI 对话工具
- 口头禅：胶囊公司科技！🔬
- 链接：待上线
- 特点：自由画布、多模型对比

## 网站特色
- 七龙珠动漫主题设计
- "集齐七颗龙珠，召唤完美作品集"的理念
- 橙色 + 蓝色 + 黄色的经典配色
- 趣味性强、互动性高

## 对话风格
- 语气：热情友好，像朋友一样交流
- 可以适当使用一些表情符号 😊
- 回答要简洁、准确、有价值
- 如果问到技术细节，可以展开讨论
- 如果问到站长个人情况，基于以上信息回答
- 可以基于下方的站长文章内容回答技术问题
- 遇到不知道的问题，诚实说明并建议联系站长

## 多轮对话
- 记住上下文，保持对话连贯性
- 如果用户追问细节，基于之前的对话继续回答
- 主动引导用户了解项目和站长`;

// 从环境变量读取配置
const API_KEY = process.env.VOLC_ENGINE_API_KEY;
const ENDPOINT = process.env.VOLC_ENGINE_ENDPOINT || 'https://ark.cn-beijing.volces.com/api/v3';
const MODEL = process.env.VOLC_ENGINE_MODEL || 'doubao-seed-1-6-lite-251015';

// 构建文章上下文（简单版：直接喂给 AI）
async function buildArticlesContext(): Promise<string> {
  try {
    const articles = await getAllArticles();
    if (articles.length === 0) {
      return '\n## 站长文章\n暂无文章。\n';
    }

    // 取最新的 5 篇文章，每篇取前 500 字作为摘要
    const articlesSummary = articles
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
      .slice(0, 5)
      .map(article => {
        // 移除 Markdown 符号，提取纯文本摘要
        const plainText = article.content
          .replace(/#{1,6}\s/g, '')
          .replace(/\*\*/g, '')
          .replace(/\*/g, '')
          .replace(/`/g, '')
          .replace(/\n/g, ' ')
          .replace(/\s+/g, ' ')
          .trim();
        const summary = plainText.slice(0, 500) + (plainText.length > 500 ? '...' : '');

      return `### ${article.title}\n${summary}\n`;
    }).join('\n');

    return `\n## 站长文章（最新 5 篇摘要）\n${articlesSummary}\n`;
  } catch (error) {
    console.error('Error building articles context:', error);
    return '\n## 站长文章\n加载文章失败。\n';
  }
}

export async function POST(request: NextRequest) {
  try {
    const { message, history = [] } = await request.json();

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

    // 获取文章上下文
    const articlesContext = await buildArticlesContext();

    // 将文章内容添加到 system message
    const enhancedSystemPrompt = SYSTEM_PROMPT + articlesContext;

    // 构建消息历史（最多保留最近 20 条）
    const recentHistory = history.slice(-20);

    // 调用火山引擎 API
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
            content: enhancedSystemPrompt,
          },
          ...recentHistory,
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
