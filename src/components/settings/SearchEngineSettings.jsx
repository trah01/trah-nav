import { useState } from 'react'
import {
    RiAddLine,
    RiDeleteBinLine,
    RiArrowUpSFill,
    RiArrowDownSFill,
    RiCheckboxCircleFill,
    RiSearchLine,
    RiGoogleFill,
    RiMicrosoftFill,
    RiExternalLinkLine
} from '@remixicon/react'
import { getIconByName } from '../../utils/iconMap'
import IconPicker from './IconPicker'

// 预设搜索引擎
const PRESET_ENGINES = [
    {
        id: 'google',
        name: 'Google',
        url: 'https://www.google.com/search?q={query}',
        icon: 'google',
        iconUrl: '',
        color: 'text-blue-500',
        bgColor: 'bg-blue-100'
    },
    {
        id: 'bing',
        name: 'Bing',
        url: 'https://www.bing.com/search?q={query}',
        icon: 'bing',
        iconUrl: '',
        color: 'text-sky-600',
        bgColor: 'bg-sky-100'
    },
    {
        id: 'baidu',
        name: '百度',
        url: 'https://www.baidu.com/s?wd={query}',
        icon: 'custom',
        iconUrl: 'https://www.baidu.com/favicon.ico',
        color: 'text-blue-600',
        bgColor: 'bg-blue-100'
    },
    {
        id: 'duckduckgo',
        name: 'DuckDuckGo',
        url: 'https://duckduckgo.com/?q={query}',
        icon: 'custom',
        iconUrl: 'https://duckduckgo.com/favicon.ico',
        color: 'text-orange-500',
        bgColor: 'bg-orange-100'
    }
]

// 图标映射
const iconMap = {
    google: RiGoogleFill,
    bing: RiMicrosoftFill,
    custom: RiSearchLine
}

/**
 * 搜索引擎设置组件
 */
const SearchEngineSettings = ({ searchEngines, defaultEngine, onChange }) => {
    const [showPresets, setShowPresets] = useState(false)

    // 获取当前引擎列表，如果为空则初始化
    const engines = searchEngines || []

    // 添加预设搜索引擎
    const addPresetEngine = (preset) => {
        // 检查是否已存在
        if (engines.find(e => e.id === preset.id)) {
            return
        }
        const newEngines = [...engines, { ...preset }]
        onChange({ searchEngines: newEngines })
        setShowPresets(false)
    }

    // 添加自定义搜索引擎
    const addCustomEngine = () => {
        const newId = `custom_${Date.now()}`
        const newEngine = {
            id: newId,
            name: '自定义搜索',
            url: 'https://example.com/search?q={query}',
            icon: 'custom',
            iconName: 'RiSearchLine', // 默认 Remix 图标
            iconUrl: '',
            color: 'text-slate-500',
            bgColor: 'bg-slate-100'
        }
        onChange({ searchEngines: [...engines, newEngine] })
    }

    // 更新搜索引擎
    const updateEngine = (id, field, value) => {
        const newEngines = engines.map(e =>
            e.id === id ? { ...e, [field]: value } : e
        )
        onChange({ searchEngines: newEngines })
    }

    // 删除搜索引擎
    const removeEngine = (id) => {
        const newEngines = engines.filter(e => e.id !== id)
        // 如果删除的是默认引擎，重置默认引擎
        if (defaultEngine === id) {
            onChange({
                searchEngines: newEngines,
                defaultSearchEngine: newEngines[0]?.id || ''
            })
        } else {
            onChange({ searchEngines: newEngines })
        }
    }

    // 移动搜索引擎顺序
    const moveEngine = (index, direction) => {
        const newEngines = [...engines]
        if (direction === 'up' && index > 0) {
            [newEngines[index], newEngines[index - 1]] = [newEngines[index - 1], newEngines[index]]
        } else if (direction === 'down' && index < engines.length - 1) {
            [newEngines[index], newEngines[index + 1]] = [newEngines[index + 1], newEngines[index]]
        }
        onChange({ searchEngines: newEngines })
    }

    // 设置默认搜索引擎
    const setDefault = (id) => {
        onChange({ defaultSearchEngine: id })
    }

    // 获取可添加的预设引擎（排除已添加的）
    const availablePresets = PRESET_ENGINES.filter(
        preset => !engines.find(e => e.id === preset.id)
    )

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-950">搜索引擎</h3>
                <div className="flex gap-3">
                    {availablePresets.length > 0 && (
                        <div className="relative">
                            <button
                                onClick={() => setShowPresets(!showPresets)}
                                className="text-sm px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors font-bold"
                            >
                                添加预设
                            </button>
                            {showPresets && (
                                <div className="absolute right-0 top-full mt-1 bg-white border border-slate-200 rounded-xl shadow-lg z-10 min-w-[160px] py-1">
                                    {availablePresets.map(preset => {
                                        const IconComp = iconMap[preset.icon] || RiSearchLine
                                        return (
                                            <button
                                                key={preset.id}
                                                onClick={() => addPresetEngine(preset)}
                                                className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 text-sm text-left font-medium"
                                            >
                                                <IconComp size={18} className={preset.color} />
                                                {preset.name}
                                            </button>
                                        )
                                    })}
                                </div>
                            )}
                        </div>
                    )}
                    <button
                        onClick={addCustomEngine}
                        className="text-sm px-3 py-1.5 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors flex items-center gap-1.5 font-bold"
                    >
                        <RiAddLine size={16} />
                        自定义
                    </button>
                </div>
            </div>

            <p className="text-sm text-slate-600 leading-relaxed">
                点击星号设为默认搜索引擎。URL 中使用 <code className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-900 font-bold">{'{query}'}</code> 作为搜索词占位符。
            </p>

            {engines.length === 0 ? (
                <div className="text-center py-8 text-slate-500 text-base">
                    暂无搜索引擎，点击上方按钮添加
                </div>
            ) : (
                <div className="space-y-2">
                    {engines.map((engine, idx) => {
                        const IconComp = iconMap[engine.icon] || RiSearchLine
                        const isDefault = defaultEngine === engine.id

                        return (
                            <div
                                key={engine.id}
                                className={`bg-slate-50 rounded-2xl p-4 border transition-colors ${isDefault ? 'border-blue-300 bg-blue-50/70 shadow-sm' : 'border-slate-200'
                                    }`}
                            >
                                <div className="flex items-start gap-2">
                                    {/* 排序按钮 */}
                                    <div className="flex flex-col gap-1">
                                        <button
                                            onClick={() => moveEngine(idx, 'up')}
                                            disabled={idx === 0}
                                            className="text-slate-400 hover:text-blue-600 disabled:opacity-30 p-1 bg-white rounded-md border border-slate-100 shadow-sm"
                                        >
                                            <RiArrowUpSFill size={20} />
                                        </button>
                                        <button
                                            onClick={() => moveEngine(idx, 'down')}
                                            disabled={idx === engines.length - 1}
                                            className="text-slate-400 hover:text-blue-600 disabled:opacity-30 p-1 bg-white rounded-md border border-slate-100 shadow-sm"
                                        >
                                            <RiArrowDownSFill size={20} />
                                        </button>
                                    </div>

                                    {/* 图标 */}
                                    <div className={`w-12 h-12 rounded-2xl ${engine.bgColor} flex items-center justify-center ${engine.color} shrink-0 overflow-hidden shadow-sm border border-white/50`}>
                                        {(() => {
                                            // 优先级：iconUrl > iconName > 内置 icon 映射
                                            if (engine.iconUrl) {
                                                return (
                                                    <img
                                                        src={engine.iconUrl}
                                                        alt={engine.name}
                                                        className="w-7 h-7 object-contain"
                                                        onError={(e) => { e.target.style.display = 'none' }}
                                                    />
                                                )
                                            }
                                            if (engine.iconName) {
                                                const CustomIcon = getIconByName(engine.iconName)
                                                return <CustomIcon size={24} />
                                            }
                                            return <IconComp size={24} />
                                        })()}
                                    </div>

                                    {/* 内容 */}
                                    <div className="flex-1 space-y-3 min-w-0">
                                        <input
                                            type="text"
                                            value={engine.name}
                                            onChange={(e) => updateEngine(engine.id, 'name', e.target.value)}
                                            placeholder="搜索引擎名称"
                                            className="w-full bg-white px-4 py-2 rounded-xl border border-slate-300 text-base font-bold text-slate-900 focus:outline-none focus:border-blue-500 shadow-sm"
                                        />
                                        <input
                                            type="text"
                                            value={engine.url}
                                            onChange={(e) => updateEngine(engine.id, 'url', e.target.value)}
                                            placeholder="搜索 URL，使用 {query} 作为关键词占位"
                                            className="w-full bg-white px-4 py-2 rounded-xl border border-slate-300 text-sm font-mono text-slate-600 focus:outline-none focus:border-blue-500 shadow-sm"
                                        />

                                        {/* 图标设置区域 */}
                                        <div className="flex items-start gap-2">
                                            {/* 图标库选择 */}
                                            <div className="flex-1">
                                                <IconPicker
                                                    value={engine.iconName || ''}
                                                    onChange={(name) => updateEngine(engine.id, 'iconName', name)}
                                                />
                                            </div>
                                        </div>

                                        {/* 自定义图标 URL */}
                                        <div>
                                            <label className="text-sm font-semibold text-slate-800 mb-1.5 block">
                                                <RiExternalLinkLine size={14} className="inline mr-1" />
                                                自定义图标 URL
                                            </label>
                                            <input
                                                type="text"
                                                value={engine.iconUrl || ''}
                                                onChange={(e) => updateEngine(engine.id, 'iconUrl', e.target.value)}
                                                placeholder="https://example.com/favicon.ico"
                                                className="w-full bg-white px-4 py-2 rounded-xl border border-slate-300 text-sm font-mono text-slate-500 focus:outline-none focus:border-blue-500 shadow-sm"
                                            />
                                        </div>
                                    </div>

                                    {/* 操作按钮 */}
                                    <div className="flex flex-col gap-2">
                                        <button
                                            onClick={() => setDefault(engine.id)}
                                            className={`p-2.5 rounded-xl transition-colors border shadow-sm ${isDefault
                                                ? 'text-blue-600 bg-blue-100 border-blue-200'
                                                : 'text-slate-400 bg-white border-slate-200 hover:text-blue-500 hover:bg-blue-50 hover:border-blue-100'
                                                }`}
                                            title={isDefault ? '当前默认' : '设为默认'}
                                        >
                                            <RiCheckboxCircleFill size={20} />
                                        </button>
                                        <button
                                            onClick={() => removeEngine(engine.id)}
                                            className="p-2.5 rounded-xl text-slate-400 bg-white border border-slate-200 hover:text-rose-600 hover:bg-rose-50 hover:border-rose-100 transition-colors shadow-sm"
                                            title="删除"
                                        >
                                            <RiDeleteBinLine size={20} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}

export default SearchEngineSettings
