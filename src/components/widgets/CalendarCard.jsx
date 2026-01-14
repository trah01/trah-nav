import { useState, useEffect } from 'react'
import { RiArrowLeftSLine, RiArrowRightSLine } from '@remixicon/react'

const CalendarCard = () => {
    const [currentDate, setCurrentDate] = useState(new Date())
    const [holidays, setHolidays] = useState({})
    const realToday = new Date()

    useEffect(() => {
        const year = currentDate.getFullYear()
        const fetchHolidays = async () => {
            try {
                const res = await fetch(`https://cdn.jsdelivr.net/gh/NateScarlet/holiday-cn@master/${year}.json`)
                if (!res.ok) return
                const data = await res.json()
                const map = {}
                if (data?.days) data.days.forEach(d => map[d.date] = d)
                setHolidays(map)
            } catch { /* 静默失败 */ }
        }
        fetchHolidays()
    }, [currentDate.getFullYear()])

    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate()
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay()

    const prevMonth = (e) => { e?.stopPropagation(); setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)) }
    const nextMonth = (e) => { e?.stopPropagation(); setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)) }
    const handleWheel = (e) => { e.deltaY > 0 ? nextMonth() : prevMonth() }

    const renderDays = () => {
        const days = []
        for (let i = 0; i < firstDayOfMonth; i++) days.push(<div key={`e-${i}`} className="w-6 h-6" />)
        for (let d = 1; d <= daysInMonth; d++) {
            const isToday = realToday.getDate() === d && realToday.getMonth() === currentDate.getMonth() && realToday.getFullYear() === currentDate.getFullYear()
            const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
            const hd = holidays[dateStr]
            const isHoliday = hd?.isOffDay
            const isWorkday = hd && !hd.isOffDay

            days.push(
                <div key={d} className="relative w-6 h-6 flex items-center justify-center" title={hd?.name || ''}>
                    <div className={`w-6 h-6 flex items-center justify-center text-xs rounded-full ${
                        isToday ? 'bg-blue-500 text-white font-bold' :
                        isHoliday ? 'text-rose-500 font-bold' :
                        isWorkday ? 'text-slate-500 bg-slate-100' : 'text-slate-600'
                    }`}>{d}</div>
                    {isHoliday && !isToday && <div className="absolute -bottom-0.5 w-1 h-1 bg-rose-500 rounded-full" />}
                </div>
            )
        }
        return days
    }

    return (
        <div className="h-[200px] glass-card p-3 rounded-[24px] shadow-soft flex flex-col items-center justify-center overflow-hidden" onWheel={handleWheel}>
            <div className="flex justify-between items-center w-full px-2 mb-2">
                <button onClick={prevMonth} className="p-1 text-slate-400 hover:text-blue-500 rounded-full hover:bg-slate-100 transition-colors">
                    <RiArrowLeftSLine size={16} />
                </button>
                <div className="font-bold text-slate-800 select-none text-sm">
                    {currentDate.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long' })}
                </div>
                <button onClick={nextMonth} className="p-1 text-slate-400 hover:text-blue-500 rounded-full hover:bg-slate-100 transition-colors">
                    <RiArrowRightSLine size={16} />
                </button>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center">
                {['日', '一', '二', '三', '四', '五', '六'].map(d => (
                    <div key={d} className="w-6 h-5 text-[10px] text-slate-400 font-bold flex items-center justify-center">{d}</div>
                ))}
                {renderDays()}
            </div>
        </div>
    )
}

export default CalendarCard
