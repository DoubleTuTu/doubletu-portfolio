# Claude 对话记录 - V0.2 开发

## 项目信息
- **项目名称**: 个人编程作品展示网页（七龙珠主题）
- **开发者**: Double兔
- **版本**: V0.2 - 文章功能 + 聊天记录保存
- **技术栈**: Next.js 15 + TypeScript + Tailwind CSS
- **仓库**: https://github.com/DoubleTuTu/doubletu-portfolio

---

## V0.2 开发内容

### 1. 字体配置修复

**问题**: V0.2 页面字体与 demo3.html 不一致

**解决方案**:
- 所有三个字体都使用 `subsets: ["latin"]`
- 在 globals.css 中添加 `!important` 确保字体优先级

**修改文件**:
- `layout.tsx`: 字体配置
- `globals.css`: 字体工具类

### 2. 拆分字体应用

**需求**: "Double" 使用 font-bangers，"兔" 使用 font-zcool

**实现**: 使用嵌套 span 元素分别应用不同字体

**修改文件**:
- `page.tsx`: 首页标题
- `Navbar.tsx`: 导航栏站名

### 3. 文章管理功能

**新增页面**:
- `/admin/articles` - 文章管理页面，可查看和删除文章

**功能**:
- 文章列表展示（按发布时间倒序）
- 删除文章功能（含确认对话框）
- 编辑按钮（待实现）

### 4. 聊天记录保存功能

**实现方式**: localStorage 客户端持久化

**功能**:
- 自动加载历史记录（页面打开时）
- 自动保存消息（每次更新后）
- 清除聊天记录按钮（🗑️）

**存储键**: `doubletu-chat-history`

**修改文件**:
- `components/AIWidget.tsx`

---

## 关键代码片段

### 拆分字体应用
```tsx
<h1>
  <span className="font-bangers">Double</span>
  <span className="font-zcool">兔</span>
</h1>
```

### localStorage 聊天记录保存
```tsx
// 加载历史记录
useEffect(() => {
  const saved = localStorage.getItem(CHAT_STORAGE_KEY);
  if (saved) {
    const parsed = JSON.parse(saved);
    const restoredMessages = parsed.map((msg: any) => ({
      ...msg,
      timestamp: new Date(msg.timestamp),
    }));
    setMessages(restoredMessages);
  }
}, []);

// 保存聊天记录
useEffect(() => {
  if (messages.length > 0) {
    localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(messages));
  }
}, [messages]);
```

---

## Git 提交记录

### V0.2 版本发布
- **标签**: v0.2
- **提交数**: 12 commits
- **分支**: `feature/v0.2-articles` → `main`
- **发布地址**: https://github.com/DoubleTuTu/doubletu-portfolio/releases/tag/v0.2

---

## 已知问题

1. **MarkdownRenderer 警告**: 使用 `<img>` 而非 Next.js `<Image />` 组件
2. **无认证**: 管理页面 `/admin/articles` 和 `/admin/upload` 无访问控制

---

## 下一步计划

V0.3 可能的功能方向：
- 文章编辑功能
- 访问统计
- 留言板
- 角色口头禅/动画

---

## 开发命令

```bash
# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 启动生产服务器
npm start

# 类型检查
npm run type-check
```

---

*最后更新: 2025-02-04*
