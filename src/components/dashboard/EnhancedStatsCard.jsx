import { useState, useEffect } from 'react'

function EnhancedStatsCard({ icon, value, label, color, trend }) {
  const [displayValue, setDisplayValue] = useState(0)

  // Animated counter effect
  useEffect(() => {
    let start = 0
    const end = parseInt(value) || 0
    if (start === end) return

    const duration = 1000 // 1 second
    const increment = end / (duration / 16) // 60fps

    const timer = setInterval(() => {
      start += increment
      if (start >= end) {
        setDisplayValue(end)
        clearInterval(timer)
      } else {
        setDisplayValue(Math.floor(start))
      }
    }, 16)

    return () => clearInterval(timer)
  }, [value])

  const colorClasses = {
    blue: {
      border: 'border-blue-500',
      bg: 'bg-blue-50 dark:bg-blue-900/20',
      iconBg: 'bg-blue-100 dark:bg-blue-800/30',
      text: 'text-blue-600 dark:text-blue-400',
      glow: 'group-hover:shadow-blue-500/50'
    },
    green: {
      border: 'border-green-500',
      bg: 'bg-green-50 dark:bg-green-900/20',
      iconBg: 'bg-green-100 dark:bg-green-800/30',
      text: 'text-green-600 dark:text-green-400',
      glow: 'group-hover:shadow-green-500/50'
    },
    orange: {
      border: 'border-orange-500',
      bg: 'bg-orange-50 dark:bg-orange-900/20',
      iconBg: 'bg-orange-100 dark:bg-orange-800/30',
      text: 'text-orange-600 dark:text-orange-400',
      glow: 'group-hover:shadow-orange-500/50'
    },
    red: {
      border: 'border-red-500',
      bg: 'bg-red-50 dark:bg-red-900/20',
      iconBg: 'bg-red-100 dark:bg-red-800/30',
      text: 'text-red-600 dark:text-red-400',
      glow: 'group-hover:shadow-red-500/50'
    }
  }

  const colors = colorClasses[color] || colorClasses.blue

  return (
    <div className={`
      group relative bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 
      border-r-4 ${colors.border}
      transition-all duration-300 
      hover:scale-105 hover:shadow-2xl ${colors.glow}
      overflow-hidden
    `}>
      {/* Animated background gradient */}
      <div className={`
        absolute inset-0 ${colors.bg} opacity-0 
        group-hover:opacity-100 transition-opacity duration-300
      `}></div>

      {/* Content */}
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex-1">
          <p className="text-slate-600 dark:text-slate-400 text-sm mb-2 font-medium">
            {label}
          </p>
          <p className={`text-4xl font-bold ${colors.text} transition-all duration-300 group-hover:scale-110 inline-block`}>
            {displayValue}
          </p>
          {trend && (
            <div className="mt-2 flex items-center gap-1 text-xs">
              <span className={trend > 0 ? 'text-green-600' : 'text-red-600'}>
                {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
              </span>
              <span className="text-slate-500 dark:text-slate-400">من الشهر الماضي</span>
            </div>
          )}
        </div>
        
        {/* Icon with animation */}
        <div className={`
          ${colors.iconBg} rounded-full p-4
          transition-all duration-300
          group-hover:scale-110 group-hover:rotate-12
        `}>
          <div className="text-4xl">{icon}</div>
        </div>
      </div>

      {/* Decorative corner */}
      <div className={`
        absolute -bottom-2 -right-2 w-24 h-24 ${colors.bg} rounded-full 
        opacity-20 group-hover:scale-150 transition-transform duration-500
      `}></div>
    </div>
  )
}

export default EnhancedStatsCard
