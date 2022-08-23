import { useCallback, useState, ChangeEvent } from 'react';

type InputHookValue = string | undefined;

type InputHookElement =
  | HTMLInputElement
  | HTMLTextAreaElement
  | HTMLSelectElement;

type InputHookOnChange = (e: ChangeEvent<InputHookElement>) => void;

interface InputHookBind {
  value: InputHookValue;
  onChange: InputHookOnChange;
}

interface InputHookAction {
  set: React.Dispatch<React.SetStateAction<string | undefined>>;
  reset: () => void;
}

type InputHook = (
  initial?: InputHookValue
) => [InputHookValue, InputHookBind, InputHookAction];

export const useInput: InputHook = (initial) => {
  const [value, set] = useState(initial);

  const reset = useCallback(() => set(initial), [set, initial]);
  const onChange: InputHookOnChange = useCallback(
    (e) => {
      set(e.target.value);
    },
    [set]
  );

  return [value, { value, onChange }, { set, reset }];
};

export default useInput;
