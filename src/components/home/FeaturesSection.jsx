import { useState } from 'react'
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

  return (
    <section className="container mx-auto px-6 py-20">
      <div className="text-center mb-16">
        <h3 className="text-4xl font-bold text-slate-800 mb-4">المميزات الرئيسية</h3>
        <p className="text-xl text-slate-600">كل ما تحتاجه لإدارة أجهزة فريقك بفعالية</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature) => (
          <FeatureCard
            key={feature.id}
            feature={feature}
            isHovered={hoveredCard === feature.id}
            onMouseEnter={() => setHoveredCard(feature.id)}
            onMouseLeave={() => setHoveredCard(null)}
          />
        ))}
      </div>
    </section>
  )
}

export default FeaturesSection
