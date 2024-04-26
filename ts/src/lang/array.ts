interface Array<T> {
  first(predicate?: (value: T, index: number, array: T[]) => boolean): T,
  last(predicate?: (value: T, index: number, array: T[]) => boolean): T,

  take(n?: number, skip?: number): T[],
  takeRight(n?: number): T[],
  skip(n?: number): T[],

  orderBy(keySelector: string | number, orders?: 'asc' | 'desc'): T[],
}

Array.prototype.first = function<T>(this: T[], predicate?: (value: T, index: number, array: T[]) => boolean) { return !predicate ? this[0] : this.find(predicate); }
Array.prototype.last = function<T>(this: T[], predicate?: (value: T, index: number, array: T[]) => boolean) { return !predicate ? this[this.length - 1] : this.findLast(predicate); }

Array.prototype.take = function<T>(this: T[], n = 1, skip = 0) { return this.slice(skip, Math.max(skip + n, 0)); }
Array.prototype.takeRight = function<T>(this: T[], n = 1) { return this.slice(Math.max(this.length - n, 0), this.length); }
Array.prototype.skip = function<T>(this: T[], n = 1) { return this.slice(n, this.length); }


Array.prototype.orderBy = function<T>(this: T[], keySelector: string | number, orders: 'asc' | 'desc' = 'asc') {
  return this.sort((a: any, b: any) => {
    const left = a[keySelector],
          right = b[keySelector],
          compareResult = (!right || left > right) ? 1 : left < right ? -1 : 0;
    return orders === 'desc' ? -compareResult : compareResult;
  })
}