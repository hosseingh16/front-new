export type PaginationItem = number | 'ellipsis'

export function getPaginationPages(
  current: number,
  last: number,
): PaginationItem[] {
  if (last <= 1) return last === 1 ? [1] : []

  if (current <= 4) {
    const pages: PaginationItem[] = []
    for (let i = 1; i <= 4; i++) pages.push(i)
    if (last > 5) {
      pages.push('ellipsis', last)
    } else {
      pages.push(5)
    }
    return pages
  }

  if (current >= last - 3) {
    return [1, 'ellipsis', last - 3, last - 2, last - 1, last]
  }

  return [1, 'ellipsis', current, current + 1, 'ellipsis', last]
}
