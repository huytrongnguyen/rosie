type TemporalUnit = 'year' | 'month' | 'week' | 'day' | 'hour' | 'minute' | 'second' | 'millisecond';

interface DateConstructor {
  MONTH_NAMES: string[],
  DOW_NAMES: string[],
  currentDate(): Date,
  parseDate(value: string): Date
  daysAgo(value: string): number,
  rollingStart(amount: number, unit?: string, today?: Date): Date,
  rollingEnd(amount: number, unit?: string, today?: Date): Date,
  // difference(dateAfter: Date, dateBefore: Date, unit?: TemporalUnit): number,
  // differenceInCalendarWeeks(dateAfter: Date, dateBefore: Date, weekStartsOn?: number): number,
  // createTimeline(startDate: Date, endDate: Date, pattern: string): string[],
}

Date.MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'];

Date.DOW_NAMES = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

const MILLISECONDS_IN_DAY = 24 * 60 * 60 * 1000;
const MONTHS_IN_QUARTER = 3;
const DAYS_IN_WEEK = 7;
const WEEK_STARTS_MONDAY = 1;

Date.currentDate = function() {
  const value = new Date();
  return new Date(value.getFullYear(), value.getMonth(), value.getDate());
}

Date.parseDate = function(str: string) {
  const value = new Date(str) ?? new Date();
  return new Date(value.getFullYear(), value.getMonth(), value.getDate());
}

Date.daysAgo = function(value: string) {
  return Math.round((Date.currentDate().getTime() - Date.parseDate(value).getTime()) / MILLISECONDS_IN_DAY);
}

// A calendar unit resolves by position: the first day of the period at the start of a range, the
// last day at the end. That is what makes a saved `1 month` keep meaning last month, rather than the
// dates it happened to be picked on.
Date.rollingStart = function(amount: number, unit?: string, today = Date.currentDate()) {
  switch (unit) {
    case 'week': return today.startOfWeek(WEEK_STARTS_MONDAY).minus(amount, 'week');
    case 'month': return today.startOfMonth().minus(amount, 'month');
    case 'quarter': return today.startOfQuarter().minus(amount * MONTHS_IN_QUARTER, 'month');
    case 'year': return today.startOfYear().minus(amount, 'year');
    default: return today.minus(amount);
  }
}

Date.rollingEnd = function(amount: number, unit?: string, today = Date.currentDate()) {
  const start = Date.rollingStart(amount, unit, today);
  switch (unit) {
    case 'week': return start.plus(DAYS_IN_WEEK - 1);
    case 'month': return start.endOfMonth();
    case 'quarter': return start.plus(MONTHS_IN_QUARTER, 'month').minus(1);
    case 'year': return start.plus(1, 'year').minus(1);
    default: return start;
  }
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

  startOfWeek(weekStartsOn?: number): Date,
  startOfQuarter(): Date,
  startOfYear(): Date,

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

Date.prototype.startOfQuarter = function(this: Date) { return new Date(this.getFullYear(), Math.floor(this.getMonth() / MONTHS_IN_QUARTER) * MONTHS_IN_QUARTER, 1); }
Date.prototype.startOfYear = function(this: Date) { return new Date(this.getFullYear(), 0, 1); }

Date.prototype.startOfWeek = function(this: Date, weekStartsOn = 0) {
  const day = this.getDay(),
        diff = (day < weekStartsOn ? 7 : 0) + day - weekStartsOn;
  return this.minus(diff, 'day');
}

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
    case 'week': return new Date(this.getFullYear(), this.getMonth(), this.getDate() + amountToAdd * 7, 0, 0, 0, 0);
    case 'day': return new Date(this.getFullYear(), this.getMonth(), this.getDate() + amountToAdd, 0, 0, 0, 0);
    case 'hour': return new Date(this.getFullYear(), this.getMonth(), this.getDate(), this.getHours() + amountToAdd, 0, 0, 0);
    case 'minute': return new Date(this.getFullYear(), this.getMonth(), this.getDate(), this.getHours(), this.getMinutes() + amountToAdd, 0, 0);
    case 'second': return new Date(this.getFullYear(), this.getMonth(), this.getDate(), this.getHours(), this.getMinutes(), this.getSeconds() + amountToAdd, 0);
    case 'millisecond': return new Date(this.getFullYear(), this.getMonth(), this.getDate(), this.getHours(), this.getMinutes(), this.getSeconds(), this.getMilliseconds() + amountToAdd);
    default: return this;
  }
}
