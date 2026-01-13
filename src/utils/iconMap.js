import {
    RiGithubFill,
    RiGoogleFill,
    RiOpenaiFill,
    RiBilibiliLine,
    RiYoutubeLine,
    RiTwitterXFill,
    RiStackOverflowLine,
    RiNpmjsFill,
    RiCodeBoxLine,
    RiBookOpenLine,
    RiCloudLine,
    RiMailLine,
    RiCalendarLine,
    RiDriveLine,
    RiNotionFill,
    RiTrelloLine,
    RiSlackLine,
    RiDiscordLine,
    RiSpotifyLine,
    RiNetflixFill,
    RiGlobalLine,
    RiSearchLine
} from '@remixicon/react'

// 图标名称到组件的映射
export const iconMap = {
    RiGithubFill,
    RiGoogleFill,
    RiOpenaiFill,
    RiBilibiliLine,
    RiYoutubeLine,
    RiTwitterXFill,
    RiStackOverflowLine,
    RiNpmjsFill,
    RiCodeBoxLine,
    RiBookOpenLine,
    RiCloudLine,
    RiMailLine,
    RiCalendarLine,
    RiDriveLine,
    RiNotionFill,
    RiTrelloLine,
    RiSlackLine,
    RiDiscordLine,
    RiSpotifyLine,
    RiNetflixFill,
    RiGlobalLine,
    RiSearchLine
}

// 组件到名称的反向映射（用于导出时获取图标名称）
const reverseIconMap = new Map(
    Object.entries(iconMap).map(([name, component]) => [component, name])
)

// 根据名称获取图标组件
export const getIconByName = (name) => {
    return iconMap[name] || RiGlobalLine
}

// 从组件获取图标名称
export const getIconName = (component) => {
    if (!component) return 'RiGlobalLine'
    return reverseIconMap.get(component) || 'RiGlobalLine'
}
