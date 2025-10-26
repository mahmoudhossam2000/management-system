import logo from '../../assets/download.png'

function Header() {
  return (
 
    <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={logo} alt="Logo" className="h-16 w-18 object-cover rounded-full" />
            <div>
              <h1 className="text-2xl font-bold text-slate-800">نظام إدارة الأجهزة</h1>
              <p className="text-sm text-slate-600">إدارة شاملة لأجهزة القطاعات المختلفة</p>
            </div>
          </div>
          <nav className="flex gap-4">
            <button 
              onClick={() => window.location.href = '?login=true'}
              className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 font-semibold shadow-lg shadow-blue-500/30 transition-all hover:shadow-xl hover:shadow-blue-500/40"
            >
              تسجيل الدخول
            </button>
          </nav>
        </div>
      </div>
    </header>
  )
}

export default Header
