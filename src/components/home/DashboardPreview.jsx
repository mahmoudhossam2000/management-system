import { useScrollAnimation } from '../../hooks/useScrollAnimation'
import StatsCard from './StatsCard'

function DashboardPreview({ stats, loading }) {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.2 })

  return (
    <section ref={ref} className="container mx-auto px-6 py-20">
      <div className="relative">
        {/* Animated background blur */}
        <div 
          className={`absolute inset-0 bg-gradient-to-r from-blue-600/20 to-indigo-600/20 blur-3xl rounded-full transition-all duration-1000 ${
            isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
          }`}
        ></div>
        
        {/* Main card with slide-up animation */}
        <div 
          className={`relative bg-white rounded-2xl shadow-2xl p-8 border border-slate-200 transition-all duration-1000 ${
            isVisible 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-20'
          }`}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Staggered animation for stats cards */}
            <div 
              className={`transition-all duration-700 ${
                isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
              }`}
              style={{ transitionDelay: '200ms' }}
            >
              <StatsCard
                icon="💻"
                value={stats.totalDevices}
                label="إجمالي الأجهزة"
                gradient="from-gray-600 to-gray-400"
                textColor="text-blue-100"
                loading={loading}
              />
            </div>

            <div 
              className={`transition-all duration-700 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
              style={{ transitionDelay: '400ms' }}
            >
              <StatsCard
                icon="✅"
                value={stats.activeDevices}
                label="أجهزة نشطة"
                gradient="from-blue-600 to-blue-500"
                textColor="text-emerald-100"
                loading={loading}
              />
            </div>

            <div 
              className={`transition-all duration-700 ${
                isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
              }`}
              style={{ transitionDelay: '600ms' }}
            >
              <StatsCard
                icon="🔧"
                value={stats.maintenanceDevices}
                label="قيد الصيانة"
                gradient="from-red-900 to-red-600"
                textColor="text-sky-100"
                loading={loading}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default DashboardPreview
