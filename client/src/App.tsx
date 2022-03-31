import './App.css'
import { BrowserRouter, useSearchParams } from 'react-router-dom'

import React from 'react'
import TankGame from './components/game/TankGame'
import { Menu } from './components/menu/Menu'

const App: React.FC = () => {
  const [searchParams] = useSearchParams()
  const roomId = searchParams.get('roomId')

  return (
    <div className="App">
      <header className="App-header">
        {roomId && <TankGame />}
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
