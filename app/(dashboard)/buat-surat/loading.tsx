export default function BuatSuratLoading() {
  return (
    <div className="animate-pulse">
      {/* Header */}
      <div className="h-8 w-64 bg-neutral-200 rounded-md mb-2" />
      <div className="h-4 w-96 bg-neutral-200 rounded-md mb-10" />

      {/* Step Indicator */}
      <div className="flex items-center justify-center mb-10 overflow-x-auto">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-center">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-neutral-200 shrink-0" />
              <div className="h-4 w-24 bg-neutral-200 rounded" />
            </div>
            {i < 3 && <div className="h-px w-16 bg-neutral-200 mx-4" />}
          </div>
        ))}
      </div>

      {/* Wizard Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Search & Input Form */}
        <div className="lg:col-span-2 space-y-6">
          <div className="border rounded-lg p-6 bg-white">
            <div className="h-6 w-48 bg-neutral-200 rounded mb-2" />
            <div className="h-4 w-80 bg-neutral-200 rounded mb-5" />
            <div className="h-4 w-60 bg-neutral-200 rounded mb-2" />
            <div className="h-10 w-full bg-neutral-200 rounded-md" />
          </div>
        </div>

        {/* Right Column: Selected Citizen Card */}
        <div className="border rounded-lg p-6 h-fit bg-white">
          <div className="flex items-center gap-2 mb-4">
            <div className="h-5 w-5 rounded-full bg-neutral-200 shrink-0" />
            <div className="h-5 w-32 bg-neutral-200 rounded" />
          </div>

          <div className="py-8 flex flex-col items-center gap-2">
            <div className="h-4 w-52 bg-neutral-200 rounded" />
            <div className="h-3 w-40 bg-neutral-200 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}
