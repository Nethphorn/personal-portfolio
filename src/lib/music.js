export const TIME_SLOTS = ['morning', 'afternoon', 'evening', 'night']

const track = (slot, file, name) => ({
  name,
  src: `/assets/audio/music/main-menu-${slot}/${file}`,
})

export const PLAYLISTS = {
  morning: [
    track('morning', 'main-menu-morning-alex-morgan-jazz-cafe-morning-music-556238.mp3', 'Jazz Cafe Morning Music'),
    track('morning', 'main-menu-morning1-alex-morgan-jazz-sunny-cafe-music-563582.mp3', 'Jazz Sunny Cafe Music'),
    track('morning', 'main-menu-morning2-alex-morgan-corporate-jazz-sunny-cafe-556694.mp3', 'Corporate Jazz Sunny Cafe'),
  ],
  afternoon: [
    track('afternoon', 'main-menu-afternoon1-alex-morgan-sultry-jazz-sunny-cafe-music-564254.mp3', 'Sultry Jazz Sunny Cafe'),
    track('afternoon', 'main-menu-afternoon2-alex-morgan-jazz-lounge-sunny-cafe-music-564270.mp3', 'Jazz Lounge Sunny Cafe'),
    track('afternoon', 'main-menu-alex-morgan-cafe-jazz-coffee-shop-music-564287.mp3', 'Cafe Jazz Coffee Shop'),
  ],
  evening: [
    track('evening', 'main-menu-evening-alex-morgan-dinner-jazz-sunny-cafe-556701.mp3', 'Dinner Jazz Sunny Cafe'),
    track('evening', 'main-menu-evening1-alex-morgan-jazz-lounge-sunny-cafe-563577.mp3', 'Jazz Lounge Sunny Cafe'),
    track('evening', 'main-menu-evening2-alex-morgan-soul-jazz-sunny-cafe-music-564286.mp3', 'Soul Jazz Sunny Cafe'),
  ],
  night: [
    track('night', 'main-menu-night-alex-morgan-jazz-cafe-midnight-club-music-564283.mp3', 'Jazz Cafe Midnight Club'),
    track('night', 'main-menu-night1-alex-morgan-saxophone-jazz-sunny-cafe-568170.mp3', 'Saxophone Jazz Sunny Cafe'),
    track('night', 'main-menu-night2-alex-morgan-cocktail-jazz-coffee-shop-556233.mp3', 'Cocktail Jazz Coffee Shop'),
  ],
}

const SLOT_HOURS = [
  { slot: 'morning', start: 5, end: 12 },
  { slot: 'afternoon', start: 12, end: 17 },
  { slot: 'evening', start: 17, end: 21 },
  { slot: 'night', start: 21, end: 29 },
]

export function getTimeSlot(date = new Date()) {
  const h = date.getHours()
  for (const { slot, start, end } of SLOT_HOURS) {
    const hour = h < 5 ? h + 24 : h
    if (hour >= start && hour < end) return slot
  }
  return 'night'
}

export const SLOT_LABELS = {
  morning: 'Morning',
  afternoon: 'Afternoon',
  evening: 'Evening',
  night: 'Night',
}
