import { useState, useEffect } from 'react'
import { RiDoubleQuotesL, RiRefreshLine } from '@remixicon/react'

const HitokotoCard = () => {
    const [quote, setQuote] = useState({ text: '加载中...', from: '...' })
    const [loading, setLoading] = useState(false)

    const fetchQuote = async () => {
        setLoading(true)
        try {
            const res = await fetch('https://v1.hitokoto.cn/?c=d&c=i&c=k')
            const data = await res.json()
            setQuote({ text: data.hitokoto, from: data.from || '未知' })
        } catch {
            setQuote({ text: '生活明朗，万物可爱。', from: '网络' })
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { fetchQuote() }, [])

    return (
        <div className="h-[200px] glass-card p-4 rounded-[24px] shadow-soft flex flex-col justify-center relative overflow-hidden group">
            <RiDoubleQuotesL size={28} className="text-blue-100 absolute top-3 left-3" />
            <div className="relative z-10 flex flex-col justify-center px-2">
                <p className="text-slate-700 font-serif text-base leading-relaxed text-center line-clamp-4">
                    {quote.text}
                </p>
                <p className="text-slate-400 text-xs text-center mt-2">—— {quote.from}</p>
            </div>
            <button
                onClick={(e) => { e.stopPropagation(); fetchQuote() }}
                className={`absolute bottom-2 right-2 p-1.5 text-slate-300 hover:text-blue-500 transition-colors ${loading ? 'animate-spin' : ''}`}
            >
                <RiRefreshLine size={16} />
            </button>
        </div>
    )
}

export default HitokotoCard
