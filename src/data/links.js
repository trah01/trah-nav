import {
    RiGithubFill,
    RiGoogleFill,
    RiOpenaiFill,
    RiBilibiliLine,
    RiYoutubeLine,
    RiTwitterXFill,
    RiStackOverflowLine,
    RiNpmjsFill,
    RiCodeBoxLine,
    RiBookOpenLine,
    RiCloudLine,
    RiMailLine,
    RiCalendarLine,
    RiFileList3Line,
    RiDriveLine,
    RiNotionFill,
    RiTrelloLine,
    RiSlackLine,
    RiDiscordLine,
    RiSpotifyLine,
    RiNetflixFill,
    RiAmazonLine,
    RiGlobalLine,
    RiSearchLine,
    RiNewspaperLine,
    RiStockLine
} from '@remixicon/react'

export const linksData = [
    // 开发工具
    { title: "GitHub", desc: "代码托管平台", url: "https://github.com", icon: RiGithubFill, category: "dev", tags: ["GIT", "CODE"] },
    { title: "Stack Overflow", desc: "开发者问答社区", url: "https://stackoverflow.com", icon: RiStackOverflowLine, category: "dev", tags: ["QA", "DEV"] },
    { title: "NPM", desc: "Node 包管理器", url: "https://www.npmjs.com", icon: RiNpmjsFill, category: "dev", tags: ["NODE", "PKG"] },
    { title: "CodePen", desc: "前端代码演示", url: "https://codepen.io", icon: RiCodeBoxLine, category: "dev", tags: ["CODE", "CSS"] },
    { title: "MDN", desc: "Web 开发文档", url: "https://developer.mozilla.org", icon: RiBookOpenLine, category: "dev", tags: ["DOCS", "WEB"] },

    // AI 工具
    { title: "ChatGPT", desc: "OpenAI 智能对话", url: "https://chat.openai.com", icon: RiOpenaiFill, category: "ai", tags: ["AI", "CHAT"] },
    { title: "Google Gemini", desc: "Google AI 助手", url: "https://gemini.google.com", icon: RiGoogleFill, category: "ai", tags: ["AI", "GOOGLE"] },
    { title: "Claude", desc: "Anthropic AI", url: "https://claude.ai", icon: RiGlobalLine, category: "ai", tags: ["AI", "CHAT"] },

    // 效率工具
    { title: "Google Drive", desc: "云端存储", url: "https://drive.google.com", icon: RiDriveLine, category: "productivity", tags: ["CLOUD", "STORAGE"] },
    { title: "Notion", desc: "笔记与协作", url: "https://www.notion.so", icon: RiNotionFill, category: "productivity", tags: ["NOTE", "WIKI"] },
    { title: "Trello", desc: "项目管理看板", url: "https://trello.com", icon: RiTrelloLine, category: "productivity", tags: ["TODO", "KANBAN"] },
    { title: "Gmail", desc: "谷歌邮箱", url: "https://mail.google.com", icon: RiMailLine, category: "productivity", tags: ["MAIL", "GOOGLE"] },
    { title: "Google Calendar", desc: "日程管理", url: "https://calendar.google.com", icon: RiCalendarLine, category: "productivity", tags: ["CALENDAR", "GOOGLE"] },

    // 社交媒体
    { title: "Twitter / X", desc: "社交媒体平台", url: "https://x.com", icon: RiTwitterXFill, category: "social", tags: ["SOCIAL", "NEWS"] },
    { title: "Discord", desc: "社群聊天平台", url: "https://discord.com", icon: RiDiscordLine, category: "social", tags: ["CHAT", "COMMUNITY"] },
    { title: "Slack", desc: "团队协作通讯", url: "https://slack.com", icon: RiSlackLine, category: "social", tags: ["CHAT", "WORK"] },

    // 媒体娱乐
    { title: "YouTube", desc: "全球视频平台", url: "https://youtube.com", icon: RiYoutubeLine, category: "media", tags: ["VIDEO", "STREAM"] },
    { title: "Bilibili", desc: "弹幕视频网站", url: "https://www.bilibili.com", icon: RiBilibiliLine, category: "media", tags: ["VIDEO", "CN"] },
    { title: "Spotify", desc: "音乐流媒体", url: "https://open.spotify.com", icon: RiSpotifyLine, category: "media", tags: ["MUSIC", "STREAM"] },
    { title: "Netflix", desc: "影视流媒体", url: "https://www.netflix.com", icon: RiNetflixFill, category: "media", tags: ["VIDEO", "MOVIE"] },
]
