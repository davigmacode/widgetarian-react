import { useCallback, useMemo, useState } from 'react';

export interface StableActions<K> {
  set: (key: K, isAdd: boolean) => void
  add: (key: K) => void
  remove: (key: K) => void
  toggle: (key: K) => void
  reset: (value?: Set<K>) => void
}

export interface Actions<K> extends StableActions<K> {
  has: (key: K) => boolean;
}

export const useSet = <K>(initialSet = new Set<K>()): [Set<K>, Actions<K>] => {
  const [value, setValue] = useState(initialSet);

  const stableActions = useMemo<StableActions<K>>(() => {
    const add = (item: K) => setValue((prevSet) => new Set([...prevSet, item]));
    const remove = (item: K) =>
      setValue((prevSet) => new Set([...prevSet].filter((i) => i !== item)));
    const toggle = (item: K) =>
      setValue((prevSet) =>
        prevSet.has(item)
          ? new Set([...prevSet].filter((i) => i !== item))
          : new Set([...prevSet, item])
      );
    const set = (item: K, isAdd = true) => isAdd ? add(item) : remove(item)
    const reset = (newSet = initialSet) => setValue(newSet)

    return { add, remove, toggle, reset, set }
  }, [setValue, initialSet]);

  const utils = {
    has: useCallback((item) => value.has(item), [value]),
    ...stableActions,
  } as Actions<K>;

  return [value, utils];
};

export default useSet;