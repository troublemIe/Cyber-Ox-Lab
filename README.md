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

## DeepSeek 接入方式（通过 Cloudflare，前端不暴露密钥）

项目已包含 Worker 代码：`cloudflare/worker.js`，对外提供：

- `POST /api/refactor`

该接口会调用 DeepSeek Chat Completions，并返回：

```json
{ "result": "..." }
```

### 1) 登录 Cloudflare 并部署 Worker

在仓库根目录执行：

```bash
npx wrangler login
npx wrangler deploy --config cloudflare/wrangler.toml
```

### 2) 将密钥写入 Cloudflare Secret（不要提交到 Git）

```bash
npx wrangler secret put DEEPSEEK_API_KEY --config cloudflare/wrangler.toml
```

然后粘贴你的 API Key（终端不会回显）。

可选：如果你要覆盖默认地址，再设置：

```bash
npx wrangler secret put DEEPSEEK_BASE_URL --config cloudflare/wrangler.toml
```

### 3) 前端指向 Worker

创建 `.env.local`：

```bash
VITE_REFACTOR_ENDPOINT=https://<your-worker-domain>/api/refactor
```

开发/构建时会自动读取该地址；若未配置，则默认请求 `/api/refactor`。

## 安全说明

- 薪资等敏感输入仅在浏览器本地（localStorage）保存。
- DeepSeek Key 不在前端，不进仓库，通过 Cloudflare Secret 托管。
