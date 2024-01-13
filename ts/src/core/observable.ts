export interface Observer<T> {
  next: (value: T) => void,
  error?: (reason: any) => void,
  complete?: () => void,
}

export class Subscription<T> {
  constructor(private subject: Subject<T>, private subscriber: Observer<T>) { }

  unsubscribe() {
    const { observers } = this.subject;
    if (!observers || !observers.length) return;

    const subscriberIndex = observers.indexOf(this.subscriber);
    if (subscriberIndex > -1) {
      observers.splice(subscriberIndex, 1);
    }
  }
}

export class Subject<T> {
  observers: Observer<T>[] = [];
  protected value: T = null as T; getData(): T { return this.value; }

  subscribe(next: (value: T) => void, error?: (reason: any) => void, complete?: () => void) {
    const subscriber = { next, error, complete };
    this.observers.push(subscriber);
    if (this.value) {
      subscriber.next(this.value);
    }
    return new Subscription<T>(this, subscriber);
  }

  next(value: T) {
    this.value = value;
    this.observers.forEach(observer => observer.next && observer.next(value));
  }
}