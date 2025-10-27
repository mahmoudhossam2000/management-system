import { useState, useEffect } from 'react'
import BackgroundSlider from '../BackgroundSlider'

function HeroSection() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Trigger animations on mount
    const timer = setTimeout(() => setIsVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])

  return (
    <section className="relative min-h-[700px] flex items-center overflow-hidden">
      {/* Background Slider */}
      <BackgroundSlider />
      
      {/* Content */}
      <div className="container mx-auto px-6 py-10 relative z-10">
        <div className="text-center max-w-4xl mx-auto mt-[-80px]">
          {/* Badge - Fade in from top */}
          <div 
            className={`inline-block mb-6 px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-full text-sm font-semibold transition-all duration-700 ${
              isVisible 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 -translate-y-10'
            }`}
            style={{ transitionDelay: '200ms' }}
          >
            ✨ نظام متكامل لإدارة الأجهزة
          </div>

          {/* Main Heading - Scale and fade in */}
          <h2 
            className={`text-5xl md:text-6xl font-bold text-white mb-6 leading-tight drop-shadow-lg transition-all duration-1000 ${
              isVisible 
                ? 'opacity-100 scale-100' 
                : 'opacity-0 scale-95'
            }`}
            style={{ transitionDelay: '400ms' }}
          >
            أدِر أجهزة فريقك
            <span className="block text-blue-300">
              بكفاءة وسهولة
            </span>
          </h2>

          {/* Description - Fade in */}
          <p 
            className={`text-xl text-gray-100 mb-10 leading-relaxed drop-shadow-md transition-all duration-700 ${
              isVisible 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-5'
            }`}
            style={{ transitionDelay: '600ms' }}
          >
            نظام شامل لتتبع الأجهزة، سجل الإصلاحات، والبيانات الكاملة لجميع أجهزة القطاعات 
          </p>

          {/* Button - Slide in from bottom */}
          <div 
            className={`flex gap-4 justify-center transition-all duration-700 ${
              isVisible 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-10'
            }`}
            style={{ transitionDelay: '800ms' }}
          >
            <button  
              onClick={() => window.location.href = '?login=true'}
              className="px-8 py-4 bg-white text-blue-600 rounded-xl hover:bg-blue-50 font-bold text-lg shadow-2xl transition-all hover:shadow-white/50 hover:scale-105 hover:-translate-y-1">
              عرض تفصيلي للأجهزة
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
