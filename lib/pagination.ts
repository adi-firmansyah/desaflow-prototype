export const DEFAULT_PAGE = 1;
export const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 100;

export function normalizePagination(page?: string, limit?: string) {
  const parsedPage = Number.parseInt(page ?? "", 10);
  const parsedLimit = Number.parseInt(limit ?? "", 10);

  return {
    page:
      Number.isFinite(parsedPage) && parsedPage > 0
        ? parsedPage
        : DEFAULT_PAGE,
    limit:
      Number.isFinite(parsedLimit) && parsedLimit > 0
        ? Math.min(parsedLimit, MAX_LIMIT)
        : DEFAULT_LIMIT,
  };
}

export function getPageHref(
  pathname: string,
  params: { q?: string; page: number; limit: number },
) {
  const searchParams = new URLSearchParams();
  if (params.q) searchParams.set("q", params.q);
  searchParams.set("page", String(params.page));
  searchParams.set("limit", String(params.limit));
  return `${pathname}?${searchParams.toString()}`;
}
