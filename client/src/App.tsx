import './App.css';

import React from 'react';
import TankGame from './TankGame';

const App: React.FC = () => {
  return (
    <div className="App">
      <header className="App-header">
        <TankGame />

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
};

export default App;
