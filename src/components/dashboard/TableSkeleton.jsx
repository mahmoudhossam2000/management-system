function TableSkeleton({ rows = 5 }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-slate-50 dark:bg-slate-700/50">
          <tr>
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <th key={i} className="px-6 py-4">
                <div className="h-4 bg-slate-200 dark:bg-slate-600 rounded animate-pulse w-24"></div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <tr key={rowIndex} className="animate-pulse">
              <td className="px-6 py-4">
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-32"></div>
              </td>
              <td className="px-6 py-4">
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-20"></div>
              </td>
              <td className="px-6 py-4">
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-28"></div>
              </td>
              <td className="px-6 py-4">
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-24"></div>
              </td>
              <td className="px-6 py-4">
                <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded-full w-20"></div>
              </td>
              <td className="px-6 py-4">
                <div className="flex gap-2">
                  <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-20"></div>
                  <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-16"></div>
                  <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-16"></div>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default TableSkeleton
