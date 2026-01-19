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

    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const firstDayOfMonth = new Date(year, month, 1).getDay()
    const lastMonthDays = new Date(year, month, 0).getDate()

    const prevMonth = (e) => {
        e?.stopPropagation()
        setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))
    }
    const nextMonth = (e) => {
        e?.stopPropagation()
        setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))
    }
    const handleWheel = (e) => {
        // 阻止默认滚动行为，避免翻页时页面也跟着跳
        if (e.deltaY > 0) nextMonth()
        else prevMonth()
    }

    const renderDays = () => {
        const days = []

        // 1. 填充上个月的末尾
        for (let i = firstDayOfMonth - 1; i >= 0; i--) {
            const d = lastMonthDays - i
            days.push(
                <div key={`prev-${d}`} className="w-7 h-5.5 flex items-center justify-center text-[12px] text-slate-300 select-none">
                    {d}
                </div>
            )
        }

        // 2. 填充当月日期
        for (let d = 1; d <= daysInMonth; d++) {
            const isToday = realToday.getDate() === d && realToday.getMonth() === month && realToday.getFullYear() === year
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
            const hd = holidays[dateStr]
            const isHoliday = hd?.isOffDay
            const isWorkday = hd && !hd.isOffDay

            days.push(
                <div key={`curr-${d}`} className="relative w-7 h-5.5 flex items-center justify-center group/day" title={hd?.name || ''}>
                    <div className={`w-5.5 h-5.5 flex items-center justify-center text-[12px] rounded-full transition-all duration-200 ${isToday ? 'bg-blue-500 text-white font-bold shadow-sm' :
                        isHoliday ? 'text-rose-500 font-bold hover:bg-rose-50' :
                            isWorkday ? 'text-slate-500 bg-slate-100 hover:bg-slate-200' : 'text-slate-600 hover:bg-slate-50'
                        }`}>{d}</div>
                    {isHoliday && !isToday && <div className="absolute bottom-0.5 w-0.5 h-0.5 bg-rose-500 rounded-full" />}
                </div>
            )
        }

        // 3. 填充下个月的开头，确保始终显示 6 行 (42个格子)
        const remainingCells = 42 - days.length
        for (let i = 1; i <= remainingCells; i++) {
            days.push(
                <div key={`next-${i}`} className="w-7 h-5.5 flex items-center justify-center text-[10px] text-slate-300 select-none">
                    {i}
                </div>
            )
        }

        return days
    }

    return (
        <div className="h-full glass-card p-2 rounded-[24px] shadow-soft flex flex-col items-center justify-between overflow-hidden" onWheel={handleWheel}>
            <div className="flex justify-between items-center w-full px-1.5 mb-0.5">
                <button onClick={prevMonth} className="p-0.5 text-slate-400 hover:text-blue-500 rounded-full hover:bg-slate-100 transition-colors">
                    <RiArrowLeftSLine size={14} />
                </button>
                <div className="font-bold text-slate-800 select-none text-[13px]">
                    {currentDate.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long' })}
                </div>
                <button onClick={nextMonth} className="p-0.5 text-slate-400 hover:text-blue-500 rounded-full hover:bg-slate-100 transition-colors">
                    <RiArrowRightSLine size={14} />
                </button>
            </div>

            <div className="flex-1 w-full flex flex-col justify-center">
                <div className="grid grid-cols-7 gap-y-0.5 text-center">
                    {['日', '一', '二', '三', '四', '五', '六'].map(d => (
                        <div key={d} className="w-7 h-4 text-[10px] text-slate-400 font-bold flex items-center justify-center uppercase tracking-tighter">{d}</div>
                    ))}
                    {renderDays()}
                </div>
            </div>
        </div>
    )
}

export default CalendarCard
