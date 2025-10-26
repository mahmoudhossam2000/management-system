import StatsCard from './StatsCard'

function DashboardPreview({ stats, loading }) {
  return (
    <section className="container mx-auto px-6 py-20">
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-indigo-600/20 blur-3xl rounded-full"></div>
        <div className="relative bg-white rounded-2xl shadow-2xl p-8 border border-slate-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatsCard
              icon="💻"
              value={stats.totalDevices}
              label="إجمالي الأجهزة"
              gradient="from-gray-600 to-gray-400"
              textColor="text-blue-100"
              loading={loading}
            />
            <StatsCard
              icon="✅"
              value={stats.activeDevices}
              label="أجهزة نشطة"
              gradient="from-blue-600 to-blue-500"
              textColor="text-emerald-100"
              loading={loading}
            />
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
    </section>
  )
}

export default DashboardPreview
