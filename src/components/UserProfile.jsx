import { RiUserSmileLine, RiSettings4Line } from '@remixicon/react'
import WidgetCarousel from './WidgetCarousel'

const UserProfile = ({ username, githubUrl, onSettingsClick, enabledWidgets, time }) => {
    return (
        <div className="md:col-span-12 lg:col-span-2 hidden lg:flex flex-col gap-5">
            {/* 轮播组件区域 - 固定高度 */}
            <div className="h-[200px]">
                <WidgetCarousel
                    enabledWidgets={enabledWidgets}
                    githubUrl={githubUrl}
                    time={time}
                />
            </div>
            {/* 用户信息卡片 - 固定高度 */}
            <div className="h-[60px] glass-card rounded-[32px] p-6 flex items-center justify-between shadow-soft">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-sky-400 to-blue-600 p-[2px]">
                        <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
                            <RiUserSmileLine size={20} className="text-slate-700" />
                        </div>
                    </div>
                    <div>
                        <div className="text-xs text-slate-400 uppercase font-bold">Admin</div>
                        <div className="text-sm font-bold text-slate-800">{username}</div>
                    </div>
                </div>
                <button
                    onClick={onSettingsClick}
                    className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                >
                    <RiSettings4Line size={20} className="text-slate-400 hover:text-slate-900 cursor-pointer transition-colors" />
                </button>
            </div>
        </div>
    )
}

export default UserProfile
