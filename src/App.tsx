import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Urge } from './pages/Urge';
import { Log } from './pages/Log';
import { Settings } from './pages/Settings';
import { Setup } from './pages/Setup';
import { useConfig } from './hooks/useConfig';

const basename = import.meta.env.BASE_URL.replace(/\/$/, '');

function SpaRedirect() {
  const navigate = useNavigate();
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const path = params.get('p');
    if (path) navigate(path, { replace: true });
  }, [navigate]);
  return null;
}

function AppRoutes() {
  const { config, loading, save } = useConfig();

  if (loading) return null;

  if (!config) {
    return <Setup onSave={save} />;
  }

  return (
    <Routes>
      <Route path="/" element={<Home config={config} />} />
      <Route path="/urge" element={<Urge config={config} />} />
      <Route path="/log" element={<Log />} />
      <Route path="/settings" element={<Settings config={config} onSave={save} />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter basename={basename}>
      <SpaRedirect />
      <Layout>
        <AppRoutes />
      </Layout>
    </BrowserRouter>
  );
}

export default App;
