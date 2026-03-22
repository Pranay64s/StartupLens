import { useState } from 'react';
import Dashboard from './components/Dashboard';
import LandingPage from './components/LandingPage';

function App() {
  const [view, setView] = useState<'landing' | 'dashboard'>('landing');

  return (
    <>
      {view === 'landing' ? (
        <LandingPage onStart={() => setView('dashboard')} />
      ) : (
        <Dashboard onBack={() => setView('landing')} />
      )}
    </>
  );
}

export default App;
