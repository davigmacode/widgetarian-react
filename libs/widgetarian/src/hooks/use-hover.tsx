import { useRef, useState, useCallback, Ref } from 'react';

type HoverHandle = (value: boolean) => void;
type HoverListener = (handler: HoverHandle) => void;

export const useHover = <T extends HTMLElement = HTMLElement>(
  handler?: HoverHandle
): [Ref<T>, boolean, HoverListener] => {
  const [value, setValue] = useState(false);

  const setHover = useCallback(
    (value: boolean) => {
      setValue(value);
      handler?.call(this, value);
    },
    [handler]
  );

  const listener: HoverListener = useCallback(
    (handler) => handler(value),
    [value]
  );

  // Wrap in useCallback so we can use in dependencies below
  const handleMouseOver = useCallback(() => setHover(true), [setHover]);
  const handleMouseOut = useCallback(() => setHover(false), [setHover]);

  // Keep track of the last node passed to callbackRef
  // so we can remove its event listeners.
  const ref = useRef<T>();

  // Use a callback ref instead of useEffect so that event listeners
  // get changed in the case that the returned ref gets added to
  // a different element later. With useEffect, changes to ref.current
  // wouldn't cause a rerender and thus the effect would run again.
  const callbackRef: Ref<T> = useCallback(
    (node: T) => {
      if (ref.current) {
        ref.current.removeEventListener('mouseover', handleMouseOver);
        ref.current.removeEventListener('mouseout', handleMouseOut);
      }

      ref.current = node;

      if (ref.current) {
        ref.current.addEventListener('mouseover', handleMouseOver);
        ref.current.addEventListener('mouseout', handleMouseOut);
      }
    },
    [handleMouseOver, handleMouseOut]
  );

  return [callbackRef, value, listener];
};

export default useHover;
