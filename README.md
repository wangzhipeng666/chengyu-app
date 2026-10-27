# 成语学习助手

每日成语 / 词语学习应用：内容学习、检索、收藏、错题本、答题进度，并支持从 PDF 笔记导入内容。

- 客户端：React 19 + Vite + Tailwind（`client/`，端口 5832）
- 服务端：Express 5 + better-sqlite3（`server/`，端口 4917）
- 数据：内容源文件为 `client/src/data/day-*.json`（50 天），SQLite 库为 `server/data/chengyu.db`（不入库，首次启动自动生成）

## 换新设备部署

要求：Node.js ≥ 20.19（建议 22 LTS）。

```bash
git clone https://github.com/wangzhipeng666/chengyu-app.git
cd chengyu-app
./start.sh        # Windows 双击 start.bat
```

启动脚本会自动安装依赖（仅首次），然后同时启动服务端和客户端。

- 本地访问：http://localhost:5832
- 局域网访问：http://<本机IP>:5832

首次启动时，服务端检测到数据库为空会自动从 `client/src/data/day-*.json` 导入全部 50 天内容，无需手动操作。

## 常用命令

| 命令 | 说明 |
| --- | --- |
| `./start.sh` | 一键启动前后端 |
| `cd server && npm run seed` | 全量重建内容数据（保留学习进度） |
| `node scripts/sync-days-to-sqlite.js <day>...` | 将指定天的 JSON 同步进 SQLite |
| `node scripts/import-question-pdf.js <pdf>` | 从 PDF 导入题目 |

## 笔记导入功能（可选）

PDF 笔记导入依赖 Claude API，需设置环境变量后再启动：

```bash
export CLAUDE_API_KEY=sk-ant-...
```

不设置不影响学习、检索、刷题等主功能。
