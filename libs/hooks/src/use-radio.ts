import { useCallback, useState, ChangeEvent } from 'react';

type RadioHookValue = string | undefined;

type RadioHookOnChange = (e: ChangeEvent<HTMLInputElement>) => void;

type RadioHookBind = (value?: RadioHookValue) => {
  type: 'radio';
  value: RadioHookValue;
  checked: boolean;
  onChange: RadioHookOnChange;
};

interface RadioHookAction {
  set: React.Dispatch<React.SetStateAction<RadioHookValue>>;
  reset: () => void;
}

type RadioHook = (
  initial?: RadioHookValue
) => [RadioHookValue, RadioHookBind, RadioHookAction];

export const useRadio: RadioHook = (initial) => {
  const [value, set] = useState(initial);

  const reset = useCallback(() => set(initial), [set, initial]);

  const onChange: RadioHookOnChange = useCallback(
    (e) => {
      e.target.checked && set(e.target.value);
    },
    [set]
  );

  const bind: RadioHookBind = useCallback(
    (v) => ({
      type: 'radio',
      checked: v === value,
      value: v,
      onChange,
    }),
    [value, onChange]
  );

  return [value, bind, { set, reset }];
};

export default useRadio;
