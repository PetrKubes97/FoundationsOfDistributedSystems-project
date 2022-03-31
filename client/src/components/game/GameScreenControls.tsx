import React from 'react'
import GreenTank from '../../images/tank.png'
import OrangeTank from '../../images/OpponentTank.png'

interface Props {
  isRoot: boolean
}

export const GameScreenControls: React.FC<Props> = ({ isRoot }) => {
  return (
    <>
      <div style={{ width: '100%' }}>
        <div style={{ width: '50%', height: '100px', float: 'left' }}>
          <div>{`You${isRoot ? ' (root)' : ' (node)'}:`}</div>
          <img src={GreenTank} className="App-logo" width={50} height={50} />
        </div>
        <div style={{ marginLeft: '50%', height: '100px' }}>
          <div>Opponent:</div>
          <img src={OrangeTank} className="App-logo" width={50} height={50} />
        </div>
      </div>
    </>
  )
}
