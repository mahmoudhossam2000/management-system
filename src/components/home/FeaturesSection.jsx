import { useState } from 'react'
import { useStaggerAnimation } from '../../hooks/useScrollAnimation'
import FeatureCard from './FeatureCard'

function FeaturesSection() {
  const [hoveredCard, setHoveredCard] = useState(null)

  const features = [
    {
      id: 1,
      title: 'إدارة الأجهزة',
      description: 'تتبع جميع الأجهزة ومعلوماتها بسهولة',
      icon: '💻',
      color: 'from-blue-500 to-blue-600'
    },
    {
      id: 2,
      title: 'سجل الإصلاحات',
      description: 'احتفظ بسجل كامل لجميع عمليات الصيانة والإصلاح',
      icon: '🔧',
      color: 'from-green-500 to-green-600'
    },
    {
      id: 3,
      title: 'التقارير والإحصائيات',
      description: 'احصل على تقارير مفصلة عن حالة الأجهزة',
      icon: '📊',
      color: 'from-purple-500 to-purple-600'
    },
    {
      id: 4,
      title: ' سهولة التحكم والصيانة',
      description: 'متابعة الأجهزة من قبل فريق الصيانة',
      icon: '👥',
      color: 'from-orange-500 to-orange-600'
    }
  ]

  const { ref, visibleItems } = useStaggerAnimation(features.length, 150)

  return (
    <section ref={ref} className="container mx-auto px-6 py-20">
      {/* Animated heading */}
      <div 
        className={`text-center mb-16 transition-all duration-1000 ${
          visibleItems.length > 0 
            ? 'opacity-100 translate-y-0' 
            : 'opacity-0 -translate-y-10'
        }`}
      >
        <h3 className="text-4xl font-bold text-slate-800 dark:text-slate-100 mb-4">المميزات الرئيسية</h3>
        <p className="text-xl text-slate-600 dark:text-slate-400">كل ما تحتاجه لإدارة أجهزة فريقك بفعالية</p>
      </div>

      {/* Staggered feature cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature, index) => (
          <div
            key={feature.id}
            className={`transition-all duration-700 ${
              visibleItems.includes(index)
                ? 'opacity-100 translate-y-0 scale-100'
                : 'opacity-0 translate-y-10 scale-95'
            }`}
          >
            <FeatureCard
              feature={feature}
              isHovered={hoveredCard === feature.id}
              onMouseEnter={() => setHoveredCard(feature.id)}
              onMouseLeave={() => setHoveredCard(null)}
            />
          </div>
        ))}
      </div>
    </section>
  )
}

export default FeaturesSection
