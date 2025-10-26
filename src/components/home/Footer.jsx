import logo from '../../assets/download.png'

function Footer() {
  return (
    <footer className="bg-gradient-to-r from-blue-800 to-blue-900 text-white py-12">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img src={logo} alt="Logo" className="h-10 w-10 object-contain" />
              <h5 className="text-xl font-bold">نظام إدارة الأجهزة</h5>
            </div>
            <p className="text-slate-400">الحل الأمثل لإدارة أجهزة فريقك</p>
          </div>
          <div>
            <h6 className="font-bold mb-4">المنتج</h6>
            <ul className="space-y-2 text-slate-400">
              <li><a href="#" className="hover:text-white transition-colors">المميزات</a></li>
              <li><a href="#" className="hover:text-white transition-colors">المنتجات</a></li>
              <li><a href="#" className="hover:text-white transition-colors">التحديثات</a></li>
            </ul>
          </div>
          <div>
            <h6 className="font-bold mb-4">الشركة</h6>
            <ul className="space-y-2 text-slate-400">
              <li><a href="#" className="hover:text-white transition-colors">من نحن</a></li>
              <li><a href="#" className="hover:text-white transition-colors">اتصل بنا</a></li>
              <li><a href="#" className="hover:text-white transition-colors">القطاعات</a></li>
            </ul>
          </div>
          <div>
            <h6 className="font-bold mb-4">الدعم</h6>
            <ul className="space-y-2 text-slate-400">
              <li><a href="#" className="hover:text-white transition-colors">المساعدة</a></li>
              <li><a href="#" className="hover:text-white transition-colors">الوثائق</a></li>
              <li><a href="#" className="hover:text-white transition-colors">الشروط</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-slate-800 mt-8 pt-8 text-center text-slate-400">
          <p>  نظام إدارة الأجهزة. جميع الحقوق محفوظة.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
