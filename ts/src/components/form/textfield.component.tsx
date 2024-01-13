import { InputHTMLAttributes, useEffect, useRef, useState } from 'react';
import { query } from '../../core/utils';

export interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  updateValue: (value: string) => void;
}

export function TextField(props: TextFieldProps) {
  const { value, updateValue, onChange, onKeyUp, onBlur, ...others } = props,
        inputRef = useRef(null),
        [fieldValue, setFieldValue] = useState('');

  useEffect(() => { setFieldValue(props.value as string) }, [props.value])

  function handleKeyUp(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      query(inputRef.current).trigger('blur');
    }
  }

  function handleBlur() {
    updateValue(fieldValue.replace(/(\r\n|\n|\r)/gm,''));
  }

  return <input ref={inputRef} type="text" value={fieldValue} {...others}
      onChange={event => setFieldValue(event.target.value)}
      onKeyUp={handleKeyUp}
      onBlur={handleBlur} />
}