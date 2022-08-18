import {
  Dispatch,
  SetStateAction,
  useCallback,
  useMemo,
  useState
} from 'react';

export interface StableActions<K> {
  add: (item: K) => void
  remove: (item: K) => void
  toggle: (item: K, add: boolean) => void
  set: Dispatch<SetStateAction<Set<K>>>
}

export interface Actions<K> extends StableActions<K> {
  reset: () => void
  has: (item: K) => boolean;
}

export type SetHookResponse<K> = [Set<K>, Actions<K>]

export const useSet = <K>(initialSet = new Set<K>()): SetHookResponse<K> => {
  const [value, setValue] = useState(initialSet);

  const stableActions = useMemo<StableActions<K>>(() => {
    const add = (item: K) => setValue((prevSet) => new Set([...prevSet, item]));
    const remove = (item: K) =>
      setValue((prevSet) => new Set([...prevSet].filter((i) => i !== item)));
    const toggle = (item: K, add?: boolean) =>
      setValue((prevSet) =>
        add === false || prevSet.has(item)
          ? new Set([...prevSet].filter((i) => i !== item))
          : new Set([...prevSet, item])
      );

    return { add, remove, toggle, set: setValue }
  }, []);

  const reset = useCallback(() => setValue(initialSet), [initialSet])

  const has = useCallback((key: K) => value.has(key), [value])

  return [ value, { ...stableActions, reset, has } ];
};

export default useSet;