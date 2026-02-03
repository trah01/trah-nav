# 🧩 TRAH Nav | Bento Dashboard

[![Version](https://img.shields.io/badge/version-1.0.5-blue.svg)](https://github.com/trah01/trah-nav/releases)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Demo](https://img.shields.io/badge/Demo-在线演示-ff69b4.svg)](https://home.trah.cn)
[![React](https://img.shields.io/badge/React-18.x-61DAFB.svg?style=flat&logo=react)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.x-646CFF.svg?style=flat&logo=vite)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-3.x-38B2AC.svg?style=flat&logo=tailwind-css)](https://tailwindcss.com/)

**TRAH Nav** 是一款基于 **Bento Grid** 磁贴风格设计的极致美观、高度可定制的个人导航页。它不仅是一个网站列表，更是你的数字化办公桌面。作为浏览器新标签页的完美替代品，它遵循 **Fluent Design** 核心原则，为您提供丝滑、高效的交互体验。

> 🌐 **在线演示**：[https://home.trah.cn](https://home.trah.cn)

---

## 📸 界面预览

### 🖥️ 主界面

> Bento 磁贴布局，集成时间、天气、日历、GitHub 热力图等多种信息卡片

![主界面预览](docs/preview.png)

**亮点功能一览：**
- ⏰ **实时时钟** - 大字体时间显示，支持公历/农历/节日展示
- 🔍 **智能搜索** - 支持拼音搜索、多搜索引擎切换
- 🌤️ **天气卡片** - 基于高德 API 实时获取天气
- 📅 **倒计时** - 管理重要日期，支持周期性提醒
- 📊 **GitHub 热力图** - 展示你的开源贡献记录
- 🗂️ **分类导航** - 自定义分类与站点管理

### ⚙️ 设置面板

> 可视化配置中心，无需修改代码即可完成个性化设置（同时可导出规范化格式的json配置文件，方便批量增加修改）

![设置面板](docs/settings.png)


---

## ✨ 核心特性

| 特性 | 描述 |
|------|------|
| 🍱 **Bento 磁贴布局** | 模块化设计，完美融合天气、日历、倒计时、便签等多种卡片 |
| 🔍 **智能全局搜索** | 支持 **拼音/首字母/中文** 极速站点搜索，自定义搜索引擎 |
| 📅 **多维度时间信息** | 实时时间、公历农历对照、传统节日及二十四节气 |
| ⏰ **倒计时卡片** | 管理重要日子（周末、生日、DEADLINE），支持周期重复 |
| 📊 **GitHub 热力图** | 展示最近 16 周 Contribution，自动获取真实数据 |
| 🍅 **番茄时钟** | 内置工作/休息计时器，提升专注力 |
| 💬 **每日一言** | Hitokoto API 精选金句 |
| 🌤️ **实时天气** | 基于高德 API，支持城市 adcode 手动配置或自动定位 |
| 📁 **可视化管理** | 无需修改代码，直接在设置中心管理分类、站点链接及图标 |
| 💾 **配置云端感** | 完整的配置导入与导出，轻松备份或迁移数据 |
| 🖼️ **极致个性化** | 支持自定义壁纸（URL 或本地上传） |

---

## 🛠️ 安装与部署

### 1. 作为浏览器插件（首选推荐）

作为新标签页使用，获得最佳沉浸体验：

1. 前往 [Releases](https://github.com/trah01/trah-nav/releases) 下载最新的 `trah-nav-extension-v1.0.5.zip`
2. 解压压缩包
3. 打开 Chrome 扩展程序页面 (`chrome://extensions/`)
4. 开启 **"开发者模式"**
5. 点击 **"加载已解压的扩展程序"**，选择解压后的目录即可

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

## ⌨️ 快捷键

| 按键 | 功能 |
|------|------|
| `/` | 快速聚焦搜索框 |
| `Enter` | 执行默认搜索引擎搜索 |
| `ESC` | 清空搜索内容并取消聚焦 |

> 💡 中文输入法兼容：使用拼音输入时，按回车仅上屏拼音，不会误触发搜索

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

## 🔄 更新日志

### v1.0.5 (2026-02-03)
- 🔧 重构 GitHub 贡献热力图，使用真实 API 获取数据
- ✨ 新增月份标签、星期标签、颜色图例和总贡献数统计
- 🐛 修复中文输入法回车上屏误触发搜索的问题
- 🎨 优化热力图配色与整体主题一致

### v1.0.4
- 🔍 新增自定义搜索引擎功能
- ✨ 搜索框交互优化

---

## 📄 开源协议

本项目采用 [MIT License](LICENSE) 开源协议。

---

## 🤝 贡献与反馈

感谢对 **TRAH Nav** 的关注与支持！

- 🐛 发现 Bug？请提交 [Issue](https://github.com/trah01/trah-nav/issues)
- 💡 有新想法？欢迎 [Pull Request](https://github.com/trah01/trah-nav/pulls)
- ⭐ 觉得好用？给个 Star 支持一下！
