import { useState, useEffect, useRef } from 'react'
import {
    RiCloseLine,
    RiDeleteBinLine,
    RiAddLine,
    RiArrowUpSFill,
    RiArrowDownSFill,
    RiDownloadLine,
    RiUploadLine
} from '@remixicon/react'
import { getIconName } from '../utils/iconMap'
import LinkManager from './LinkManager'

const weekDays = [
    { val: '1', label: '周一' },
    { val: '2', label: '周二' },
    { val: '3', label: '周三' },
    { val: '4', label: '周四' },
    { val: '5', label: '周五' },
    { val: '6', label: '周六' },
    { val: '0', label: '周日' }
]

const SettingsModal = ({ isOpen, onClose, config, onSave, linksData, onLinksChange, sections, onSectionsChange }) => {
    const [formData, setFormData] = useState(config)
    const [activeTab, setActiveTab] = useState('general')
    const fileInputRef = useRef(null)
    const faviconInputRef = useRef(null)

    useEffect(() => {
        setFormData(config)
    }, [config, isOpen])

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

                alert('配置导入成功，请点击保存')
            } catch {
                alert('导入失败: 文件格式错误')
            }
        }
        reader.readAsText(file)
        e.target.value = ''
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
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
                title: '新事件',
                type: 'date',
                value: new Date().toISOString().split('T')[0],
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
            alert('图标文件过大，请选择 100KB 以内的图片')
            return
        }

        const reader = new FileReader()
        reader.onload = (event) => {
            setFormData(prev => ({ ...prev, favicon: event.target.result }))
        }
        reader.readAsDataURL(file)
        e.target.value = ''
    }

    const handleSave = () => {
        onSave(formData)
        onClose()
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
            <div className="bg-white rounded-[32px] w-full max-w-2xl shadow-2xl flex flex-col h-[85vh]">
                {/* Header */}
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-slate-800">设置</h2>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-500">
                        <RiCloseLine size={20} />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-gray-100 px-6 bg-slate-50/50">
                    {[
                        { id: 'general', label: '基本设置' },
                        { id: 'links', label: '链接管理' },
                        { id: 'countdown', label: '倒计时' }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`py-3 mr-8 text-sm font-bold border-b-2 transition-colors ${activeTab === tab.id
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-slate-400 hover:text-slate-600'
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto flex-1 bg-white">
                    {activeTab === 'general' && (
                        <div className="space-y-4 max-w-lg mx-auto">
                            {/* 网站基础信息 */}
                            <div>
                                <h3 className="text-sm font-bold text-slate-900 mb-3">网站信息</h3>
                                <div className="space-y-3">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">网站标题</label>
                                        <input
                                            type="text"
                                            name="siteTitle"
                                            value={formData.siteTitle || ''}
                                            onChange={handleChange}
                                            placeholder="My Nav"
                                            className="w-full px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Favicon URL / 上传图片</label>
                                        <div className="flex gap-2">
                                            <div className="flex-1 relative">
                                                <input
                                                    type="text"
                                                    name="favicon"
                                                    value={formData.favicon || ''}
                                                    onChange={handleChange}
                                                    placeholder="https://example.com/favicon.ico"
                                                    className="w-full pl-4 pr-10 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
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
                                                className="shrink-0 p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
                                                title="上传图片"
                                            >
                                                <RiUploadLine size={20} />
                                            </button>
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
                                        <label className="block text-sm font-medium text-slate-700 mb-1">ICP 备案号</label>
                                        <input
                                            type="text"
                                            name="icpBeian"
                                            value={formData.icpBeian || ''}
                                            onChange={handleChange}
                                            placeholder="京ICP备XXXXXXXX号"
                                            className="w-full px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-gray-100">
                                <h3 className="text-sm font-bold text-slate-900 mb-3">用户信息</h3>
                                <div className="space-y-3">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Admin 用户名</label>
                                        <input
                                            type="text"
                                            name="username"
                                            value={formData.username}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">GitHub 链接</label>
                                        <input
                                            type="text"
                                            name="githubUrl"
                                            value={formData.githubUrl}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="pt-4 border-t border-gray-100">
                                <h3 className="text-sm font-bold text-slate-900 mb-3">天气设置</h3>
                                <div className="space-y-3">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">高德 API Key</label>
                                        <input
                                            type="text"
                                            name="weatherKey"
                                            value={formData.weatherKey}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-mono text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">城市 Adcode (天气地址)</label>
                                        <input
                                            type="text"
                                            name="weatherAdcode"
                                            value={formData.weatherAdcode}
                                            onChange={handleChange}
                                            placeholder="例如: 110000"
                                            className="w-full px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-mono text-sm"
                                        />
                                        <p className="text-xs text-slate-400 mt-1">留空则尝试自动定位</p>
                                    </div>
                                </div>
                            </div>

                            {/* 个性化与备份 */}
                            <div className="pt-4 border-t border-gray-100">
                                <h3 className="text-sm font-bold text-slate-900 mb-3">个性化与备份</h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">自定义壁纸 URL</label>
                                        <input
                                            type="text"
                                            name="backgroundImage"
                                            value={formData.backgroundImage || ''}
                                            onChange={handleChange}
                                            placeholder="https://..."
                                            className="w-full px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
                                        />
                                        <p className="text-xs text-slate-400 mt-1">留空则显示默认背景</p>
                                    </div>

                                    <div className="flex gap-3">
                                        <button
                                            onClick={handleExport}
                                            className="flex-1 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-sm font-medium flex items-center justify-center gap-2"
                                        >
                                            <RiDownloadLine size={16} /> 导出配置
                                        </button>
                                        <button
                                            onClick={() => fileInputRef.current?.click()}
                                            className="flex-1 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-sm font-medium flex items-center justify-center gap-2"
                                        >
                                            <RiUploadLine size={16} /> 导入配置
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
                        <div className="space-y-4 max-w-lg mx-auto">
                            <p className="text-xs text-slate-400 mb-2">
                                提示：首页仅显示前 3 个事件。可使用箭头调整顺序。过去的日期会显示已过天数。
                            </p>
                            {formData.countdownEvents.map((ev, idx) => (
                                <div key={ev.id} className="flex flex-col gap-2 bg-slate-50 p-3 rounded-xl border border-slate-100">
                                    <div className="flex gap-2 items-center">
                                        {/* Sorting Buttons */}
                                        <div className="flex flex-col">
                                            <button
                                                onClick={() => moveEvent(idx, 'up')}
                                                disabled={idx === 0}
                                                className="text-slate-400 hover:text-blue-500 disabled:opacity-30 p-0.5"
                                            >
                                                <RiArrowUpSFill size={16} />
                                            </button>
                                            <button
                                                onClick={() => moveEvent(idx, 'down')}
                                                disabled={idx === formData.countdownEvents.length - 1}
                                                className="text-slate-400 hover:text-blue-500 disabled:opacity-30 p-0.5"
                                            >
                                                <RiArrowDownSFill size={16} />
                                            </button>
                                        </div>

                                        <div className="flex-1 space-y-2">
                                            <div className="flex gap-2">
                                                <input
                                                    type="text"
                                                    value={ev.title}
                                                    onChange={(e) => handleEventChange(ev.id, 'title', e.target.value)}
                                                    placeholder="事件名称"
                                                    className="flex-1 bg-transparent border-b border-slate-200 focus:border-blue-500 outline-none text-sm font-bold text-slate-700"
                                                />
                                                <select
                                                    value={ev.type}
                                                    onChange={(e) => handleEventChange(ev.id, 'type', e.target.value)}
                                                    className="bg-white border border-slate-200 rounded-lg text-xs px-2 py-1 outline-none focus:border-blue-500"
                                                >
                                                    <option value="date">固定日期</option>
                                                    <option value="monthly">每月重复</option>
                                                    <option value="weekly">每周重复</option>
                                                </select>
                                            </div>

                                            {/* Dynamic Input based on Type */}
                                            <div>
                                                {ev.type === 'date' && (
                                                    <input
                                                        type="date"
                                                        value={ev.value}
                                                        onChange={(e) => handleEventChange(ev.id, 'value', e.target.value)}
                                                        className="w-full bg-white px-2 py-1 rounded border border-slate-200 outline-none text-xs text-slate-500 font-mono"
                                                    />
                                                )}
                                                {ev.type === 'monthly' && (
                                                    <div className="flex items-center gap-2 text-xs text-slate-600">
                                                        <span>每月</span>
                                                        <input
                                                            type="number"
                                                            min="1"
                                                            max="31"
                                                            value={ev.value}
                                                            onChange={(e) => handleEventChange(ev.id, 'value', e.target.value)}
                                                            className="w-16 bg-white px-2 py-1 rounded border border-slate-200 outline-none font-mono"
                                                        />
                                                        <span>号</span>
                                                    </div>
                                                )}
                                                {ev.type === 'weekly' && (
                                                    <div className="flex items-center gap-2 text-xs text-slate-600">
                                                        <span>每周</span>
                                                        <select
                                                            value={ev.value}
                                                            onChange={(e) => handleEventChange(ev.id, 'value', e.target.value)}
                                                            className="bg-white px-2 py-1 rounded border border-slate-200 outline-none font-sans"
                                                        >
                                                            {weekDays.map(d => (
                                                                <option key={d.val} value={d.val}>{d.label}</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => removeEvent(ev.id)}
                                            className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors self-start"
                                        >
                                            <RiDeleteBinLine size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                            <button
                                onClick={addEvent}
                                className="w-full py-2 flex items-center justify-center gap-2 text-blue-500 font-medium bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors text-sm"
                            >
                                <RiAddLine size={16} /> 添加新事件
                            </button>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-100 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-5 py-2 rounded-xl text-slate-600 hover:bg-slate-50 font-medium text-sm transition-colors"
                    >
                        取消
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-5 py-2 rounded-xl bg-slate-900 text-white hover:bg-slate-800 font-medium text-sm shadow-lg shadow-slate-200 transition-all transform active:scale-95"
                    >
                        保存更改
                    </button>
                </div>
            </div>
        </div>
    )
}

export default SettingsModal
