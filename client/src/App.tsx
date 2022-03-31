import './App.css'
import { useSearchParams } from 'react-router-dom'

import React from 'react'
import { Menu } from './components/menu/Menu'
import { RoomConnectionProvider } from './components/game/RoomConnectionProvider'

const App: React.FC = () => {
  const [searchParams] = useSearchParams()
  const roomId = searchParams.get('roomId')

  return (
    <div className="App">
      <header className="App-header">
        {roomId && <RoomConnectionProvider roomId={roomId} />}
        {!roomId && <Menu />}

        <a
          style={{ marginTop: '32px' }}
          className="App-link"
          href="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
          target="_blank"
          rel="noopener noreferrer"
        >
          Source Code
        </a>
      </header>
    </div>
  )
}

export default App
