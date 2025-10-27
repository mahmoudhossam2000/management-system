import { useRef } from 'react'
import { useReactToPrint } from 'react-to-print'
import logo from '../../assets/download.png'

function RepairDetailsModal({ repair, onClose }) {
  const contentRef = useRef(null)

  const handlePrint = useReactToPrint({
    contentRef,
    documentTitle: `repair_${repair.id}_${new Date().toISOString().split('T')[0]}`
  })

  const getStatusColor = (status) => {
    const colors = {
      'مكتمل': 'text-green-700 bg-green-100',
      'قيد التنفيذ': 'text-blue-700 bg-blue-100',
      'معلق': 'text-yellow-700 bg-yellow-100'
    }
    return colors[status] || 'text-gray-700 bg-gray-100'
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden animate-slideUp">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-700 dark:to-indigo-700 p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-white">
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">تفاصيل عملية الصيانة</h2>
              <p className="text-purple-100 text-sm">رقم العملية: #{repair.id}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-all flex items-center gap-2 font-semibold"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0l.229 2.523a1.125 1.125 0 01-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0021 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 00-1.913-.247M6.34 18H5.25A2.25 2.25 0 013 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 011.913-.247m10.5 0a48.536 48.536 0 00-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5zm-3 0h.008v.008H15V10.5z" />
              </svg>
              طباعة
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-white">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-88px)]">
          {/* Printable Content */}
          <div ref={contentRef} className="p-8">
            {/* Print Header - Only visible when printing */}
            <div className="hidden print:block mb-8 border-b-2 border-purple-600 pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <img src={logo} alt="Logo" className="h-16 w-16 object-contain" />
                  <div>
                    <h1 className="text-2xl font-bold text-slate-800">نظام إدارة الأجهزة</h1>
                    <p className="text-slate-600">تقرير عملية الصيانة</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-slate-600">تاريخ الطباعة</p>
                  <p className="font-semibold">{new Date().toLocaleDateString('ar-EG')}</p>
                </div>
              </div>
            </div>

            {/* Repair Information */}
            <div className="space-y-6">
              {/* Status Badge */}
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 print:text-slate-800">معلومات العملية</h3>
                <span className={`px-4 py-2 rounded-full text-sm font-bold ${getStatusColor(repair.status)}`}>
                  {repair.status}
                </span>
              </div>

              {/* Basic Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Date */}
                <div className="bg-slate-50 dark:bg-slate-700/50 print:bg-slate-50 rounded-lg p-4">
                  <p className="text-sm text-slate-600 dark:text-slate-400 print:text-slate-600 mb-1">تاريخ العملية</p>
                  <p className="text-lg font-bold text-slate-800 dark:text-slate-100 print:text-slate-800">
                    {new Date(repair.repair_date).toLocaleDateString('ar-EG', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>

                {/* Cost */}
                <div className="bg-slate-50 dark:bg-slate-700/50 print:bg-slate-50 rounded-lg p-4">
                  <p className="text-sm text-slate-600 dark:text-slate-400 print:text-slate-600 mb-1">التكلفة</p>
                  <p className="text-lg font-bold text-indigo-600 dark:text-indigo-400 print:text-indigo-600">
                    {parseFloat(repair.cost || 0).toFixed(2)} جنيه مصري
                  </p>
                </div>

                {/* Technician */}
                {repair.technician_name && (
                  <div className="bg-slate-50 dark:bg-slate-700/50 print:bg-slate-50 rounded-lg p-4">
                    <p className="text-sm text-slate-600 dark:text-slate-400 print:text-slate-600 mb-1">اسم الفني</p>
                    <p className="text-lg font-bold text-slate-800 dark:text-slate-100 print:text-slate-800">
                      {repair.technician_name}
                    </p>
                  </div>
                )}
              </div>

              {/* Device Information */}
              {repair.devices && (
                <div className="border-t border-slate-200 dark:border-slate-700 print:border-slate-200 pt-6">
                  <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 print:text-slate-800 mb-4">معلومات الجهاز</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Device Name */}
                    <div className="bg-blue-50 dark:bg-blue-900/20 print:bg-blue-50 rounded-lg p-4">
                      <p className="text-sm text-blue-600 dark:text-blue-400 print:text-blue-600 mb-1">اسم الجهاز</p>
                      <p className="text-lg font-bold text-slate-800 dark:text-slate-100 print:text-slate-800">
                        {repair.devices.device_name}
                      </p>
                    </div>

                    {/* Device Type */}
                    <div className="bg-blue-50 dark:bg-blue-900/20 print:bg-blue-50 rounded-lg p-4">
                      <p className="text-sm text-blue-600 dark:text-blue-400 print:text-blue-600 mb-1">نوع الجهاز</p>
                      <p className="text-lg font-bold text-slate-800 dark:text-slate-100 print:text-slate-800">
                        {repair.devices.device_type}
                      </p>
                    </div>

                    {/* Serial Number */}
                    <div className="bg-blue-50 dark:bg-blue-900/20 print:bg-blue-50 rounded-lg p-4">
                      <p className="text-sm text-blue-600 dark:text-blue-400 print:text-blue-600 mb-1">الرقم التسلسلي</p>
                      <p className="text-lg font-bold text-slate-800 dark:text-slate-100 print:text-slate-800 font-mono">
                        {repair.devices.serial_number}
                      </p>
                    </div>

                    {/* Sector */}
                    <div className="bg-blue-50 dark:bg-blue-900/20 print:bg-blue-50 rounded-lg p-4">
                      <p className="text-sm text-blue-600 dark:text-blue-400 print:text-blue-600 mb-1">القطاع</p>
                      <p className="text-lg font-bold text-slate-800 dark:text-slate-100 print:text-slate-800">
                        {repair.devices.sector}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Repair Description */}
              <div className="border-t border-slate-200 dark:border-slate-700 print:border-slate-200 pt-6">
                <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 print:text-slate-800 mb-4">وصف العملية</h3>
                <div className="bg-amber-50 dark:bg-amber-900/20 print:bg-amber-50 rounded-lg p-6">
                  <p className="text-slate-800 dark:text-slate-200 print:text-slate-800 leading-relaxed whitespace-pre-wrap">
                    {repair.repair_description}
                  </p>
                </div>
              </div>

              {/* Notes */}
              {repair.notes && (
                <div className="border-t border-slate-200 dark:border-slate-700 print:border-slate-200 pt-6">
                  <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 print:text-slate-800 mb-4">ملاحظات إضافية</h3>
                  <div className="bg-slate-50 dark:bg-slate-700/50 print:bg-slate-50 rounded-lg p-6">
                    <p className="text-slate-700 dark:text-slate-300 print:text-slate-700 leading-relaxed whitespace-pre-wrap">
                      {repair.notes}
                    </p>
                  </div>
                </div>
              )}

              {/* Print Footer - Only visible when printing */}
              <div className="hidden print:block mt-12 pt-6 border-t-2 border-slate-300">
                <div className="flex justify-between items-center text-sm text-slate-600">
                  <div>
                    <p>نظام إدارة الأجهزة</p>
                    <p>تم الإنشاء بواسطة النظام الآلي</p>
                  </div>
                  <div className="text-right">
                    <p>رقم العملية: #{repair.id}</p>
                    <p>صفحة 1 من 1</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons - Not printed */}
          <div className="print:hidden p-6 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-700 flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors font-semibold"
            >
              إغلاق
            </button>
            <button
              onClick={handlePrint}
              className="px-6 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all font-semibold flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0l.229 2.523a1.125 1.125 0 01-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0021 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 00-1.913-.247M6.34 18H5.25A2.25 2.25 0 013 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 011.913-.247m10.5 0a48.536 48.536 0 00-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5zm-3 0h.008v.008H15V10.5z" />
              </svg>
              طباعة التقرير
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RepairDetailsModal
