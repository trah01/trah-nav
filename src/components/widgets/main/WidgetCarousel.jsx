import { useState } from 'react'
import { RiArrowLeftSLine, RiArrowRightSLine } from '@remixicon/react'
import GithubCard from '../carousel/GithubCard'
import NoteCard from '../carousel/NoteCard'
import PomodoroCard from '../carousel/PomodoroCard'
import HitokotoCard from '../carousel/HitokotoCard'
import ClockCard from '../carousel/ClockCard'
import CalendarCard from '../carousel/CalendarCard'

const WidgetCarousel = ({ enabledWidgets, githubUrl, time }) => {
    const [currentIndex, setCurrentIndex] = useState(0)
    const activeWidgets = enabledWidgets?.length > 0 ? enabledWidgets : ['github']

    const handleNext = (e) => {
        e.preventDefault()
        e.stopPropagation()
        setCurrentIndex((prev) => (prev + 1) % activeWidgets.length)
    }

    const handlePrev = (e) => {
        e.preventDefault()
        e.stopPropagation()
        setCurrentIndex((prev) => (prev - 1 + activeWidgets.length) % activeWidgets.length)
    }

    const currentWidgetId = activeWidgets[currentIndex]

    const renderWidget = () => {
        switch (currentWidgetId) {
            case 'github':
                return <GithubCard url={githubUrl} />
            case 'note':
                return <NoteCard />
            case 'pomodoro':
                return <PomodoroCard />
            case 'hitokoto':
                return <HitokotoCard />
            case 'clock':
                return <ClockCard time={time} />
            case 'calendar':
                return <CalendarCard />
            default:
                return <GithubCard url={githubUrl} />
        }
    }

    return (
        <div className="h-full relative group select-none flex flex-col overflow-visible">
            <div className="flex-1 transition-all duration-300">
                {renderWidget()}
            </div>
            {activeWidgets.length > 1 && (
                <>
                    <button
                        onClick={handlePrev}
                        className="absolute -left-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 backdrop-blur rounded-full shadow-lg flex items-center justify-center text-slate-500 opacity-0 group-hover:opacity-100 hover:bg-white hover:text-blue-500 transition-all z-30"
                    >
                        <RiArrowLeftSLine size={18} />
                    </button>
                    <button
                        onClick={handleNext}
                        className="absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 backdrop-blur rounded-full shadow-lg flex items-center justify-center text-slate-500 opacity-0 group-hover:opacity-100 hover:bg-white hover:text-blue-500 transition-all z-30"
                    >
                        <RiArrowRightSLine size={18} />
                    </button>
                    <div className="absolute -bottom-3 left-0 right-0 flex justify-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity z-30 pointer-events-none">
                        {activeWidgets.map((_, idx) => (
                            <div
                                key={idx}
                                className={`w-1.5 h-1.5 rounded-full transition-colors shadow-sm ${idx === currentIndex ? 'bg-slate-500' : 'bg-slate-300/70'}`}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    )
}

export default WidgetCarousel
