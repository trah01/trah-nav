import { RiArrowRightUpLine, RiCloseLine } from '@remixicon/react'

const LinkCard = ({ item, isEditMode, onDragStart, onDragOver, onDrop, onDragEnd, onDelete }) => {
    const IconComponent = item.icon

    const content = (
        <div className={`bg-white border border-gray-100 rounded-2xl p-5 flex flex-col relative overflow-hidden h-full ${isEditMode
            ? 'animate-jiggle cursor-move shadow-md ring-2 ring-transparent hover:ring-blue-300'
            : 'hover:bg-sky-50 transition-all duration-300 hover:shadow-lg hover:-translate-y-1'
            }`}>
            {isEditMode && (
                <button
                    onClick={(e) => {
                        e.stopPropagation()
                        e.preventDefault()
                        if (onDelete) onDelete()
                    }}
                    className="absolute top-2 right-2 flex items-center justify-center w-7 h-7 bg-red-100/80 text-red-500 rounded-full hover:bg-red-500 hover:text-white transition-all duration-200 z-10 pointer-events-auto shadow-sm"
                    title="删除"
                >
                    <RiCloseLine size={18} />
                </button>
            )}
            <div className="flex justify-between items-start mb-4 pointer-events-none">
                <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center text-2xl text-gray-800 group-hover:text-blue-600 group-hover:bg-white transition-colors">
                    <IconComponent size={24} />
                </div>
                <RiArrowRightUpLine className="text-gray-400 group-hover:text-blue-600 transition-colors" size={18} />
            </div>
            <div className="pointer-events-none">
                <h4 className="font-bold text-black text-lg mb-1.5 group-hover:text-blue-700 transition-colors tracking-tight">{item.title}</h4>
                <p className="text-sm text-gray-600 font-medium line-clamp-1">{item.desc}</p>
            </div>
            <div className="mt-4 flex gap-1.5 pointer-events-none">
                {item.tags.slice(0, 2).map(tag => (
                    <span key={tag} className="text-xs px-2 py-0.5 rounded-md bg-gray-100 text-gray-600 font-bold font-mono tracking-wide">
                        {tag}
                    </span>
                ))}
            </div>
        </div>
    )

    if (isEditMode) {
        return (
            <div
                className="block group h-full"
                draggable="true"
                onDragStart={onDragStart}
                onDragOver={onDragOver}
                onDrop={onDrop}
                onDragEnd={onDragEnd}
                onClick={(e) => e.preventDefault()}
            >
                {content}
            </div>
        )
    }

    return (
        <a href={item.url} target="_blank" className="block group">
            {content}
        </a>
    )
}

export default LinkCard
