import './App.css'
import { useSearchParams } from 'react-router-dom'

import React, { useRef } from 'react'
import { Menu } from './components/menu/Menu'
import {
  RoomConnectionProvider,
  RoomRole,
} from './components/game/providers/RoomConnectionProvider'
import {
  WebRTCConnectionProvider,
  WebRTCState,
} from './components/game/providers/WebRTCConnectionProvider'
import { Game, UserAction } from './components/game/game-logic/Game'
import TankGame from './components/game/TankGame'
import { AppProvider, Stage } from '@inlet/react-pixi'
import { GameScreenControls } from './components/game/GameScreenControls'
import { FIELD_HEIGHT, FIELD_WIDTH } from './config'
import {
  Key,
  KeyControlsProvider,
} from './components/game/providers/KeyControlsProvider'
import { keysToAction } from './components/game/gameHelpers'

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

                  const PING = 'ping'
                  const PING_REPLY = 'ping_reply'
                  const pingResultRef = useRef<HTMLParagraphElement>(null)
                  let pingStart: number = 0

                  if (webRtcConnection.state == WebRTCState.CONNECTED) {
                    /*
                     * Short explanation how this whole thing works:
                     * Basically there are three streams of events
                     *   - webRtc data
                     *   - key presses
                     *   - game loop
                     * It's not very reacty, because I did not want force a redraw
                     * of components every time any of these events comes in.
                     *
                     * Soooo in case of root, key press callback and webRTC are constantly
                     * setting the user actions, which are used to calculate the new game state
                     * on each tick.
                     *
                     * The node receives new game state which overrides its own,
                     * but still calculates new states. It might still look okay-ish smooth
                     * when the connection is slow.
                     *
                     * The only component that updates in the game loop is the <TankGame/>
                     * which forces its update on each tick and draws the new game state -> it's still
                     * the same reference in memory, so react trigger does not happen automatically. Which
                     * is a good thing.
                     *
                     * Possible refactoring: maybe the providers should be replaced by custom hooks?
                     * */

                    const game = new Game()
                    appLog('starting the game...')

                    webRtcConnection.handlers?.setDataListener((data) => {
                      if (data == PING) {
                        webRtcConnection.handlers?.sendData(PING_REPLY)
                        return
                      }

                      if (data == PING_REPLY) {
                        const millisSinceStart = performance.now() - pingStart
                        pingResultRef.current!.innerText = `${millisSinceStart.toFixed(
                          3
                        )} ms`
                        return
                      }

                      if (isRoot) {
                        // Root is receiving only the node action, let's update it! 😎
                        game.gameState.userActions = {
                          ...game.gameState.userActions,
                          nodeAction: data,
                        }
                      } else {
                        // This might be a little confusing 🤨... The reason for this shananigans
                        // is that node is receiving the whole state - including the node action!
                        // But we want the node decide what it wants to do! 🤓
                        const nodeAction = game.gameState.userActions.nodeAction
                        game.gameState = data
                        game.gameState.userActions.nodeAction = nodeAction
                      }
                    })

                    const onKeysUpdated = (keys: Key[]) => {
                      const newAction = keysToAction(keys)
                      if (isRoot) {
                        game.gameState.userActions.rootAction = newAction
                      } else {
                        game.gameState.userActions.nodeAction = newAction
                      }
                    }

                    const onGameTick = () => {
                      game.update()
                      if (isRoot) {
                        webRtcConnection?.handlers?.sendData(game.gameState)
                      } else {
                        webRtcConnection?.handlers?.sendData(
                          game.gameState.userActions.nodeAction
                        )
                      }
                    }

                    const ping = () => {
                      pingStart = performance.now()
                      webRtcConnection.handlers?.sendData(PING)
                    }

                    return (
                      <KeyControlsProvider
                        child={(setKeyPressHandler) => {
                          setKeyPressHandler(onKeysUpdated)
                          return (
                            <>
                              <GameScreenControls
                                isRoot={isRoot}
                                gameState={game.gameState}
                              />
                              <Stage
                                width={FIELD_WIDTH}
                                height={FIELD_HEIGHT}
                                options={{ backgroundColor: 0x505152 }}
                              >
                                <TankGame
                                  isRoot={isRoot}
                                  game={game}
                                  tick={onGameTick}
                                />
                              </Stage>
                              <br></br>
                              <br></br>
                              <button onClick={ping}>Ping opponent!</button>
                              <p ref={pingResultRef} />
                            </>
                          )
                        }}
                      />
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
          href="https://github.com/PetrKubes97/FoundationsOfDistributedSystems-project"
          target="_blank"
          rel="noopener noreferrer"
        >
          Source Code
        </a>
        <br></br>
      </header>
    </div>
  )
}

export default App
