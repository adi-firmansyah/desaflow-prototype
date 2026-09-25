export default function DashboardLoading() {
  return (
    <div className="animate-pulse">
      {/* Header */}
      <div className="h-8 w-40 bg-neutral-200 rounded-md mb-2" />
      <div className="h-4 w-80 bg-neutral-200 rounded-md mb-6" />

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="border rounded-lg p-5 bg-white">
          <div className="flex items-center justify-between mb-3">
            <div className="h-3 w-28 bg-neutral-200 rounded" />
            <div className="h-4 w-4 bg-neutral-200 rounded" />
          </div>
          <div className="h-10 w-16 bg-neutral-200 rounded" />
        </div>

        <div className="border rounded-lg p-5 bg-white">
          <div className="flex items-center justify-between mb-3">
            <div className="h-3 w-32 bg-neutral-200 rounded" />
            <div className="h-4 w-4 bg-neutral-200 rounded" />
          </div>
          <div className="h-10 w-16 bg-neutral-200 rounded" />
        </div>

        <div className="border rounded-lg p-5 bg-white flex flex-col items-center justify-center gap-2">
          <div className="h-6 w-6 bg-neutral-200 rounded" />
          <div className="h-4 w-28 bg-neutral-200 rounded" />
        </div>
      </div>

      {/* Chart Skeleton */}
      <div className="border rounded-lg bg-white mb-8 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b">
          <div>
            <div className="h-5 w-56 bg-neutral-200 rounded mb-2" />
            <div className="h-3.5 w-72 bg-neutral-200 rounded" />
          </div>
          <div className="h-6 w-44 bg-neutral-200 rounded" />
        </div>
        <div className="p-5">
          <div className="h-72 w-full bg-neutral-100/70 rounded-lg flex flex-col justify-around p-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="h-3.5 w-36 bg-neutral-200 rounded shrink-0" />
                <div
                  className="h-5 bg-neutral-200 rounded"
                  style={{ width: `${80 - i * 15}%` }}
                />
              </div>
            ))}
          </div>
        </div>
        <div className="border-t px-5 py-3 flex items-center justify-between">
          <div className="h-3.5 w-64 bg-neutral-200 rounded" />
          <div className="h-3.5 w-24 bg-neutral-200 rounded" />
        </div>
      </div>

      {/* Recent Letters Table */}
      <div className="border rounded-lg bg-white overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b">
          <div className="h-5 w-44 bg-neutral-200 rounded" />
          <div className="h-4 w-20 bg-neutral-200 rounded" />
        </div>

        <table className="w-full text-sm">
          <thead>
            <tr className="bg-neutral-50 text-left text-neutral-500">
              <th className="px-5 py-3 font-medium">No. Surat</th>
              <th className="px-5 py-3 font-medium">Nama Pemohon</th>
              <th className="px-5 py-3 font-medium">Jenis Surat</th>
              <th className="px-5 py-3 font-medium text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 4 }).map((_, i) => (
              <tr key={i} className="border-t">
                <td className="px-5 py-4">
                  <div className="h-4 w-32 bg-neutral-200 rounded" />
                </td>
                <td className="px-5 py-4">
                  <div className="h-4 w-36 bg-neutral-200 rounded" />
                </td>
                <td className="px-5 py-4">
                  <div className="h-4 w-40 bg-neutral-200 rounded" />
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center justify-end gap-3">
                    <div className="h-4 w-4 bg-neutral-200 rounded" />
                    <div className="h-4 w-4 bg-neutral-200 rounded" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
