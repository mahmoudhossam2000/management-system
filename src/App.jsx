import { useState } from 'react'
import { AuthProvider, useAuth } from './context/AuthContext'
import Home from './components/Home'
import Login from './components/Login'
import Signup from './components/Signup'
import SectorSelection from './components/SectorSelection'
import AdminDashboard from './components/AdminDashboard'

function AppContent() {
  const { user, loading } = useAuth()
  const [showSignup, setShowSignup] = useState(false)
  const [selectedSector, setSelectedSector] = useState(null)

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">⏳</div>
          <p className="text-xl text-slate-600">جاري التحميل...</p>
        </div>
      </div>
    )
  }

  // If user is logged in
  if (user) {
    // If sector is selected, show admin dashboard for that sector
    if (selectedSector) {
      return (
        <AdminDashboard 
          sector={selectedSector} 
          onBack={() => setSelectedSector(null)} 
        />
      )
    }
    // Otherwise, show sector selection
    return <SectorSelection onSelectSector={setSelectedSector} />
  }

  // If not logged in, show login/signup or home
  if (showSignup) {
    return <Signup onToggleLogin={() => setShowSignup(false)} />
  }

  // Check if user clicked login button from home
  const urlParams = new URLSearchParams(window.location.search)
  if (urlParams.get('login') === 'true') {
    return <Login onToggleSignup={() => setShowSignup(true)} />
  }

  return <Home />
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App
