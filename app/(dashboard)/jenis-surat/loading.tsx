export default function JenisSuratLoading() {
  return (
    <div className="animate-pulse">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="h-8 w-36 bg-neutral-200 rounded-md mb-2" />
          <div className="h-4 w-72 bg-neutral-200 rounded-md" />
        </div>
        <div className="h-10 w-40 bg-neutral-200 rounded-md" />
      </div>

      {/* Search */}
      <div className="h-10 w-full max-w-sm bg-neutral-200 rounded-md mb-4" />

      {/* Table */}
      <div className="border rounded-lg bg-white overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-neutral-50 text-left text-neutral-500">
              <th className="px-5 py-3 font-medium">Nama</th>
              <th className="px-5 py-3 font-medium">Kode Format</th>
              <th className="px-5 py-3 font-medium">Deskripsi</th>
              <th className="px-5 py-3 font-medium">Jumlah Field</th>
              <th className="px-5 py-3 font-medium text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 6 }).map((_, i) => (
              <tr key={i} className="border-t">
                <td className="px-5 py-4">
                  <div className="h-4 w-32 bg-neutral-200 rounded" />
                </td>
                <td className="px-5 py-4">
                  <div className="h-4 w-20 bg-neutral-200 rounded" />
                </td>
                <td className="px-5 py-4">
                  <div className="h-4 w-48 bg-neutral-200 rounded" />
                </td>
                <td className="px-5 py-4">
                  <div className="h-4 w-16 bg-neutral-200 rounded" />
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
