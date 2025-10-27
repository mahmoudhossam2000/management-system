function StatsCard({ icon, value, label, gradient, textColor, loading }) {
  return (
    <div className={`group relative bg-gradient-to-br ${gradient} rounded-xl p-6 text-white shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 overflow-hidden`}>
      {/* Animated background overlay on hover */}
      <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      {/* Content */}
      <div className="relative z-10">
        <div className="text-4xl mb-2 transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
          {icon}
        </div>
        <div className="text-4xl font-bold mb-1 transform group-hover:translate-x-1 transition-all duration-300">
          {loading ? (
            <span className="animate-pulse">...</span>
          ) : (
            <span className="inline-block group-hover:scale-110 transition-transform duration-300">
              {value}
            </span>
          )}
        </div>
        <div className={`${textColor} group-hover:translate-x-1 transition-all duration-300`}>
          {label}
        </div>
      </div>

      {/* Decorative corner element */}
      <div className="absolute -bottom-2 -right-2 w-20 h-20 bg-white/5 rounded-full transform group-hover:scale-150 transition-transform duration-500"></div>
    </div>
  )
}

export default StatsCard
