/**
 * 轻量级国际化（i18n）工具
 * 支持中文和英文切换
 */

// 翻译资源
const translations = {
    'zh-CN': {
        // 搜索引擎设置
        'search.useCustomEngine': '使用自定义搜索引擎',
        'search.usingCustom': '当前使用扩展内配置的自定义搜索引擎',
        'search.usingChrome': '当前遵循 Chrome 浏览器的默认搜索引擎设置',
        'search.switchToChrome': '切换为 Chrome 默认',
        'search.enableCustom': '启用自定义搜索',
        'search.followChrome': '遵循 Chrome 浏览器设置',
        'search.followChromeDesc': '搜索将使用您在 Chrome 浏览器中设置的默认搜索引擎。如需更改，请前往 Chrome 设置 → 搜索引擎。',
        'search.customEngines': '自定义搜索引擎',
        'search.addPreset': '添加预设',
        'search.custom': '自定义',
        'search.urlHint': '点击星号设为默认搜索引擎。URL 中使用 {query} 作为搜索词占位符。',
        'search.noEngines': '暂无搜索引擎，点击上方按钮添加',
        'search.engineName': '搜索引擎名称',
        'search.engineUrl': '搜索 URL，使用 {query} 作为关键词占位',
        'search.customIconUrl': '自定义图标 URL',
        'search.setDefault': '设为默认',
        'search.currentDefault': '当前默认',
        'search.delete': '删除',
        'search.searchWith': '使用 {name} 搜索',
        'search.searchWithChrome': '使用 Chrome 默认搜索引擎搜索',
        'search.placeholder': '在此搜索',

        // 设置页面
        'settings.title': '设置',
        'settings.save': '保存更改',
        'settings.cancel': '取消',
        'settings.tabs.general': '常规',
        'settings.tabs.links': '链接管理',
        'settings.tabs.widgets': '轮播组件',
        'settings.tabs.sections': '分类',
        'settings.tabs.search': '搜索引擎',
        'settings.tabs.countdown': '倒计时',
        'settings.tabs.about': '关于',
        'settings.language': '界面语言',
        'settings.languageDesc': '选择扩展的显示语言',

        // 常规设置
        'settings.siteInfo': '网站信息',
        'settings.siteTitle': '网站标题',
        'settings.favicon': 'Favicon URL / 上传图片',
        'settings.uploadImage': '上传图片',
        'settings.clearIcon': '清除图标',
        'settings.icpBeian': 'ICP 备案号',
        'settings.userInfo': '用户信息',
        'settings.adminName': 'Admin 用户名',
        'settings.githubLink': 'GitHub 链接',
        'settings.weatherSettings': '天气设置',
        'settings.amapApiKey': '高德 API Key',
        'settings.cityAdcode': '城市 Adcode (天气地址)',
        'settings.autoLocate': '留空则尝试自动定位',
        'settings.personalization': '个性化与备份',
        'settings.customWallpaper': '自定义壁纸',
        'settings.wallpaperHint': '支持 URL 或上传本地图片（最大 2MB），留空则显示默认背景',
        'settings.uploadBg': '上传背景图片',
        'settings.clearBg': '清除背景图',
        'settings.exportConfig': '导出配置',
        'settings.importConfig': '导入配置',
        'settings.importSuccess': '配置导入成功，请点击保存',
        'settings.importError': '导入失败: 文件格式错误',
        'settings.iconTooLarge': '图标文件过大，请选择 100KB 以内的图片',
        'settings.bgTooLarge': '背景图片过大，请选择 2MB 以内的图片',
        'settings.icpPlaceholder': '京ICP备XXXXXXXX号',
        'settings.wallpaperPlaceholder': '输入图片 URL 或上传本地图片',
        'settings.bgPreview': '背景预览',

        // 轮播组件
        'widgets.description': '勾选要显示的组件，在侧边栏上方区域轮播显示。',
        'widgets.github': 'GitHub 卡片',
        'widgets.note': '快捷便签',
        'widgets.pomodoro': '番茄时钟',
        'widgets.hitokoto': '每日一言',
        'widgets.calendar': '日历',
        'widgets.clock': '模拟时钟',

        // 倒计时
        'countdown.title': '重要日',
        'countdown.hint': '提示：首页仅显示前 3 个事件。可使用箭头调整顺序。过去的日期会显示已过天数。',
        'countdown.addEvent': '添加新事件',
        'countdown.newEvent': '新事件',
        'countdown.eventName': '事件名称',
        'countdown.fixedDate': '固定日期',
        'countdown.monthly': '每月重复',
        'countdown.weekly': '每周重复',
        'countdown.everyMonth': '每月',
        'countdown.day': '号',
        'countdown.everyWeek': '每周',
        'countdown.today': '今天',
        'countdown.tomorrow': '明天',
        'countdown.ongoing': '就是现在',
        'countdown.duration': '持续天数',

        // 星期
        'weekday.mon': '周一',
        'weekday.tue': '周二',
        'weekday.wed': '周三',
        'weekday.thu': '周四',
        'weekday.fri': '周五',
        'weekday.sat': '周六',
        'weekday.sun': '周日',

        // 问候语
        'greeting.night': '夜深了，注意休息',
        'greeting.morning': '早上好，开启新的一天',
        'greeting.noon': '午安，记得小憩',
        'greeting.afternoon': '下午好，继续加油',
        'greeting.evening': '晚上好，享受闲暇',

        // 主页
        'home.noResults': '未找到相关应用',

        // 通用
        'common.settings': '设置',
        'common.save': '保存更改',
        'common.cancel': '取消',
        'common.language': '语言',
    },
    'en': {
        // Search engine settings
        'search.useCustomEngine': 'Use Custom Search Engine',
        'search.usingCustom': 'Currently using custom search engines configured in this extension',
        'search.usingChrome': 'Currently following Chrome browser\'s default search engine settings',
        'search.switchToChrome': 'Switch to Chrome Default',
        'search.enableCustom': 'Enable Custom Search',
        'search.followChrome': 'Follow Chrome Browser Settings',
        'search.followChromeDesc': 'Search will use the default search engine set in Chrome. To change it, go to Chrome Settings → Search engine.',
        'search.customEngines': 'Custom Search Engines',
        'search.addPreset': 'Add Preset',
        'search.custom': 'Custom',
        'search.urlHint': 'Click the star to set as default. Use {query} as the search term placeholder in URL.',
        'search.noEngines': 'No search engines. Click the button above to add.',
        'search.engineName': 'Search engine name',
        'search.engineUrl': 'Search URL, use {query} as keyword placeholder',
        'search.customIconUrl': 'Custom Icon URL',
        'search.setDefault': 'Set as Default',
        'search.currentDefault': 'Current Default',
        'search.delete': 'Delete',
        'search.searchWith': 'Search with {name}',
        'search.searchWithChrome': 'Search with Chrome default search engine',
        'search.placeholder': 'Search here',

        // Settings page
        'settings.title': 'Settings',
        'settings.save': 'Save Changes',
        'settings.cancel': 'Cancel',
        'settings.tabs.general': 'General',
        'settings.tabs.links': 'Links',
        'settings.tabs.widgets': 'Widgets',
        'settings.tabs.sections': 'Categories',
        'settings.tabs.search': 'Search Engine',
        'settings.tabs.countdown': 'Countdown',
        'settings.tabs.about': 'About',
        'settings.language': 'Interface Language',
        'settings.languageDesc': 'Choose the display language for this extension',

        // General settings
        'settings.siteInfo': 'Site Information',
        'settings.siteTitle': 'Site Title',
        'settings.favicon': 'Favicon URL / Upload Image',
        'settings.uploadImage': 'Upload Image',
        'settings.clearIcon': 'Clear Icon',
        'settings.icpBeian': 'ICP Registration Number',
        'settings.userInfo': 'User Information',
        'settings.adminName': 'Admin Username',
        'settings.githubLink': 'GitHub Link',
        'settings.weatherSettings': 'Weather Settings',
        'settings.amapApiKey': 'Amap API Key',
        'settings.cityAdcode': 'City Adcode (Weather Location)',
        'settings.autoLocate': 'Leave empty for auto-location',
        'settings.personalization': 'Personalization & Backup',
        'settings.customWallpaper': 'Custom Wallpaper',
        'settings.wallpaperHint': 'Supports URL or local image upload (max 2MB). Leave empty for default background.',
        'settings.uploadBg': 'Upload Background',
        'settings.clearBg': 'Clear Background',
        'settings.exportConfig': 'Export Config',
        'settings.importConfig': 'Import Config',
        'settings.importSuccess': 'Configuration imported successfully. Click Save to apply.',
        'settings.importError': 'Import failed: Invalid file format',
        'settings.iconTooLarge': 'Icon file too large. Please choose an image under 100KB.',
        'settings.bgTooLarge': 'Background image too large. Please choose an image under 2MB.',
        'settings.icpPlaceholder': 'e.g. ICP12345678',
        'settings.wallpaperPlaceholder': 'Enter image URL or upload local image',
        'settings.bgPreview': 'Background Preview',

        // Widgets
        'widgets.description': 'Select widgets to display in the sidebar carousel.',
        'widgets.github': 'GitHub Card',
        'widgets.note': 'Quick Note',
        'widgets.pomodoro': 'Pomodoro Timer',
        'widgets.hitokoto': 'Daily Quote',
        'widgets.calendar': 'Calendar',
        'widgets.clock': 'Analog Clock',

        // Countdown
        'countdown.title': 'Important Days',
        'countdown.hint': 'Tip: Only the first 3 events are shown on the homepage. Use arrows to reorder. Past dates show elapsed days.',
        'countdown.addEvent': 'Add New Event',
        'countdown.newEvent': 'New Event',
        'countdown.eventName': 'Event Name',
        'countdown.fixedDate': 'Fixed Date',
        'countdown.monthly': 'Monthly',
        'countdown.weekly': 'Weekly',
        'countdown.everyMonth': 'Every',
        'countdown.day': 'th',
        'countdown.everyWeek': 'Every',
        'countdown.today': 'Today',
        'countdown.tomorrow': 'Tomorrow',
        'countdown.ongoing': 'Right Now',
        'countdown.duration': 'Duration (days)',

        // Weekdays
        'weekday.mon': 'Monday',
        'weekday.tue': 'Tuesday',
        'weekday.wed': 'Wednesday',
        'weekday.thu': 'Thursday',
        'weekday.fri': 'Friday',
        'weekday.sat': 'Saturday',
        'weekday.sun': 'Sunday',

        // Greetings
        'greeting.night': 'It\'s late, get some rest',
        'greeting.morning': 'Good morning, start a new day',
        'greeting.noon': 'Good noon, time for a break',
        'greeting.afternoon': 'Good afternoon, keep going',
        'greeting.evening': 'Good evening, enjoy your time',

        // Home
        'home.noResults': 'No matching apps found',

        // Common
        'common.settings': 'Settings',
        'common.save': 'Save Changes',
        'common.cancel': 'Cancel',
        'common.language': 'Language',
    }
}


// 支持的语言列表
export const SUPPORTED_LANGUAGES = [
    { code: 'zh-CN', name: '简体中文' },
    { code: 'en', name: 'English' },
]

// 存储键
const LANGUAGE_STORAGE_KEY = 'trah_nav_language'

// 检测浏览器语言
const detectBrowserLanguage = () => {
    const lang = navigator.language || navigator.userLanguage
    if (lang.startsWith('zh')) return 'zh-CN'
    return 'en'
}

// 从存储中加载语言设置
const loadSavedLanguage = () => {
    try {
        const saved = localStorage.getItem(LANGUAGE_STORAGE_KEY)
        if (saved && translations[saved]) {
            return saved
        }
    } catch (e) {
        // localStorage 不可用
    }
    return detectBrowserLanguage()
}

// 当前语言（优先使用保存的设置，否则检测浏览器语言）
let currentLanguage = loadSavedLanguage()

// 语言变更监听器
const listeners = new Set()

/**
 * 设置当前语言
 * @param {string} lang - 语言代码 (zh-CN, en)
 */
export const setLanguage = (lang) => {
    if (translations[lang]) {
        currentLanguage = lang
        // 保存到 localStorage
        try {
            localStorage.setItem(LANGUAGE_STORAGE_KEY, lang)
        } catch (e) {
            // localStorage 不可用
        }
        // 通知所有监听器
        listeners.forEach(listener => listener(lang))
    }
}

/**
 * 获取当前语言
 * @returns {string} 当前语言代码
 */
export const getLanguage = () => currentLanguage

/**
 * 翻译函数
 * @param {string} key - 翻译键
 * @param {object} params - 替换参数
 * @returns {string} 翻译后的文本
 */
export const t = (key, params = {}) => {
    const langDict = translations[currentLanguage] || translations['zh-CN']
    let text = langDict[key] || translations['zh-CN'][key] || key

    // 替换参数 {name} -> value
    Object.keys(params).forEach(param => {
        text = text.replace(`{${param}}`, params[param])
    })

    return text
}

/**
 * 订阅语言变更
 * @param {function} callback - 语言变更时的回调
 * @returns {function} 取消订阅函数
 */
export const onLanguageChange = (callback) => {
    listeners.add(callback)
    return () => listeners.delete(callback)
}

/**
 * React Hook: 使用翻译
 * 当语言变更时自动重新渲染
 */
import { useState, useEffect, useCallback } from 'react'

export const useTranslation = () => {
    const [lang, setLang] = useState(currentLanguage)

    useEffect(() => {
        const unsubscribe = onLanguageChange((newLang) => {
            setLang(newLang)
        })
        return unsubscribe
    }, [])

    const translate = useCallback((key, params = {}) => {
        return t(key, params)
    }, [lang])

    return {
        t: translate,
        language: lang,
        setLanguage,
        languages: SUPPORTED_LANGUAGES,
    }
}

export default {
    t,
    setLanguage,
    getLanguage,
    useTranslation,
    SUPPORTED_LANGUAGES,
}
