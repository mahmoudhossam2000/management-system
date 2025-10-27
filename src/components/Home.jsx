import Header from './home/Header'
import HeroSection from './home/HeroSection'
import DashboardPreview from './home/DashboardPreview'
import FeaturesSection from './home/FeaturesSection'
import Footer from './home/Footer'
import { useDeviceStats } from '../hooks/useDeviceStats'

function Home() {
  const { stats, loading } = useDeviceStats()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-colors duration-300">
      <Header />
      <HeroSection />
      <DashboardPreview stats={stats} loading={loading} />
      <FeaturesSection />
      <Footer />
    </div>
  )
}

export default Home
