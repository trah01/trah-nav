import { useState, useEffect } from 'react'
import { RiFocus3Line, RiCupLine, RiPlayFill, RiPauseLine, RiRefreshLine, RiSwapLine } from '@remixicon/react'

const PomodoroCard = () => {
    const [timeLeft, setTimeLeft] = useState(25 * 60)
    const [isActive, setIsActive] = useState(false)
    const [mode, setMode] = useState('work')

    useEffect(() => {
        let interval = null
        if (isActive && timeLeft > 0) {
            interval = setInterval(() => setTimeLeft(t => t - 1), 1000)
        } else if (timeLeft === 0) {
            setIsActive(false)
        }
        return () => clearInterval(interval)
    }, [isActive, timeLeft])

    const toggleTimer = () => setIsActive(!isActive)
    const resetTimer = () => { setIsActive(false); setTimeLeft(mode === 'work' ? 25 * 60 : 5 * 60) }
    const switchMode = () => {
        const newMode = mode === 'work' ? 'break' : 'work'
        setMode(newMode)
        setTimeLeft(newMode === 'work' ? 25 * 60 : 5 * 60)
        setIsActive(false)
    }

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }

    return (
        <div className="h-[200px] glass-card p-4 rounded-[24px] shadow-soft flex flex-col justify-center items-center overflow-hidden">
            <div className="flex items-center gap-2 mb-2 text-slate-700">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${mode === 'work' ? 'bg-rose-100 text-rose-500' : 'bg-emerald-100 text-emerald-500'}`}>
                    {mode === 'work' ? <RiFocus3Line size={14} /> : <RiCupLine size={14} />}
                </div>
                <span className="font-bold text-sm">{mode === 'work' ? '专注模式' : '休息一下'}</span>
            </div>
            <div className={`text-4xl font-mono font-bold mb-3 tracking-tighter ${mode === 'work' ? 'text-slate-800' : 'text-emerald-600'}`}>
                {formatTime(timeLeft)}
            </div>
            <div className="flex gap-2">
                <button onClick={toggleTimer} className={`w-9 h-9 rounded-full flex items-center justify-center text-white transition-colors ${isActive ? 'bg-amber-500 hover:bg-amber-600' : 'bg-blue-500 hover:bg-blue-600'}`}>
                    {isActive ? <RiPauseLine size={16} /> : <RiPlayFill size={16} />}
                </button>
                <button onClick={resetTimer} className="w-9 h-9 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center hover:bg-slate-200 transition-colors">
                    <RiRefreshLine size={16} />
                </button>
                <button onClick={switchMode} className="w-9 h-9 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center hover:bg-slate-200 transition-colors">
                    <RiSwapLine size={16} />
                </button>
            </div>
        </div>
    )
}

export default PomodoroCard
