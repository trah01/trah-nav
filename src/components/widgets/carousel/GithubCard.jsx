import { useState, useEffect, useMemo } from 'react'
import { RiGithubFill, RiExternalLinkLine, RiRefreshLine } from '@remixicon/react'

const GithubCard = ({ url }) => {
    const [contributions, setContributions] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [totalCount, setTotalCount] = useState(0)

    // 从 URL 中提取用户名
    const username = useMemo(() => {
        if (!url) return null
        try {
            const path = new URL(url).pathname
            const parts = path.split('/').filter(Boolean)
            return parts[0]
        } catch (e) {
            return null
        }
    }, [url])

    // 生成过去 N 周的日期数据
    const generateDateGrid = (weeks = 16) => {
        const today = new Date()
        const dates = []

        // 从今天往回推，找到本周日作为结束点
        const dayOfWeek = today.getDay()
        const endDate = new Date(today)

        // 计算总天数
        const totalDays = weeks * 7
        const startDate = new Date(endDate)
        startDate.setDate(endDate.getDate() - totalDays + 1)

        // 调整到那一周的周日
        const startDayOfWeek = startDate.getDay()
        startDate.setDate(startDate.getDate() - startDayOfWeek)

        // 生成日期网格
        const current = new Date(startDate)
        while (current <= endDate) {
            dates.push(new Date(current))
            current.setDate(current.getDate() + 1)
        }

        return dates
    }

    // 获取贡献数据
    useEffect(() => {
        if (!username) {
            setLoading(false)
            return
        }

        const fetchContributions = async () => {
            setLoading(true)
            setError(null)

            try {
                // 使用 GitHub Contributions API (通过代理或直接解析)
                const response = await fetch(
                    `https://github-contributions-api.jogruber.de/v4/${username}?y=last`
                )

                if (!response.ok) {
                    throw new Error('获取数据失败')
                }

                const data = await response.json()

                if (data && data.contributions) {
                    // 转换为日期映射
                    const contribMap = {}
                    data.contributions.forEach(item => {
                        contribMap[item.date] = item.count
                    })
                    setContributions(contribMap)
                    setTotalCount(data.total?.lastYear || Object.values(contribMap).reduce((a, b) => a + b, 0))
                }
            } catch (err) {
                console.error('Failed to fetch contributions:', err)
                setError(err.message)
                // 生成模拟数据用于展示
                generateMockData()
            } finally {
                setLoading(false)
            }
        }

        fetchContributions()
    }, [username])

    // 生成模拟数据（当 API 失败时）
    const generateMockData = () => {
        const mockContribs = {}
        const dates = generateDateGrid(16)
        dates.forEach(date => {
            const dateStr = date.toISOString().split('T')[0]
            mockContribs[dateStr] = Math.random() > 0.6 ? Math.floor(Math.random() * 10) : 0
        })
        setContributions(mockContribs)
        setTotalCount(Object.values(mockContribs).reduce((a, b) => a + b, 0))
    }

    // 获取贡献等级（0-4）
    const getContributionLevel = (count) => {
        if (!count || count === 0) return 0
        if (count <= 2) return 1
        if (count <= 5) return 2
        if (count <= 8) return 3
        return 4
    }

    // 颜色映射 - 使用蓝色系匹配主题
    const levelColors = [
        'bg-slate-100',           // 0: 无贡献
        'bg-blue-200',            // 1: 少量
        'bg-blue-300',            // 2: 中等
        'bg-blue-400',            // 3: 较多
        'bg-blue-500',            // 4: 大量
    ]

    // 生成热力图网格数据
    const heatmapData = useMemo(() => {
        const dates = generateDateGrid(16)
        const weeks = []
        let currentWeek = []

        dates.forEach((date, index) => {
            const dateStr = date.toISOString().split('T')[0]
            const count = contributions[dateStr] || 0

            currentWeek.push({
                date,
                dateStr,
                count,
                level: getContributionLevel(count),
                dayOfWeek: date.getDay()
            })

            if (currentWeek.length === 7) {
                weeks.push(currentWeek)
                currentWeek = []
            }
        })

        if (currentWeek.length > 0) {
            weeks.push(currentWeek)
        }

        return weeks
    }, [contributions])

    // 获取月份标签
    const monthLabels = useMemo(() => {
        const labels = []
        let lastMonth = -1

        heatmapData.forEach((week, weekIndex) => {
            const firstDay = week[0]
            if (firstDay && firstDay.date.getMonth() !== lastMonth) {
                labels.push({
                    month: firstDay.date.toLocaleDateString('zh-CN', { month: 'short' }),
                    weekIndex
                })
                lastMonth = firstDay.date.getMonth()
            }
        })

        return labels
    }, [heatmapData])

    return (
        <a
            href={url || 'https://github.com'}
            target="_blank"
            rel="noopener noreferrer"
            className="block h-[200px] bg-white rounded-[32px] p-4 flex flex-col shadow-soft border border-slate-100 group transition-all hover:shadow-lg overflow-hidden relative"
        >
            {/* Header */}
            <div className="flex justify-between items-center mb-2 shrink-0">
                <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-slate-900 text-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                        <RiGithubFill size={16} />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-900 leading-tight">GitHub</span>
                        <span className="text-[9px] text-slate-400 font-mono font-bold uppercase tracking-tight">Contributions</span>
                    </div>
                </div>
                <div className="flex items-center gap-1">
                    {loading && (
                        <RiRefreshLine size={14} className="text-slate-300 animate-spin" />
                    )}
                    <RiExternalLinkLine size={14} className="text-slate-300 group-hover:text-blue-500 transition-colors" />
                </div>
            </div>

            {/* Heatmap Content */}
            <div className="flex-1 flex flex-col min-h-0">
                {username ? (
                    <div className="flex-1 flex flex-col gap-1.5">
                        {/* Month Labels */}
                        <div className="flex pl-4 h-3 text-[8px] text-slate-400 font-medium">
                            {monthLabels.map((label, idx) => (
                                <div
                                    key={idx}
                                    className="absolute"
                                    style={{
                                        left: `${16 + label.weekIndex * 9}px`,
                                    }}
                                >
                                    {label.month}
                                </div>
                            ))}
                        </div>

                        {/* Heatmap Grid */}
                        <div className="flex-1 flex gap-[2px] overflow-hidden">
                            {/* Day Labels */}
                            <div className="flex flex-col gap-[2px] text-[7px] text-slate-300 font-medium pr-1 shrink-0">
                                <div className="h-[8px]"></div>
                                <div className="h-[8px] flex items-center">一</div>
                                <div className="h-[8px]"></div>
                                <div className="h-[8px] flex items-center">三</div>
                                <div className="h-[8px]"></div>
                                <div className="h-[8px] flex items-center">五</div>
                                <div className="h-[8px]"></div>
                            </div>

                            {/* Contribution Grid */}
                            <div className="flex-1 flex gap-[2px] overflow-x-auto scrollbar-hide">
                                {heatmapData.map((week, weekIdx) => (
                                    <div key={weekIdx} className="flex flex-col gap-[2px] shrink-0">
                                        {week.map((day, dayIdx) => (
                                            <div
                                                key={dayIdx}
                                                className={`w-[8px] h-[8px] rounded-[2px] ${levelColors[day.level]} transition-all hover:ring-1 hover:ring-blue-400 hover:ring-offset-1`}
                                                title={`${day.dateStr}: ${day.count} 次贡献`}
                                            />
                                        ))}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="flex justify-between items-center pt-1 shrink-0">
                            <div className="text-[10px] font-bold text-slate-500 font-mono truncate">
                                @{username}
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="flex items-center gap-[2px]">
                                    <span className="text-[8px] text-slate-400">少</span>
                                    {[0, 1, 2, 3, 4].map((level) => (
                                        <div
                                            key={level}
                                            className={`w-[6px] h-[6px] rounded-[1px] ${levelColors[level]}`}
                                        />
                                    ))}
                                    <span className="text-[8px] text-slate-400">多</span>
                                </div>
                                {totalCount > 0 && (
                                    <span className="text-[9px] font-bold text-blue-500">
                                        {totalCount.toLocaleString()}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-slate-400 gap-2">
                        <RiGithubFill size={36} className="opacity-20" />
                        <span className="text-xs font-bold px-4 text-center">请在设置中配置有效的 GitHub 链接</span>
                    </div>
                )}
            </div>

            {/* Subtle Gradient Overlay on Hover */}
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/0 to-blue-500/0 group-hover:from-blue-500/[0.02] group-hover:to-cyan-500/[0.02] transition-colors pointer-events-none rounded-[32px]" />
        </a>
    )
}

export default GithubCard
