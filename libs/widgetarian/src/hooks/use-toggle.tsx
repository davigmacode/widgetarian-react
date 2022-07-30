import { useState, useCallback } from 'react';

/**
 * Toggle a boolean value whenever the toggle function is triggered.
 * @param initialState {boolean}
 * @return [state, toggle]
 */

export type ToggleHandler = (value?: boolean) => void;

export const useToggle = (initialState = false): [boolean, ToggleHandler] => {
  const [state, setState] = useState(initialState);

  const toggleFn: ToggleHandler = useCallback((value) => {
    setState((toggled) => (typeof value === 'boolean' ? value : !toggled));
  }, []);

  return [state, toggleFn];
};

export default useToggle;
