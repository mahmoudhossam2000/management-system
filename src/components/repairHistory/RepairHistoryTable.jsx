import { useState } from 'react'
import RepairDetailsModal from './RepairDetailsModal'

function RepairHistoryTable({ loading, filteredRepairs }) {
  const [selectedRepair, setSelectedRepair] = useState(null)

  const getStatusBadge = (status) => {
    const badges = {
      'مكتمل': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
      'قيد التنفيذ': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
      'معلق': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
    }
    return badges[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300'
  }

  return (
    <>
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden transition-colors duration-300">
        <div className="p-6 border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
            سجل العمليات ({filteredRepairs.length})
          </h2>
        </div>

      {loading ? (
        <div className="p-12 text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent"></div>
          <p className="mt-4 text-slate-600 dark:text-slate-400">جاري التحميل...</p>
        </div>
      ) : filteredRepairs.length === 0 ? (
        <div className="p-12 text-center">
          <div className="text-6xl mb-4">📋</div>
          <p className="text-xl text-slate-600 dark:text-slate-400">لا توجد عمليات صيانة</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 dark:bg-slate-900/50">
              <tr>
                <th className="px-6 py-4 text-right text-sm font-bold text-slate-700 dark:text-slate-300">التاريخ</th>
                <th className="px-6 py-4 text-right text-sm font-bold text-slate-700 dark:text-slate-300">القطاع</th>
                <th className="px-6 py-4 text-right text-sm font-bold text-slate-700 dark:text-slate-300">الجهاز</th>
                <th className="px-6 py-4 text-right text-sm font-bold text-slate-700 dark:text-slate-300">الوصف</th>
                <th className="px-6 py-4 text-right text-sm font-bold text-slate-700 dark:text-slate-300">الفني</th>
                <th className="px-6 py-4 text-right text-sm font-bold text-slate-700 dark:text-slate-300">التكلفة</th>
                <th className="px-6 py-4 text-right text-sm font-bold text-slate-700 dark:text-slate-300">الحالة</th>
                <th className="px-6 py-4 text-center text-sm font-bold text-slate-700 dark:text-slate-300">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {filteredRepairs.map((repair) => (
                <tr 
                  key={repair.id}
                  className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                >
                  <td className="px-6 py-4 text-sm text-slate-800 dark:text-slate-200 whitespace-nowrap">
                    {new Date(repair.repair_date).toLocaleDateString('ar-EG', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-800 dark:text-slate-200">
                    <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 rounded-full text-xs font-semibold">
                      {repair.devices?.sector || '-'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-800 dark:text-slate-200">
                    <div>
                      <p className="font-semibold">{repair.devices?.device_name || '-'}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{repair.devices?.device_type || '-'}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">{repair.devices?.serial_number || '-'}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-800 dark:text-slate-200 max-w-xs">
                    <p className="truncate" title={repair.repair_description}>
                      {repair.repair_description}
                    </p>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-800 dark:text-slate-200">
                    {repair.technician_name || '-'}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-800 dark:text-slate-200 whitespace-nowrap">
                    <span className="font-semibold">{parseFloat(repair.cost || 0).toFixed(2)}</span> ج.م
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(repair.status)}`}>
                      {repair.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => setSelectedRepair(repair)}
                      className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all font-semibold text-sm flex items-center gap-2 mx-auto"
                      title="عرض التفاصيل"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      التفاصيل
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      </div>

      {/* Details Modal */}
      {selectedRepair && (
        <RepairDetailsModal
          repair={selectedRepair}
          onClose={() => setSelectedRepair(null)}
        />
      )}
    </>
  )
}

export default RepairHistoryTable
