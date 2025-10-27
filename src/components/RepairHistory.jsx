import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { supabase } from '../lib/supabaseClient'
import RepairHistoryHeader from './repairHistory/RepairHistoryHeader'
import RepairHistoryStats from './repairHistory/RepairHistoryStats'
import RepairHistoryFilters from './repairHistory/RepairHistoryFilters'
import RepairHistoryTable from './repairHistory/RepairHistoryTable'

function RepairHistory({ onBack }) {
  const { user, isAdmin, signOut } = useAuth()
  const { isDark, toggleTheme } = useTheme()
  
  // State
  const [repairs, setRepairs] = useState([])
  const [filteredRepairs, setFilteredRepairs] = useState([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    inProgress: 0,
    pending: 0,
    totalCost: 0
  })

  // Filter states
  const [filters, setFilters] = useState({
    sector: '',
    status: '',
    technician: '',
    dateFilter: 'all',
    selectedMonth: '',
    startDate: '',
    endDate: '',
    searchTerm: ''
  })

  const [sectors, setSectors] = useState([])
  const [technicians, setTechnicians] = useState([])

  useEffect(() => {
    fetchRepairs()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [filters, repairs])

  const fetchRepairs = async () => {
    try {
      setLoading(true)
      
      const { data, error } = await supabase
        .from('repair_history')
        .select(`
          *,
          devices (
            device_name,
            device_type,
            sector,
            serial_number
          )
        `)
        .order('repair_date', { ascending: false })

      if (error) throw error

      setRepairs(data || [])
      
      const uniqueSectors = [...new Set(data.map(r => r.devices?.sector).filter(Boolean))]
      const uniqueTechnicians = [...new Set(data.map(r => r.technician_name).filter(Boolean))]
      
      setSectors(uniqueSectors.sort())
      setTechnicians(uniqueTechnicians.sort())
      
      calculateStats(data || [])
      
    } catch (error) {
      console.error('Error fetching repairs:', error)
    } finally {
      setLoading(false)
    }
  }

  const calculateStats = (data) => {
    const stats = {
      total: data.length,
      completed: data.filter(r => r.status === 'مكتمل').length,
      inProgress: data.filter(r => r.status === 'قيد التنفيذ').length,
      pending: data.filter(r => r.status === 'معلق').length,
      totalCost: data.reduce((sum, r) => sum + (parseFloat(r.cost) || 0), 0)
    }
    setStats(stats)
  }

  const applyFilters = () => {
    let filtered = [...repairs]

    if (filters.sector) {
      filtered = filtered.filter(r => r.devices?.sector === filters.sector)
    }

    if (filters.status) {
      filtered = filtered.filter(r => r.status === filters.status)
    }

    if (filters.technician) {
      filtered = filtered.filter(r => r.technician_name === filters.technician)
    }

    if (filters.dateFilter === 'month' && filters.selectedMonth) {
      filtered = filtered.filter(r => {
        const repairDate = new Date(r.repair_date)
        const selectedDate = new Date(filters.selectedMonth)
        return repairDate.getMonth() === selectedDate.getMonth() &&
               repairDate.getFullYear() === selectedDate.getFullYear()
      })
    } else if (filters.dateFilter === 'range' && filters.startDate && filters.endDate) {
      filtered = filtered.filter(r => {
        const repairDate = new Date(r.repair_date)
        const start = new Date(filters.startDate)
        const end = new Date(filters.endDate)
        return repairDate >= start && repairDate <= end
      })
    }

    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase()
      filtered = filtered.filter(r => 
        r.repair_description?.toLowerCase().includes(term) ||
        r.devices?.device_name?.toLowerCase().includes(term) ||
        r.devices?.serial_number?.toLowerCase().includes(term) ||
        r.notes?.toLowerCase().includes(term)
      )
    }

    setFilteredRepairs(filtered)
    calculateStats(filtered)
  }

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const resetFilters = () => {
    setFilters({
      sector: '',
      status: '',
      technician: '',
      dateFilter: 'all',
      selectedMonth: '',
      startDate: '',
      endDate: '',
      searchTerm: ''
    })
  }

  const exportToCSV = () => {
    const headers = ['التاريخ', 'القطاع', 'الجهاز', 'الرقم التسلسلي', 'الوصف', 'الفني', 'التكلفة', 'الحالة', 'ملاحظات']
    const rows = filteredRepairs.map(r => [
      new Date(r.repair_date).toLocaleDateString('ar-EG'),
      r.devices?.sector || '',
      r.devices?.device_name || '',
      r.devices?.serial_number || '',
      r.repair_description || '',
      r.technician_name || '',
      r.cost || '0',
      r.status || '',
      r.notes || ''
    ])

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n')

    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `repair_history_${new Date().toISOString().split('T')[0]}.csv`
    link.click()
  }

  const handleSignOut = async () => {
    await signOut()
    window.history.pushState({}, '', window.location.pathname)
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">غير مصرح</h2>
          <p className="text-slate-600 dark:text-slate-400">هذه الصفحة متاحة للمسؤولين فقط</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-colors duration-300">
      <RepairHistoryHeader 
        user={user}
        isDark={isDark}
        toggleTheme={toggleTheme}
        handleSignOut={handleSignOut}
        onBack={onBack}
      />

      <div className="container mx-auto px-6 py-8">
        <RepairHistoryStats stats={stats} />
        
        <RepairHistoryFilters
          filters={filters}
          sectors={sectors}
          technicians={technicians}
          handleFilterChange={handleFilterChange}
          resetFilters={resetFilters}
          exportToCSV={exportToCSV}
        />

        <RepairHistoryTable
          loading={loading}
          filteredRepairs={filteredRepairs}
        />
      </div>
    </div>
  )
}

export default RepairHistory
