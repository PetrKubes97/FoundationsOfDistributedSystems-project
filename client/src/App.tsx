import './App.css';

import React, { useState } from 'react';

import TankGame from './TankGame';

function App() {
  const [channelCreated, setChannelCreated] = useState(false);

  const onCreateChannelClick = () => {
    setChannelCreated(true);
    console.log('Here we insert the channel creation stuff');
  };

  return (
    <div className="App">
      <header className="App-header">
        <p>The Great Game of Tanks</p>

        <button onClick={onCreateChannelClick}>Create channel</button>
        {channelCreated ? (
          <>
            <div style={{ width: '100%' }}>
              <div style={{ width: '50%', height: '100px', float: 'left' }}>
                <div>You:</div>
                <img
                  src="./src/images/tank.png"
                  className="App-logo"
                  width={50}
                  height={50}
                />
              </div>
              <div style={{ marginLeft: '50%', height: '100px' }}>
                <div>Opponent:</div>
                <img
                  src="./src/images/OpponentTank.png"
                  className="App-logo"
                  width={50}
                  height={50}
                />
              </div>
            </div>
            <TankGame />
          </>
        ) : null}

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
  );
}

export default App;
