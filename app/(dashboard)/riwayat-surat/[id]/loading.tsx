export default function DetailSuratLoading() {
  return (
    <div className="animate-pulse">
      {/* Back Button */}
      <div className="flex items-center gap-2 mb-6">
        <div className="h-4 w-4 bg-neutral-200 rounded" />
        <div className="h-4 w-44 bg-neutral-200 rounded" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6">
        {/* Left Column: Info & Actions */}
        <div className="space-y-6">
          {/* Informasi Surat */}
          <div className="border rounded-lg p-6 bg-white">
            <div className="h-5 w-32 bg-neutral-200 rounded mb-4" />
            <div className="space-y-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="pb-3 border-b last:border-0">
                  <div className="h-3 w-24 bg-neutral-200 rounded mb-2" />
                  <div className="h-4 w-36 bg-neutral-200 rounded" />
                </div>
              ))}
            </div>
          </div>

          {/* Tindakan */}
          <div className="border rounded-lg p-6 space-y-3 bg-white">
            <div className="h-5 w-20 bg-neutral-200 rounded mb-3" />
            <div className="h-10 w-full bg-neutral-200 rounded-md" />
            <div className="h-10 w-full bg-neutral-200 rounded-md" />
          </div>
        </div>

        {/* Right Column: Surat Document Preview */}
        <div className="border rounded-lg p-10 bg-white">
          <div className="flex flex-col items-center border-b-2 border-neutral-900 pb-4 mb-6">
            <div className="h-5 w-48 bg-neutral-200 rounded mb-2" />
            <div className="h-4 w-36 bg-neutral-200 rounded" />
          </div>

          <div className="flex justify-center mb-6">
            <div className="h-6 w-64 bg-neutral-200 rounded" />
          </div>

          <div className="h-4 w-3/4 bg-neutral-200 rounded mb-6" />

          {/* Table Warga Rows */}
          <div className="space-y-3 mb-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex gap-4">
                <div className="h-4 w-44 bg-neutral-200 rounded" />
                <div className="h-4 w-4 bg-neutral-200 rounded" />
                <div className="h-4 w-60 bg-neutral-200 rounded" />
              </div>
            ))}
          </div>

          <div className="h-4 w-28 bg-neutral-200 rounded mb-4" />

          {/* Keterangan Rows */}
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex gap-4">
                <div className="h-4 w-44 bg-neutral-200 rounded" />
                <div className="h-4 w-4 bg-neutral-200 rounded" />
                <div className="h-4 w-48 bg-neutral-200 rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
