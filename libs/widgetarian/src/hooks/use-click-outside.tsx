import { useRef, useState, useCallback, useEffect, Ref } from 'react';

type ClickOutsideHandle = (value: boolean) => void;
type ClickOutsideListener = (handler: ClickOutsideHandle) => void;

export const useClickOutside = <T extends HTMLElement = HTMLElement>(
  handler?: ClickOutsideHandle
): [Ref<T>, boolean, ClickOutsideListener] => {
  const [value, setValue] = useState(false);

  const setClickOutside = useCallback(
    (value: boolean) => {
      setValue(value);
      handler?.call(this, value);
    },
    [handler]
  );

  const listener: ClickOutsideListener = useCallback(
    (handler) => handler(value),
    [value]
  );

  // Keep track of the last node passed to callbackRef
  // so we can remove its event listeners.
  const ref = useRef<T>(null);

  useEffect(
    () => {
      const eventHandler: EventListener = (event) => {
        // Do nothing if clicking ref's element or descendent elements
        const clickedOutside =
          ref.current && !ref.current.contains(event.target as Node);
        setClickOutside(
          typeof clickedOutside === 'boolean' ? clickedOutside : false
        );
      };

      document.addEventListener('mousedown', eventHandler);
      document.addEventListener('touchstart', eventHandler);
      return () => {
        document.removeEventListener('mousedown', eventHandler);
        document.removeEventListener('touchstart', eventHandler);
      };
    },
    // Add ref and handler to effect dependencies
    // It's worth noting that because passed in handler is a new ...
    // ... function on every render that will cause this effect ...
    // ... callback/cleanup to run every render. It's not a big deal ...
    // ... but to optimize you can wrap handler in useCallback before ...
    // ... passing it into this hook.
    [ref, handler, setClickOutside]
  );

  return [ref, value, listener];
};

export default useClickOutside;
