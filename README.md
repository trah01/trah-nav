# 🧩 TRAH Nav | Bento Dashboard

[![Version](https://img.shields.io/badge/version-1.0.4-blue.svg)](https://github.com/trah01/trah-nav/releases)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![React](https://img.shields.io/badge/React-18.x-61DAFB.svg?style=flat&logo=react)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.x-646CFF.svg?style=flat&logo=vite)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-3.x-38B2AC.svg?style=flat&logo=tailwind-css)](https://tailwindcss.com/)

**TRAH Nav** 是一款基于 **Bento Grid** 磁贴风格设计的极致美观、高度可定制的个人导航页。它不仅是一个网站列表，更是你的数字化办公桌面。作为浏览器新标签页的完美替代品，它遵循 **Fluent Design** 核心原则，为您提供丝滑、高效的交互体验。

![Preview](docs/preview.png)

---

## ✨ 核心特性

- 🍱 **Bento 磁贴布局**：模块化设计，完美融合天气、日历、倒计时、便签等多种卡片。
- 🔍 **智能全局搜索**：
  - 支持 **拼音/首字母/中文** 极速站点搜索。
  - **自定义搜索引擎**：内置 Google、Bing 等预设，支持通过命令（如 `/`）切换或设置默认搜索。
- 📅 **多维度时间信息**：显示实时时间、公历农历对照、传统节日及二十四节气。
- ⏰ **倒计时卡片**：管理你的重要日子（周末、生日、DEADLINE），支持每周、每月或固定日期重复。
- 🎠 **多功能小组件 (Widgets)**：
  - **GitHub 热力图**：展示你的 Contribution。
  - **番茄时钟 (Pomodoro)**：内置工作/休息提醒。
  - **每日一言 (Hitokoto)**：精选金句。
  - **实时天气**：基于高德 API，支持城市 adcode 手动配置或自动定位。
- 📁 **可视化管理**：无需修改代码，直接在设置中心管理分类、站点链接及图标（内置 IconPicker）。
- 💾 **配置云端感**：支持完整的配置导入与导出，轻松备份或迁移你的数据。
- 🖼️ **极致个性化**：支持自定义壁纸（URL 或本地上传），自适应深浅色模式。

---

## 🛠️ 安装与部署

### 1. 作为浏览器插件 (首选推荐)
作为新标签页使用，获得最佳沉浸体验：

1. 前往 [Releases](https://github.com/trah01/trah-nav/releases) 下载最新的 `trah-nav-extension-v1.0.4.zip`。
2. 解压压缩包。
3. 打开 Chrome 扩展程序页面 (`chrome://extensions/`)。
4. 开启 **“开发者模式”**。
5. 点击 **“加载已解压的扩展程序”**，选择解压后的目录即可。

### 2. Docker 部署
适合拥有私有服务器的用户：

```bash
docker-compose up -d
# 默认端口 3000
```

### 3. 本地开发
环境要求：Node.js 18+

```bash
git clone https://github.com/trah01/trah-nav.git
cd trah-nav
npm install
npm run dev
```

---

## ⌨️ 快捷操作

- `Enter`：执行默认搜索。
- `/`：快速聚焦搜索框。
- `ESC`：清空搜索内容并取消聚焦。
- **自定义命令**：可在设置中配置搜索引擎触发词（即将上线更丰富的快捷键支持）。

---

## 📂 项目架构

```text
src/
├── components/          # 核心组件库
│   ├── links/          # 站点链接与分类管理
│   ├── settings/       # 设置面板与配置逻辑
│   └── widgets/        # 小组件（轮播/主看板）
├── data/               # 静态资源与默认配置
├── utils/              # 工具函数（日期、搜索逻辑等）
└── index.css           # 全局样式与动效定义
```

---

## 📄 开源协议

本项目采用 [MIT License](LICENSE) 开源协议。

感谢对 **TRAH Nav** 的关注与支持！如果有任何建议，欢迎提交 [Issue](https://github.com/trah01/trah-nav/issues) 或 Pull Request。
