import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import App from './App.tsx';
import Demo from './app/pages/demo.tsx';
import Rewards from './app/pages/rewards.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HashRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/demo" element={<Demo />} />
        <Route path="/rewards" element={<Rewards />} />
      </Routes>
    </HashRouter>
  </StrictMode>
);
