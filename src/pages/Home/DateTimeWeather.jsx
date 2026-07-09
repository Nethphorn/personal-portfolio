import { useState, useEffect } from 'react'
import './DateTimeWeather.css'

const wmoCodes = {
  0: ['☀️', 'Clear'], 1: ['🌤️', 'Mainly Clear'], 2: ['⛅', 'Partly Cloudy'], 3: ['☁️', 'Overcast'],
  45: ['🌫️', 'Foggy'], 48: ['🌫️', 'Foggy'],
  51: ['🌦️', 'Drizzle'], 53: ['🌦️', 'Drizzle'], 55: ['🌦️', 'Drizzle'],
  61: ['🌧️', 'Rain'], 63: ['🌧️', 'Rain'], 65: ['🌧️', 'Rain'],
  71: ['❄️', 'Snow'], 73: ['❄️', 'Snow'], 75: ['❄️', 'Snow'],
  80: ['🌦️', 'Rain Showers'], 81: ['🌦️', 'Rain Showers'], 82: ['🌦️', 'Rain Showers'],
  95: ['⛈️', 'Thunderstorm'], 96: ['⛈️', 'Thunderstorm'], 99: ['⛈️', 'Thunderstorm'],
}

export default function DateTimeWeather() {
  const [now, setNow] = useState(new Date())
  const [weather, setWeather] = useState(null)
  const [coords, setCoords] = useState(null)

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setCoords({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
        () => {}
      )
    }
  }, [])

  useEffect(() => {
    if (!coords) return
    fetch(`https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}&current_weather=true`)
      .then((r) => r.json())
      .then((data) => {
        if (data.current_weather) setWeather(data.current_weather)
      })
      .catch(() => {})
  }, [coords])

  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone
  const dateStr = new Intl.DateTimeFormat('en-CA', {
    timeZone: tz, year: 'numeric', month: '2-digit', day: '2-digit',
  }).format(now).replace(/-/g, '/')
  const timeStr = new Intl.DateTimeFormat('en-GB', {
    timeZone: tz, hour: '2-digit', minute: '2-digit', hour12: false,
  }).format(now)

  const temp = weather ? `${Math.round(weather.temperature)}°C` : null
  const [emoji, label] = weather ? (wmoCodes[weather.weathercode] || ['', '']) : ['', '']

  return (
    <div className="dw-container">
      <span className="dw-time">{timeStr}</span>
      <span className="dw-date">{dateStr}</span>
      {temp && <span className="dw-weather">{temp} {emoji} {label}</span>}
    </div>
  )
}
