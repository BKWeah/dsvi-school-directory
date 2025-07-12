import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { HelmetProvider } from 'react-helmet-async'
import { Toaster } from 'sonner'
import DirectoryHome from './pages/DirectoryHome'
import SchoolProfile from './pages/SchoolProfile'
import PromoBoost from './pages/PromoBoost'
import DirectoryAdmin from './pages/DirectoryAdmin'
import ManualSubmission from './pages/ManualSubmission'
import CampaignDashboard from './components/promo/CampaignDashboard'
import ComponentTest from './test/ComponentTest'

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <HelmetProvider>
        <BrowserRouter>
          <div className="min-h-screen bg-background">
            <Routes>
              <Route path="/" element={<DirectoryHome />} />
              <Route path="/school/:schoolId" element={<SchoolProfile />} />
              <Route path="/submit-school" element={<ManualSubmission />} />
              <Route path="/promo-boost" element={<PromoBoost />} />
              <Route path="/campaigns" element={<CampaignDashboard />} />
              <Route path="/admin" element={<DirectoryAdmin />} />
              <Route path="/test" element={<ComponentTest />} />
            </Routes>
            <Toaster position="top-right" />
          </div>
        </BrowserRouter>
      </HelmetProvider>
    </QueryClientProvider>
  )
}

export default App
