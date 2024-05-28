import { useEffect, useState } from 'react';
import { Subject } from '../mixin';

export function useSubject<T = any>(subject: Subject<T>): [T] {
  const [data, setData] = useState(null as T);

  useEffect(() => {
    const subject$ = subject.subscribe(value => {
      setData(value);
    });

    return () => { subject$.unsubscribe(); }
  }, []);

  return [data];
}