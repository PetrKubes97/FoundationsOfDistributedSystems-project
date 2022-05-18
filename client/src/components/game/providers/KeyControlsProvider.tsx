import React, { useEffect, useRef } from 'react'

export enum Key {
  up = 'up',
  down = 'down',
  left = 'left',
  right = 'right',
  space = 'space',
}

type KeyPressHandler = (pressed: Key[]) => void

type Props = {
  child: (
    registerKeyPressHandler: (handler: KeyPressHandler) => void
  ) => JSX.Element
}

export const KeyControlsProvider: React.FC<Props> = ({ child }) => {
  let localHandler: KeyPressHandler | undefined
  const currentlyPressedKeys: Key[] = []

  const addOrRemoveFromCurrentlyPressed = (remove: boolean, key: Key) => {
    if (remove) {
      // TODO: check for duplicates and non-existent in edge cases
      const idx = currentlyPressedKeys.indexOf(key)
      currentlyPressedKeys.splice(idx, 1)
    } else {
      if (currentlyPressedKeys.indexOf(key) == -1) {
        currentlyPressedKeys.push(key)
      }
    }
  }

  const registerHandler = (handler: KeyPressHandler) => {
    localHandler = handler
  }

  useEffect(() => {
    const keyListener = (isUp: boolean) => (event: KeyboardEvent) => {
      event.preventDefault()
      switch (event.code) {
        case 'ArrowUp':
          addOrRemoveFromCurrentlyPressed(isUp, Key.up)
          break
        case 'ArrowDown':
          addOrRemoveFromCurrentlyPressed(isUp, Key.down)
          break
        case 'ArrowLeft':
          addOrRemoveFromCurrentlyPressed(isUp, Key.left)
          break
        case 'ArrowRight':
          addOrRemoveFromCurrentlyPressed(isUp, Key.right)
          break
        case 'Space':
          addOrRemoveFromCurrentlyPressed(isUp, Key.space)
          break
      }
      localHandler?.([...currentlyPressedKeys])
    }

    const upListener = keyListener(true)
    const downListener = keyListener(false)

    document.addEventListener('keydown', downListener)
    document.addEventListener('keyup', upListener)

    return () => {
      document.removeEventListener('keydown', downListener)
      document.removeEventListener('keyup', upListener)
    }
  }, [])

  return child(registerHandler)
}
