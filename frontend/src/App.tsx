
import { Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/context_api.tsx';
import Auth from './components/Auth.tsx';
import LandingPage from './pages/landing_page.tsx';
import AdminPanel from './components/adminPannel';

function App() {
  return (
    <AppProvider>
      <Routes>
        <Route path="/" element={<LandingPage />} />
      </Routes>
    </AppProvider>
  );
}

export default App;
