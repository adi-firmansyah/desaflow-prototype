import Link from "next/link";

export function PaginationControls({
  pathname,
  query,
  page,
  limit,
  totalPages,
}: {
  pathname: string;
  query?: string;
  page: number;
  limit: number;
  totalPages: number;
}) {
  const previousHref = `${pathname}?${new URLSearchParams({
    ...(query ? { q: query } : {}),
    page: String(page - 1),
    limit: String(limit),
  })}`;
  const nextHref = `${pathname}?${new URLSearchParams({
    ...(query ? { q: query } : {}),
    page: String(page + 1),
    limit: String(limit),
  })}`;

  return (
    <div className="flex items-center justify-between px-1 py-4 text-sm">
      <span className="text-neutral-500">
        Halaman {page} dari {totalPages}
      </span>
      <div className="flex gap-2">
        {page > 1 ? (
          <Link
            href={previousHref}
            className="rounded-md border px-3 py-2 hover:bg-neutral-50 bg-white"
          >
            Sebelumnya
          </Link>
        ) : (
          <span className="rounded-md border px-3 py-2 text-neutral-300 bg-white">
            Sebelumnya
          </span>
        )}
        {page < totalPages ? (
          <Link
            href={nextHref}
            className="rounded-md border px-3 py-2 hover:bg-neutral-50 bg-white"
          >
            Berikutnya
          </Link>
        ) : (
          <span className="rounded-md border px-3 py-2 text-neutral-300 bg-white">
            Berikutnya
          </span>
        )}
      </div>
    </div>
  );
}
