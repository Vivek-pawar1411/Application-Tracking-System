function setupPaginationOptions({
  page = 1,
  limit = 10,
  sortBy = 'created_at',
  sortOrder = 'DESC',
  validSortFields = [],
  defaultSortBy = 'created_at',
}) {
  const safePage = page < 1 ? 1 : page;
  const safeLimit = limit < 1 || limit > 100 ? 10 : limit;
  const skip = (safePage - 1) * safeLimit;

  const sortField = validSortFields.includes(sortBy) ? sortBy : defaultSortBy;
  const order = sortOrder.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

  return { page: safePage, limit: safeLimit, skip, sortField, sortOrder: order };
}

function formatPaginationResponse({ page, limit, totalCount }) {
  const totalPages = Math.ceil(totalCount / limit);
  const hasNextPage = page < totalPages;
  const hasPreviousPage = page > 1;

  return {
    currentPage: page,
    limit,
    totalCount,
    totalPages,
    hasNextPage,
    hasPreviousPage,
    nextPage: hasNextPage ? page + 1 : null,
    previousPage: hasPreviousPage ? page - 1 : null,
  };
}

module.exports = {
  setupPaginationOptions,
  formatPaginationResponse,
};