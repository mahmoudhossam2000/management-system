import BackgroundSlider from '../BackgroundSlider'

function HeroSection() {
  return (
    <section className="relative min-h-[700px] flex items-center overflow-hidden">
      {/* Background Slider */}
      <BackgroundSlider />
      
      {/* Content */}
      <div className="container mx-auto px-6 py-10 relative z-10">
        <div className="text-center max-w-4xl mx-auto mt-[-80px]">
          <div className="inline-block mb-6 px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-full text-sm font-semibold">
            ✨ نظام متكامل لإدارة الأجهزة
          </div>
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight drop-shadow-lg">
            أدِر أجهزة فريقك
            <span className="block text-blue-300">
              بكفاءة وسهولة
            </span>
          </h2>
          <p className="text-xl text-gray-100 mb-10 leading-relaxed drop-shadow-md">
            نظام شامل لتتبع الأجهزة، سجل الإصلاحات، والبيانات الكاملة لجميع أجهزة القطاعات 
          </p>
          <div className="flex gap-4 justify-center">
            <button  
              onClick={() => window.location.href = '?login=true'}
              className="px-8 py-4 bg-white text-blue-600 rounded-xl hover:bg-blue-50 font-bold text-lg shadow-2xl transition-all hover:shadow-white/50 hover:scale-105">
              عرض تفصيلي للأجهزة
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
