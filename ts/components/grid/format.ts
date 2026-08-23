import { ColumnFormat } from './types';

export const EMPTY_CELL_TEXT = '—';

export function isEmptyValue(value: any) {
  return value === null || value === undefined;
}

export function formatCellText(value: any, format?: ColumnFormat): string {
  if (isEmptyValue(value)) return EMPTY_CELL_TEXT;
  if (typeof value !== 'number') return typeof value === 'object' ? JSON.stringify(value) : String(value);

  switch (format) {
    case 'integer': return value.format(0);
    case 'decimal': return value.format(2);
    case 'percent': return `${(value * 100).format(2)}%`;
    case 'number': return value.format();
    default: return String(value);
  }
}
