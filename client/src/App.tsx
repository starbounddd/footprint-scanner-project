import './styles/App.css';
import { ControlPanel } from './components/Controls';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react';
function App() {
  const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY
  
  if (!PUBLISHABLE_KEY) {
    throw new Error('Missing Publishable Key')
  }
  

  return (
    <div className="App">
      <SignedIn>
        <UserButton />
        <ControlPanel />
      </SignedIn>
      <SignedOut>
        <SignInButton />
      </SignedOut>
      <div className="ControlPanel"></div>
    </div>
  );
}

export default App;
