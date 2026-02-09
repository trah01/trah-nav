import { useState, useEffect, useRef } from 'react'
import {
    RiCloseLine,
    RiDeleteBinLine,
    RiAddLine,
    RiArrowUpSFill,
    RiArrowDownSFill,
    RiDownloadLine,
    RiUploadLine,
    RiImageLine,
    RiGithubFill,
    RiStickyNoteLine,
    RiTimerLine,
    RiDoubleQuotesL,
    RiTimeLine,
    RiCalendarLine,
    RiCheckboxCircleFill,
    RiCheckboxBlankCircleLine,
    RiGlobalLine
} from '@remixicon/react'
import { getIconName } from '../../utils/iconMap'
import { useTranslation, SUPPORTED_LANGUAGES } from '../../utils/i18n'
import LinkManager from '../links/LinkManager'
import SearchEngineSettings from './SearchEngineSettings'

// 可选的轮播组件列表 - 使用翻译键
const WIDGET_OPTIONS = [
    { id: 'github', labelKey: 'widgets.github', icon: RiGithubFill },
    { id: 'note', labelKey: 'widgets.note', icon: RiStickyNoteLine },
    { id: 'pomodoro', labelKey: 'widgets.pomodoro', icon: RiTimerLine },
    { id: 'hitokoto', labelKey: 'widgets.hitokoto', icon: RiDoubleQuotesL },
    { id: 'calendar', labelKey: 'widgets.calendar', icon: RiCalendarLine },
    { id: 'clock', labelKey: 'widgets.clock', icon: RiTimeLine },
]

const WEEKDAY_OPTIONS = [
    { val: '1', labelKey: 'weekday.mon' },
    { val: '2', labelKey: 'weekday.tue' },
    { val: '3', labelKey: 'weekday.wed' },
    { val: '4', labelKey: 'weekday.thu' },
    { val: '5', labelKey: 'weekday.fri' },
    { val: '6', labelKey: 'weekday.sat' },
    { val: '0', labelKey: 'weekday.sun' }
]

const SettingsModal = ({ isOpen, onClose, config, onSave, linksData, onLinksChange, sections, onSectionsChange }) => {
    const [formData, setFormData] = useState(config)
    const [activeTab, setActiveTab] = useState('general')
    const fileInputRef = useRef(null)
    const faviconInputRef = useRef(null)
    const bgImageInputRef = useRef(null)
    const { t, language, setLanguage } = useTranslation()

    useEffect(() => {
        setFormData(config)
    }, [config, isOpen])

    // 模态框打开时禁止 body 滚动
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden'
        }
        return () => {
            document.body.style.overflow = ''
        }
    }, [isOpen])

    if (!isOpen) return null

    // 导出完整配置为单个 JSON 文件
    const handleExport = () => {
        // 将 links 中的图标组件转为字符串名称
        const exportLinks = linksData.map(item => ({
            ...item,
            icon: typeof item.icon === 'string' ? item.icon : getIconName(item.icon)
        }))

        const exportData = {
            config: formData,
            links: exportLinks,
            sections: sections
        }

        // 根据网站标题生成文件名
        const siteName = (formData.siteTitle || 'homepage')
            .replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, '_')
            .replace(/_+/g, '_')
            .toLowerCase()
        const fileName = `${siteName}_backup.json`

        const dataStr = JSON.stringify(exportData, null, 2)
        const blob = new Blob([dataStr], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = fileName
        link.click()
        URL.revokeObjectURL(url)
    }

    // 从 JSON 文件导入配置
    const handleImport = (e) => {
        const file = e.target.files[0]
        if (!file) return
        const reader = new FileReader()
        reader.onload = (event) => {
            try {
                const imported = JSON.parse(event.target.result)

                // 更新 config
                if (imported.config) {
                    const newConfig = { ...formData, ...imported.config }
                    setFormData(newConfig)
                }

                // 更新 links
                if (imported.links && onLinksChange) {
                    onLinksChange(imported.links)
                }

                // 更新 sections
                if (imported.sections && onSectionsChange) {
                    onSectionsChange(imported.sections)
                }

                alert(t('settings.importSuccess'))
            } catch {
                alert(t('settings.importError'))
            }
        }
        reader.readAsText(file)
        e.target.value = ''
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const toggleWidget = (widgetId) => {
        const current = formData.enabledWidgets || []
        const isEnabled = current.includes(widgetId)
        const newWidgets = isEnabled
            ? current.filter(id => id !== widgetId)
            : [...current, widgetId]
        setFormData(prev => ({ ...prev, enabledWidgets: newWidgets }))
    }

    const handleEventChange = (id, field, value) => {
        setFormData(prev => ({
            ...prev,
            countdownEvents: prev.countdownEvents.map(ev =>
                ev.id === id ? { ...ev, [field]: value } : ev
            )
        }))
    }

    const addEvent = () => {
        const newId = Date.now()
        setFormData(prev => ({
            ...prev,
            countdownEvents: [...prev.countdownEvents, {
                id: newId,
                title: t('countdown.newEvent'),
                type: 'date',
                value: new Date().toISOString().split('T')[0],
                duration: 1,
                color: 'text-blue-500',
                bg: 'bg-blue-400'
            }]
        }))
    }

    const removeEvent = (id) => {
        setFormData(prev => ({
            ...prev,
            countdownEvents: prev.countdownEvents.filter(ev => ev.id !== id)
        }))
    }

    const moveEvent = (index, direction) => {
        const newEvents = [...formData.countdownEvents]
        if (direction === 'up' && index > 0) {
            [newEvents[index], newEvents[index - 1]] = [newEvents[index - 1], newEvents[index]]
        } else if (direction === 'down' && index < newEvents.length - 1) {
            [newEvents[index], newEvents[index + 1]] = [newEvents[index + 1], newEvents[index]]
        }
        setFormData(prev => ({ ...prev, countdownEvents: newEvents }))
    }

    const handleFaviconUpload = (e) => {
        const file = e.target.files[0]
        if (!file) return

        if (file.size > 100 * 1024) { // 100KB 限制
            alert(t('settings.iconTooLarge'))
            return
        }

        const reader = new FileReader()
        reader.onload = (event) => {
            setFormData(prev => ({ ...prev, favicon: event.target.result }))
        }
        reader.readAsDataURL(file)
        e.target.value = ''
    }

    const handleBgImageUpload = (e) => {
        const file = e.target.files[0]
        if (!file) return

        if (file.size > 2 * 1024 * 1024) { // 2MB 限制
            alert(t('settings.bgTooLarge'))
            return
        }

        const reader = new FileReader()
        reader.onload = (event) => {
            setFormData(prev => ({ ...prev, backgroundImage: event.target.result }))
        }
        reader.readAsDataURL(file)
        e.target.value = ''
    }

    const handleClearBgImage = () => {
        setFormData(prev => ({ ...prev, backgroundImage: '' }))
    }

    const handleClearFavicon = () => {
        setFormData(prev => ({ ...prev, favicon: '' }))
    }

    const handleSave = () => {
        onSave(formData)
        onClose()
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
            <div className="bg-white rounded-[32px] w-full max-w-2xl shadow-2xl flex flex-col h-[85vh] overflow-hidden">
                {/* Header */}
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-slate-50/30">
                    <h2 className="text-2xl font-bold text-slate-900">{t('settings.title')}</h2>
                    <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full text-slate-600 transition-colors">
                        <RiCloseLine size={24} />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-gray-100 px-6 bg-slate-50/50">
                    {[
                        { id: 'general', label: t('settings.tabs.general') },
                        { id: 'search', label: t('settings.tabs.search') },
                        { id: 'widgets', label: t('settings.tabs.widgets') },
                        { id: 'links', label: t('settings.tabs.links') },
                        { id: 'countdown', label: t('settings.tabs.countdown') }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`py-4 mr-8 text-base font-bold border-b-2 transition-colors ${activeTab === tab.id
                                ? 'border-blue-500 text-blue-700'
                                : 'border-transparent text-slate-500 hover:text-slate-700'
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto flex-1 bg-white">
                    {activeTab === 'general' && (
                        <div className="space-y-6 max-w-lg mx-auto">
                            {/* 语言设置 */}
                            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                                        <RiGlobalLine size={22} className="text-blue-600" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-base font-bold text-slate-900">{t('settings.language')}</h3>
                                        <p className="text-sm text-slate-500">{t('settings.languageDesc')}</p>
                                    </div>
                                    <select
                                        value={language}
                                        onChange={(e) => setLanguage(e.target.value)}
                                        className="px-4 py-2 rounded-xl bg-white border border-slate-300 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                                    >
                                        {SUPPORTED_LANGUAGES.map(lang => (
                                            <option key={lang.code} value={lang.code}>{lang.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* 网站基础信息 */}
                            <div>
                                <h3 className="text-base font-bold text-slate-950 mb-4">{t('settings.siteInfo')}</h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-[15px] font-semibold text-slate-800 mb-1.5">{t('settings.siteTitle')}</label>
                                        <input
                                            type="text"
                                            name="siteTitle"
                                            value={formData.siteTitle || ''}
                                            onChange={handleChange}
                                            placeholder="My Nav"
                                            className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-base text-slate-900"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[15px] font-semibold text-slate-800 mb-1.5">{t('settings.favicon')}</label>
                                        <div className="flex gap-2">
                                            <div className="flex-1 relative">
                                                <input
                                                    type="text"
                                                    name="favicon"
                                                    value={formData.favicon || ''}
                                                    onChange={handleChange}
                                                    placeholder="https://example.com/favicon.ico"
                                                    className="w-full pl-5 pr-12 py-3 rounded-xl bg-slate-50 border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-base text-slate-900"
                                                />
                                                {formData.favicon && (
                                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded overflow-hidden border border-slate-200 bg-white">
                                                        <img src={formData.favicon} alt="Favicon Preview" className="w-full h-full object-contain" />
                                                    </div>
                                                )}
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => faviconInputRef.current?.click()}
                                                className="shrink-0 p-3 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 transition-colors"
                                                title={t('settings.uploadImage')}
                                            >
                                                <RiUploadLine size={20} />
                                            </button>
                                            {formData.favicon && (
                                                <button
                                                    type="button"
                                                    onClick={handleClearFavicon}
                                                    className="shrink-0 p-3 rounded-xl border border-slate-300 text-rose-600 hover:bg-rose-50 transition-colors"
                                                    title={t('settings.clearIcon')}
                                                >
                                                    <RiDeleteBinLine size={20} />
                                                </button>
                                            )}
                                            <input
                                                type="file"
                                                ref={faviconInputRef}
                                                onChange={handleFaviconUpload}
                                                accept="image/*"
                                                className="hidden"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-[15px] font-semibold text-slate-800 mb-1.5">{t('settings.icpBeian')}</label>
                                        <input
                                            type="text"
                                            name="icpBeian"
                                            value={formData.icpBeian || ''}
                                            onChange={handleChange}
                                            placeholder={t('settings.icpPlaceholder')}
                                            className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-base text-slate-900"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="pt-6 border-t border-gray-100">
                                <h3 className="text-base font-bold text-slate-950 mb-4">{t('settings.userInfo')}</h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-[15px] font-semibold text-slate-800 mb-1.5">{t('settings.adminName')}</label>
                                        <input
                                            type="text"
                                            name="username"
                                            value={formData.username}
                                            onChange={handleChange}
                                            className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-base text-slate-900"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[15px] font-semibold text-slate-800 mb-1.5">{t('settings.githubLink')}</label>
                                        <input
                                            type="text"
                                            name="githubUrl"
                                            value={formData.githubUrl}
                                            onChange={handleChange}
                                            className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-base text-slate-900"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="pt-6 border-t border-gray-100">
                                <h3 className="text-base font-bold text-slate-950 mb-4">{t('settings.weatherSettings')}</h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-[15px] font-semibold text-slate-800 mb-1.5">{t('settings.amapApiKey')}</label>
                                        <input
                                            type="text"
                                            name="weatherKey"
                                            value={formData.weatherKey}
                                            onChange={handleChange}
                                            className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-mono text-base text-slate-900"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[15px] font-semibold text-slate-800 mb-1.5">{t('settings.cityAdcode')}</label>
                                        <input
                                            type="text"
                                            name="weatherAdcode"
                                            value={formData.weatherAdcode}
                                            onChange={handleChange}
                                            placeholder="110000"
                                            className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-mono text-base text-slate-900"
                                        />
                                        <p className="text-sm text-slate-500 mt-1.5">{t('settings.autoLocate')}</p>
                                    </div>
                                </div>
                            </div>

                            {/* 个性化与备份 */}
                            <div className="pt-6 border-t border-gray-100">
                                <h3 className="text-base font-bold text-slate-950 mb-4">{t('settings.personalization')}</h3>
                                <div className="space-y-5">
                                    <div>
                                        <label className="block text-[15px] font-semibold text-slate-800 mb-1.5">{t('settings.customWallpaper')}</label>
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                name="backgroundImage"
                                                value={formData.backgroundImage || ''}
                                                onChange={handleChange}
                                                placeholder={t('settings.wallpaperPlaceholder')}
                                                className="flex-1 px-5 py-3 rounded-xl bg-slate-50 border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-base text-slate-900"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => bgImageInputRef.current?.click()}
                                                className="shrink-0 p-3 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 transition-colors"
                                                title={t('settings.uploadBg')}
                                            >
                                                <RiImageLine size={20} />
                                            </button>
                                            <input
                                                type="file"
                                                ref={bgImageInputRef}
                                                onChange={handleBgImageUpload}
                                                accept="image/*"
                                                className="hidden"
                                            />
                                        </div>
                                        <p className="text-sm text-slate-500 mt-1.5">{t('settings.wallpaperHint')}</p>

                                        {/* 背景图预览 */}
                                        {formData.backgroundImage && (
                                            <div className="mt-3 relative group">
                                                <div className="w-full h-24 rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
                                                    <img
                                                        src={formData.backgroundImage}
                                                        alt={t('settings.bgPreview')}
                                                        className="w-full h-full object-cover"
                                                        onError={(e) => {
                                                            e.target.style.display = 'none'
                                                        }}
                                                    />
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={handleClearBgImage}
                                                    className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
                                                    title={t('settings.clearBg')}
                                                >
                                                    <RiDeleteBinLine size={14} />
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex gap-4">
                                        <button
                                            onClick={handleExport}
                                            className="flex-1 py-3 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 text-base font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                                        >
                                            <RiDownloadLine size={20} /> {t('settings.exportConfig')}
                                        </button>
                                        <button
                                            onClick={() => fileInputRef.current?.click()}
                                            className="flex-1 py-3 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 text-base font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                                        >
                                            <RiUploadLine size={20} /> {t('settings.importConfig')}
                                        </button>
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            onChange={handleImport}
                                            accept=".json"
                                            className="hidden"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'widgets' && (
                        <div className="space-y-6 max-w-lg mx-auto">
                            <p className="text-base text-slate-600 mb-6">{t('widgets.description')}</p>
                            <div className="grid grid-cols-1 gap-3">
                                {WIDGET_OPTIONS.map(opt => {
                                    const isChecked = (formData.enabledWidgets || []).includes(opt.id)
                                    const IconComponent = opt.icon
                                    return (
                                        <div
                                            key={opt.id}
                                            onClick={() => toggleWidget(opt.id)}
                                            className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all ${isChecked
                                                ? 'bg-blue-50 border-blue-200 ring-1 ring-blue-200'
                                                : 'bg-white border-slate-200 hover:bg-slate-50'
                                                }`}
                                        >
                                            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isChecked
                                                ? 'bg-blue-100 text-blue-700'
                                                : 'bg-slate-100 text-slate-500'
                                                }`}>
                                                <IconComponent size={24} />
                                            </div>
                                            <span className={`text-base font-bold ${isChecked ? 'text-slate-900' : 'text-slate-600'}`}>
                                                {t(opt.labelKey)}
                                            </span>
                                            <div className="ml-auto">
                                                {isChecked
                                                    ? <RiCheckboxCircleFill size={28} className="text-blue-500" />
                                                    : <RiCheckboxBlankCircleLine size={28} className="text-slate-300" />
                                                }
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    )}

                    {activeTab === 'search' && (
                        <div className="max-w-lg mx-auto">
                            <SearchEngineSettings
                                searchEngines={formData.searchEngines}
                                defaultEngine={formData.defaultSearchEngine}
                                useCustomSearch={formData.useCustomSearch || false}
                                onChange={(updates) => {
                                    setFormData(prev => ({ ...prev, ...updates }))
                                }}
                            />
                        </div>
                    )}

                    {activeTab === 'links' && (
                        <LinkManager
                            links={linksData.map(item => ({
                                ...item,
                                icon: typeof item.icon === 'string' ? item.icon : getIconName(item.icon)
                            }))}
                            sections={sections}
                            onUpdateLinks={onLinksChange}
                            onUpdateSections={onSectionsChange}
                        />
                    )}

                    {activeTab === 'countdown' && (
                        <div className="space-y-5 max-w-lg mx-auto">
                            <p className="text-[15px] text-slate-600 mb-2">
                                {t('countdown.hint')}
                            </p>
                            {formData.countdownEvents.map((ev, idx) => (
                                <div key={ev.id} className="flex flex-col gap-2 bg-slate-50 p-3 rounded-xl border border-slate-100">
                                    <div className="flex gap-2 items-center">
                                        {/* Sorting Buttons */}
                                        <div className="flex flex-col gap-1">
                                            <button
                                                onClick={() => moveEvent(idx, 'up')}
                                                disabled={idx === 0}
                                                className="text-slate-500 hover:text-blue-600 disabled:opacity-30 p-1 bg-white rounded-md border border-slate-200"
                                            >
                                                <RiArrowUpSFill size={18} />
                                            </button>
                                            <button
                                                onClick={() => moveEvent(idx, 'down')}
                                                disabled={idx === formData.countdownEvents.length - 1}
                                                className="text-slate-500 hover:text-blue-600 disabled:opacity-30 p-1 bg-white rounded-md border border-slate-200"
                                            >
                                                <RiArrowDownSFill size={18} />
                                            </button>
                                        </div>

                                        <div className="flex-1 space-y-2">
                                            <div className="flex gap-3">
                                                <input
                                                    type="text"
                                                    value={ev.title}
                                                    onChange={(e) => handleEventChange(ev.id, 'title', e.target.value)}
                                                    placeholder={t('countdown.eventName')}
                                                    className="flex-1 bg-transparent border-b-2 border-slate-200 focus:border-blue-500 outline-none text-base font-bold text-slate-900"
                                                />
                                                <select
                                                    value={ev.type}
                                                    onChange={(e) => handleEventChange(ev.id, 'type', e.target.value)}
                                                    className="bg-white border border-slate-300 rounded-xl text-sm px-3 py-1.5 outline-none focus:border-blue-500 font-bold text-slate-700 shadow-sm"
                                                >
                                                    <option value="date">{t('countdown.fixedDate')}</option>
                                                    <option value="monthly">{t('countdown.monthly')}</option>
                                                    <option value="weekly">{t('countdown.weekly')}</option>
                                                </select>
                                            </div>

                                            {/* Dynamic Input based on Type */}
                                            <div className="space-y-2">
                                                {ev.type === 'date' && (
                                                    <input
                                                        type="date"
                                                        value={ev.value}
                                                        onChange={(e) => handleEventChange(ev.id, 'value', e.target.value)}
                                                        className="w-full bg-white px-3 py-2 rounded-xl border border-slate-300 outline-none text-sm text-slate-900 font-mono shadow-sm"
                                                    />
                                                )}
                                                {ev.type === 'monthly' && (
                                                    <div className="flex items-center gap-2 text-base text-slate-700 font-bold">
                                                        <span>{t('countdown.everyMonth')}</span>
                                                        <input
                                                            type="number"
                                                            min="1"
                                                            max="31"
                                                            value={ev.value}
                                                            onChange={(e) => handleEventChange(ev.id, 'value', e.target.value)}
                                                            className="w-20 bg-white px-3 py-2 rounded-xl border border-slate-300 outline-none font-mono text-sm text-slate-900 shadow-sm"
                                                        />
                                                        <span>{t('countdown.day')}</span>
                                                    </div>
                                                )}
                                                {ev.type === 'weekly' && (
                                                    <div className="flex items-center gap-2 text-base text-slate-700 font-bold">
                                                        <span>{t('countdown.everyWeek')}</span>
                                                        <select
                                                            value={ev.value}
                                                            onChange={(e) => handleEventChange(ev.id, 'value', e.target.value)}
                                                            className="bg-white px-3 py-2 rounded-xl border border-slate-300 outline-none font-sans text-sm shadow-sm"
                                                        >
                                                            {WEEKDAY_OPTIONS.map(d => (
                                                                <option key={d.val} value={d.val}>{t(d.labelKey)}</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                )}

                                                {/* Duration input for multi-day events */}
                                                <div className="flex items-center gap-2 text-sm text-slate-600">
                                                    <span>{t('countdown.duration')}:</span>
                                                    <input
                                                        type="number"
                                                        min="1"
                                                        max="365"
                                                        value={ev.duration || 1}
                                                        onChange={(e) => handleEventChange(ev.id, 'duration', parseInt(e.target.value) || 1)}
                                                        className="w-16 bg-white px-2 py-1 rounded-lg border border-slate-300 outline-none font-mono text-sm text-slate-900 shadow-sm"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => removeEvent(ev.id)}
                                            className="p-2.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors self-start border border-transparent hover:border-rose-100"
                                        >
                                            <RiDeleteBinLine size={20} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                            <button
                                onClick={addEvent}
                                className="w-full py-4 flex items-center justify-center gap-2 text-blue-600 font-bold bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors text-base border border-blue-100"
                            >
                                <RiAddLine size={20} /> {t('countdown.addEvent')}
                            </button>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-100 flex justify-end gap-4 bg-slate-50/30">
                    <button
                        onClick={onClose}
                        className="px-8 py-3 rounded-xl text-slate-700 hover:bg-slate-200 font-bold text-base transition-colors"
                    >
                        {t('settings.cancel')}
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-8 py-3 rounded-xl bg-slate-900 text-white hover:bg-black font-bold text-base shadow-xl shadow-slate-200 transition-all transform active:scale-95"
                    >
                        {t('settings.save')}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default SettingsModal
