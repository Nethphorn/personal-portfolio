import SceneView from '../../components/SceneView'
import MainMenu from '../../components/MainMenu'
import RetroMusicPlayer from '../../components/RetroMusicPlayer'
import DateTimeWeather from '../../components/DateTimeWeather'

export default function Home() {
  return (
    <>
      <SceneView />
      <RetroMusicPlayer />
      <MainMenu />
      <DateTimeWeather />
    </>
  )
}
