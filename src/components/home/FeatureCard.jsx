function FeatureCard({ feature, isHovered, onMouseEnter, onMouseLeave }) {
  return (
    <div
      className="relative group cursor-pointer"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className={`
        bg-white rounded-2xl p-8 shadow-lg border-2 border-slate-100
        transition-all duration-300
        ${isHovered ? 'transform -translate-y-2 shadow-2xl' : ''}
      `}>
        <div className={`
          text-5xl mb-4 transition-transform duration-300
          ${isHovered ? 'scale-110' : ''}
        `}>
          {feature.icon}
        </div>
        <h4 className="text-xl font-bold text-slate-800 mb-3">{feature.title}</h4>
        <p className="text-slate-600 leading-relaxed">{feature.description}</p>
        
        {/* Hover gradient overlay */}
        <div className={`
          absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 rounded-2xl
          transition-opacity duration-300 -z-10
          ${isHovered ? 'opacity-5' : ''}
        `}></div>
      </div>
    </div>
  )
}

export default FeatureCard
