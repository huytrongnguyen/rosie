interface Array<T> {
  take(n?: number): T[],
  takeRight(n?: number): T[],
  skip(n?: number): T[],
  // clone(): T[],
  // distinct(): T[],
  // defaultIfEmpty(defaultValue: T[]): T[],
  mergeDictionary<TResult = any>(): TResult,

  // where(predicate: (value: T, index: number, array: T[]) => boolean): T[],
  // first(predicate?: (value: T, index: number, array: T[]) => boolean): T,
  // last(predicate?: (value: T, index: number, array: T[]) => boolean): T,

  // orderBy(keySelector: string | number, orders?: 'asc' | 'desc'): T[],
  // sumBy(iteratee: string | number | ((item: T) => string)): number,

  // toDictionary<TResult = any>(keySelector: string | number | ((item: T, index: number, array: T[]) => string), elementSelector?: (value: T[], key: string) => TResult): { [key:string]: TResult }

  // groupBy<TResult = any>(this: T[], keySelectors: string[], elementSelector: (value: T[], keySet: { [key:string]: any }) => { [key:string]: any }): TResult[],

  // joinWith<TInner = any, TResult = T & TInner>(inner: TInner[], joinSelector: string[], joinType?: 'inner' | 'left' | 'right' | 'full'): TResult[],
  // groupJoin<TInner = any, TKey = any, TResult = T & TInner>(
  //   inner: TInner[],
  //   outerKeySelector: (value: T, index: number, array: T[]) => TKey,
  //   innerKeySelector: (value: TInner, index: number, array: TInner[]) => TKey,
  //   joinType?: 'inner' | 'left' | 'right' | 'full'
  // ): TResult[],

  // with<TResult = T>(additionalFields: { [name: string]: (item: T, index: number, array: T[]) => any }): TResult[],
  // select<TResult = any>(...fieldNames: string[]): TResult[],
}

Array.prototype.take = function<T>(this: T[], n = 1) { return this.slice(0, Math.max(n, 0)); }
Array.prototype.takeRight = function<T>(this: T[], n = 1) { return this.slice(Math.max(this.length - n, 0), this.length); }
Array.prototype.skip = function<T>(this: T[], n = 1) { return this.slice(n, this.length); }

// Array.prototype.clone = function<T>(this: T[]) { return this.map(x => ({ ...x })); }
// Array.prototype.distinct = function<T>(this: T[]) { return this.filter((value, index, array) => array.indexOf(value) === index); }
// Array.prototype.defaultIfEmpty = function<T>(this: T[], defaultValue: T[]) { return this.length > 0 ? this : defaultValue; }
Array.prototype.mergeDictionary = function<T, TResult = any>(this: T[]) { return Object.assign({}, ...this) as TResult; }

// Array.prototype.where = function<T>(this: T[], predicate: (value: T, index: number, array: T[]) => boolean) { return this.filter(predicate); }

// Array.prototype.first = function<T>(this: T[], predicate?: (value: T, index: number, array: T[]) => boolean) { return !predicate ? this[0] : this.find(predicate); }
// Array.prototype.last = function<T>(this: T[], predicate?: (value: T, index: number, array: T[]) => boolean) { return !predicate ? this[this.length - 1] : this.filter(predicate).reverse()[0]; }

// Array.prototype.orderBy = function<T>(this: T[], keySelector: string | number, orders: 'asc' | 'desc' = 'asc') {
//   return this.sort((a, b) => {
//     const left = a[keySelector],
//           right = b[keySelector],
//           compareResult = (!right || left > right) ? 1 : left < right ? -1 : 0;
//     return orders === 'desc' ? -compareResult : compareResult;
//   })
// }

// Array.prototype.sumBy = function<T>(this: T[], iteratee: string | number | ((item: T) => string)) {
//   return this.reduce((result, item) => {
//     return result + (((typeof iteratee === 'string' || typeof iteratee === 'number') ? item?.[iteratee] ?? 0 : iteratee(item)) ?? 0);
//   }, 0);
// }

// Array.prototype.toDictionary = function<T, TResult = any>(this: T[], keySelector: string | number | ((item: T, index: number, array: T[]) => string), elementSelector?: (value: T[], key: string) => TResult) {
//   const result = this.reduce((result, item, index, array) => {
//     const key: string = (typeof keySelector === 'string' || typeof keySelector === 'number') ? item[keySelector] : keySelector(item, index, array);
//     !result[key] && (result[key] = []);
//     result[key].push(item);
//     return result;
//   }, {});

//   if (!elementSelector) return result;

//   for (let key in result) {
//     result[key] = elementSelector(result[key], key);
//   }
//   return result;
// }

// Array.prototype.groupBy = function<T, TResult = any>(this: T[], keySelectors: string[], elementSelector: (value: T[], keySet: { [key:string]: any }) => { [key:string]: any }) {
//   const NUL = '\0',
//         groupByKey = this.toDictionary(x => keySelectors.map(key => x[key]).join(NUL));

//   return Object.entries(groupByKey).map(([combineKey, values]) => {
//     const keySet = combineKey.split(NUL).map((x, i) => ({ [keySelectors[i]]: x })).mergeDictionary();
//     return Object.assign({}, keySet, elementSelector(values, keySet)) as TResult;
//   })
// }

// Array.prototype.joinWith = function<T, TInner = any, TResult = T & TInner>(this: T[], inner: TInner[], joinSelector: string[], joinType: 'inner' | 'left' | 'right' | 'full' = 'inner'): TResult[] {
//   return this.groupJoin(
//     inner,
//     outer => joinSelector.map(field => ({ [field]: outer[field] })).mergeDictionary(),
//     inner => joinSelector.map(field => ({ [field]: inner[field] })).mergeDictionary(),
//     joinType
//   )
// }

// Array.prototype.groupJoin = function<T, TInner = any, TKey = any, TResult = T & TInner>(
//   this: T[],
//   inner: TInner[],
//   outerKeySelector: (value: T, index: number, array: T[]) => TKey,
//   innerKeySelector: (value: TInner, index: number, array: TInner[]) => TKey,
//   joinType: 'inner' | 'left' | 'right' | 'full' = 'inner'
// ): TResult[] {
//   const NUL = '\0';
//   const groupByKeySelectorFn = <TGroup>(data: TGroup[], keySelector: (value: TGroup, index: number, array: TGroup[]) => TKey) => {
//     return data.toDictionary((value, index, array) => {
//       const joinKey = keySelector(value, index, array);
//       if (typeof joinKey !== 'object') return joinKey as unknown as string;

//       return Object.keys(joinKey).sort().map(k => joinKey[k]).join(NUL);
//     })
//   }

//   const outerGroup = groupByKeySelectorFn(this, outerKeySelector),
//         innerGroup = groupByKeySelectorFn(inner, innerKeySelector);

//   return [ ...Object.keys(outerGroup), ...Object.keys(innerGroup) ].distinct().map(key => {
//     if (outerGroup[key] && innerGroup[key]) {
//       return outerGroup[key].map(outerValue => {
//         return innerGroup[key].map(innerValue => {
//           return { ...outerValue, ...innerValue } as unknown as TResult;
//         });
//       }).flat();
//     } else if (!innerGroup[key] && (joinType === 'left' || joinType === 'full')) {
//       return outerGroup[key] as unknown as TResult[];
//     } else if (joinType === 'right' || joinType === 'full') {
//       return innerGroup[key] as unknown as TResult[];
//     } else {
//       return null;
//     }
//   }).filter(x => x !== null).flat();
// }

// Array.prototype.with = function<T, TResult = T>(this: T[], additionalFields: { [name: string]: (item: T, index: number, array: T[]) => any }) {
//   return this.map((x, index, array) => {
//     const result = { ...x } as unknown as TResult;
//     Object.entries(additionalFields).forEach(([name, selector]) => {
//       result[name] = selector(x, index, array);
//     });
//     return result;
//   });
// }

// Array.prototype.select = function<T, TResult = any>(this: T[], ...fieldNames: string[]) {
//   return this.map(x => {
//     const result = {} as TResult;
//     fieldNames.forEach(name => {
//       if (!name.includes(' as ')) {
//         result[name] = x[name];
//       } else {
//         const nameAlias = name.split(' as ');
//         result[nameAlias[1]] = x[nameAlias[0]];
//       }
//     });
//     return result;
//   })
// }