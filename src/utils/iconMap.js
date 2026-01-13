import * as Icons from '@remixicon/react'

// 图标名称到组件的映射 (包含所有 Remix Icons)
export const iconMap = Icons

// 根据名称获取图标组件
export const getIconByName = (name) => {
    return Icons[name] || Icons.RiGlobalLine
}

// 从组件获取图标名称 (仅作兼容，生产环境下不可靠)
export const getIconName = (component) => {
    if (!component) return 'RiGlobalLine'

    // 尝试寻找匹配的组件
    for (const [name, comp] of Object.entries(Icons)) {
        if (comp === component) return name
    }

    return 'RiGlobalLine'
}
