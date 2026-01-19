import { useState, useEffect, useMemo, useRef } from 'react'
import { pinyin } from 'pinyin-pro'
import { Solar } from 'lunar-javascript'
import { RiSearch2Line, RiGhostLine, RiGoogleFill, RiMicrosoftFill } from '@remixicon/react'
import { linksData as defaultLinksData } from './data/links'
import { getIconByName } from './utils/iconMap'
import WeatherCard from './components/widgets/main/WeatherCard'
import CountdownCard from './components/widgets/main/CountdownCard'
import UserProfile from './components/widgets/main/UserProfile'
import LinkSection from './components/links/LinkSection'
import SettingsModal from './components/settings/SettingsModal'

// 默认分类配置
const defaultSections = [
    { id: 'dev', title: '开发工具', colorClass: 'bg-cyan-500' },
    { id: 'ai', title: 'AI 工具', colorClass: 'bg-violet-500' },
    { id: 'productivity', title: '效率工具', colorClass: 'bg-emerald-500' },
    { id: 'social', title: '社交媒体', colorClass: 'bg-blue-500' },
    { id: 'media', title: '媒体娱乐', colorClass: 'bg-rose-500' },
]

// 默认配置
const defaultConfig = {
    // 网站基础信息
    siteTitle: 'My Nav | Bento Dashboard',
    favicon: '',
    icpBeian: '',
    // 用户信息
    username: 'User',
    githubUrl: 'https://github.com',
    // 天气设置
    weatherKey: '',
    weatherAdcode: '',
    // 个性化
    backgroundImage: '',
    // 轮播组件
    enabledWidgets: ['github'],
    // 倒计时事件
    countdownEvents: [
        { id: 1, title: '周末', type: 'weekly', value: '6', color: 'text-blue-500', bg: 'bg-blue-400' },
        { id: 2, title: '月末', type: 'monthly', value: '28', color: 'text-emerald-500', bg: 'bg-emerald-400' },
        { id: 3, title: '新年', type: 'date', value: '2027-01-01', color: 'text-rose-500', bg: 'bg-rose-400' },
    ]
}

// 从 localStorage 加载配置
function loadConfig() {
    try {
        const saved = localStorage.getItem('trah-nav-config')
        if (saved) {
            return { ...defaultConfig, ...JSON.parse(saved) }
        }
    } catch (e) {
        console.warn('加载配置失败:', e)
    }
    return defaultConfig
}

// 从 localStorage 加载 links 数据
function loadLinks() {
    try {
        const saved = localStorage.getItem('trah-nav-links')
        if (saved) {
            const parsed = JSON.parse(saved)
            // 将字符串图标名称转换回组件
            return parsed.map(item => ({
                ...item,
                icon: typeof item.icon === 'string' ? getIconByName(item.icon) : item.icon
            }))
        }
    } catch (e) {
        console.warn('加载链接数据失败:', e)
    }
    return defaultLinksData
}

// 从 localStorage 加载 sections 数据
function loadSections() {
    try {
        const saved = localStorage.getItem('trah-nav-sections')
        if (saved) {
            return JSON.parse(saved)
        }
    } catch (e) {
        console.warn('加载分类数据失败:', e)
    }
    return defaultSections
}

const App = () => {
    const [time, setTime] = useState(new Date())
    const [search, setSearch] = useState('')
    const [greeting, setGreeting] = useState('')
    const [config, setConfig] = useState(loadConfig)
    const [links, setLinks] = useState(loadLinks)
    const [sections, setSections] = useState(loadSections)
    const [settingsOpen, setSettingsOpen] = useState(false)
    const searchInputRef = useRef(null)

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000)

        const hour = new Date().getHours()
        if (hour < 6) setGreeting('夜深了，注意休息')
        else if (hour < 11) setGreeting('早上好，开启新的一天')
        else if (hour < 14) setGreeting('午安，记得小憩')
        else if (hour < 18) setGreeting('下午好，继续加油')
        else setGreeting('晚上好，享受闲暇')

        // 快捷键支持
        const handleKeyDown = (e) => {
            // 如果当前焦点在任何输入框或文本域中，不触发快捷键
            const activeEl = document.activeElement
            const isInputFocused = activeEl?.tagName === 'INPUT' ||
                activeEl?.tagName === 'TEXTAREA' ||
                activeEl?.isContentEditable

            if (e.key === '/' && !isInputFocused) {
                e.preventDefault()
                searchInputRef.current?.focus()
            }
            if (e.key === 'Escape') {
                searchInputRef.current?.blur()
                setSearch('')
            }
        }

        document.addEventListener('keydown', handleKeyDown)
        return () => {
            clearInterval(timer)
            document.removeEventListener('keydown', handleKeyDown)
        }
    }, [])

    // 动态更新网站标题和 favicon
    useEffect(() => {
        document.title = config.siteTitle || 'TRAH_Nav'

        // 更新 favicon
        if (config.favicon) {
            let link = document.querySelector("link[rel~='icon']")
            if (!link) {
                link = document.createElement('link')
                link.rel = 'icon'
                document.head.appendChild(link)
            }
            link.href = config.favicon
        }
    }, [config.siteTitle, config.favicon])

    const handleSaveConfig = (newConfig) => {
        setConfig(newConfig)
        localStorage.setItem('trah-nav-config', JSON.stringify(newConfig))
    }

    // 处理 links 数据更新（从导入）
    const handleLinksChange = (newLinks) => {
        // 将字符串图标名称转换回组件
        const processedLinks = newLinks.map(item => ({
            ...item,
            icon: typeof item.icon === 'string' ? getIconByName(item.icon) : item.icon
        }))
        setLinks(processedLinks)
        // 存储时保存字符串形式的图标名称
        const linksToSave = newLinks.map(item => ({
            ...item,
            icon: typeof item.icon === 'string' ? item.icon : (item.icon.name || item.icon.displayName || 'RiLinkLine')
        }))
        localStorage.setItem('trah-nav-links', JSON.stringify(linksToSave))
    }

    // 处理 sections 数据更新
    const handleSectionsChange = (newSections) => {
        setSections(newSections)
        localStorage.setItem('trah-nav-sections', JSON.stringify(newSections))
    }

    const getPinyinMatch = (text, query) => {
        if (!query) return false
        const pinyinFull = pinyin(text, { toneType: 'none', type: 'array' }).join('').toLowerCase()
        const pinyinShort = pinyin(text, { pattern: 'first', toneType: 'none', type: 'array' }).join('').toLowerCase()
        const q = query.toLowerCase()
        return text.toLowerCase().includes(q) || pinyinFull.includes(q) || pinyinShort.includes(q)
    }

    const filteredLinks = useMemo(() => {
        // 如果以 / 开头（搜索引擎命令），显示全部站点
        if (!search || search.startsWith('/')) return links
        return links.filter(item => {
            const fullText = item.title + item.desc + item.tags.join('')
            return getPinyinMatch(fullText, search)
        })
    }, [search, links])

    const getGroup = (cat) => filteredLinks.filter(l => l.category === cat)

    // 根据 sections 动态生成分组
    const linkGroups = sections.map(section => ({
        ...section,
        links: getGroup(section.id)
    }))

    const hasResults = filteredLinks.length > 0

    // 获取农历和节日信息
    const getLunarInfo = () => {
        const solar = Solar.fromDate(time)
        const lunar = solar.getLunar()

        // 农历日期
        const lunarDate = `${lunar.getMonthInChinese()}月${lunar.getDayInChinese()}`

        // 获取节日（优先级：公历节日 > 农历节日 > 节气）
        const solarFestivals = solar.getFestivals()
        const lunarFestivals = lunar.getFestivals()
        const jieQi = lunar.getJieQi()

        let festival = ''
        if (solarFestivals.length > 0) {
            festival = solarFestivals[0]
        } else if (lunarFestivals.length > 0) {
            festival = lunarFestivals[0]
        } else if (jieQi) {
            festival = jieQi
        }

        return { lunarDate, festival }
    }

    const { lunarDate, festival } = getLunarInfo()

    // 搜索引擎快捷键处理
    const handleSearchKeyDown = (e) => {
        if (e.key === 'Enter') {
            const val = search.trim()
            if (val.startsWith('/g')) {
                const query = val.substring(2).trim()
                if (query) {
                    window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`, '_blank')
                    setSearch('')
                }
                return
            }
            if (val.startsWith('/b')) {
                const query = val.substring(2).trim()
                if (query) {
                    window.open(`https://www.bing.com/search?q=${encodeURIComponent(query)}`, '_blank')
                    setSearch('')
                }
                return
            }
        }
    }

    // 自定义壁纸样式
    const containerStyle = config.backgroundImage ? {
        backgroundImage: `url(${config.backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
    } : {}

    return (
        <div className="min-h-screen relative" style={containerStyle}>
            {/* 壁纸遮罩层，确保文字可读性 */}
            {config.backgroundImage && (
                <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-0" />
            )}

            <div className="relative z-10 p-4 md:p-8 flex items-center justify-center min-h-screen">
                <div className="max-w-[1400px] w-full mx-auto grid grid-cols-1 md:grid-cols-12 gap-5 auto-rows-min">

                    <div className="col-span-12 lg:col-span-5 flex flex-col justify-center py-4 px-2">
                        <div>
                            <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold text-slate-800 font-mono tracking-wide">
                                {time.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                            </h1>
                            <div className="flex items-center flex-wrap gap-2 mt-3">
                                <span className="px-4 py-1.5 rounded-full bg-slate-200 text-slate-600 text-sm font-bold uppercase tracking-wider">
                                    {time.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric', weekday: 'short' })}
                                </span>
                                <span className="px-3 py-1.5 rounded-full bg-amber-100 text-amber-700 text-sm font-medium">
                                    {lunarDate}
                                </span>
                                {festival && (
                                    <span className="px-3 py-1.5 rounded-full bg-rose-100 text-rose-600 text-sm font-medium">
                                        {festival}
                                    </span>
                                )}
                                <p className="text-slate-500 font-medium text-lg">{greeting}</p>
                            </div>

                            <div className="mt-8 relative max-w-md group">
                                {/* Icon */}
                                <div className="absolute inset-y-0 left-0 pl-0 flex items-center pointer-events-none transition-transform duration-300 group-focus-within:scale-110 group-focus-within:-translate-y-0.5">
                                    <RiSearch2Line size={20} className="text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                                </div>

                                {/* Input */}
                                <input
                                    ref={searchInputRef}
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    onKeyDown={handleSearchKeyDown}
                                    placeholder="Type / to search..."
                                    className="block w-full pl-8 pr-12 py-3 bg-transparent border-b-2 border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-transparent transition-all font-sans text-lg relative z-10"
                                />

                                {/* Animated Bottom Line */}
                                <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-gradient-to-r from-blue-400 to-cyan-400 transition-all duration-500 ease-out group-focus-within:w-full z-20"></div>

                                {/* Shortcut Hint */}
                                <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none opacity-100 group-focus-within:opacity-0 transition-opacity duration-200">
                                    <kbd className="hidden sm:inline-block px-2 py-0.5 bg-slate-100 border border-slate-200 rounded text-xs text-slate-400 font-mono">/</kbd>
                                </div>

                                {/* Google Search Hint */}
                                {search.startsWith('/g') && (
                                    <div className="absolute top-full left-0 right-0 mt-2 bg-white/80 backdrop-blur-md border border-blue-100 rounded-xl p-3 shadow-lg z-30 flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-500">
                                            <RiGoogleFill size={18} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="text-xs font-bold text-blue-600 uppercase tracking-wider">Google Search</div>
                                            <div className="text-sm text-slate-700 truncate font-medium">
                                                {search.substring(2).trim() || '输入搜索关键词...'}
                                            </div>
                                        </div>
                                        <div className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-400 font-mono border border-slate-200">ENTER</div>
                                    </div>
                                )}

                                {/* Bing Search Hint */}
                                {search.startsWith('/b') && !search.startsWith('/g') && (
                                    <div className="absolute top-full left-0 right-0 mt-2 bg-white/80 backdrop-blur-md border border-sky-100 rounded-xl p-3 shadow-lg z-30 flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-sky-100 flex items-center justify-center text-sky-600">
                                            <RiMicrosoftFill size={18} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="text-xs font-bold text-sky-600 uppercase tracking-wider">Bing Search</div>
                                            <div className="text-sm text-slate-700 truncate font-medium">
                                                {search.substring(2).trim() || '输入搜索关键词...'}
                                            </div>
                                        </div>
                                        <div className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-400 font-mono border border-slate-200">ENTER</div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="col-span-12 md:col-span-6 lg:col-span-2 min-h-[180px] sm:min-h-[220px]">
                        <WeatherCard apiKey={config.weatherKey} adcode={config.weatherAdcode} />
                    </div>

                    <div className="col-span-12 md:col-span-6 lg:col-span-3 min-h-[180px] sm:min-h-[220px]">
                        <CountdownCard events={config.countdownEvents} />
                    </div>

                    <UserProfile
                        username={config.username}
                        githubUrl={config.githubUrl}
                        onSettingsClick={() => setSettingsOpen(true)}
                        enabledWidgets={config.enabledWidgets}
                        time={time}
                    />

                    {linkGroups.map((group, index) => (
                        <LinkSection
                            key={group.id}
                            title={group.title}
                            index={index + 1}
                            colorClass={group.colorClass}
                            links={group.links}
                        />
                    ))}

                    {!hasResults && (
                        <div className="col-span-12 py-20 text-center">
                            <RiGhostLine size={36} className="text-slate-300 mb-4 inline-block" />
                            <p className="text-slate-500">未找到相关应用</p>
                        </div>
                    )}

                    {/* ICP 备案号 */}
                    {config.icpBeian && (
                        <div className="col-span-12 text-center py-4 mt-8">
                            <a
                                href="https://beian.miit.gov.cn/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-slate-400 hover:text-slate-600 transition-colors"
                            >
                                {config.icpBeian}
                            </a>
                        </div>
                    )}

                </div>
            </div>

            <SettingsModal
                isOpen={settingsOpen}
                onClose={() => setSettingsOpen(false)}
                config={config}
                onSave={handleSaveConfig}
                linksData={links}
                onLinksChange={handleLinksChange}
                sections={sections}
                onSectionsChange={handleSectionsChange}
            />
        </div>
    )
}

export default App
