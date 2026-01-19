# Trah Nav

一个 Bento 风格的个人导航页，基于 React + Vite + Tailwind CSS 构建。

![Preview](docs/preview.png)

## 功能特性

- 🎨 Bento 风格布局，简洁美观
- 🔍 拼音/中文搜索，快速定位
- ⌨️ 搜索引擎快捷键（`/g` Google、`/b` Bing）
- 🌤️ 实时天气显示（高德 API）
- 📅 农历日期与节日/节气显示
- ⏰ 倒计时事件管理
- 🎠 多组件卡片轮播切换
- 📁 可视化链接与分类管理
- 💾 配置导入/导出
- 🖼️ 自定义壁纸
- 📱 响应式设计

### 浏览器插件 (推荐)

项目现已支持作为浏览器插件（新标签页）使用：

1. 从 [Releases](https://github.com/trah01/trah-nav/releases) 下载 `trah-nav-extension-v1.0.3.zip` 并解压。
2. 打开 Chrome 扩展程序页面 (`chrome://extensions/`)。
3. 开启右上角的 **“开发者模式”**。
4. 点击 **“加载已解压的扩展程序”**，选择解压后的目录。

### 本地开发

```bash
npm install
npm run dev
```

### Docker 部署

```bash
docker-compose up -d
# 访问 http://localhost:3000
```

## 配置说明

所有配置通过设置面板管理，数据存储在浏览器 localStorage 中。

- 网站标题 / Favicon / 备案号
- 用户名 / GitHub 链接
- 高德天气 API Key / 城市代码
- 自定义壁纸 URL
- 倒计时事件
- 链接与分类

## 技术栈

- React 18
- Vite
- Tailwind CSS
- Remix Icon

## License

MIT
