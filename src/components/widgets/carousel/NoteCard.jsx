import { useState, useEffect } from 'react'
import { RiStickyNoteLine } from '@remixicon/react'

const NoteCard = () => {
    const [note, setNote] = useState(() => localStorage.getItem('trah_nav_note') || '')

    useEffect(() => {
        localStorage.setItem('trah_nav_note', note)
    }, [note])

    return (
        <div className="h-[200px] glass-card p-4 rounded-[24px] shadow-soft flex flex-col overflow-hidden">
            <div className="flex items-center gap-2 mb-2 text-slate-700 shrink-0">
                <div className="w-6 h-6 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center">
                    <RiStickyNoteLine size={14} />
                </div>
                <span className="font-bold text-sm">便签</span>
            </div>
            <textarea
                className="flex-1 w-full bg-transparent resize-none outline-none text-sm text-slate-600 placeholder-slate-300 leading-relaxed"
                placeholder="在此处快速记录..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
            />
        </div>
    )
}

export default NoteCard
