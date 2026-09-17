export default function RiwayatSuratLoading() {
  return (
    <div className="animate-pulse">
      {/* Header */}
      <div className="h-8 w-44 bg-neutral-200 rounded-md mb-2" />
      <div className="h-4 w-96 bg-neutral-200 rounded-md mb-6" />

      {/* Search */}
      <div className="h-10 w-full max-w-sm bg-neutral-200 rounded-md mb-4" />

      {/* Table */}
      <div className="border rounded-lg bg-white overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-neutral-50 text-left text-neutral-500">
              <th className="px-5 py-3 font-medium">No. Surat</th>
              <th className="px-5 py-3 font-medium">Nama Pemohon</th>
              <th className="px-5 py-3 font-medium">Jenis Surat</th>
              <th className="px-5 py-3 font-medium">Tanggal</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 font-medium text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 6 }).map((_, i) => (
              <tr key={i} className="border-t">
                <td className="px-5 py-4">
                  <div className="h-4 w-28 bg-neutral-200 rounded" />
                </td>
                <td className="px-5 py-4">
                  <div className="h-4 w-32 bg-neutral-200 rounded" />
                </td>
                <td className="px-5 py-4">
                  <div className="h-4 w-36 bg-neutral-200 rounded" />
                </td>
                <td className="px-5 py-4">
                  <div className="h-4 w-24 bg-neutral-200 rounded" />
                </td>
                <td className="px-5 py-4">
                  <div className="h-5 w-16 bg-neutral-200 rounded-full" />
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
