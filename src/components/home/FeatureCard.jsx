function FeatureCard({ feature, isHovered, onMouseEnter, onMouseLeave }) {
  return (
    <div
      className="relative group cursor-pointer"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className={`
        relative bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-lg border-2 border-slate-100 dark:border-slate-700
        transition-all duration-500 overflow-hidden
        ${isHovered ? 'transform -translate-y-3 shadow-2xl border-slate-200 dark:border-slate-600' : ''}
      `}>
        {/* Animated background gradient */}
        <div className={`
          absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 rounded-2xl
          transition-all duration-500
          ${isHovered ? 'opacity-10 scale-110' : 'scale-100'}
        `}></div>

        {/* Decorative circles */}
        <div className={`
          absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br ${feature.color} rounded-full opacity-0 blur-2xl
          transition-all duration-700
          ${isHovered ? 'opacity-20 scale-150' : 'scale-100'}
        `}></div>

        {/* Content */}
        <div className="relative z-10">
          {/* Icon with rotation and scale */}
          <div className={`
            text-5xl mb-4 transition-all duration-500 inline-block
            ${isHovered ? 'scale-125 rotate-12' : 'scale-100 rotate-0'}
          `}>
            {feature.icon}
          </div>

          {/* Title with slide effect */}
          <h4 className={`
            text-xl font-bold text-slate-800 dark:text-slate-100 mb-3 transition-all duration-300
            ${isHovered ? 'translate-x-1' : 'translate-x-0'}
          `}>
            {feature.title}
          </h4>

          {/* Description with fade */}
          <p className={`
            text-slate-600 dark:text-slate-400 leading-relaxed transition-all duration-300
            ${isHovered ? 'text-slate-700 dark:text-slate-300' : 'text-slate-600 dark:text-slate-400'}
          `}>
            {feature.description}
          </p>
        </div>

        {/* Bottom shine effect */}
        <div className={`
          absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${feature.color}
          transition-all duration-500 transform origin-left
          ${isHovered ? 'scale-x-100' : 'scale-x-0'}
        `}></div>
      </div>
    </div>
  )
}

export default FeatureCard
