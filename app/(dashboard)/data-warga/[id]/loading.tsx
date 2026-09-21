export default function DetailWargaLoading() {
  return (
    <div className="animate-pulse">
      {/* Back button */}
      <div className="flex items-center gap-2 mb-6">
        <div className="h-4 w-4 bg-neutral-200 rounded" />
        <div className="h-4 w-36 bg-neutral-200 rounded" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-6">
        {/* Warga Profile Card */}
        <div className="border rounded-lg p-6 h-fit bg-white">
          <div className="h-6 w-48 bg-neutral-200 rounded mb-2" />
          <div className="h-4 w-36 bg-neutral-200 rounded mb-6" />

          <div className="space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="pb-3 border-b last:border-0">
                <div className="h-3 w-28 bg-neutral-200 rounded mb-2" />
                <div className="h-4 w-44 bg-neutral-200 rounded" />
              </div>
            ))}
          </div>
        </div>

        {/* Letter History Card */}
        <div className="border rounded-lg bg-white overflow-hidden">
          <div className="px-5 py-4 border-b">
            <div className="h-5 w-32 bg-neutral-200 rounded mb-2" />
            <div className="h-4 w-64 bg-neutral-200 rounded" />
          </div>

          <table className="w-full text-sm">
            <thead>
              <tr className="bg-neutral-50 text-left text-neutral-500">
                <th className="px-5 py-3 font-medium">No. Surat</th>
                <th className="px-5 py-3 font-medium">Jenis Surat</th>
                <th className="px-5 py-3 font-medium">Tanggal</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 4 }).map((_, i) => (
                <tr key={i} className="border-t">
                  <td className="px-5 py-4">
                    <div className="h-4 w-28 bg-neutral-200 rounded" />
                  </td>
                  <td className="px-5 py-4">
                    <div className="h-4 w-32 bg-neutral-200 rounded" />
                  </td>
                  <td className="px-5 py-4">
                    <div className="h-4 w-24 bg-neutral-200 rounded" />
                  </td>
                  <td className="px-5 py-4">
                    <div className="h-5 w-16 bg-neutral-200 rounded-full" />
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end">
                      <div className="h-4 w-4 bg-neutral-200 rounded" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
