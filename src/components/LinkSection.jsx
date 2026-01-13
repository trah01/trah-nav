import LinkCard from './LinkCard'

const LinkSection = ({ title, index, colorClass, links }) => {
    if (links.length === 0) return null

    return (
        <div className="col-span-12 flex flex-col space-y-4 pt-4">
            <div className="flex items-center space-x-2 px-2">
                <span className={`w-2 h-2 rounded-full ${colorClass}`}></span>
                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider font-mono">
                    {String(index).padStart(2, '0')} / {title}
                </h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {links.map((link, i) => (
                    <LinkCard key={i} item={link} />
                ))}
            </div>
        </div>
    )
}

export default LinkSection
