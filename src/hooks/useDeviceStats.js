import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'

export function useDeviceStats() {
  const [stats, setStats] = useState({
    totalDevices: 0,
    activeDevices: 0,
    maintenanceDevices: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDeviceStats()
  }, [])

  const fetchDeviceStats = async () => {
    try {
      setLoading(true)
      // Fetch all devices
      const { data: allDevices, error } = await supabase
        .from('devices')
        .select('status')

      if (error) throw error

      const total = allDevices?.length || 0
      const active = allDevices?.filter(d => d.status === 'نشط').length || 0
      const maintenance = allDevices?.filter(d => d.status === 'قيد الصيانة').length || 0

      setStats({
        totalDevices: total,
        activeDevices: active,
        maintenanceDevices: maintenance
      })
    } catch (error) {
      console.error('Error fetching device stats:', error)
    } finally {
      setLoading(false)
    }
  }

  return { stats, loading }
}
