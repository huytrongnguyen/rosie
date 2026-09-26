import { ChartConfig, DataStore } from '../../core';
import { GridEmptyProps } from '../grid/types';

export type ChartProps = ChartConfig & {
  store: DataStore<any>,
  className?: string,
  loading?: boolean,
  empty?: GridEmptyProps,
}
