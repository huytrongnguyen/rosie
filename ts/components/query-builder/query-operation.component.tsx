import { Dropdown } from '../dropdown.component';
import { CriteriaFieldComponent } from './criteria-field.component';
import { combineOperators, CriteriaField, newOperation, QueryOperation } from './type';

type QueryOperationComponentProps = {
  operation: QueryOperation,
  index: number,
  criteria: CriteriaField[],
  onChange: (operation: QueryOperation, index?: number) => void,
}

export function QueryOperationComponent(props: QueryOperationComponentProps) {
  function updateCriteriaField(field: CriteriaField, index: number) {}

  function updateQueryOperation(operation: QueryOperation, index?: number) {
    if (!index) {
      operation.operations.push(newOperation());
    } else {
      operation.operations[index] = operation;
    }
    props.onChange({ ...operation }, index);
  }

  return <div className="d-flex flex-column pt-2">
    <Dropdown buttonClass="btn-outline-secondary" options={combineOperators} defaultText="" separator="" searchBox={false}
        value={[props.operation.operator]}
        onChange={(operators) => props.onChange({ ...props.operation, operator: operators[0] }, props.index)} />
    <div className="d-flex flex-column ps-3 pt-2">
      <div className="d-flex flex-row">
        {props.operation.fields.map((value, index) => {
          return <CriteriaFieldComponent key={index} field={value} index={index} criteria={props.criteria}
              onChange={updateCriteriaField} />
        })}
        <div><button className="btn btn-outline-secondary"><span className="fa fa-plus" /></button></div>
      </div>
      {props.operation.operations.map((value, index) => {
        return <QueryOperationComponent key={index} operation={value} index={index} criteria={props.criteria}
            onChange={updateQueryOperation} />
      })}
      <div className="pt-2">
        <button className="btn btn-outline-secondary" onClick={() => updateQueryOperation(props.operation)}>
          <span className="fa fa-plus me-1" />Filter
        </button>
      </div>
    </div>
  </div>
}