import './styles/App.css';
import React, { useState } from 'react';
import { ControlPanel } from './components/Controls';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react';
import { AppMode } from './types';


function App() {
  const [mode, setMode] = useState<AppMode>(AppMode.ONE_TO_ONE);

  return (
    <div className="App">
        <ControlPanel mode={mode} setMode={setMode} />

      <div className="ControlPanel"></div>
    </div>
  );
}

export default App;
