import './App.css'
import { useSearchParams } from 'react-router-dom'

import React from 'react'
import { Menu } from './components/menu/Menu'
import {
  RoomConnectionProvider,
  RoomRole,
} from './components/game/providers/RoomConnectionProvider'
import {
  WebRTCConnectionProvider,
  WebRTCState,
} from './components/game/providers/WebRTCConnectionProvider'
import { Game } from './components/game/game-logic/Game'
import TankGame from './components/game/TankGame'
import { AppProvider, Stage } from '@inlet/react-pixi'
import { GameScreenControls } from './components/game/GameScreenControls'
import { FIELD_HEIGHT, FIELD_WIDTH } from './config'

const App: React.FC = () => {
  const [searchParams] = useSearchParams()
  const roomId = searchParams.get('roomId')

  const appLog = (...log: any[]) => {
    console.log('app: ', ...log)
  }

  return (
    <div className="App">
      <header className="App-header">
        {roomId && (
          <RoomConnectionProvider
            roomId={roomId}
            child={(roomConnection) => (
              <WebRTCConnectionProvider
                roomConnection={roomConnection}
                child={(webRtcConnection) => {
                  const isRoot = roomConnection.role == RoomRole.ROOT

                  if (webRtcConnection.state == WebRTCState.CONNECTED) {
                    const game = new Game()
                    appLog('app:', 'starting the game...')

                    webRtcConnection.handlers?.setDataListener((data) => {
                      appLog('got data', data)
                      // if (isRoot) {
                      //   game.userActions = {
                      //     ...game.userActions,
                      //     nodeAction: data,
                      //   }
                      // } else {
                      //   game.gameState = data
                      // }
                    })

                    return (
                      <>
                        <GameScreenControls isRoot={isRoot} />
                        <Stage
                          width={FIELD_WIDTH}
                          height={FIELD_HEIGHT}
                          options={{ backgroundColor: 0x505152 }}
                        >
                          <TankGame
                            isRoot={isRoot}
                            gameState={game.gameState}
                            currentUserActions={game.userActions}
                            updateUserAction={(action) => {
                              if (isRoot) {
                                game.userActions.rootAction = action
                              } else {
                                game.userActions.nodeAction = action
                              }
                              // console.log('--------')
                              // console.log(action)
                              // console.log(game)
                              // console.log(game.userActions)
                              // console.log(game.userActions.nodeAction)
                            }}
                            tick={() => {
                              game.update()
                            }}
                          />
                        </Stage>
                      </>
                    )
                  }
                  return <>Loading...</>
                }}
              />
            )}
          />
        )}
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
