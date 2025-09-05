export type QueryOperator = { name: string }

export type CriteriaField = {
  name: string,
  value: any,
  operator: QueryOperator,
}

export type QueryOperation = {
  operator: QueryOperator,
  fields: CriteriaField[],
  operations: QueryOperation[],
}

export const andOperator = () => ({ name: 'AND', value: 'and' } as QueryOperator)
export const orOperator = () => ({ name: 'OR', value: 'or' } as QueryOperator)
export const excludeOperator = () => ({ name: 'EXCLUDE', value: 'not' } as QueryOperator)
export const combineOperators = [ andOperator(), orOperator(), excludeOperator() ]

export const isOperator = () => ({ name: 'is', value: 'eq' });
export const beforeOperator = () => ({ name: 'before', value: 'lt' });
export const afterOperator = () => ({ name: 'after', value: 'gt' });
export const fromOperator = () => ({ name: 'from', value: 'gte' });
export const toOperator = () => ({ name: 'to', value: 'lte' });
export const compareOperators = [ isOperator(), beforeOperator(), afterOperator(), fromOperator(), toOperator() ]

export const newOperation = (operator?: QueryOperator) => {
  return {
    operator: operator ?? andOperator(),
    fields: [],
    operations: [],
  } as QueryOperation;
}