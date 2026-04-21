# Cyber-Ox Lab（轻松版）

赛博牛马实验室单页应用，采用“放松、柔和、低压”的视觉基调，包含 7 个功能模块：

- 能量回收计划
- 虚空遁地兽
- 语义重塑模组
- 全域感知终端
- 存量文档加速器
- 精神熵增稳定器
- 律动核心工程

## 技术栈

- React + Vite
- Tailwind CSS
- Framer Motion
- Lucide React
- React Router
- Cloudflare Workers（用于代理 DeepSeek）

## 本地开发

```bash
npm install
npm run dev
```

## DeepSeek 接入方式（Cloudflare Pages Functions）

项目已包含 Pages Functions 接口：`functions/api/refactor.js`，对外提供：

- `POST /api/refactor`

该接口会调用 DeepSeek Chat Completions，并返回：

```json
{ "result": "..." }
```

### 1) 在 Cloudflare Pages 配置环境变量

在 Pages 项目设置里添加：

- `DEEPSEEK_KEY`（推荐）
- `DEEPSEEK_API_KEY`（兼容旧命名，也可用）
- `DEEPSEEK_BASE_URL`（可选，默认 `https://api.deepseek.com/v1`）

接口会优先读取 `context.env.DEEPSEEK_KEY`，若不存在则回退读取 `context.env.DEEPSEEK_API_KEY`。

### 2) 本地开发（可选）

如果需要本地模拟 Pages Functions，可使用 Wrangler：

```bash
npx wrangler login
npx wrangler pages dev dist
```

### 3) 前端指向接口（默认就是 `/api/refactor`）

创建 `.env.local`：

```bash
VITE_REFACTOR_ENDPOINT=https://<your-worker-domain>/api/refactor
```

开发/构建时会自动读取该地址；若未配置，则默认请求同域 `/api/refactor`。

## 安全说明

- 薪资等敏感输入仅在浏览器本地（localStorage）保存。
- DeepSeek Key 不在前端，不进仓库，由 Cloudflare Pages 环境变量托管。
