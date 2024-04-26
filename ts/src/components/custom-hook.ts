import { useEffect, useState } from 'react';
import { Rosie } from '../core';
import { DataModel } from '../data';

export function useDataModel<T = any>(model: DataModel<T>): [T] {
  const [data, setData] = useState({} as T);

  useEffect(() => {
    const model$ = model.subscribe(value => {
      Rosie.afterProcessing();
      setData({...value});
    });

    return () => { model$.unsubscribe(); }
  }, []);

  return [data];
}