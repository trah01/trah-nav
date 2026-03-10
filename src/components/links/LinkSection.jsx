import { useState, Fragment } from 'react'
import LinkCard from './LinkCard'
import { RiArrowDownSLine, RiArrowUpSLine } from '@remixicon/react'

const LinkSection = ({ title, sectionId, index, colorClass, links, isEditMode, draggedItem, dropTarget, onDragStart, onDragOver, onDrop, onDragEnd, onDelete }) => {
    const [isCollapsed, setIsCollapsed] = useState(false)
    const isEmpty = links.length === 0

    return (
        <div
            className={`col-span-12 flex flex-col pt-4 transition-all duration-300 ${isEmpty && !isEditMode ? 'opacity-0 h-0 overflow-hidden !pt-0' : 'opacity-100'}`}
        >
            <div
                className="flex items-center space-x-2 px-2 pb-4 cursor-pointer group select-none"
                onClick={() => setIsCollapsed(!isCollapsed)}
            >
                <span className={`w-2 h-2 rounded-full ${colorClass}`}></span>
                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider font-mono flex-1 group-hover:text-slate-700 transition-colors">
                    {String(index).padStart(2, '0')} / {title}
                </h3>
                <span className="text-slate-400 group-hover:text-slate-600 transition-colors">
                    {isCollapsed ? (
                        <RiArrowDownSLine className="w-5 h-5" />
                    ) : (
                        <RiArrowUpSLine className="w-5 h-5" />
                    )}
                </span>
            </div>

            <div className={`grid transition-all duration-300 ${isCollapsed ? 'grid-rows-[0fr] opacity-0' : 'grid-rows-[1fr] opacity-100'}`}>
                <div className={`overflow-hidden pt-1 ${isEditMode && !isCollapsed ? 'min-h-[120px] rounded-xl border-2 border-dashed border-slate-200/50 bg-slate-50/50 p-2' : ''}`}>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                        {links.map((link, i) => {
                            const isDragged = draggedItem && draggedItem.url === link.url && draggedItem.title === link.title;
                            return (
                                <Fragment key={`${link.url}-${link.title}`}>
                                    {isEditMode && !isCollapsed && dropTarget?.sectionId === sectionId && dropTarget?.index === i && (
                                        <div
                                            onDragOver={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                            }}
                                            onDrop={(e) => {
                                                if (isEditMode && !isCollapsed) onDrop(e)
                                            }}
                                            className="h-full min-h-[120px] rounded-2xl border-2 border-dashed border-blue-400 bg-blue-50/50 flex items-center justify-center text-blue-500 font-bold text-sm"
                                        >
                                            拖放至此
                                        </div>
                                    )}
                                    <div className={`h-full ${isDragged ? 'opacity-50 scale-95' : ''}`}>
                                        <LinkCard
                                            item={link}
                                            isEditMode={isEditMode && !isCollapsed}
                                            onDragStart={(e) => isEditMode && !isCollapsed && onDragStart(e, link)}
                                            onDragOver={(e) => {
                                                if (isEditMode && !isCollapsed) onDragOver(e, sectionId, i)
                                            }}
                                            onDrop={(e) => {
                                                if (isEditMode && !isCollapsed) onDrop(e)
                                            }}
                                            onDragEnd={onDragEnd}
                                            onDelete={() => onDelete && onDelete(link)}
                                        />
                                    </div>
                                </Fragment>
                            );
                        })}

                        {isEditMode && !isCollapsed && dropTarget?.sectionId === sectionId && dropTarget?.index === links.length && (
                            <div
                                onDragOver={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                }}
                                onDrop={(e) => {
                                    if (isEditMode && !isCollapsed) onDrop(e)
                                }}
                                className="h-full min-h-[120px] rounded-2xl border-2 border-dashed border-blue-400 bg-blue-50/50 flex items-center justify-center text-blue-500 font-bold text-sm"
                            >
                                拖放至此
                            </div>
                        )}

                        {isEmpty && isEditMode && !isCollapsed && dropTarget?.sectionId !== sectionId && (
                            <div
                                onDragOver={(e) => {
                                    if (isEditMode && !isCollapsed) onDragOver(e, sectionId, null)
                                }}
                                onDrop={(e) => {
                                    if (isEditMode && !isCollapsed) onDrop(e)
                                }}
                                className="col-span-full h-full min-h-[120px] flex items-center justify-center text-slate-400 font-medium text-sm border-2 border-dashed border-transparent hover:border-slate-300 rounded-2xl transition-colors"
                            >
                                拖拽卡片到此处
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LinkSection
