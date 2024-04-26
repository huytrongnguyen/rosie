interface String {
  parseInt(): number,
  parseFloat(): number,
  parseDate(): Date,
  parseDateTime(): Date,

  encodeHtml(): string,
  decodeHtml(): string,

  decodeQS<T = any>(): T,
}

String.prototype.parseInt = function(this: string) { return parseInt(this, 10); }
String.prototype.parseFloat = function(this: string) { return parseFloat(this); }
String.prototype.parseDate = function(this: string) { const value = new Date(this); return new Date(value.getFullYear(), value.getMonth(), value.getDate()); }
String.prototype.parseDateTime = function(this: string) { return new Date(this); }

String.prototype.encodeHtml = function(this: string) { return encodeURIComponent(this); }
String.prototype.decodeHtml = function(this: string) { return decodeURIComponent(this); }

String.prototype.decodeQS = function<T>(this: string) {
  return this.replace('?', '').split('&').reduce((queryParams, paramStr) => {
    const param = paramStr.split('=');
    queryParams[param[0]] = param[1];
    return queryParams;
  }, {} as any) as T;
}