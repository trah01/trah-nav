import { RiArrowRightUpLine } from '@remixicon/react'

const LinkCard = ({ item }) => {
    const IconComponent = item.icon

    return (
        <a href={item.url} target="_blank" className="block group">
            <div className="bg-white hover:bg-sky-50 border border-gray-100 rounded-2xl p-5 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 h-full flex flex-col relative overflow-hidden">
                <div className="flex justify-between items-start mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center text-2xl text-gray-800 group-hover:text-blue-600 group-hover:bg-white transition-colors">
                        <IconComponent size={24} />
                    </div>
                    <RiArrowRightUpLine className="text-gray-400 group-hover:text-blue-600 transition-colors" size={18} />
                </div>
                <div>
                    <h4 className="font-bold text-black text-lg mb-1.5 group-hover:text-blue-700 transition-colors tracking-tight">{item.title}</h4>
                    <p className="text-sm text-gray-600 font-medium line-clamp-1">{item.desc}</p>
                </div>
                <div className="mt-4 flex gap-1.5">
                    {item.tags.slice(0, 2).map(tag => (
                        <span key={tag} className="text-xs px-2 py-0.5 rounded-md bg-gray-100 text-gray-600 font-bold font-mono tracking-wide">
                            {tag}
                        </span>
                    ))}
                </div>
            </div>
        </a>
    )
}

export default LinkCard
