import { DataModel } from '../../core';
import { formatCellText } from './format';
import { GridColumnProps } from './types';

const CHARACTER_WIDTH_PX = 12;
const CELL_PADDING_PX = 32;
const MIN_MEASURED_WIDTH_PX = 100;
const MAX_MEASURED_WIDTH_PX = 400;
const DEFAULT_WIDTH_PX = 160;

export function measureColumnWidth(column: GridColumnProps, records: DataModel<any>[]) {
  if (column.width) return column.width;
  if (!records.length) return DEFAULT_WIDTH_PX;

  const headerText = column.header ?? column.field,
        longest = records.reduce(
          (max, record) => Math.max(max, formatCellText(record.get(column.field), column.format).length),
          headerText.length);

  return clampToMeasurableRange(longest * CHARACTER_WIDTH_PX + CELL_PADDING_PX);
}

function clampToMeasurableRange(width: number) {
  return Math.max(MIN_MEASURED_WIDTH_PX, Math.min(MAX_MEASURED_WIDTH_PX, width));
}
