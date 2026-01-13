/**
 * 计算事件的天数详情
 * @param {Object} event - 事件对象 { type: 'date'|'monthly'|'weekly', value: string }
 * @returns {{ days: number, isPast: boolean }}
 */
export const calculateEventDetails = (event) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    let targetDate = new Date()
    let isPast = false
    let days = 0

    if (event.type === 'date') {
        // 固定日期：支持正数（已过）和倒数（未来）
        targetDate = new Date(event.value)
        targetDate.setHours(0, 0, 0, 0)
        const diffTime = targetDate - today
        days = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
        
        if (days < 0) {
            isPast = true
            days = Math.abs(days)
        }
    } else if (event.type === 'monthly') {
        // 每月重复：计算到下一个该日期的天数
        const day = parseInt(event.value)
        targetDate.setDate(day)
        
        // 如果这个月的该日期已过，移到下个月
        if (targetDate < today) {
            targetDate.setMonth(targetDate.getMonth() + 1)
        }
        
        const diffTime = targetDate - today
        days = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
        isPast = false
    } else if (event.type === 'weekly') {
        // 每周重复：计算到下一个该星期几的天数
        const targetDay = parseInt(event.value) // 0 (Sun) - 6 (Sat)
        const currentDay = today.getDay()
        let diffDays = targetDay - currentDay
        
        if (diffDays <= 0) {
            diffDays += 7 // 下周
        }
        
        days = diffDays
        isPast = false
    }

    return { days, isPast }
}
