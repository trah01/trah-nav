import { useState, useEffect, useRef } from 'react'
import { RiSearchLine } from '@remixicon/react'
import { iconMap, getIconByName } from '../../utils/iconMap'

// 获取所有可用图标名称
const ICON_NAMES = Object.keys(iconMap)

const IconPicker = ({ value, onChange }) => {
    const [isOpen, setIsOpen] = useState(false)
    const [search, setSearch] = useState('')
    const wrapperRef = useRef(null)

    // 点击外部关闭下拉框
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setIsOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const filteredIcons = ICON_NAMES.filter(name =>
        name.toLowerCase().includes(search.toLowerCase())
    )

    const IconComponent = getIconByName(value)

    return (
        <div className="relative" ref={wrapperRef}>
            <label className="text-xs font-bold text-slate-500 mb-1 block">
                图标 (点击选择或手动输入)
            </label>
            <div className="flex gap-2">
                {/* 预览按钮 */}
                <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-10 h-10 rounded-lg border border-slate-200 flex items-center justify-center hover:border-blue-500 hover:text-blue-500 transition-colors bg-slate-50 shrink-0"
                    title="打开图标选择器"
                >
                    <IconComponent size={20} />
                </button>

                {/* 手动输入 */}
                <input
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder="输入图标名称 (如 RiHomeLine)"
                    className="flex-1 border-b border-slate-200 py-1 outline-none focus:border-blue-500 text-sm font-mono text-slate-600"
                />
            </div>

            {/* 下拉选择器 */}
            {isOpen && (
                <div className="absolute top-full left-0 mt-2 w-full bg-white rounded-xl shadow-xl border border-slate-100 z-[60] overflow-hidden">
                    {/* 搜索栏 */}
                    <div className="p-2 border-b border-slate-50 bg-slate-50/50 sticky top-0 z-10">
                        <div className="relative">
                            <RiSearchLine size={14} className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="搜索图标..."
                                className="w-full pl-7 pr-2 py-1.5 text-xs bg-white border border-slate-200 rounded-md focus:outline-none focus:border-blue-500"
                                autoFocus
                            />
                        </div>
                    </div>
                    {/* 图标网格 */}
                    <div className="h-48 overflow-y-auto p-2 grid grid-cols-6 gap-1">
                        {filteredIcons.slice(0, search ? undefined : 100).map(iconName => {
                            const Icon = iconMap[iconName]
                            if (typeof Icon !== 'function') return null // 过滤掉非组件导出
                            return (
                                <button
                                    key={iconName}
                                    type="button"
                                    onClick={() => { onChange(iconName); setIsOpen(false) }}
                                    className={`aspect-square rounded-lg flex items-center justify-center text-lg hover:bg-blue-50 hover:text-blue-500 transition-colors ${value === iconName ? 'bg-blue-100 text-blue-600 ring-2 ring-blue-200' : 'text-slate-500'
                                        }`}
                                    title={iconName}
                                >
                                    <Icon size={18} />
                                </button>
                            )
                        })}
                        {filteredIcons.length === 0 && (
                            <div className="col-span-6 text-center py-8 text-xs text-slate-400">
                                无匹配图标
                            </div>
                        )}
                        {!search && filteredIcons.length > 100 && (
                            <div className="col-span-6 text-center py-2 text-[10px] text-slate-400 font-medium">
                                输入关键词搜索更多图标...
                            </div>
                        )}
                    </div>

                </div>
            )}
        </div>
    )
}

export default IconPicker
