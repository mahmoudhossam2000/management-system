import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabaseClient'
import logo from '../assets/download.png'
import ConfirmDialog from './ConfirmDialog'

function AdminDashboard({ sector, onBack }) {
  const { user, isAdmin, signOut } = useAuth()
  const [devices, setDevices] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingDevice, setEditingDevice] = useState(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deviceToDelete, setDeviceToDelete] = useState(null)
  const [viewingDevice, setViewingDevice] = useState(null)
  const [repairHistory, setRepairHistory] = useState([])
  const [repairHistoryLoaded, setRepairHistoryLoaded] = useState(false)
  const [showRepairModal, setShowRepairModal] = useState(false)
  const [editingRepair, setEditingRepair] = useState(null)
  const [showDeleteRepairConfirm, setShowDeleteRepairConfirm] = useState(false)
  const [repairToDelete, setRepairToDelete] = useState(null)
  const [formData, setFormData] = useState({
    device_name: '',
    device_type: '',
    serial_number: '',
    owner_name: '',
    owner_mobile: '',
    owner_landline: '',
    ip_address: '',
    status: 'نشط',
    notes: ''
  })

  const [repairFormData, setRepairFormData] = useState({
    repair_description: '',
    repair_date: new Date().toISOString().split('T')[0],
    technician_name: '',
    cost: '',
    status: 'مكتمل',
    notes: ''
  })

  const deviceStatuses = ['نشط', 'قيد الصيانة', 'معطل', 'متوقف']
  const deviceTypes = ['PC', 'Printer', 'Scanner']
  const repairStatuses = ['مكتمل', 'قيد التنفيذ', 'معلق']

  useEffect(() => {
    fetchDevices()
  }, [])

  const fetchDevices = async () => {
    try {
      setLoading(true)
      // Filter devices by sector if sector is provided
      let query = supabase
        .from('devices')
        .select('*')
        .order('created_at', { ascending: false })
      
      // If sector is provided, filter by sector name
      if (sector) {
        query = query.eq('sector', sector.name)
      }

      const { data, error } = await query

      if (error) throw error
      setDevices(data || [])
    } catch (error) {
      console.error('Error fetching devices:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddDevice = async (e) => {
    e.preventDefault()
    
    try {
      const { error } = await supabase
        .from('devices')
        .insert([{
          ...formData,
          department: sector?.name, // Use sector name as department
          sector: sector?.name, // Add sector name to device
          created_by: user.id,
          created_at: new Date().toISOString()
        }])

      if (error) throw error

      setShowAddModal(false)
      resetForm()
      fetchDevices()
    } catch (error) {
      console.error('Error adding device:', error)
      alert('حدث خطأ أثناء إضافة الجهاز')
    }
  }

  const handleUpdateDevice = async (e) => {
    e.preventDefault()
    
    try {
      const { error } = await supabase
        .from('devices')
        .update({
          ...formData,
          updated_at: new Date().toISOString()
        })
        .eq('id', editingDevice.id)

      if (error) throw error

      setEditingDevice(null)
      resetForm()
      fetchDevices()
    } catch (error) {
      console.error('Error updating device:', error)
      alert('حدث خطأ أثناء تحديث الجهاز')
    }
  }

  const handleDeleteClick = (device) => {
    setDeviceToDelete(device)
    setShowDeleteConfirm(true)
  }

  const handleDeleteDevice = async () => {
    if (!deviceToDelete) return

    try {
      const { error } = await supabase
        .from('devices')
        .delete()
        .eq('id', deviceToDelete.id)

      if (error) throw error
      fetchDevices()
      setDeviceToDelete(null)
    } catch (error) {
      console.error('Error deleting device:', error)
    }
  }

  const openEditModal = (device) => {
    setEditingDevice(device)
    setFormData({
      device_name: device.device_name,
      device_type: device.device_type,
      serial_number: device.serial_number,
      owner_name: device.owner_name || '',
      owner_mobile: device.owner_mobile || '',
      owner_landline: device.owner_landline || '',
      ip_address: device.ip_address || '',
      status: device.status,
      notes: device.notes || ''
    })
  }

  const resetForm = () => {
    setFormData({
      device_name: '',
      device_type: '',
      serial_number: '',
      owner_name: '',
      owner_mobile: '',
      owner_landline: '',
      ip_address: '',
      status: 'نشط',
      notes: ''
    })
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'نشط': return 'bg-green-100 text-green-700 border-green-200'
      case 'قيد الصيانة': return 'bg-orange-100 text-orange-700 border-orange-200'
      case 'معطل': return 'bg-red-100 text-red-700 border-red-200'
      case 'متوقف': return 'bg-gray-100 text-gray-700 border-gray-200'
      default: return 'bg-blue-100 text-blue-700 border-blue-200'
    }
  }

  const handleSignOut = async () => {
    await signOut()
    // Clear URL params and redirect to home
    window.history.pushState({}, '', window.location.pathname)
  }

  // Repair History Functions
  const fetchRepairHistory = async (deviceId) => {
    try {
      const { data, error } = await supabase
        .from('repair_history')
        .select('*')
        .eq('device_id', deviceId)
        .order('repair_date', { ascending: false })

      if (error) throw error
      setRepairHistory(data || [])
      setRepairHistoryLoaded(true)
    } catch (error) {
      console.error('Error fetching repair history:', error)
      setRepairHistoryLoaded(true)
    }
  }

  const handleAddRepair = async (e) => {
    e.preventDefault()
    
    try {
      const { error } = await supabase
        .from('repair_history')
        .insert([{
          ...repairFormData,
          device_id: viewingDevice.id,
          created_by: user.id,
          created_at: new Date().toISOString()
        }])

      if (error) throw error

      setShowRepairModal(false)
      resetRepairForm()
      fetchRepairHistory(viewingDevice.id)
    } catch (error) {
      console.error('Error adding repair:', error)
      alert('حدث خطأ أثناء إضافة سجل الإصلاح')
    }
  }

  const handleUpdateRepair = async (e) => {
    e.preventDefault()
    
    try {
      const { error } = await supabase
        .from('repair_history')
        .update({
          ...repairFormData,
          updated_at: new Date().toISOString()
        })
        .eq('id', editingRepair.id)

      if (error) throw error

      setEditingRepair(null)
      resetRepairForm()
      fetchRepairHistory(viewingDevice.id)
    } catch (error) {
      console.error('Error updating repair:', error)
      alert('حدث خطأ أثناء تحديث سجل الإصلاح')
    }
  }

  const handleDeleteRepair = async () => {
    if (!repairToDelete) return

    try {
      const { error } = await supabase
        .from('repair_history')
        .delete()
        .eq('id', repairToDelete.id)

      if (error) throw error
      fetchRepairHistory(viewingDevice.id)
      setRepairToDelete(null)
    } catch (error) {
      console.error('Error deleting repair:', error)
    }
  }

  const openEditRepairModal = (repair) => {
    setEditingRepair(repair)
    setRepairFormData({
      repair_description: repair.repair_description,
      repair_date: repair.repair_date,
      technician_name: repair.technician_name || '',
      cost: repair.cost || '',
      status: repair.status,
      notes: repair.notes || ''
    })
    setShowRepairModal(true)
  }

  const resetRepairForm = () => {
    setRepairFormData({
      repair_description: '',
      repair_date: new Date().toISOString().split('T')[0],
      technician_name: '',
      cost: '',
      status: 'مكتمل',
      notes: ''
    })
    setShowRepairModal(false)
    setEditingRepair(null)
  }

  const getRepairStatusColor = (status) => {
    switch (status) {
      case 'مكتمل': return 'bg-green-100 text-green-700 border-green-200'
      case 'قيد التنفيذ': return 'bg-orange-100 text-orange-700 border-orange-200'
      case 'معلق': return 'bg-yellow-100 text-yellow-700 border-yellow-200'
      default: return 'bg-blue-100 text-blue-700 border-blue-200'
    }
  }

  const stats = {
    total: devices.length,
    active: devices.filter(d => d.status === 'نشط').length,
    maintenance: devices.filter(d => d.status === 'قيد الصيانة').length,
    broken: devices.filter(d => d.status === 'معطل').length
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={onBack}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors group"
                title="العودة للقطاعات"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-slate-600 group-hover:text-blue-600 transition-colors">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
              </button>
              <img src={logo} alt="Logo" className="h-12 w-12 object-contain" />
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-3xl">{sector?.icon}</span>
                  <h1 className="text-2xl font-bold text-slate-800">{sector?.name}</h1>
                </div>
                <p className="text-sm text-slate-600">إدارة أجهزة القطاع - {devices.length} جهاز</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-left">
                <p className="font-semibold text-slate-800">{user?.user_metadata?.full_name || user?.email}</p>
                {isAdmin && (
                  <span className="inline-block px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full mt-1">
                    مسؤول
                  </span>
                )}
              </div>
             <button
              onClick={handleSignOut}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 hover:shadow-md text-white rounded-lg font-semibold transition-colors"
            >
              تسجيل الخروج
            </button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border-r-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm mb-1">إجمالي الأجهزة</p>
                <p className="text-3xl font-bold text-slate-800">{stats.total}</p>
              </div>
              <div className="text-4xl">💻</div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 border-r-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm mb-1">أجهزة نشطة</p>
                <p className="text-3xl font-bold text-slate-800">{stats.active}</p>
              </div>
              <div className="text-4xl">✅</div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 border-r-4 border-orange-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm mb-1">قيد الصيانة</p>
                <p className="text-3xl font-bold text-slate-800">{stats.maintenance}</p>
              </div>
              <div className="text-4xl">🔧</div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 border-r-4 border-red-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm mb-1">أجهزة معطلة</p>
                <p className="text-3xl font-bold text-slate-800">{stats.broken}</p>
              </div>
              <div className="text-4xl">❌</div>
            </div>
          </div>
        </div>

        {/* Devices Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-slate-200 flex justify-between items-center">
            <h2 className="text-2xl font-bold text-slate-800">قائمة الأجهزة</h2>
            {isAdmin && (
              <button
                onClick={() => setShowAddModal(true)}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 font-semibold shadow-lg shadow-blue-500/30 transition-all"
              >
                + إضافة جهاز جديد
              </button>
            )}
          </div>

          {loading ? (
            <div className="p-12 text-center">
              <div className="text-4xl mb-4">⏳</div>
              <p className="text-slate-600">جاري تحميل البيانات...</p>
            </div>
          ) : devices.length === 0 ? (
            <div className="p-12 text-center">
              <div className="text-6xl mb-4">📦</div>
              <p className="text-xl text-slate-600 mb-2">لا توجد أجهزة مسجلة</p>
              <p className="text-slate-500">ابدأ بإضافة أول جهاز</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-4 text-right text-sm font-bold text-slate-700">اسم الجهاز</th>
                    <th className="px-6 py-4 text-right text-sm font-bold text-slate-700">النوع</th>
                    <th className="px-6 py-4 text-right text-sm font-bold text-slate-700">الرقم التسلسلي</th>
                    <th className="px-6 py-4 text-right text-sm font-bold text-slate-700">القطاع</th>
                    <th className="px-6 py-4 text-right text-sm font-bold text-slate-700">الحالة</th>
                    <th className="px-6 py-4 text-right text-sm font-bold text-slate-700">الإجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {devices.map((device) => (
                    <tr key={device.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 text-slate-800 font-semibold">{device.device_name}</td>
                      <td className="px-6 py-4 text-slate-600">{device.device_type}</td>
                      <td className="px-6 py-4 text-slate-600 font-mono text-sm">{device.serial_number}</td>
                      <td className="px-6 py-4 text-slate-600">{device.department}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold border ${getStatusColor(device.status)}`}>
                          {device.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => setViewingDevice(device)}
                            className="px-3 py-1 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg text-sm font-semibold transition-colors"
                          >
                            عرض التفاصيل
                          </button>
                          {isAdmin && (
                            <>
                              <button
                                onClick={() => openEditModal(device)}
                                className="px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg text-sm font-semibold transition-colors"
                              >
                                تعديل
                              </button>
                              <button
                                onClick={() => handleDeleteClick(device)}
                                className="px-3 py-1 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg text-sm font-semibold transition-colors"
                              >
                                حذف
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      {(showAddModal || editingDevice) && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-6 z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200">
              <h3 className="text-2xl font-bold text-slate-800">
                {editingDevice ? 'تعديل الجهاز' : 'إضافة جهاز جديد'}
              </h3>
            </div>
            
            <form onSubmit={editingDevice ? handleUpdateDevice : handleAddDevice} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    نوع الجهاز *
                  </label>
                  <select
                    required
                    value={formData.device_type}
                    onChange={(e) => setFormData({ ...formData, device_type: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">اختر نوع الجهاز</option>
                    {deviceTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    اسم الجهاز *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.device_name}
                    onChange={(e) => setFormData({ ...formData, device_name: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="مثال: HP LaserJet Pro"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    الرقم التسلسلي *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.serial_number}
                    onChange={(e) => setFormData({ ...formData, serial_number: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="SN123456"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    الحالة *
                  </label>
                  <select
                    required
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {deviceStatuses.map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    عنوان IP (اختياري)
                  </label>
                  <input
                    type="text"
                    value={formData.ip_address}
                    onChange={(e) => setFormData({ ...formData, ip_address: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="مثال: 192.168.1.100"
                  />
                </div>
              </div>

              {/* Owner Details Section */}
              <div className="border-t border-slate-200 pt-4 mt-4">
                <h4 className="text-lg font-bold text-slate-800 mb-3">بيانات مالك الجهاز</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      اسم المالك
                    </label>
                    <input
                      type="text"
                      value={formData.owner_name}
                      onChange={(e) => setFormData({ ...formData, owner_name: e.target.value })}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="اسم مالك الجهاز"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      رقم الموبايل
                    </label>
                    <input
                      type="tel"
                      value={formData.owner_mobile}
                      onChange={(e) => setFormData({ ...formData, owner_mobile: e.target.value })}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="مثال: 0501234567"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      رقم الهاتف الأرضي
                    </label>
                    <input
                      type="tel"
                      value={formData.owner_landline}
                      onChange={(e) => setFormData({ ...formData, owner_landline: e.target.value })}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="مثال: 0112345678"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  ملاحظات
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="3"
                  placeholder="أي ملاحظات إضافية..."
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 font-bold shadow-lg transition-all"
                >
                  {editingDevice ? 'حفظ التعديلات' : 'إضافة الجهاز'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false)
                    setEditingDevice(null)
                    resetForm()
                  }}
                  className="flex-1 py-3 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg font-bold transition-colors"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Device Details Modal */}
      {viewingDevice && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-6 z-50" onMouseDown={(e) => {
          if (e.target === e.currentTarget) {
            setViewingDevice(null)
            setRepairHistory([])
            setRepairHistoryLoaded(false)
          }
        }}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200 bg-gradient-to-r from-blue-600 to-indigo-600">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-white">تفاصيل الجهاز</h3>
                <button
                  onClick={() => {
                    setViewingDevice(null)
                    setRepairHistory([])
                    setRepairHistoryLoaded(false)
                  }}
                  className="text-white hover:bg-white/20 rounded-lg p-2 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Device Information Section */}
              <div className="bg-slate-50 rounded-xl p-5">
                <h4 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <span className="text-2xl">💻</span>
                  معلومات الجهاز
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-slate-600 mb-1">نوع الجهاز</p>
                    <p className="text-lg font-semibold text-slate-800">{viewingDevice.device_type}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 mb-1">اسم الجهاز</p>
                    <p className="text-lg font-semibold text-slate-800">{viewingDevice.device_name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 mb-1">الرقم التسلسلي</p>
                    <p className="text-lg font-semibold text-slate-800 font-mono">{viewingDevice.serial_number}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 mb-1">القطاع</p>
                    <p className="text-lg font-semibold text-slate-800">{viewingDevice.department || viewingDevice.sector}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 mb-1">الحالة</p>
                    <span className={`inline-block px-4 py-2 rounded-full text-sm font-semibold border ${getStatusColor(viewingDevice.status)}`}>
                      {viewingDevice.status}
                    </span>
                  </div>
                  {viewingDevice.ip_address && (
                    <div>
                      <p className="text-sm text-slate-600 mb-1">عنوان IP</p>
                      <p className="text-lg font-semibold text-slate-800 font-mono">{viewingDevice.ip_address}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Owner Information Section */}
              {(viewingDevice.owner_name || viewingDevice.owner_mobile || viewingDevice.owner_landline) && (
                <div className="bg-blue-50 rounded-xl p-5">
                  <h4 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <span className="text-2xl">👤</span>
                    بيانات المالك
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {viewingDevice.owner_name && (
                      <div>
                        <p className="text-sm text-slate-600 mb-1">اسم المالك</p>
                        <p className="text-lg font-semibold text-slate-800">{viewingDevice.owner_name}</p>
                      </div>
                    )}
                    {viewingDevice.owner_mobile && (
                      <div>
                        <p className="text-sm text-slate-600 mb-1">رقم الموبايل</p>
                        <p className="text-lg font-semibold text-slate-800 direction-ltr text-right">{viewingDevice.owner_mobile}</p>
                      </div>
                    )}
                    {viewingDevice.owner_landline && (
                      <div>
                        <p className="text-sm text-slate-600 mb-1">رقم الهاتف الأرضي</p>
                        <p className="text-lg font-semibold text-slate-800 direction-ltr text-right">{viewingDevice.owner_landline}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Notes Section */}
              {viewingDevice.notes && (
                <div className="bg-amber-50 rounded-xl p-5">
                  <h4 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
                    <span className="text-2xl">📝</span>
                    ملاحظات
                  </h4>
                  <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">{viewingDevice.notes}</p>
                </div>
              )}

              {/* Metadata Section */}
              <div className="bg-slate-100 rounded-xl p-5">
                <h4 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
                  <span className="text-2xl">ℹ️</span>
                  معلومات إضافية
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-slate-600 mb-1">تاريخ الإضافة</p>
                    <p className="text-sm font-semibold text-slate-800">
                      {viewingDevice.created_at ? new Date(viewingDevice.created_at).toLocaleDateString('ar-EG', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      }) : 'غير متوفر'}
                    </p>
                  </div>
                  {viewingDevice.updated_at && (
                    <div>
                      <p className="text-sm text-slate-600 mb-1">آخر تحديث</p>
                      <p className="text-sm font-semibold text-slate-800">
                        {new Date(viewingDevice.updated_at).toLocaleDateString('ar-EG', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Repair History Section */}
              <div className="bg-purple-50 rounded-xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                    <span className="text-2xl">🔧</span>
                    سجل الإصلاحات والصيانة
                  </h4>
                  {isAdmin && (
                    <button
                      onClick={() => {
                        fetchRepairHistory(viewingDevice.id)
                        setShowRepairModal(true)
                      }}
                      className="px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-700 hover:to-purple-800 font-semibold shadow-md transition-all text-sm"
                    >
                      + إضافة سجل إصلاح
                    </button>
                  )}
                </div>

                {!repairHistoryLoaded ? (
                  <button
                    onClick={() => fetchRepairHistory(viewingDevice.id)}
                    className="w-full mb-4 px-4 py-2 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-lg font-semibold transition-colors text-sm"
                  >
                    تحميل سجل الإصلاحات
                  </button>
                ) : repairHistory.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-slate-600">لا توجد سجلات إصلاح لهذا الجهاز</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {repairHistory.map((repair) => (
                      <div key={repair.id} className="bg-white rounded-lg p-4 border border-purple-200 shadow-sm">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <p className="font-bold text-slate-800 mb-1">{repair.repair_description}</p>
                            <div className="flex items-center gap-3 text-sm text-slate-600">
                              <span>📅 {new Date(repair.repair_date).toLocaleDateString('ar-EG')}</span>
                              {repair.technician_name && <span>👨‍🔧 {repair.technician_name}</span>}
                              {repair.cost && <span>💰 {repair.cost} ج.م</span>}
                            </div>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getRepairStatusColor(repair.status)}`}>
                            {repair.status}
                          </span>
                        </div>
                        {repair.notes && (
                          <p className="text-sm text-slate-600 mb-3 bg-slate-50 p-2 rounded">{repair.notes}</p>
                        )}
                        {isAdmin && (
                          <div className="flex gap-2 pt-2 border-t border-slate-200">
                            <button
                              onClick={() => openEditRepairModal(repair)}
                              className="px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded text-xs font-semibold transition-colors"
                            >
                              تعديل
                            </button>
                            <button
                              onClick={() => {
                                setRepairToDelete(repair)
                                setShowDeleteRepairConfirm(true)
                              }}
                              className="px-3 py-1 bg-red-100 hover:bg-red-200 text-red-700 rounded text-xs font-semibold transition-colors"
                            >
                              حذف
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="p-6 border-t border-slate-200 bg-slate-50">
              <button
                onClick={() => {
                  setViewingDevice(null)
                  setRepairHistory([])
                  setRepairHistoryLoaded(false)
                }}
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 font-bold shadow-lg transition-all"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Repair Add/Edit Modal */}
      {showRepairModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-6 z-[60]">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200">
              <h3 className="text-2xl font-bold text-slate-800">
                {editingRepair ? 'تعديل سجل الإصلاح' : 'إضافة سجل إصلاح جديد'}
              </h3>
            </div>
            
            <form onSubmit={editingRepair ? handleUpdateRepair : handleAddRepair} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  وصف الإصلاح *
                </label>
                <textarea
                  required
                  value={repairFormData.repair_description}
                  onChange={(e) => setRepairFormData({ ...repairFormData, repair_description: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  rows="3"
                  placeholder="اشرح المشكلة والإصلاح الذي تم..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    تاريخ الإصلاح *
                  </label>
                  <input
                    type="date"
                    required
                    value={repairFormData.repair_date}
                    onChange={(e) => setRepairFormData({ ...repairFormData, repair_date: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    اسم الفني
                  </label>
                  <input
                    type="text"
                    value={repairFormData.technician_name}
                    onChange={(e) => setRepairFormData({ ...repairFormData, technician_name: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="اسم الفني المسؤول"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    التكلفة (ج.م)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={repairFormData.cost}
                    onChange={(e) => setRepairFormData({ ...repairFormData, cost: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    حالة الإصلاح *
                  </label>
                  <select
                    required
                    value={repairFormData.status}
                    onChange={(e) => setRepairFormData({ ...repairFormData, status: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    {repairStatuses.map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  ملاحظات إضافية
                </label>
                <textarea
                  value={repairFormData.notes}
                  onChange={(e) => setRepairFormData({ ...repairFormData, notes: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  rows="2"
                  placeholder="أي ملاحظات إضافية..."
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-700 hover:to-purple-800 font-bold shadow-lg transition-all"
                >
                  {editingRepair ? 'حفظ التعديلات' : 'إضافة السجل'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowRepairModal(false)
                    setEditingRepair(null)
                    resetRepairForm()
                  }}
                  className="flex-1 py-3 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg font-bold transition-colors"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Device Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => {
          setShowDeleteConfirm(false)
          setDeviceToDelete(null)
        }}
        onConfirm={handleDeleteDevice}
        title="تأكيد الحذف"
        message={`هل أنت متأكد من حذف الجهاز "${deviceToDelete?.device_name}"؟ لا يمكن التراجع عن هذا الإجراء.`}
        confirmText="حذف"
        cancelText="إلغاء"
      />

      {/* Delete Repair Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showDeleteRepairConfirm}
        onClose={() => {
          setShowDeleteRepairConfirm(false)
          setRepairToDelete(null)
        }}
        onConfirm={handleDeleteRepair}
        title="تأكيد حذف سجل الإصلاح"
        message={`هل أنت متأكد من حذف سجل الإصلاح "${repairToDelete?.repair_description}"؟`}
        confirmText="حذف"
        cancelText="إلغاء"
      />
    </div>
  )
}

export default AdminDashboard
