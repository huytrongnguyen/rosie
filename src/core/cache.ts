const CacheType = {
  Local: 'localStorage',
  Session: 'sessionStorage',
  Memory: 'memory',
}

class Cache {
  private cacheData: { [key:string]: string } = {};

  constructor(private type: string) { }

  private hasLocalStorage() {
    try {
      return 'localStorage' in window && window.localStorage !== null;
    } catch (e) {
      return false;
    }
  }

  private hasSessionStorage() {
    try {
      return 'sessionStorage' in window && window.sessionStorage !== null;
    } catch (e) {
      return false;
    }
  }

  get(key: string) {
    if (this.type === CacheType.Local && this.hasLocalStorage()) {
      return localStorage.getItem(key) || undefined;
    } else if (this.type === CacheType.Session && this.hasSessionStorage()) {
      return sessionStorage.getItem(key) || undefined;
    } else {
      return this.cacheData[key] || undefined;
    }
  }

  set(key: string, value: string) {
    if (this.type === CacheType.Local && this.hasLocalStorage()) {
      localStorage.setItem(key, value);
    } else if (this.type === CacheType.Session && this.hasSessionStorage()) {
      sessionStorage.setItem(key, value);
    } else {
      this.cacheData[key] = value;
    }
  }

  remove(key: string) {
    if (this.type === CacheType.Local && this.hasLocalStorage()) {
      localStorage.removeItem(key);
    } else if (this.type === CacheType.Session && this.hasSessionStorage()) {
      sessionStorage.removeItem(key);
    } else {
      delete this.cacheData[key];
    }
  }
}

export const LocalCache = new Cache(CacheType.Local);
export const SessionCache = new Cache(CacheType.Session);
export const MemoryCache = new Cache(CacheType.Memory);