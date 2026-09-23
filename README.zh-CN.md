# williamcaban.github.io

[williamcaban.github.io](https://williamcaban.github.io) 的源码 — William Caban 关于 AI 安全、安全防护与评估的研究、分析与写作网站。

**[English](./README.md) | [简体中文](./README.zh-CN.md)**

## 栏目

- **[每日简报](https://williamcaban.github.io/news)** — 每日 AI 安全与趋势简报，由定时代理任务自动生成并发布（`reports/`，构建时同步到 `src/content/blog/`）。
- **[每周AI安全简报](https://williamcaban.github.io/pm-briefing)** — 面向产品/工程负责人的每周简报，基于当周每日简报综合而成（`reports/weekly-pm/`，构建时同步到 `src/content/weekly-pm/`）。
- **[学术论文](https://williamcaban.github.io/publications)** — 通过 BibTeX 导入流程从 `citations.bib` 导入的论文。
- **[博客](https://williamcaban.github.io/writing)** — 长文写作，从 shift.zone/Medium 博客迁移而来，保留原始发布日期（`src/content/writing/`）。

## 技术栈

基于 [Scholar-Lite](https://github.com/fjd2004711/scholar-lite) 模板构建：Astro 5 + Tailwind + Pagefind 搜索。通过 `src/i18n/ui.ts` 支持 8 种语言的国际化。

## 本地开发

```bash
npm install
npm run dev      # 本地开发服务器 http://localhost:4321
npm run build    # 同步内容、导入 BibTeX、构建并生成搜索索引
```

## 内容结构

- `src/content/blog/`、`src/content/weekly-pm/` — 已加入 `.gitignore`，由 `scripts/` 中的流水线脚本在构建时从 `reports/` 重新生成，请勿直接编辑。
- `src/content/writing/`、`src/content/publications/` — 已提交到仓库的内容，直接编辑 Markdown 文件即可。
- `src/content.config.ts` — 内容集合的 Schema 定义。
- `src/config.ts` — 站点元数据与导航配置。

## 部署

推送到 `main` 分支会触发 `.github/workflows/deploy.yml`，自动构建并发布到 GitHub Pages。
