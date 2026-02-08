# Double兔 作品集

> 七龙珠主题个人编程作品展示网页

## 项目简介

这是 Double兔 的个人作品集网站，采用七龙珠动漫主题设计，展示个人编程项目。

### 技术栈

- **框架**: Next.js 15 (App Router)
- **语言**: TypeScript
- **样式**: Tailwind CSS
- **字体**: Google Fonts (Bangers, ZCOOL KuaiLe, Noto Sans SC)
- **API**: 火山引擎 Ark API

### 功能特性

- ✅ 七龙珠主题设计（橙色 + 金色能量风格）
- ✅ 5个项目卡片展示
- ✅ AI 助手聊天浮窗
- ✅ 响应式设计（桌面/平板/移动端）

### 本地运行

```bash
# 安装依赖
npm install

# 配置环境变量
cp .env.local.example .env.local
# 编辑 .env.local 填入你的 API 密钥

# 启动开发服务器
npm run dev
```

访问 http://localhost:3000

### 环境变量

```env
VOLC_ENGINE_API_KEY=your_api_key
VOLC_ENGINE_ENDPOINT=https://ark.cn-beijing.volces.com/api/v3
VOLC_ENGINE_MODEL=doubao-seed-1-6-lite-251015
```

### 项目结构

```
app/
├── app/
│   ├── components/      # React 组件
│   │   ├── DragonBall.tsx
│   │   ├── Navbar.tsx
│   │   ├── ProjectCard.tsx
│   │   └── AIWidget.tsx
│   ├── api/            # API 路由
│   │   └── chat/
│   │       └── route.ts
│   ├── globals.css     # 全局样式
│   ├── layout.tsx      # 根布局
│   └── page.tsx        # 主页面
├── docs/               # 项目文档
└── public/             # 静态资源
```

## 版本历史

### V0.1 MVP (当前版本)

- 首页框架
- 5个项目卡片
- AI 助手浮窗（基础问答）
- 响应式设计

---

**作者**: Double兔
**联系**: QQ/微信 118071452
