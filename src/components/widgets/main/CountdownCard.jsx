import { RiCalendarCheckLine, RiFlagLine, RiTimeLine, RiCheckLine, RiSparklingLine } from '@remixicon/react'
import { calculateEventDetails } from '../../../utils/dateUtils'
import { useTranslation } from '../../../utils/i18n'

const CountdownCard = ({ events }) => {
    const { t } = useTranslation()

    // 渲染天数显示
    const renderDaysDisplay = (event) => {
        const { days, isPast, isTomorrow, isOngoing } = calculateEventDetails(event)

        // 正在进行中（多日事件期间）
        if (isOngoing) {
            return (
                <div className="flex items-center gap-1">
                    <RiSparklingLine size={16} className={`${event.color} animate-pulse`} />
                    <span className={`text-base font-black ${event.color}`}>{t('countdown.ongoing')}</span>
                </div>
            )
        }

        if (isTomorrow) {
            return (
                <span className={`text-lg font-black ${event.color}`}>{t('countdown.tomorrow')}</span>
            )
        }

        return (
            <div className="flex items-baseline gap-1 font-mono">
                {isPast && <span className={`text-xs font-bold ${event.color} opacity-70`}>+</span>}
                <span className={`text-2xl font-black ${event.color} group-hover:scale-110 transition-transform duration-300`}>{days}</span>
                <span className="text-xs text-slate-500 font-bold">D</span>
            </div>
        )
    }

    // 渲染图标
    const renderIcon = (event) => {
        const { isPast, isOngoing } = calculateEventDetails(event)

        if (isOngoing) {
            return <RiSparklingLine size={18} />
        }
        return isPast ? <RiTimeLine size={18} /> : <RiFlagLine size={18} />
    }

    return (
        <div className="h-full glass-card p-5 rounded-[32px] shadow-soft flex flex-col relative overflow-hidden">
            {/* Header */}
            <div className="flex justify-between items-center mb-4 px-1 shrink-0">
                <div>
                    <h3 className="text-slate-950 font-bold text-xl">{t('countdown.title')}</h3>
                    <p className="text-slate-600 text-[13px] mt-0.5 font-bold font-mono">Upcoming Events</p>
                </div>
                <div className="w-9 h-9 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shadow-sm">
                    <RiCalendarCheckLine size={20} />
                </div>
            </div>

            {/* Events List */}
            <div className="flex-1 overflow-y-auto scrollbar-hide py-0.5 pr-1 space-y-2 overscroll-contain" style={{ maxHeight: 'calc(3 * 56px + 2 * 8px + 4px)' }}>
                {events.map(event => {
                    return (
                        <div key={event.id} className="group relative flex items-center justify-between py-2 px-3 rounded-2xl transition-all duration-300 hover:scale-[1.02] hover:bg-white hover:shadow-lg cursor-pointer border border-transparent hover:border-slate-100 shrink-0 h-[56px]">
                            {/* Left Decoration Line on Hover */}
                            <div className={`absolute left-0 top-1/2 -translate-y-1/2 h-8 w-1.5 rounded-r-full ${event.bg} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>

                            <div className="flex items-center gap-4 pl-1">
                                <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-white text-xs font-bold shadow-md ${event.bg} transition-transform group-hover:rotate-6`}>
                                    {renderIcon(event)}
                                </div>
                                <span className="text-slate-800 font-bold text-base group-hover:text-black transition-colors truncate max-w-[120px]">{event.title}</span>
                            </div>

                            <div className="flex flex-col items-end pr-1">
                                {renderDaysDisplay(event)}
                            </div>
                        </div>
                    )
                })}
            </div>

        </div>
    )
}

export default CountdownCard
