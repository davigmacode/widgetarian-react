import { useRef, useState, useCallback, Ref } from 'react';

interface FeedbackListener {
  onActive?: (state: boolean, e: MouseEvent) => void;
  onTouch?: (state: boolean, e: TouchEvent) => void;
  onHover?: (state: boolean, e: MouseEvent) => void;
  onFocus?: (state: boolean, e: FocusEvent) => void;
}

interface FeedbackState {
  isActive: boolean;
  isTouch: boolean;
  isHover: boolean;
  isFocus: boolean;
}

export const useFeedback = <T extends HTMLElement = HTMLElement>({
  onActive,
  onTouch,
  onHover,
  onFocus,
}: FeedbackListener = {}): [Ref<T>, FeedbackState] => {
  const [state, setState] = useState<FeedbackState>({
    isActive: false,
    isTouch: false,
    isHover: false,
    isFocus: false,
  });

  const setActive = useCallback(
    (isActive: boolean, e: MouseEvent) => {
      setState((prevState) => ({ ...prevState, isActive }));
      onActive && onActive(isActive, e);
    },
    [onActive]
  );

  const setTouch = useCallback(
    (isTouch: boolean, e: TouchEvent) => {
      setState((prevState) => ({ ...prevState, isTouch }));
      onTouch && onTouch(isTouch, e);
    },
    [onTouch]
  );

  const setHover = useCallback(
    (isHover: boolean, e: MouseEvent) => {
      setState((prevState) => ({ ...prevState, isHover }));
      onHover && onHover(isHover, e);
    },
    [onHover]
  );

  const setFocus = useCallback(
    (isFocus: boolean, e: FocusEvent) => {
      setState((prevState) => ({ ...prevState, isFocus }));
      onFocus && onFocus(isFocus, e);
    },
    [onFocus]
  );

  // Wrap in useCallback so we can use in dependencies below
  const handlerMouseDown = useCallback(
    (e: MouseEvent) => setActive(true, e),
    [setActive]
  );
  const handlerMouseUp = useCallback(
    (e: MouseEvent) => setActive(false, e),
    [setActive]
  );
  const handlerTouchStart = useCallback(
    (e: TouchEvent) => setTouch(true, e),
    [setTouch]
  );
  const handlerTouchEnd = useCallback(
    (e: TouchEvent) => setTouch(false, e),
    [setTouch]
  );
  const handlerMouseOver = useCallback(
    (e: MouseEvent) => setHover(true, e),
    [setHover]
  );
  const handlerMouseOut = useCallback(
    (e: MouseEvent) => setHover(false, e),
    [setHover]
  );
  const handlerFocus = useCallback(
    (e: FocusEvent) => setFocus(true, e),
    [setFocus]
  );
  const handlerBlur = useCallback(
    (e: FocusEvent) => setFocus(false, e),
    [setFocus]
  );

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
        ref.current.removeEventListener('mousedown', handlerMouseDown);
        ref.current.removeEventListener('mouseup', handlerMouseUp);
        ref.current.removeEventListener('touchstart', handlerTouchStart);
        ref.current.removeEventListener('touchend', handlerTouchEnd);
        ref.current.removeEventListener('mouseover', handlerMouseOver);
        ref.current.removeEventListener('mouseout', handlerMouseOut);
        ref.current.removeEventListener('focus', handlerFocus);
        ref.current.removeEventListener('blur', handlerBlur);
      }

      ref.current = node;

      if (ref.current) {
        ref.current.addEventListener('mousedown', handlerMouseDown);
        ref.current.addEventListener('mouseup', handlerMouseUp);
        ref.current.addEventListener('touchstart', handlerTouchStart);
        ref.current.addEventListener('touchend', handlerTouchEnd);
        ref.current.addEventListener('mouseover', handlerMouseOver);
        ref.current.addEventListener('mouseout', handlerMouseOut);
        ref.current.addEventListener('focus', handlerFocus);
        ref.current.addEventListener('blur', handlerBlur);
      }
    },
    [
      handlerMouseDown,
      handlerMouseUp,
      handlerTouchStart,
      handlerTouchEnd,
      handlerMouseOver,
      handlerMouseOut,
      handlerFocus,
      handlerBlur,
    ]
  );

  return [callbackRef, state];
};

export default useFeedback;
