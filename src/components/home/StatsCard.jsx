function StatsCard({ icon, value, label, gradient, textColor, loading }) {
  return (
    <div className={`bg-gradient-to-br ${gradient} rounded-xl p-6 text-white shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300`}>
      <div className="text-4xl mb-2">{icon}</div>
      <div className="text-4xl font-bold mb-1">
        {loading ? (
          <span className="animate-pulse">...</span>
        ) : (
          value
        )}
      </div>
      <div className={textColor}>{label}</div>
    </div>
  )
}

export default StatsCard
