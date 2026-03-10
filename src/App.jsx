import { useState, useEffect, useMemo, useRef, useCallback } from 'react'
import { pinyin } from 'pinyin-pro'
import { Solar } from 'lunar-javascript'
import { RiSearch2Line, RiGhostLine, RiGoogleFill, RiMicrosoftFill, RiSearchLine, RiEdit2Line, RiCheckLine } from '@remixicon/react'
import { linksData as defaultLinksData } from './data/links'
import { getIconByName } from './utils/iconMap'
import { useTranslation } from './utils/i18n'
import { getStorageItem, setStorageItem, STORAGE_KEYS, migrateFromLocalStorage, onStorageChange } from './utils/storage'
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

// 默认搜索引擎
const defaultSearchEngines = [
    { id: 'google', name: 'Google', url: 'https://www.google.com/search?q={query}', icon: 'google', iconUrl: '', color: 'text-blue-500', bgColor: 'bg-blue-100' },
    { id: 'bing', name: 'Bing', url: 'https://www.bing.com/search?q={query}', icon: 'bing', iconUrl: '', color: 'text-sky-600', bgColor: 'bg-sky-100' },
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
    // 搜索引擎设置
    useCustomSearch: false,  // 默认使用 Chrome 浏览器的默认搜索引擎
    searchEngines: defaultSearchEngines,
    defaultSearchEngine: 'google',
    // 倒计时事件
    countdownEvents: [
        { id: 1, title: '周末', type: 'weekly', value: '6', color: 'text-blue-500', bg: 'bg-blue-400' },
        { id: 2, title: '月末', type: 'monthly', value: '28', color: 'text-emerald-500', bg: 'bg-emerald-400' },
        { id: 3, title: '新年', type: 'date', value: '2027-01-01', color: 'text-rose-500', bg: 'bg-rose-400' },
    ]
}

// 处理 links 数据，将字符串图标名称转换为组件
function processLinks(linksData) {
    if (!linksData || !Array.isArray(linksData)) return defaultLinksData
    return linksData.map(item => ({
        ...item,
        icon: typeof item.icon === 'string' ? getIconByName(item.icon) : item.icon
    }))
}

const App = () => {
    const [time, setTime] = useState(new Date())
    const [search, setSearch] = useState('')
    const [config, setConfig] = useState(defaultConfig)
    const [links, setLinks] = useState(defaultLinksData)
    const [sections, setSections] = useState(defaultSections)
    const [settingsOpen, setSettingsOpen] = useState(false)
    const [searchError, setSearchError] = useState(false)
    const [isLoading, setIsLoading] = useState(true)  // 加载状态
    const [isEditMode, setIsEditMode] = useState(false)
    const [draggedItem, setDraggedItem] = useState(null)
    const [dropTarget, setDropTarget] = useState(null)
    const searchInputRef = useRef(null)
    const isComposingRef = useRef(false)  // 跟踪输入法组合状态
    const { t } = useTranslation()

    // 动态计算问候语 - 根据时间和语言自动更新
    const greeting = useMemo(() => {
        const hour = time.getHours()
        if (hour < 6) return t('greeting.night')
        else if (hour < 11) return t('greeting.morning')
        else if (hour < 14) return t('greeting.noon')
        else if (hour < 18) return t('greeting.afternoon')
        else return t('greeting.evening')
    }, [time, t])

    // 异步加载存储数据
    useEffect(() => {
        const loadStorageData = async () => {
            try {
                // 先执行数据迁移（从 localStorage 迁移到 chrome.storage.sync）
                await migrateFromLocalStorage()

                // 并行加载所有数据
                const [savedConfig, savedLinks, savedSections] = await Promise.all([
                    getStorageItem(STORAGE_KEYS.CONFIG, null),
                    getStorageItem(STORAGE_KEYS.LINKS, null),
                    getStorageItem(STORAGE_KEYS.SECTIONS, null),
                ])

                if (savedConfig) {
                    setConfig({ ...defaultConfig, ...savedConfig })
                }
                if (savedLinks) {
                    setLinks(processLinks(savedLinks))
                }
                if (savedSections) {
                    setSections(savedSections)
                }
            } catch (e) {
                console.warn('加载存储数据失败:', e)
            } finally {
                setIsLoading(false)
            }
        }

        loadStorageData()

        // 监听存储变化（多标签页/设备同步）
        const unsubscribe = onStorageChange(async (changes) => {
            if (changes[STORAGE_KEYS.CONFIG]?.newValue) {
                setConfig({ ...defaultConfig, ...changes[STORAGE_KEYS.CONFIG].newValue })
            }
            if (changes[STORAGE_KEYS.LINKS]?.newValue) {
                setLinks(processLinks(changes[STORAGE_KEYS.LINKS].newValue))
            }
            if (changes[STORAGE_KEYS.SECTIONS]?.newValue) {
                setSections(changes[STORAGE_KEYS.SECTIONS].newValue)
            }
        })

        return () => unsubscribe()
    }, [])

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000)

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

    // 保存配置（使用 useCallback 避免不必要的重渲染）
    const handleSaveConfig = useCallback(async (newConfig) => {
        setConfig(newConfig)
        await setStorageItem(STORAGE_KEYS.CONFIG, newConfig)
    }, [])

    // 处理 links 数据更新（从导入）
    const handleLinksChange = useCallback(async (newLinks) => {
        // 将字符串图标名称转换回组件用于显示
        const processedLinks = processLinks(newLinks)
        setLinks(processedLinks)
        // 存储时保存字符串形式的图标名称
        const linksToSave = newLinks.map(item => ({
            ...item,
            icon: typeof item.icon === 'string' ? item.icon : (item.icon.name || item.icon.displayName || 'RiLinkLine')
        }))
        await setStorageItem(STORAGE_KEYS.LINKS, linksToSave)
    }, [])

    // 处理 sections 数据更新
    const handleSectionsChange = useCallback(async (newSections) => {
        setSections(newSections)
        await setStorageItem(STORAGE_KEYS.SECTIONS, newSections)
    }, [])

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

    const linkGroups = sections.map(section => ({
        ...section,
        links: getGroup(section.id)
    }))

    // 拖拽相关逻辑
    const handleDragStart = (e, link) => {
        setDraggedItem(link)
        setDropTarget(null)
        e.dataTransfer.effectAllowed = 'move'
    }

    const handleDragOver = (e, targetCategoryId, index) => {
        e.preventDefault()
        e.stopPropagation()
        if (!isEditMode) return

        if (index !== null) {
            const rect = e.currentTarget.getBoundingClientRect()
            const position = (e.clientX - rect.left) < (rect.width / 2) ? 'before' : 'after'

            let targetIndex = index
            if (position === 'after') {
                targetIndex += 1
            }

            setDropTarget(prev => {
                if (prev?.sectionId === targetCategoryId && prev?.index === targetIndex) return prev
                return { sectionId: targetCategoryId, index: targetIndex }
            })
        } else {
            // Dragging over empty section
            setDropTarget(prev => {
                if (prev?.sectionId === targetCategoryId && prev?.index === 0) return prev
                return { sectionId: targetCategoryId, index: 0 }
            })
        }
    }

    const handleDragEnd = () => {
        setDraggedItem(null)
        setDropTarget(null)
    }

    const handleDrop = (e) => {
        e.preventDefault()
        e.stopPropagation()
        if (!draggedItem || !dropTarget) {
            handleDragEnd()
            return
        }

        let newLinks = [...links]
        const sourceIndex = newLinks.findIndex(l => l.url === draggedItem.url && l.title === draggedItem.title)

        if (sourceIndex === -1) {
            handleDragEnd()
            return
        }

        const targetSectionLinks = newLinks.filter(l => l.category === dropTarget.sectionId)
        const referenceLink = targetSectionLinks[dropTarget.index]

        const [removedItem] = newLinks.splice(sourceIndex, 1)
        removedItem.category = dropTarget.sectionId

        if (referenceLink && referenceLink !== draggedItem) {
            const insertIndex = newLinks.findIndex(l => l === referenceLink)
            if (insertIndex !== -1) {
                newLinks.splice(insertIndex, 0, removedItem)
            } else {
                newLinks.push(removedItem)
            }
        } else if (referenceLink === draggedItem) {
            newLinks.splice(sourceIndex, 0, removedItem)
        } else {
            newLinks.push(removedItem)
        }

        setLinks(newLinks)
        handleDragEnd()
    }

    const toggleEditMode = () => {
        if (isEditMode) {
            // 退出的时候保存
            handleLinksChange(links)
        } else {
            setSearch('')
        }
        setIsEditMode(!isEditMode)
    }

    const handleDeleteLink = (itemToDelete) => {
        if (window.confirm(`确定要删除 "${itemToDelete.title}" 吗？`)) {
            const newLinks = links.filter(l => !(l.url === itemToDelete.url && l.title === itemToDelete.title))
            setLinks(newLinks)
            // 如果在编辑模式下，最好也立即保存一下
            handleLinksChange(newLinks)
        }
    }

    const hasResults = filteredLinks.length > 0

    // 获取农历和节日信息
    const getLunarInfo = () => {
        const solar = Solar.fromDate(time)
        const lunar = solar.getLunar()

        const lunarMonthCh = lunar.getMonthInChinese()
        const lunarDayCh = lunar.getDayInChinese()
        const lunarMonthNum = lunar.getMonth()
        const lunarDayNum = lunar.getDay()

        // 农历日期
        const isLeap = lunarMonthNum < 0 ? t('lunar.leap') : ''
        const lunarDate = t('lunar.date', {
            monthCh: lunarMonthCh,
            dayCh: lunarDayCh,
            monthNum: Math.abs(lunarMonthNum),
            dayNum: lunarDayNum,
            isLeap
        })

        // 获取节日（优先级：公历节日 > 农历节日 > 节气）
        const solarFestivals = solar.getFestivals()
        const lunarFestivals = lunar.getFestivals()
        const jieQi = lunar.getJieQi()

        let rawFestival = ''
        if (solarFestivals.length > 0) {
            rawFestival = solarFestivals[0]
        } else if (lunarFestivals.length > 0) {
            rawFestival = lunarFestivals[0]
        } else if (jieQi) {
            rawFestival = jieQi
        }

        // 尝试翻译节日
        let festival = ''
        if (rawFestival) {
            const festivalKey = `festival.${rawFestival}`
            const translatedFestival = t(festivalKey)
            // 如果未能翻译（返回了 key），则回退到原始中文名称
            festival = translatedFestival === festivalKey ? rawFestival : translatedFestival
        }

        return { lunarDate, festival }
    }

    const { lunarDate, festival } = getLunarInfo()

    // 执行搜索
    // 根据配置决定使用 Chrome Search API 还是自定义搜索引擎
    const executeSearch = (query) => {
        if (!query) return

        if (config.useCustomSearch) {
            // 使用自定义搜索引擎
            const engines = config.searchEngines || defaultSearchEngines
            const engine = engines.find(e => e.id === config.defaultSearchEngine) || engines[0]
            if (engine) {
                const url = engine.url.replace('{query}', encodeURIComponent(query))
                window.open(url, '_blank')
            }
        } else {
            // 使用 Chrome Search API，尊重用户浏览器设置
            if (typeof chrome !== 'undefined' && chrome.search && chrome.search.query) {
                chrome.search.query({
                    text: query,
                    disposition: 'NEW_TAB'
                })
            } else {
                // 非 Chrome 扩展环境的回退方案（如开发模式）
                window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`, '_blank')
            }
        }
        setSearch('')
    }

    // 输入法组合事件处理
    const handleCompositionStart = () => {
        isComposingRef.current = true
    }

    const handleCompositionEnd = () => {
        isComposingRef.current = false
    }

    // 搜索引擎快捷键处理
    const handleSearchKeyDown = (e) => {
        // 如果正在使用输入法组合（如中文拼音输入），不触发搜索
        // 这样按回车只会上屏拼音，而不会同时触发搜索
        if (e.key === 'Enter' && !isComposingRef.current) {
            const val = search.trim()
            if (!val) return
            executeSearch(val)
        }
    }

    // 获取默认搜索引擎
    const getDefaultEngine = () => {
        const engines = config.searchEngines || defaultSearchEngines
        return engines.find(e => e.id === config.defaultSearchEngine) || engines[0]
    }

    // 搜索引擎图标映射
    const engineIconMap = {
        google: RiGoogleFill,
        bing: RiMicrosoftFill,
    }

    // 点击搜索按钮
    const handleSearchButtonClick = () => {
        const val = search.trim()
        if (!val) {
            // 空输入时触发报错动画
            setSearchError(true)
            searchInputRef.current?.focus()
            setTimeout(() => setSearchError(false), 500)
            return
        }
        executeSearch(val)
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

            <div className="relative z-10 p-4 md:p-8 flex items-start justify-center min-h-screen pt-8 md:pt-16">
                <div className="max-w-[1400px] w-full mx-auto grid grid-cols-1 md:grid-cols-12 gap-5 auto-rows-min">

                    <div className="col-span-12 lg:col-span-5 flex flex-col justify-center py-4 px-2">
                        <div>
                            <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold text-slate-800 font-mono tracking-wide">
                                {time.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                            </h1>
                            <div className="flex items-center flex-wrap gap-2 mt-3">
                                <span className="px-4 py-1.5 rounded-full bg-slate-200 text-slate-600 text-sm font-bold uppercase tracking-wider">
                                    {time.toLocaleDateString(t('date.format'), { month: 'short', day: 'numeric', weekday: 'short' })}
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
                                <div className="flex items-center gap-2">
                                    {/* 搜索输入框容器 */}
                                    <div className="flex-1 relative">
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
                                            onCompositionStart={handleCompositionStart}
                                            onCompositionEnd={handleCompositionEnd}
                                            placeholder={t('search.placeholder')}
                                            className={`block w-full pl-8 pr-4 py-3 bg-transparent border-b-2 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-transparent transition-all font-sans text-lg relative z-10 ${searchError ? 'border-red-400 animate-shake' : 'border-slate-200'}`}
                                        />

                                        {/* Animated Bottom Line */}
                                        <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-gradient-to-r from-blue-400 to-cyan-400 transition-all duration-500 ease-out group-focus-within:w-full z-20"></div>
                                    </div>

                                    {/* 搜索按钮 - 根据搜索模式显示不同图标 */}
                                    {(() => {
                                        // 如果使用自定义搜索引擎，显示对应引擎图标
                                        if (config.useCustomSearch) {
                                            const engine = getDefaultEngine()
                                            let iconContent
                                            if (engine?.iconUrl) {
                                                iconContent = <img src={engine.iconUrl} alt={engine.name} className="w-5 h-5 object-contain" />
                                            } else if (engine?.iconName) {
                                                const CustomIcon = getIconByName(engine.iconName)
                                                iconContent = <CustomIcon size={20} />
                                            } else {
                                                const IconComponent = engineIconMap[engine?.icon] || RiSearchLine
                                                iconContent = <IconComponent size={20} />
                                            }
                                            return (
                                                <button
                                                    onClick={handleSearchButtonClick}
                                                    className={`shrink-0 w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 shadow-md hover:shadow-lg ${engine?.bgColor || 'bg-slate-100'} ${engine?.color || 'text-slate-500'}`}
                                                    title={t('search.searchWith', { name: engine?.name || 'Search' })}
                                                >
                                                    {iconContent}
                                                </button>
                                            )
                                        }
                                        // 使用 Chrome 默认搜索引擎，显示通用搜索图标
                                        return (
                                            <button
                                                onClick={handleSearchButtonClick}
                                                className="shrink-0 w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 shadow-md hover:shadow-lg bg-slate-100 text-slate-600"
                                                title={t('search.searchWithChrome')}
                                            >
                                                <RiSearchLine size={20} />
                                            </button>
                                        )
                                    })()}
                                </div>
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
                            sectionId={group.id}
                            index={index + 1}
                            colorClass={group.colorClass}
                            links={group.links}
                            isEditMode={isEditMode}
                            draggedItem={draggedItem}
                            dropTarget={dropTarget}
                            onDragStart={handleDragStart}
                            onDragOver={handleDragOver}
                            onDrop={handleDrop}
                            onDragEnd={handleDragEnd}
                            onDelete={handleDeleteLink}
                        />
                    ))}

                    {!hasResults && (
                        <div className="col-span-12 py-20 text-center">
                            <RiGhostLine size={36} className="text-slate-300 mb-4 inline-block" />
                            <p className="text-slate-500">{t('home.noResults')}</p>
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

            {/* 编辑模式悬浮按钮 */}
            <button
                onClick={toggleEditMode}
                className={`fixed outline-none bottom-8 right-8 z-[60] w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 shadow-md hover:shadow-lg ${isEditMode
                    ? 'bg-amber-500 text-white shadow-amber-500/30 ring-4 ring-amber-100'
                    : 'bg-white text-slate-600 border border-slate-200 shadow-slate-200/50 hover:bg-slate-50'
                    }`}
                title={isEditMode ? '完成编辑' : '编辑模式'}
            >
                {isEditMode ? <RiCheckLine size={24} /> : <RiEdit2Line size={24} />}
            </button>

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
