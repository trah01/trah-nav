/**
 * 计算事件的天数详情
 * @param {Object} event - 事件对象 { type: 'date'|'monthly'|'weekly', value: string, duration?: number }
 * @returns {{ days: number, isPast: boolean, isToday: boolean, isTomorrow: boolean, isOngoing: boolean }}
 */
export const calculateEventDetails = (event) => {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const duration = event.duration || 1 // 默认持续1天

    let targetDate = new Date()
    let isPast = false
    let isToday = false
    let isTomorrow = false
    let isOngoing = false // 正在进行中（多日事件）
    let days = 0

    if (event.type === 'date') {
        // 固定日期：支持正数（已过）和倒数（未来）
        targetDate = new Date(event.value)
        targetDate.setHours(0, 0, 0, 0)

        const diffTime = targetDate.getTime() - today.getTime()
        days = Math.round(diffTime / (1000 * 60 * 60 * 24))

        if (days < 0) {
            // 检查是否在多日事件期间内（事件开始后的 duration 天内）
            const daysSinceStart = Math.abs(days)
            if (daysSinceStart < duration) {
                isOngoing = true
                days = 0
            } else {
                isPast = true
                days = daysSinceStart - duration + 1 // 事件结束后的天数
            }
        } else if (days === 0) {
            isOngoing = true // 第一天也算进行中
        } else if (days === 1) {
            isTomorrow = true
        }
    } else if (event.type === 'monthly') {
        // 每月重复：计算到这个月或下个月该日期的天数
        const targetDay = parseInt(event.value)

        // 先尝试这个月
        targetDate = new Date(today.getFullYear(), today.getMonth(), targetDay)

        // 计算差值
        let diffTime = targetDate.getTime() - today.getTime()
        days = Math.round(diffTime / (1000 * 60 * 60 * 24))

        // 检查是否在进行中（事件已开始但未超过持续时间）
        if (days < 0 && Math.abs(days) < duration) {
            isOngoing = true
            days = 0
        } else if (days < 0) {
            // 已过期，计算下个月
            targetDate = new Date(today.getFullYear(), today.getMonth() + 1, targetDay)
            diffTime = targetDate.getTime() - today.getTime()
            days = Math.round(diffTime / (1000 * 60 * 60 * 24))
        }

        if (!isOngoing) {
            if (days === 0) {
                isOngoing = true
            } else if (days === 1) {
                isTomorrow = true
            }
        }
    } else if (event.type === 'weekly') {
        // 每周重复：计算到目标星期几的天数
        const targetWeekday = parseInt(event.value) // 0 (Sun) - 6 (Sat)
        const currentWeekday = today.getDay()

        // 计算从今天到目标日的天数差
        let diffDays = targetWeekday - currentWeekday

        // 检查是否在多日事件期间内
        if (diffDays < 0) {
            // 目标日已过，检查是否还在持续期间
            const daysSinceStart = Math.abs(diffDays)
            if (daysSinceStart < duration) {
                isOngoing = true
                diffDays = 0
            } else {
                diffDays += 7 // 下周
            }
        } else if (diffDays === 0) {
            isOngoing = true
        }

        days = diffDays

        if (!isOngoing) {
            if (days === 1) {
                isTomorrow = true
            }
        }
    }

    return { days, isPast, isToday, isTomorrow, isOngoing }
}
