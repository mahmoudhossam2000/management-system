import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabaseClient'
import logo from '../assets/download.png'

function SectorSelection({ onSelectSector }) {
  const { user, isAdmin, signOut } = useAuth()
  const [searchTerm, setSearchTerm] = useState('')
  const [hoveredSector, setHoveredSector] = useState(null)
  const [sectorCounts, setSectorCounts] = useState({})

  const sectors = [
    
    { id: 1, name: 'القطاع الإداري', icon: '🏛️', color: 'from-slate-600 to-slate-700', devices: 45 },
    { id: 2, name: 'القطاع الثاني', icon: '🏭', color: 'from-blue-600 to-blue-700', devices: 32 },
    { id: 3, name: 'القطاع الثالث', icon: '🏗️', color: 'from-gray-600 to-gray-700', devices: 28 },
    { id: 4, name: 'القطاع الرابع', icon: '🏢', color: 'from-indigo-600 to-indigo-700', devices: 51 },
    { id: 5, name: 'القطاع الخامس', icon: '🏪', color: 'from-slate-700 to-slate-800', devices: 19 },
    { id: 6, name: 'القطاع السادس', icon: '🏨', color: 'from-blue-700 to-blue-800', devices: 37 },
    { id: 7, name: 'القطاع السابع', icon: '🏦', color: 'from-cyan-700 to-cyan-800', devices: 42 },
    { id: 8, name: 'القطاع الثامن', icon: '🏫', color: 'from-teal-700 to-teal-800', devices: 29 },
    { id: 9, name: 'القطاع التاسع', icon: '🏬', color: 'from-sky-600 to-sky-700', devices: 55 },
    { id: 10, name: 'القطاع العاشر', icon: '🏢', color: 'from-slate-600 to-gray-700', devices: 48 },
    { id: 11, name: 'القطاع الحادي عشر', icon: '🏭', color: 'from-blue-600 to-indigo-700', devices: 33 },
    { id: 12, name: 'القطاع الثاني عشر', icon: '🏗️', color: 'from-gray-700 to-slate-800', devices: 26 },
    { id: 13, name: 'القطاع الثالث عشر', icon: '🏛️', color: 'from-indigo-700 to-blue-800', devices: 41 },
    { id: 14, name: 'القطاع الرابع عشر', icon: '🏪', color: 'from-slate-600 to-slate-800', devices: 38 },
    { id: 15, name: 'القطاع الخامس عشر', icon: '🏨', color: 'from-cyan-600 to-teal-700', devices: 44 },
    { id: 16, name: 'القطاع السادس عشر', icon: '🏦', color: 'from-blue-700 to-indigo-800', devices: 31 },
    { id: 17, name: 'القطاع السابع عشر', icon: '🏫', color: 'from-sky-700 to-blue-800', devices: 27 },
    { id: 18, name: 'القطاع الثامن عشر', icon: '🏬', color: 'from-gray-600 to-slate-700', devices: 52 },
    { id: 19, name: 'القطاع التاسع عشر', icon: '🏢', color: 'from-teal-600 to-cyan-700', devices: 36 },
    { id: 20, name: 'القطاع العشرون', icon: '🏭', color: 'from-indigo-600 to-blue-700', devices: 49 },
    { id: 21, name: 'القطاع الحادي والعشرون', icon: '🏗️', color: 'from-slate-700 to-gray-800', devices: 23 },
    { id: 22, name: 'القطاع الثاني والعشرون', icon: '🏛️', color: 'from-blue-600 to-sky-700', devices: 40 },
    { id: 23, name: 'القطاع الثالث والعشرون', icon: '🏪', color: 'from-cyan-700 to-teal-800', devices: 35 },
    { id: 24, name: 'القطاع الرابع والعشرون', icon: '🏨', color: 'from-gray-700 to-slate-800', devices: 47 }
  ]

  // Fetch device counts for each sector from Supabase
  useEffect(() => {
    const fetchDeviceCounts = async () => {
      try {
        const { data, error } = await supabase
          .from('devices')
          .select('sector')

        if (error) throw error

        // Count devices per sector
        const counts = {}
        data.forEach(device => {
          const sectorName = device.sector
          counts[sectorName] = (counts[sectorName] || 0) + 1
        })

        setSectorCounts(counts)
      } catch (error) {
        console.error('Error fetching device counts:', error)
      }
    }

    fetchDeviceCounts()
  }, [])

  // Update sectors with real device counts
  const sectorsWithRealCounts = sectors.map(sector => ({
    ...sector,
    devices: sectorCounts[sector.name] || 0
  }))

  const filteredSectors = sectorsWithRealCounts.filter(sector =>
    sector.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const totalDevices = sectorsWithRealCounts.reduce((sum, sector) => sum + sector.devices, 0)

  const handleSignOut = async () => {
    await signOut()
    // Clear URL params and redirect to home
    window.history.pushState({}, '', window.location.pathname)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src={logo} alt="Logo" className="h-12 w-12 object-contain" />
              <div>
                <h1 className="text-2xl font-bold text-slate-800">لوحة تحكم القطاعات</h1>
                <p className="text-sm text-slate-600">اختر القطاع للبدء في إدارة الأجهزة</p>
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
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border-r-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm mb-1">إجمالي القطاعات</p>
                <p className="text-4xl font-bold text-slate-800">{sectors.length}</p>
              </div>
              <div className="text-5xl">🏢</div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 border-r-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm mb-1">إجمالي الأجهزة</p>
                <p className="text-4xl font-bold text-slate-800">{totalDevices}</p>
              </div>
              <div className="text-5xl">💻</div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 border-r-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm mb-1">متوسط الأجهزة</p>
                <p className="text-4xl font-bold text-slate-800">{Math.round(totalDevices / sectors.length)}</p>
              </div>
              <div className="text-5xl">📊</div>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="relative">
            <input
              type="text"
              placeholder="ابحث عن قطاع..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-6 py-4 pr-12 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg transition-all"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-6 h-6 absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
          </div>
        </div>

        {/* Sectors Grid */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-slate-800 mb-6">القطاعات المتاحة</h2>
          
          {filteredSectors.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <p className="text-xl text-slate-600">لا توجد نتائج للبحث</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredSectors.map((sector) => (
                <button
                  key={sector.id}
                  onClick={() => onSelectSector(sector)}
                  onMouseEnter={() => setHoveredSector(sector.id)}
                  onMouseLeave={() => setHoveredSector(null)}
                  className={`
                    relative overflow-hidden rounded-xl p-6 text-white
                    bg-gradient-to-br ${sector.color}
                    transition-all duration-300 transform
                    hover:scale-105 hover:shadow-2xl
                    ${hoveredSector === sector.id ? 'ring-4 ring-white ring-opacity-50' : ''}
                  `}
                >
                  {/* Background Pattern */}
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0" style={{
                      backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
                      backgroundSize: '20px 20px'
                    }}></div>
                  </div>

                  {/* Content */}
                  <div className="relative">
                    <div className="text-5xl mb-3">{sector.icon}</div>
                    <h3 className="text-lg font-bold mb-2">{sector.name}</h3>
                    <div className="flex items-center justify-between">
                      <span className="text-sm opacity-90">{sector.devices} جهاز</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        className={`w-6 h-6 transition-transform duration-300 ${hoveredSector === sector.id ? 'translate-x-[-4px]' : ''}`}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                      </svg>
                    </div>
                  </div>

                  {hoveredSector === sector.id && (
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20 animate-shine"></div>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default SectorSelection
