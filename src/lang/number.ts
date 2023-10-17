// interface NumberConstructor {
//   range(end: number, start?: number, step?: number): number[]
// }

// Number.range = function(end: number, start = 0, step = 1) {
//   const result = [];
//   for (let index = start; index < end; index += step) {
//     result.push(index);
//   }
//   return result;
// }

interface Number {
  round(fractionDigits?: number): number,
  ceil(): number,
  floor(): number,
  abs(): number,
}

Number.prototype.round = function(this: number, fractionDigits?: number) {
  return fractionDigits ? Math.round(this * 10 * fractionDigits + Number.EPSILON) / (10 * fractionDigits) : Math.round(this);
}
Number.prototype.ceil = function(this: number) { return Math.ceil(this); }
Number.prototype.floor = function(this: number) { return Math.floor(this); }
Number.prototype.abs = function(this: number) { return Math.abs(this); }
