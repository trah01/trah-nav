import { useState, useEffect } from 'react'
import {
    RiSunLine,
    RiSunCloudyLine,
    RiCloudyLine,
    RiRainyLine,
    RiSnowyLine,
    RiThunderstormsLine,
    RiHazeLine,
    RiMapPinLine
} from '@remixicon/react'

const iconMap = {
    'ri-sun-line': RiSunLine,
    'ri-sun-cloudy-line': RiSunCloudyLine,
    'ri-cloudy-line': RiCloudyLine,
    'ri-rainy-line': RiRainyLine,
    'ri-snowy-line': RiSnowyLine,
    'ri-thunderstorms-line': RiThunderstormsLine,
    'ri-haze-line': RiHazeLine
}

const WeatherCard = ({ apiKey, adcode }) => {
    const [weather, setWeather] = useState({
        temp: '--',
        condition: '加载中...',
        city: '定位中...',
        low: '-',
        high: '-',
        icon: 'ri-sun-cloudy-line'
    })

    useEffect(() => {
        const fetchWeather = async () => {
            let cityCode = adcode || '441900'

            try {
                // 如果没有指定 adcode，尝试自动定位
                if (!adcode) {
                    try {
                        const ipRes = await fetch(`https://restapi.amap.com/v3/ip?key=${apiKey}`)
                        const ipData = await ipRes.json()
                        if (ipData.status === '1' && ipData.adcode) {
                            cityCode = ipData.adcode
                        }
                    } catch (e) {
                        console.warn("IP定位自动获取失败，使用默认城市:", e)
                    }
                }

                const baseRes = await fetch(`https://restapi.amap.com/v3/weather/weatherInfo?city=${cityCode}&key=${apiKey}&extensions=base`)
                const baseData = await baseRes.json()

                const allRes = await fetch(`https://restapi.amap.com/v3/weather/weatherInfo?city=${cityCode}&key=${apiKey}&extensions=all`)
                const allData = await allRes.json()

                if (baseData.status === '1' && baseData.lives.length > 0) {
                    const live = baseData.lives[0]
                    let forecast = { daytemp: '--', nighttemp: '--' }
                    
                    if (allData.status === '1' && allData.forecasts.length > 0 && allData.forecasts[0].casts.length > 0) {
                        forecast = allData.forecasts[0].casts[0]
                    }

                    let iconClass = 'ri-sun-cloudy-line'
                    const w = live.weather
                    if (w.includes('晴')) iconClass = 'ri-sun-line'
                    else if (w.includes('多云')) iconClass = 'ri-sun-cloudy-line'
                    else if (w.includes('阴')) iconClass = 'ri-cloudy-line'
                    else if (w.includes('雨')) iconClass = 'ri-rainy-line'
                    else if (w.includes('雪')) iconClass = 'ri-snowy-line'
                    else if (w.includes('雷')) iconClass = 'ri-thunderstorms-line'
                    else if (w.includes('雾') || w.includes('霾')) iconClass = 'ri-haze-line'

                    setWeather({
                        temp: live.temperature,
                        condition: live.weather,
                        city: live.city,
                        low: forecast.nighttemp,
                        high: forecast.daytemp,
                        icon: iconClass
                    })
                }
            } catch (error) {
                console.error("天气数据加载失败:", error)
                setWeather(prev => ({ ...prev, condition: "暂无数据", city: "未知" }))
            }
        }

        fetchWeather()
        const interval = setInterval(fetchWeather, 30 * 60 * 1000)
        return () => clearInterval(interval)
    }, [apiKey, adcode])

    const WeatherIcon = iconMap[weather.icon] || RiSunCloudyLine

    return (
        <div className="h-full flex flex-col justify-between p-6 bg-gradient-to-br from-sky-500 to-blue-700 rounded-[32px] text-white shadow-lg relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-20">
                <WeatherIcon size={144} className="transform group-hover:scale-110 transition-transform duration-700" />
            </div>
            <div className="relative z-10">
                <div className="flex items-center space-x-2 opacity-90 mb-1">
                    <RiMapPinLine size={14} />
                    <span className="text-sm font-medium tracking-wide">{weather.city}</span>
                </div>
                <h2 className="text-5xl font-bold font-mono mt-2">{weather.temp}°</h2>
            </div>
            <div className="relative z-10 mt-4">
                <p className="font-medium text-lg">{weather.condition}</p>
                <div className="flex justify-between items-center mt-2 text-sm opacity-80 font-mono">
                    <span>最高: {weather.high}°</span>
                    <span>最低: {weather.low}°</span>
                </div>
            </div>
        </div>
    )
}

export default WeatherCard
