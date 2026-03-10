import { useState } from 'react'
import {
    RiArrowDownSLine,
    RiArrowRightSLine,
    RiEditLine,
    RiDeleteBinLine,
    RiCloseLine,
    RiAddLine,
    RiAddCircleLine,
    RiMenuLine
} from '@remixicon/react'
import { getIconByName } from '../../utils/iconMap'
import IconPicker from '../settings/IconPicker'

// 颜色选项
const COLORS_OPTIONS = [
    { label: 'Blue', value: 'bg-blue-500' },
    { label: 'Indigo', value: 'bg-indigo-500' },
    { label: 'Purple', value: 'bg-purple-500' },
    { label: 'Pink', value: 'bg-pink-500' },
    { label: 'Rose', value: 'bg-rose-500' },
    { label: 'Orange', value: 'bg-orange-500' },
    { label: 'Amber', value: 'bg-amber-500' },
    { label: 'Emerald', value: 'bg-emerald-500' },
    { label: 'Teal', value: 'bg-teal-500' },
    { label: 'Cyan', value: 'bg-cyan-500' },
    { label: 'Slate', value: 'bg-slate-500' },
]

const LinkManager = ({ links, sections, onUpdateLinks, onUpdateSections }) => {
    const [expandedSections, setExpandedSections] = useState({})
    const [editingItem, setEditingItem] = useState(null)
    const [draggedSectionIndex, setDraggedSectionIndex] = useState(null)
    const [draggedLinkIndex, setDraggedLinkIndex] = useState(null)
    const [dropTarget, setDropTarget] = useState(null) // { type: 'section'|'link', index: number, position: 'before'|'after', categoryId?: string }

    const toggleSection = (id) => {
        setExpandedSections(prev => ({ ...prev, [id]: !prev[id] }))
    }

    // 拖拽操作
    const handleDragStart = (e, type, index) => {
        if (type === 'section') {
            setDraggedSectionIndex(index)
            setDraggedLinkIndex(null)
        } else {
            setDraggedLinkIndex(index)
            setDraggedSectionIndex(null)
        }
        e.dataTransfer.effectAllowed = 'move'
    }

    const handleDragOver = (e, type, index, categoryId = null) => {
        e.preventDefault()
        e.stopPropagation()

        // 不允许把链接往分类头部放（除非作为 fallback 添加到末尾），主要是视觉占位控制
        if (draggedSectionIndex !== null && type === 'link') return

        const rect = e.currentTarget.getBoundingClientRect()
        // 判断鼠标在元素的上半部还是下半部
        const position = (e.clientY - rect.top) < (rect.height / 2) ? 'before' : 'after'

        setDropTarget(prev => {
            if (prev?.type === type && prev?.index === index && prev?.position === position) {
                return prev
            }
            return { type, index, position, categoryId }
        })
    }

    const handleDragLeave = (e) => {
        // e.preventDefault()
    }

    const handleDrop = (e) => {
        e.preventDefault()
        e.stopPropagation()
        if (!dropTarget) {
            handleDragEnd()
            return
        }

        if (draggedSectionIndex !== null && dropTarget.type === 'section') {
            const newSections = [...sections]
            const draggedSection = newSections[draggedSectionIndex]

            let targetIdx = dropTarget.index
            if (dropTarget.position === 'after') targetIdx += 1
            if (draggedSectionIndex < targetIdx) targetIdx -= 1

            newSections.splice(draggedSectionIndex, 1)
            newSections.splice(targetIdx, 0, draggedSection)
            onUpdateSections(newSections)

        } else if (draggedLinkIndex !== null) {
            const newLinks = [...links]
            const draggedItem = newLinks[draggedLinkIndex]
            newLinks.splice(draggedLinkIndex, 1)

            if (dropTarget.type === 'link') {
                draggedItem.category = dropTarget.categoryId
                const targetItem = links[dropTarget.index]
                let targetIdx = newLinks.indexOf(targetItem)

                if (targetIdx !== -1) {
                    if (dropTarget.position === 'after') targetIdx += 1
                    newLinks.splice(targetIdx, 0, draggedItem)
                } else {
                    newLinks.push(draggedItem)
                }
            } else if (dropTarget.type === 'section') {
                // 如果直接放置到了空分类的空白区域等价位置
                draggedItem.category = dropTarget.categoryId
                newLinks.push(draggedItem)
            }
            onUpdateLinks(newLinks)
        }

        handleDragEnd()
    }

    const handleDragEnd = () => {
        setDraggedSectionIndex(null)
        setDraggedLinkIndex(null)
        setDropTarget(null)
    }

    // 占位符组件，通过过渡动画生成“预先开缝”效果
    const DropPlaceholder = ({ isVisible }) => (
        <div
            className={`transition-all duration-300 ease-out overflow-hidden ${isVisible ? 'h-[68px] opacity-100 mb-2 mt-2' : 'h-0 opacity-0 mb-0 mt-0 pointer-events-none'}`}
        >
            <div className="w-full h-full border-2 border-dashed border-blue-400 bg-blue-50/50 rounded-xl flex items-center justify-center text-blue-500 font-bold text-sm">
                拖放至此
            </div>
        </div>
    )

    // 分类操作
    const addSection = () => {
        const newId = `sec_${Date.now()}`
        const newSection = { id: newId, title: '新分类', colorClass: 'bg-blue-500' }
        onUpdateSections([...sections, newSection])
        setEditingItem({ type: 'section', id: newId, data: newSection })
        setExpandedSections(prev => ({ ...prev, [newId]: true }))
    }

    const deleteSection = (id) => {
        if (confirm('确定删除该分类及其下所有链接吗？')) {
            onUpdateSections(sections.filter(s => s.id !== id))
            onUpdateLinks(links.filter(l => l.category !== id))
        }
    }

    const saveSection = () => {
        onUpdateSections(sections.map(s => s.id === editingItem.id ? editingItem.data : s))
        setEditingItem(null)
    }

    // 链接操作
    const addLink = (categoryId) => {
        const newLink = {
            title: '新站点',
            desc: '描述',
            url: 'https://',
            icon: 'RiGlobalLine',
            category: categoryId,
            tags: ['NEW']
        }
        onUpdateLinks([...links, newLink])
        const newIndex = links.length
        setEditingItem({ type: 'link', index: newIndex, data: newLink })
    }

    const deleteLink = (index) => {
        const newLinks = [...links]
        newLinks.splice(index, 1)
        onUpdateLinks(newLinks)
    }

    const saveLink = () => {
        const newLinks = [...links]
        newLinks[editingItem.index] = editingItem.data
        onUpdateLinks(newLinks)
        setEditingItem(null)
    }

    const saveAndNewLink = () => {
        const newLinks = [...links]
        newLinks[editingItem.index] = editingItem.data

        const newLink = {
            title: '新站点',
            desc: '描述',
            url: 'https://',
            icon: 'RiGlobalLine',
            category: editingItem.data.category,
            tags: ['NEW']
        }
        newLinks.push(newLink)
        onUpdateLinks(newLinks)
        setEditingItem({ type: 'link', index: newLinks.length - 1, data: newLink })
    }

    const duplicateAndNewLink = () => {
        const newLinks = [...links]
        newLinks[editingItem.index] = editingItem.data

        const duplicateLink = {
            ...editingItem.data,
            title: editingItem.data.title + ' 副本'
        }
        newLinks.push(duplicateLink)
        onUpdateLinks(newLinks)
        setEditingItem({ type: 'link', index: newLinks.length - 1, data: duplicateLink })
    }

    return (
        <div className="space-y-4">
            {/* 编辑弹窗 */}
            {editingItem && (
                <div className="fixed inset-0 bg-black/10 backdrop-blur-[1px] z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 w-full max-w-lg overflow-visible">
                        <h3 className="text-xl font-bold mb-6 text-slate-950">
                            {editingItem.type === 'section' ? '编辑分类' : '编辑站点'}
                        </h3>
                        <div className="space-y-4">
                            {editingItem.type === 'section' ? (
                                <>
                                    <div>
                                        <label className="text-[15px] font-bold text-slate-800 mb-2 block">分类名称</label>
                                        <input
                                            type="text"
                                            value={editingItem.data.title}
                                            onChange={e => setEditingItem({
                                                ...editingItem,
                                                data: { ...editingItem.data, title: e.target.value }
                                            })}
                                            className="w-full border-b-2 border-slate-200 py-2 outline-none focus:border-blue-500 text-base font-medium text-slate-900"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[15px] font-bold text-slate-800 mb-2 block">颜色标记</label>
                                        <select
                                            value={editingItem.data.colorClass}
                                            onChange={e => setEditingItem({
                                                ...editingItem,
                                                data: { ...editingItem.data, colorClass: e.target.value }
                                            })}
                                            className="w-full bg-slate-50 rounded-xl px-3 py-3 mt-1 outline-none border border-slate-200 text-base font-medium"
                                        >
                                            {COLORS_OPTIONS.map(c => (
                                                <option key={c.value} value={c.value}>{c.label}</option>
                                            ))}
                                        </select>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div>
                                        <label className="text-[15px] font-bold text-slate-800 mb-2 block">标题</label>
                                        <input
                                            type="text"
                                            value={editingItem.data.title}
                                            onChange={e => setEditingItem({
                                                ...editingItem,
                                                data: { ...editingItem.data, title: e.target.value }
                                            })}
                                            className="w-full border-b-2 border-slate-200 py-2 outline-none focus:border-blue-500 text-base font-bold text-slate-900"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[15px] font-bold text-slate-800 mb-2 block">描述</label>
                                        <input
                                            type="text"
                                            value={editingItem.data.desc}
                                            onChange={e => setEditingItem({
                                                ...editingItem,
                                                data: { ...editingItem.data, desc: e.target.value }
                                            })}
                                            className="w-full border-b-2 border-slate-200 py-2 outline-none focus:border-blue-500 text-base text-slate-700"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[15px] font-bold text-slate-800 mb-2 block">链接 URL</label>
                                        <input
                                            type="text"
                                            value={editingItem.data.url}
                                            onChange={e => setEditingItem({
                                                ...editingItem,
                                                data: { ...editingItem.data, url: e.target.value }
                                            })}
                                            className="w-full border-b-2 border-slate-200 py-2 outline-none focus:border-blue-500 text-base font-mono text-blue-600"
                                        />
                                    </div>
                                    <IconPicker
                                        value={editingItem.data.icon}
                                        onChange={val => setEditingItem({
                                            ...editingItem,
                                            data: { ...editingItem.data, icon: val }
                                        })}
                                    />
                                    <div>
                                        <label className="text-[15px] font-bold text-slate-800 mb-2 block">标签 (逗号分隔)</label>
                                        <input
                                            type="text"
                                            value={editingItem.data.tags.join(', ')}
                                            onChange={e => setEditingItem({
                                                ...editingItem,
                                                data: {
                                                    ...editingItem.data,
                                                    tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean)
                                                }
                                            })}
                                            className="w-full border-b-2 border-slate-200 py-2 outline-none focus:border-blue-500 text-base text-slate-600"
                                        />
                                    </div>
                                </>
                            )}
                        </div>
                        <div className="flex flex-wrap justify-end gap-3 mt-8">
                            <button
                                onClick={() => setEditingItem(null)}
                                className="px-5 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 font-bold text-base transition-colors"
                            >
                                取消
                            </button>

                            {editingItem.type === 'link' && (
                                <>
                                    <button
                                        onClick={duplicateAndNewLink}
                                        className="px-5 py-2.5 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 font-bold text-base transition-all active:scale-95"
                                    >
                                        复制并新建
                                    </button>
                                    <button
                                        onClick={saveAndNewLink}
                                        className="px-5 py-2.5 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 font-bold text-base transition-all active:scale-95"
                                    >
                                        保存并新
                                    </button>
                                </>
                            )}

                            <button
                                onClick={editingItem.type === 'section' ? saveSection : saveLink}
                                className="px-6 py-2.5 rounded-xl bg-slate-900 text-white hover:bg-black font-bold text-base transition-all active:scale-95 shadow-lg shadow-slate-200"
                            >
                                保存
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* 树形列表 */}
            <div className="space-y-2 pb-10">
                {sections.map((section, idx) => {
                    const sectionLinksWithIndex = links
                        .map((link, i) => ({ ...link, originalIndex: i }))
                        .filter(link => link.category === section.id)

                    return (
                        <div key={section.id} className="relative">

                            <DropPlaceholder isVisible={dropTarget?.type === 'section' && dropTarget?.index === idx && dropTarget?.position === 'before'} />

                            {/* 分类头部 */}
                            <div
                                draggable
                                onDragStart={(e) => handleDragStart(e, 'section', idx)}
                                onDragOver={(e) => handleDragOver(e, 'section', idx, section.id)}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}
                                onDragEnd={handleDragEnd}
                                className={`flex items-center gap-3 bg-slate-50 border border-slate-200 p-4 rounded-xl transition-all group shadow-sm ${draggedSectionIndex === idx ? 'opacity-50 scale-[0.98]' : 'hover:border-blue-300 opacity-100'}`}
                            >
                                <div className="cursor-move text-slate-400 hover:text-slate-600 hidden sm:block">
                                    <RiMenuLine size={20} />
                                </div>
                                <button
                                    onClick={() => toggleSection(section.id)}
                                    className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-500"
                                >
                                    {expandedSections[section.id]
                                        ? <RiArrowDownSLine size={20} />
                                        : <RiArrowRightSLine size={20} />
                                    }
                                </button>
                                <div className={`w-3.5 h-3.5 rounded-full ${section.colorClass} shadow-inner`}></div>
                                <span className="font-bold text-slate-900 text-base flex-1 pointer-events-none">{section.title}</span>
                                <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => setEditingItem({ type: 'section', id: section.id, data: { ...section } })}
                                        className="p-2 text-slate-500 hover:text-blue-600 hover:bg-white rounded-lg transition-colors border border-transparent hover:border-slate-100"
                                    >
                                        <RiEditLine size={18} />
                                    </button>
                                    <button
                                        onClick={() => deleteSection(section.id)}
                                        className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors border border-transparent hover:border-rose-100"
                                    >
                                        <RiDeleteBinLine size={18} />
                                    </button>
                                </div>
                            </div>

                            <DropPlaceholder isVisible={dropTarget?.type === 'section' && dropTarget?.index === idx && dropTarget?.position === 'after'} />

                            {/* 链接树 */}
                            {expandedSections[section.id] && (
                                <div className="relative ml-4 mt-2 space-y-2 pl-4 border-l border-slate-200">
                                    {sectionLinksWithIndex.map((linkObj, linkPos) => {
                                        const IconComponent = getIconByName(linkObj.icon)
                                        return (
                                            <div key={linkObj.originalIndex}>
                                                <div className="ml-8">
                                                    <DropPlaceholder isVisible={dropTarget?.type === 'link' && dropTarget?.index === linkObj.originalIndex && dropTarget?.position === 'before'} />
                                                </div>
                                                <div
                                                    draggable
                                                    onDragStart={(e) => handleDragStart(e, 'link', linkObj.originalIndex)}
                                                    onDragOver={(e) => handleDragOver(e, 'link', linkObj.originalIndex, section.id)}
                                                    onDragLeave={handleDragLeave}
                                                    onDrop={handleDrop}
                                                    onDragEnd={handleDragEnd}
                                                    className={`relative flex items-center gap-4 p-3 rounded-xl border border-transparent hover:border-slate-200 group transition-all ${draggedLinkIndex === linkObj.originalIndex ? 'opacity-50 scale-[0.98] border-blue-300' : 'hover:bg-slate-50 opacity-100'}`}
                                                >
                                                    <div className="cursor-move text-slate-400 hover:text-slate-600">
                                                        <RiMenuLine size={20} />
                                                    </div>
                                                    <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-600 shadow-sm z-10 transition-transform group-hover:scale-105 pointer-events-none">
                                                        <IconComponent size={20} />
                                                    </div>
                                                    <div className="flex-1 min-w-0 z-10 pointer-events-none">
                                                        <div className="text-[15px] font-bold text-slate-900 truncate">{linkObj.title}</div>
                                                        <div className="text-sm text-slate-500 truncate font-mono">{linkObj.url.length > 40 ? linkObj.url.substring(0, 40) + '...' : linkObj.url}</div>
                                                    </div>
                                                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10 bg-white/80 backdrop-blur-sm rounded-lg border border-slate-100 shadow-sm p-1">
                                                        <button
                                                            onClick={() => setEditingItem({ type: 'link', index: linkObj.originalIndex, data: { ...linkObj } })}
                                                            className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-slate-50 rounded"
                                                        >
                                                            <RiEditLine size={18} />
                                                        </button>
                                                        <button
                                                            onClick={() => deleteLink(linkObj.originalIndex)}
                                                            className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded"
                                                        >
                                                            <RiCloseLine size={18} />
                                                        </button>
                                                    </div>
                                                </div>
                                                <div className="ml-8">
                                                    <DropPlaceholder isVisible={dropTarget?.type === 'link' && dropTarget?.index === linkObj.originalIndex && dropTarget?.position === 'after'} />
                                                </div>
                                            </div>
                                        )
                                    })}
                                    {sectionLinksWithIndex.length === 0 && (
                                        <div
                                            onDragOver={(e) => handleDragOver(e, 'section', idx, section.id)}
                                            onDrop={handleDrop}
                                            className="p-4 text-center text-slate-400 text-sm border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50 transition-colors hover:border-blue-400"
                                        >
                                            拖拽链接到此处
                                        </div>
                                    )}
                                    <button
                                        onClick={() => addLink(section.id)}
                                        className="relative flex items-center gap-2 p-3 pl-3 text-sm text-blue-600 font-bold hover:text-blue-700 w-full text-left transition-colors"
                                    >
                                        <RiAddLine size={18} /> 添加新站点
                                    </button>
                                </div>
                            )}
                        </div>
                    )
                })}
                <button
                    onClick={addSection}
                    className="w-full py-3 border-2 border-dashed border-slate-200 rounded-xl text-slate-400 hover:border-blue-400 hover:text-blue-500 transition-colors flex items-center justify-center gap-2 font-bold"
                >
                    <RiAddCircleLine size={20} /> 新建分类
                </button>
            </div>
        </div>
    )
}

export default LinkManager
