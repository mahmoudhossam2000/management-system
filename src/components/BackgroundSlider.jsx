import { useState, useEffect } from 'react'

function BackgroundSlider() {
  const [currentSlide, setCurrentSlide] = useState(0)

  // High-quality images from Unsplash - suitable for device management/tech theme
  const slides = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1920&q=80',
      title: 'إدارة متقدمة للأجهزة',
      description: 'نظام شامل لتتبع وإدارة جميع الأجهزة'
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1920&q=80',
      title: 'تقنية حديثة',
      description: 'استخدم أحدث التقنيات لإدارة أجهزتك'
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1920&q=80',
      title: 'أمان وموثوقية',
      description: 'حماية بياناتك وأجهزتك بأعلى معايير الأمان'
    },
    {
      id: 4,
      image: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=1920&q=80',
      title: 'تقارير تفصيلية',
      description: 'احصل على تحليلات شاملة لأداء الأجهزة'
    }
  ]

  // Auto-play functionality
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000) // Change slide every 5 seconds

    return () => clearInterval(interval)
  }, [slides.length])

  const goToSlide = (index) => {
    setCurrentSlide(index)
  }

  return (
    <div className="absolute inset-0 w-full h-full">
      {/* Background slides */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <img
            src={slide.image}
            alt={slide.title}
            className="w-full h-full object-cover"
            loading="eager"
          />
          {/* Dark overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900/70 via-blue-900/60 to-indigo-900/70"></div>
        </div>
      ))}

      {/* Dots indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`transition-all duration-300 rounded-full ${
              index === currentSlide
                ? 'w-8 h-3 bg-white'
                : 'w-3 h-3 bg-white/50 hover:bg-white/75'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}

export default BackgroundSlider
