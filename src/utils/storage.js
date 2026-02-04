/**
 * 存储抽象层
 * 优先使用 chrome.storage.sync（支持跨设备同步）
 * 降级到 localStorage（普通浏览器环境）
 */

// 存储键名常量
export const STORAGE_KEYS = {
    CONFIG: 'trah-nav-config',
    LINKS: 'trah-nav-links',
    SECTIONS: 'trah-nav-sections',
}

/**
 * 检测是否在扩展环境中
 */
function isExtensionEnvironment() {
    return typeof chrome !== 'undefined' && chrome.storage && chrome.storage.sync
}

/**
 * 从存储中获取数据
 * @param {string} key - 存储键名
 * @param {*} defaultValue - 默认值
 * @returns {Promise<*>} 存储的数据或默认值
 */
export async function getStorageItem(key, defaultValue = null) {
    try {
        if (isExtensionEnvironment()) {
            // 使用 chrome.storage.sync
            return new Promise((resolve) => {
                chrome.storage.sync.get([key], (result) => {
                    if (chrome.runtime.lastError) {
                        console.warn('chrome.storage.sync 读取失败:', chrome.runtime.lastError)
                        resolve(defaultValue)
                        return
                    }
                    resolve(result[key] !== undefined ? result[key] : defaultValue)
                })
            })
        } else {
            // 降级到 localStorage
            const saved = localStorage.getItem(key)
            if (saved) {
                return JSON.parse(saved)
            }
            return defaultValue
        }
    } catch (e) {
        console.warn(`读取存储失败 [${key}]:`, e)
        return defaultValue
    }
}

/**
 * 保存数据到存储
 * @param {string} key - 存储键名
 * @param {*} value - 要存储的数据
 * @returns {Promise<boolean>} 是否保存成功
 */
export async function setStorageItem(key, value) {
    try {
        if (isExtensionEnvironment()) {
            // 使用 chrome.storage.sync
            return new Promise((resolve) => {
                chrome.storage.sync.set({ [key]: value }, () => {
                    if (chrome.runtime.lastError) {
                        console.warn('chrome.storage.sync 写入失败:', chrome.runtime.lastError)
                        // 降级到 localStorage
                        try {
                            localStorage.setItem(key, JSON.stringify(value))
                            resolve(true)
                        } catch (fallbackError) {
                            console.error('localStorage 降级写入也失败:', fallbackError)
                            resolve(false)
                        }
                        return
                    }
                    resolve(true)
                })
            })
        } else {
            // 使用 localStorage
            localStorage.setItem(key, JSON.stringify(value))
            return true
        }
    } catch (e) {
        console.error(`保存存储失败 [${key}]:`, e)
        return false
    }
}

/**
 * 删除存储中的数据
 * @param {string} key - 存储键名
 * @returns {Promise<boolean>} 是否删除成功
 */
export async function removeStorageItem(key) {
    try {
        if (isExtensionEnvironment()) {
            return new Promise((resolve) => {
                chrome.storage.sync.remove([key], () => {
                    if (chrome.runtime.lastError) {
                        console.warn('chrome.storage.sync 删除失败:', chrome.runtime.lastError)
                        resolve(false)
                        return
                    }
                    resolve(true)
                })
            })
        } else {
            localStorage.removeItem(key)
            return true
        }
    } catch (e) {
        console.error(`删除存储失败 [${key}]:`, e)
        return false
    }
}

/**
 * 获取所有存储数据（用于导出）
 * @returns {Promise<object>} 所有存储的数据
 */
export async function getAllStorageData() {
    const config = await getStorageItem(STORAGE_KEYS.CONFIG, {})
    const links = await getStorageItem(STORAGE_KEYS.LINKS, [])
    const sections = await getStorageItem(STORAGE_KEYS.SECTIONS, [])

    return {
        config,
        links,
        sections,
        exportedAt: new Date().toISOString(),
        version: '1.0',
    }
}

/**
 * 导入所有存储数据
 * @param {object} data - 要导入的数据
 * @returns {Promise<boolean>} 是否导入成功
 */
export async function importAllStorageData(data) {
    try {
        if (data.config) {
            await setStorageItem(STORAGE_KEYS.CONFIG, data.config)
        }
        if (data.links) {
            await setStorageItem(STORAGE_KEYS.LINKS, data.links)
        }
        if (data.sections) {
            await setStorageItem(STORAGE_KEYS.SECTIONS, data.sections)
        }
        return true
    } catch (e) {
        console.error('导入数据失败:', e)
        return false
    }
}

/**
 * 监听存储变化（用于多标签页同步）
 * @param {function} callback - 变化回调函数
 * @returns {function} 取消监听函数
 */
export function onStorageChange(callback) {
    if (isExtensionEnvironment()) {
        const listener = (changes, areaName) => {
            if (areaName === 'sync') {
                const changedKeys = Object.keys(changes)
                const relevantChanges = changedKeys.filter(key =>
                    Object.values(STORAGE_KEYS).includes(key)
                )
                if (relevantChanges.length > 0) {
                    callback(changes)
                }
            }
        }
        chrome.storage.onChanged.addListener(listener)
        return () => chrome.storage.onChanged.removeListener(listener)
    } else {
        // localStorage 的 storage 事件只在其他标签页触发
        const listener = (event) => {
            if (Object.values(STORAGE_KEYS).includes(event.key)) {
                callback({
                    [event.key]: {
                        oldValue: event.oldValue ? JSON.parse(event.oldValue) : null,
                        newValue: event.newValue ? JSON.parse(event.newValue) : null,
                    }
                })
            }
        }
        window.addEventListener('storage', listener)
        return () => window.removeEventListener('storage', listener)
    }
}

/**
 * 获取存储使用情况（仅扩展环境）
 * @returns {Promise<object|null>} 存储使用情况
 */
export async function getStorageUsage() {
    if (isExtensionEnvironment()) {
        return new Promise((resolve) => {
            chrome.storage.sync.getBytesInUse(null, (bytesInUse) => {
                resolve({
                    bytesInUse,
                    quota: chrome.storage.sync.QUOTA_BYTES || 102400, // 100KB
                    percentUsed: ((bytesInUse / (chrome.storage.sync.QUOTA_BYTES || 102400)) * 100).toFixed(1)
                })
            })
        })
    }
    return null
}

/**
 * 迁移旧的 localStorage 数据到 chrome.storage.sync
 * 仅在首次升级时执行
 */
export async function migrateFromLocalStorage() {
    if (!isExtensionEnvironment()) return false

    const migrated = await getStorageItem('trah-nav-migrated', false)
    if (migrated) return false

    console.log('开始迁移 localStorage 数据到 chrome.storage.sync...')

    try {
        // 检查 localStorage 中是否有旧数据
        const oldConfig = localStorage.getItem(STORAGE_KEYS.CONFIG)
        const oldLinks = localStorage.getItem(STORAGE_KEYS.LINKS)
        const oldSections = localStorage.getItem(STORAGE_KEYS.SECTIONS)

        if (oldConfig || oldLinks || oldSections) {
            if (oldConfig) {
                await setStorageItem(STORAGE_KEYS.CONFIG, JSON.parse(oldConfig))
            }
            if (oldLinks) {
                await setStorageItem(STORAGE_KEYS.LINKS, JSON.parse(oldLinks))
            }
            if (oldSections) {
                await setStorageItem(STORAGE_KEYS.SECTIONS, JSON.parse(oldSections))
            }
            console.log('数据迁移完成')
        }

        // 标记已迁移
        await setStorageItem('trah-nav-migrated', true)
        return true
    } catch (e) {
        console.error('数据迁移失败:', e)
        return false
    }
}
