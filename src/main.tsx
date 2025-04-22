import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'  // Import necessary components from react-router-dom
import './index.css'
import App from './App.tsx'
import Demo from './app/pages/demo.tsx'
import Onboarding from './app/pages/onboarding.tsx'

import Rewards from './app/pages/rewards.tsx'
import Challenges from './app/pages/challenges.tsx'
import Rides from './app/pages/rides.tsx'











createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/demo" element={<Demo />} />
        <Route path="/rewards" element={<Rewards />} />
        <Route path="/on-board" element={<Onboarding />} />
        <Route path="/challenges" element={<Challenges />} />
        <Route path="/rides" element={<Rides />} />





        
     







      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
