import { Dictionary } from './types';

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
    this.refresh();
  }

  refresh() {
    this.observers.forEach(observer => observer.next && observer.next(this.value));
  }

  on(eventName: string, handler: (...extraParameters: any) => void) {
    if (!this.events[eventName]) this.events[eventName] = [];
    this.events?.[eventName]?.push(handler);
  }

  trigger(eventName: string, ...extraParameters: any) {
    this.events?.[eventName]?.forEach(handler => handler(...extraParameters));
  }

  value: T = null as T;
  observers: Observer<T>[] = [];
  private events: Dictionary<Function[]> = {};
}