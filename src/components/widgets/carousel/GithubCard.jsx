import { RiGithubFill, RiExternalLinkLine } from '@remixicon/react'

const GithubCard = ({ url }) => {
    // 从 URL 中提取用户名
    const getUsername = (githubUrl) => {
        if (!githubUrl) return null
        try {
            const path = new URL(githubUrl).pathname
            const parts = path.split('/').filter(Boolean)
            return parts[0]
        } catch (e) {
            return null
        }
    }

    const username = getUsername(url)
    // 使用 ghchart.rshah.org 服务获取热力图 SVG
    // 颜色使用蓝绿色方案 (40c463 是原色，这里用 3b82f6 蓝色系匹配主题)
    const chartUrl = username ? `https://ghchart.rshah.org/3b82f6/${username}` : null

    return (
        <a
            href={url || 'https://github.com'}
            target="_blank"
            rel="noopener noreferrer"
            className="block h-[200px] bg-white rounded-[32px] p-5 flex flex-col shadow-soft border border-slate-100 group transition-all hover:shadow-lg overflow-hidden relative"
        >
            {/* Header */}
            <div className="flex justify-between items-center mb-2 shrink-0">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                        <RiGithubFill size={20} />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-900">GitHub</span>
                        <span className="text-[10px] text-slate-400 font-mono font-bold uppercase tracking-tight">Contributions</span>
                    </div>
                </div>
                <RiExternalLinkLine size={16} className="text-slate-300 group-hover:text-blue-500 transition-colors" />
            </div>

            {/* Heatmap Content */}
            <div className="flex-1 flex flex-col justify-center items-center min-h-0">
                {username ? (
                    <div className="w-full h-full flex flex-col justify-center items-center gap-2">
                        <div className="w-full overflow-hidden flex justify-center py-2 bg-slate-50/50 rounded-xl px-2 border border-slate-50">
                            <img
                                src={chartUrl}
                                alt={`${username}'s GitHub Contributions`}
                                className="max-w-none h-[110px] object-contain filter grayscale-[0.2] contrast-[1.1]"
                                onError={(e) => {
                                    e.target.parentElement.innerHTML = '<div class="text-slate-400 text-xs py-10 font-bold">图表加载失败</div>'
                                }}
                            />
                        </div>
                        <div className="text-[11px] font-bold text-slate-500 font-mono truncate w-full text-center">
                            @{username}
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-8 text-slate-400 gap-2">
                        <RiGithubFill size={40} className="opacity-20 translate-y-2" />
                        <span className="text-xs font-bold px-4 text-center">请在设置中配置有效的 GitHub 链接</span>
                    </div>
                )}
            </div>

            {/* Subtle Gradient Overlay on Hover */}
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/0 to-blue-500/0 group-hover:from-blue-500/[0.02] group-hover:to-cyan-500/[0.02] transition-colors pointer-events-none" />
        </a>
    )
}

export default GithubCard
