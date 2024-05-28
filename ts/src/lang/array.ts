interface Array<T> {
  first(predicate?: (value: T, index: number, array: T[]) => boolean): T,
  last(predicate?: (value: T, index: number, array: T[]) => boolean): T,

  take(n?: number, skip?: number): T[],
  takeRight(n?: number): T[],
  skip(n?: number): T[],

  orderBy(keySelector: string | number, orders?: 'asc' | 'desc'): T[],

  groupBy<T, TElement = T>(keySelector: string | number | ((item: T, index: number, array: T[]) => any), elementSelector?: (value: T[], key: string) => TElement): { key: any, elements: TElement[] }[],
  sumBy(keySelector: string | number | ((item: T, index: number, array: T[]) => number)): number,

  toDictionary<T, TElement>(keySelector: string | number | ((item: T, index: number, array: T[]) => any), elementSelector?: (item: T, index: number, array: T[]) => TElement): { [key: string]: TElement }
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

Array.prototype.groupBy = function<T, TElement = T>(this: T[], keySelector: string | number | ((item: T, index: number, array: T[]) => any), elementSelector?: (value: T[], key: string) => TElement) {
  const groupByKey = this.reduce((result, item: any, index, array) => {
    const key = (typeof keySelector === 'string' || typeof keySelector === 'number') ? item[keySelector] : keySelector(item, index, array);
    !result[key] && (result[key] = []);
    result[key].push(item);
    return result;
  }, {} as any);

  if (elementSelector) {
    for (let key in groupByKey) {
      groupByKey[key] = elementSelector(groupByKey[key], key);
    }
  }

  const result: { key: any, elements: TElement[] }[] = [];

  for (let key in groupByKey) {
    result.push({ key, elements: groupByKey[key] });
  }

  return result;
}

Array.prototype.sumBy = function<T>(this: T[], keySelector: string | number | ((item: T, index: number, array: T[]) => number)) {
  return this.reduce((result, item: any, index, array) => {
    const key = (typeof keySelector === 'string' || typeof keySelector === 'number') ? item[keySelector] : keySelector(item, index, array);
    return result + (key ?? 0);
  }, 0);
}

Array.prototype.toDictionary = function<T, TElement>(this: T[], keySelector: string | number | ((item: T, index: number, array: T[]) => any), elementSelector?: (item: T, index: number, array: T[]) => TElement) {
  return this.reduce((result, item: any, index, array) => {
    const key = (typeof keySelector === 'string' || typeof keySelector === 'number') ? item[keySelector] : keySelector(item, index, array);
    !result[key] && (result[key] = elementSelector(item, index, array));
    return result;
  }, {} as { [key: string]: TElement });
}