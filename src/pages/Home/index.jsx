import CharacterHomeView from './CharacterHomeView'
import MainMenu from './MainMenu'
import RetroMusicPlayer from './RetroMusicPlayer'
import DateTimeWeather from './DateTimeWeather'

export default function Home() {
  return (
    <>
      <CharacterHomeView />
      <RetroMusicPlayer />
      <MainMenu />
      <DateTimeWeather />
    </>
  )
}
