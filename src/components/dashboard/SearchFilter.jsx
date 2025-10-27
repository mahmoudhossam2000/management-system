import { useState } from 'react'

function SearchFilter({ onSearch, onFilterChange, deviceTypes, deviceStatuses }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedType, setSelectedType] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')

  const handleSearchChange = (e) => {
    const value = e.target.value
    setSearchTerm(value)
    onSearch(value)
  }

  const handleTypeChange = (e) => {
    const value = e.target.value
    setSelectedType(value)
    onFilterChange({ type: value, status: selectedStatus })
  }

  const handleStatusChange = (e) => {
    const value = e.target.value
    setSelectedStatus(value)
    onFilterChange({ type: selectedType, status: value })
  }

  const clearFilters = () => {
    setSearchTerm('')
    setSelectedType('all')
    setSelectedStatus('all')
    onSearch('')
    onFilterChange({ type: 'all', status: 'all' })
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 mb-6 border border-slate-200 dark:border-slate-700">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Search Input */}
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
            🔍 البحث
          </label>
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="ابحث عن جهاز، رقم تسلسلي، أو مالك..."
              className="w-full px-4 py-3 pr-10 rounded-lg border-2 border-slate-200 dark:border-slate-600 
                       bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200
                       focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20
                       transition-all duration-200 placeholder:text-slate-400"
            />
            {searchTerm && (
              <button
                onClick={() => {
                  setSearchTerm('')
                  onSearch('')
                }}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Type Filter */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
            💻 نوع الجهاز
          </label>
          <select
            value={selectedType}
            onChange={handleTypeChange}
            className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 dark:border-slate-600
                     bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200
                     focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20
                     transition-all duration-200 cursor-pointer"
          >
            <option value="all">الكل</option>
            {deviceTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
            📊 الحالة
          </label>
          <select
            value={selectedStatus}
            onChange={handleStatusChange}
            className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 dark:border-slate-600
                     bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200
                     focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20
                     transition-all duration-200 cursor-pointer"
          >
            <option value="all">الكل</option>
            {deviceStatuses.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Active Filters Display */}
      {(searchTerm || selectedType !== 'all' || selectedStatus !== 'all') && (
        <div className="mt-4 flex items-center gap-2 flex-wrap">
          <span className="text-sm text-slate-600 dark:text-slate-400 font-medium">الفلاتر النشطة:</span>
          {searchTerm && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm">
              بحث: {searchTerm}
            </span>
          )}
          {selectedType !== 'all' && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-sm">
              نوع: {selectedType}
            </span>
          )}
          {selectedStatus !== 'all' && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-sm">
              حالة: {selectedStatus}
            </span>
          )}
          <button
            onClick={clearFilters}
            className="text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-medium transition-colors"
          >
            مسح الكل ✕
          </button>
        </div>
      )}
    </div>
  )
}

export default SearchFilter
