type TemporalUnit = 'year' | 'month' | 'week' | 'day' | 'hour' | 'minute' | 'second' | 'millisecond';

interface DateConstructor {
  currentDate(): Date,
  parseDate(value: string): Date
  // difference(dateAfter: Date, dateBefore: Date, unit?: TemporalUnit): number,
  // differenceInCalendarWeeks(dateAfter: Date, dateBefore: Date, weekStartsOn?: number): number,
  // createTimeline(startDate: Date, endDate: Date, pattern: string): string[],
}

Date.currentDate = function() {
  const value = new Date();
  return new Date(value.getFullYear(), value.getMonth(), value.getDate());
}

Date.parseDate = function(str: string) {
  const value = new Date(str) ?? new Date();
  return new Date(value.getFullYear(), value.getMonth(), value.getDate());
}

// const MILLISECONDS_IN_SECOND = 1000,
//       MILLISECONDS_IN_MINUTE = MILLISECONDS_IN_SECOND * 60,
//       MILLISECONDS_IN_HOUR = MILLISECONDS_IN_MINUTE * 60,
//       MILLISECONDS_IN_DAY = MILLISECONDS_IN_HOUR * 24,
//       MILLISECONDS_IN_WEEK = MILLISECONDS_IN_DAY * 7;

// Date.difference = function(dateAfter: Date, dateBefore: Date, unit = 'day') {
//   const diff = (dateAfter?.getTime() ?? 0) - (dateBefore?.getTime() ?? 0);
//   switch (unit) {
//     case 'week': return Math.floor(diff / MILLISECONDS_IN_WEEK);
//     case 'day': return Math.floor(diff / MILLISECONDS_IN_DAY);
//     case 'hour': return Math.floor(diff / MILLISECONDS_IN_HOUR);
//     case 'minute': return Math.floor(diff / MILLISECONDS_IN_MINUTE);
//     case 'second': return Math.floor(diff / MILLISECONDS_IN_SECOND);
//     case 'millisecond': return diff;
//     default: return diff;
//   }
// }

// Date.differenceInCalendarWeeks = function(dateAfter: Date, dateBefore: Date, weekStartsOn = 0) {
//   const startOfWeekBefore = dateBefore.startOfWeek(weekStartsOn),
//         startOfWeekAfter = dateAfter.startOfWeek(weekStartsOn),
//         diff = (startOfWeekAfter?.getTime() ?? 0) - (startOfWeekBefore?.getTime() ?? 0)
//   return Math.round(diff / MILLISECONDS_IN_WEEK);
// }

// Date.createTimeline = function(startDate: Date, endDate: Date, pattern: string) {
//   const timeline: string[] = [];
//   for (let cur = startDate; cur.isBefore(endDate) || cur.equals(endDate); cur = cur.plus(1)) {
//     timeline.push(cur.format(pattern));
//   }
//   return timeline;
// }

interface Date {
  // equals(other: Date): boolean,
  // isBefore(other: Date): boolean,
  // isAfter(other: Date): boolean,

  format(pattern?: string): string,

  startOfMonth(): Date,
  endOfMonth(): Date,
  lengthOfMonth(): number,

  // startOfWeek(weekStartsOn?: number): Date,

  // getWeeksInMonth(): number,

  plus(amountToAdd: number, unit?: TemporalUnit): Date,
  minus(amountToSubtract: number, unit?: TemporalUnit): Date,
}

// Date.prototype.equals = function(this: Date, other: Date) { return this?.getTime() === other?.getTime(); }
// Date.prototype.isBefore = function(this: Date, other: Date) { return this?.getTime() < other?.getTime(); }
// Date.prototype.isAfter = function(this: Date, other: Date) { return this?.getTime() > other?.getTime(); }

Date.prototype.format = function(this: Date, pattern?: string) {
  return (pattern ?? 'yyyy-MM-dd')
      .replace('yyyy', `${this.getFullYear()}`)
      .replace('MM', `${this.getMonth() + 1}`.padStart(2, '0'))
      .replace('dd', `${this.getDate()}`.padStart(2, '0'))
      .replace('HH', `${this.getHours()}`.padStart(2, '0'))
      .replace('mm', `${this.getMinutes()}`.padStart(2, '0'))
      .replace('ss', `${this.getSeconds()}`.padStart(2, '0'));
}

Date.prototype.startOfMonth = function(this: Date) { return new Date(this.getFullYear(), this.getMonth(), 1); }
Date.prototype.endOfMonth = function(this: Date) { return new Date(this.getFullYear(), this.getMonth() + 1, 0); }
Date.prototype.lengthOfMonth = function(this: Date) { return this.endOfMonth().getDate(); }

// Date.prototype.startOfWeek = function(this: Date, weekStartsOn = 0) {
//   const day = this.getDay(),
//         diff = (day < weekStartsOn ? 7 : 0) + day - weekStartsOn,
//         date = this.minus(diff, 'day');
//   date.setHours(0, 0, 0, 0);
//   return date;
// }

// Date.prototype.getWeeksInMonth = function(this: Date) {
//   const startOfMonth = this.startOfMonth(),
//         endOfMonth = this.endOfMonth(),
//         weeks = Date.differenceInCalendarWeeks(endOfMonth, startOfMonth) + 1;
//   return weeks;
// }

Date.prototype.minus = function(this: Date, amountToSubtract: number, unit = 'day') { return this.plus(-amountToSubtract, unit); }
Date.prototype.plus = function(this: Date, amountToAdd: number, unit = 'day') {
  switch (unit) {
    case 'year': return new Date(this.getFullYear() + amountToAdd, this.getMonth(), this.getDate(), 0, 0, 0, 0);
    case 'month': return new Date(this.getFullYear(), this.getMonth() + amountToAdd, this.getDate(), 0, 0, 0, 0);
    case 'day': return new Date(this.getFullYear(), this.getMonth(), this.getDate() + amountToAdd, 0, 0, 0, 0);
    case 'hour': return new Date(this.getFullYear(), this.getMonth(), this.getDate(), this.getHours() + amountToAdd, 0, 0, 0);
    case 'minute': return new Date(this.getFullYear(), this.getMonth(), this.getDate(), this.getHours(), this.getMinutes() + amountToAdd, 0, 0);
    case 'second': return new Date(this.getFullYear(), this.getMonth(), this.getDate(), this.getHours(), this.getMinutes(), this.getSeconds() + amountToAdd, 0);
    case 'millisecond': return new Date(this.getFullYear(), this.getMonth(), this.getDate(), this.getHours(), this.getMinutes(), this.getSeconds(), this.getMilliseconds() + amountToAdd);
    default: return this;
  }
}
