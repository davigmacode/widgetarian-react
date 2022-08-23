import { useCallback, ChangeEvent } from 'react';
import { useSet } from './use-set';

type CheckboxHookValue = string[] | undefined;

type CheckboxHookOnChange = (e: ChangeEvent<HTMLInputElement>) => void;

type CheckboxHookBind = (value?: string | undefined) => {
  type: 'checkbox';
  value: string | undefined;
  checked: boolean;
  onChange: CheckboxHookOnChange;
};

interface CheckboxHookAction {
  has: (key: string) => boolean;
  toggle: (key: string, active: boolean) => void;
  reset: (value?: string[] | undefined) => void;
}

type CheckboxHook = (
  initial?: CheckboxHookValue
) => [CheckboxHookValue, CheckboxHookBind, CheckboxHookAction];

export const useCheckbox: CheckboxHook = (initial) => {
  const [value, { has, set, toggle }] = useSet(new Set(initial));

  const onChange: CheckboxHookOnChange = useCallback(
    (e) => {
      const target = e.target;
      toggle(target.value, target.checked);
    },
    [toggle]
  );

  const bind: CheckboxHookBind = useCallback(
    (v) => ({
      type: 'checkbox',
      checked: !!v && has(v),
      value: v,
      onChange,
    }),
    [onChange, has]
  );

  const utils: CheckboxHookAction = {
    reset: useCallback((v) => set(new Set(v ? v : initial)), [set, initial]),
    toggle,
    has,
  };

  return [[...value], bind, utils];
};

export default useCheckbox;
