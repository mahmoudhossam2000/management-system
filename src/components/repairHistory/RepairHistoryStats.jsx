function RepairHistoryStats({ stats }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border-r-4 border-purple-500 transition-all duration-300 hover:scale-105">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-slate-600 dark:text-slate-400 text-sm mb-1">إجمالي العمليات</p>
            <p className="text-3xl font-bold text-slate-800 dark:text-slate-100">{stats.total}</p>
          </div>
          <div className="text-4xl">🔧</div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border-r-4 border-green-500 transition-all duration-300 hover:scale-105">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-slate-600 dark:text-slate-400 text-sm mb-1">مكتملة</p>
            <p className="text-3xl font-bold text-green-600 dark:text-green-400">{stats.completed}</p>
          </div>
          <div className="text-4xl">✅</div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border-r-4 border-blue-500 transition-all duration-300 hover:scale-105">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-slate-600 dark:text-slate-400 text-sm mb-1">قيد التنفيذ</p>
            <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{stats.inProgress}</p>
          </div>
          <div className="text-4xl">⚙️</div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border-r-4 border-yellow-500 transition-all duration-300 hover:scale-105">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-slate-600 dark:text-slate-400 text-sm mb-1">معلقة</p>
            <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">{stats.pending}</p>
          </div>
          <div className="text-4xl">⏳</div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border-r-4 border-indigo-500 transition-all duration-300 hover:scale-105">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-slate-600 dark:text-slate-400 text-sm mb-1">التكلفة الإجمالية</p>
            <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{stats.totalCost.toFixed(2)} ج.م</p>
          </div>
          <div className="text-4xl">💰</div>
        </div>
      </div>
    </div>
  )
}

export default RepairHistoryStats
