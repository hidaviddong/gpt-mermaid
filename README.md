# ChatGPT Mermaid Studio

优雅的高颜值 Mermaid 图表工作台，基于 **Next.js + Tailwind CSS** 构建。

🌐 **在线体验**：[https://gpt-mermaid.vercel.app](https://gpt-mermaid.vercel.app)  
📦 **GitHub 开源仓库**：[https://github.com/hidaviddong/gpt-mermaid](https://github.com/hidaviddong/gpt-mermaid)

---
1. **ELK 工业级布局**（`@mermaid-js/layout-elk` 代替默认 Dagre 引擎）：节点规整、连线横平竖直、不拥挤。
2. **ChatGPT 视觉规范**：
   - 节点统一 `rx: 15px, ry: 15px` 现代大圆角胶囊矩形；
   - 决策节点（菱形）转化为优雅的微虚线判定框；
   - 连线文字使用高颜值药丸 Badge 背景；
   - 连线端点自动替换为开放式细线箭头（Open Chevron），告别突兀的实心三角；
3. **LLM 语法自愈器**：自动修复大模型常出现的未加引号括号（如 `A[处理 (主流程)]`），杜绝解析崩溃。
4. **一键导出**：支持一键导出矢量 **SVG** 或高清 **PNG**（2.5x Retina），以及复制 SVG 源码。
5. **多主题支持**：内置 ChatGPT 客户端同款的 5 款主题色板（经典蓝、极简灰白、清新绿、雅致紫、暖阳橙），并支持明暗模式一键切换。

---

## 快速启动

```bash
# 进入项目目录
cd /Users/daviddong/Developer/personal/gpt-mermaid

# 启动开发服务器
pnpm dev
```

浏览器打开 [http://localhost:3000](http://localhost:3000) 即可开始使用。

---

## 核心技术栈
- **框架**：Next.js (App Router) + React 19 + TypeScript
- **样式**：Tailwind CSS v4 + Lucide React 图标
- **渲染核心**：`mermaid` + `@mermaid-js/layout-elk`
