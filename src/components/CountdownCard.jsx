import { RiCalendarCheckLine, RiFlagLine, RiTimeLine } from '@remixicon/react'
import { calculateEventDetails } from '../utils/dateUtils'

const CountdownCard = ({ events }) => {
    // 只显示前 3 个事件
    const displayEvents = events.slice(0, 3)

    return (
        <div className="h-full glass-card p-5 rounded-[32px] shadow-soft flex flex-col relative overflow-hidden">
            {/* Header */}
            <div className="flex justify-between items-center mb-2 px-1">
                <div>
                    <h3 className="text-slate-900 font-bold text-lg">重要日</h3>
                    <p className="text-slate-500 text-xs mt-0.5 font-mono">Upcoming Events</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-500 flex items-center justify-center">
                    <RiCalendarCheckLine size={16} />
                </div>
            </div>

            {/* Events List */}
            <div className="flex-1 flex flex-col justify-center gap-2">
                {displayEvents.map(event => {
                    const { days, isPast } = calculateEventDetails(event)
                    
                    return (
                        <div key={event.id} className="group relative flex items-center justify-between p-3 rounded-2xl transition-all duration-300 hover:scale-105 hover:bg-white hover:shadow-lg cursor-pointer border border-transparent hover:border-slate-100">
                            {/* Left Decoration Line on Hover */}
                            <div className={`absolute left-0 top-1/2 -translate-y-1/2 h-8 w-1 rounded-r-full ${event.bg} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                            
                            <div className="flex items-center gap-3 pl-2">
                                <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-white text-xs font-bold shadow-sm ${event.bg}`}>
                                    {isPast ? <RiTimeLine size={14} /> : <RiFlagLine size={14} />}
                                </div>
                                <span className="text-slate-700 font-bold text-sm group-hover:text-slate-900 transition-colors">{event.title}</span>
                            </div>
                            
                            <div className="flex flex-col items-end pr-1">
                                <div className="flex items-baseline gap-1">
                                    {isPast && <span className="text-[10px] text-slate-400 font-bold">+</span>}
                                    <span className={`text-xl font-mono font-black ${event.color} group-hover:scale-110 transition-transform duration-300`}>{days}</span>
                                    <span className="text-[10px] text-slate-400 font-bold">DAYS</span>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default CountdownCard
