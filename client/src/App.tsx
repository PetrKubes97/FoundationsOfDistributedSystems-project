import './App.css'

import React, { useState } from 'react'
import TankGame from './TankGame'
import { Menu } from './components/menu/Menu'

const App: React.FC = () => {
  const [roomId, setRoomId] = useState<string | undefined>()

  const createRoom = () => {}

  const joinRoom = (roomId: string) => {}

  return (
    <div className="App">
      <header className="App-header">
        {roomId && <TankGame />}
        {!roomId && <Menu createRoom={createRoom} joinRoom={joinRoom} />}

        <a
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
