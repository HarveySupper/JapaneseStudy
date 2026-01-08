# Japanese Study - 日语学习助手

一个基于 Nuxt 3 的日语学习应用，支持五十音学习、背单词（艾宾浩斯记忆曲线）、学习笔记等功能。

## 功能特性

- 五十音图学习与测验
- 背单词（每日20词，艾宾浩斯遗忘曲线复习）
- 学习笔记
- 打卡记录
- 用户登录/注册

## 技术栈

- Nuxt 3
- Vue 3 + TypeScript
- Supabase (数据库 + 认证)
- UnoCSS / Tailwind CSS
- Nuxt UI

## Setup

```bash
# 安装依赖
bun install

# 启动开发服务器
bun run dev

# 构建生产版本
bun run build
```

## 项目结构

```
├── app/
│   ├── pages/           # 页面组件
│   ├── components/      # 通用组件
│   ├── composables/     # 组合式函数
│   ├── layouts/         # 布局组件
│   └── types/           # TypeScript 类型定义
├── server/
│   └── api/             # API 路由
├── supabase/
│   ├── migrations/      # 数据库迁移文件
│   └── seed/            # 种子数据
├── screenshots/         # Playwright 截图存放目录
└── public/              # 静态资源
```

## 开发规范

### 截图与测试文件

1. **Playwright 截图**：所有截图必须保存到 `screenshots/` 目录
   - 命名格式：`{页面名称}.png` 或 `{功能}-{描述}.png`
   - 示例：`vocabulary.png`, `debug-after-login.png`

2. **临时测试代码**：测试完成后应删除临时测试文件
   - 不要在项目根目录留下 `test-*.ts` 等临时文件
   - 正式测试用例应放在专门的测试目录

### 数据库迁移

- 迁移文件放在 `supabase/migrations/` 目录
- 命名格式：`YYYYMMDD_描述.sql`
- 使用 `supabase db push` 推送迁移

## 环境变量

在 `.env` 文件中配置：

```env
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_anon_key
```

## 部署

项目使用 Vercel 自动部署，已配置 GitHub 集成：

- **Push to main** → 自动触发生产部署
- **Push to 其他分支** → 自动生成预览部署
- **创建 PR** → 自动生成预览链接

### 手动部署

```bash
# 安装 Vercel CLI
npm i -g vercel

# 部署到预览环境
vercel

# 部署到生产环境
vercel --prod
```

### Vercel 环境变量配置

在 Vercel 项目设置中需要配置：
- `SUPABASE_URL`
- `SUPABASE_KEY`

## License

MIT
