import { useState, useEffect } from 'react'
import { wmoCodes } from './data'

export function useWeather() {
  const [now, setNow] = useState(new Date())
  const [weather, setWeather] = useState(null)

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    let ok = true
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          if (!ok) return
          const { latitude, longitude } = pos.coords
          fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`)
            .then(r => r.json())
            .then(data => { if (ok && data.current_weather) setWeather(data.current_weather) })
            .catch(() => {})
        },
        () => {}
      )
    }
    return () => { ok = false }
  }, [])

  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone
  const dateStr = new Intl.DateTimeFormat('en-CA', {
    timeZone: tz, year: 'numeric', month: '2-digit', day: '2-digit',
  }).format(now).replace(/-/g, '/')
  const timeStr = new Intl.DateTimeFormat('en-GB', {
    timeZone: tz, hour: '2-digit', minute: '2-digit', hour12: false,
  }).format(now)
  const temp = weather ? `${Math.round(weather.temperature)}°C` : null
  const [emoji, label] = weather ? (wmoCodes[weather.weathercode] || ['', '']) : ['', '']

  return { dateStr, timeStr, temp, emoji, label }
}
