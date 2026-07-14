import CharacterHomeView from './CharacterHomeView'
import MainMenu from './MainMenu'
import RetroMusicPlayer from './RetroMusicPlayer'
import DateTimeWeather from './DateTimeWeather'
import './HomePara.css'

export default function Home() {
  return (
    <>
      <CharacterHomeView />
      <MainMenu />
      <div className="home-para">
        <div className="home-para-bg" />
        <div className="home-para-fg">
          <div className="home-para-content">
            <RetroMusicPlayer />
            <DateTimeWeather />
          </div>
        </div>
      </div>
    </>
  )
}
