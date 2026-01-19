const ClockCard = ({ time = new Date() }) => {

    const seconds = time.getSeconds()
    const minutes = time.getMinutes()
    const hours = time.getHours()
    const secondDegrees = ((seconds / 60) * 360) + 90
    const minuteDegrees = ((minutes / 60) * 360) + ((seconds / 60) * 6) + 90
    const hourDegrees = ((hours / 12) * 360) + ((minutes / 60) * 30) + 90

    return (
        <div className="h-[200px] glass-card p-4 rounded-[24px] shadow-soft flex flex-col justify-center items-center overflow-hidden">
            <div className="relative w-24 h-24 border-3 border-slate-200 rounded-full flex items-center justify-center shadow-inner">
                {[...Array(12)].map((_, i) => (
                    <div key={i} className="absolute w-0.5 h-1.5 bg-slate-300 origin-bottom" style={{ transform: `rotate(${i * 30}deg) translate(0, -32px)` }} />
                ))}
                <div className="w-2 h-2 bg-blue-500 rounded-full z-10 shadow-sm" />
                <div className="absolute top-1/2 left-1/2 w-8 h-0.5 bg-slate-800 rounded-full origin-left -mt-px z-0 shadow-sm" style={{ transform: `rotate(${hourDegrees}deg)` }} />
                <div className="absolute top-1/2 left-1/2 w-10 h-0.5 bg-slate-500 rounded-full origin-left -mt-px z-0" style={{ transform: `rotate(${minuteDegrees}deg)` }} />
                <div className="absolute top-1/2 left-1/2 w-10 h-px bg-rose-500 rounded-full origin-left z-0" style={{ transform: `rotate(${secondDegrees}deg)` }} />
            </div>
            <div className="mt-2 text-lg font-mono font-bold text-slate-700 tracking-widest">
                {time.toLocaleTimeString('en-US', { hour12: false })}
            </div>
        </div>
    )
}

export default ClockCard
