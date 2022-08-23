import { useState, useCallback } from 'react';

const sleep = (delay: number) =>
  new Promise((resolve) => setTimeout(resolve, delay));

export const useDelayedUnmount = (isInitiallyMounted = false, delay = 300) => {
  const [isMounted, _setIsMounted] = useState(isInitiallyMounted);
  const [isUnmounting, setIsUnmounting] = useState(false);

  const setIsMounted = useCallback(
    async (_isMounted = false) => {
      if (isMounted === _isMounted) return;

      if (!_isMounted) {
        setIsUnmounting(true);
        await sleep(delay);
        setIsUnmounting(false);
      }

      _setIsMounted(_isMounted);
    },
    [isMounted, delay, _setIsMounted, setIsUnmounting]
  );

  return { isMounted, isUnmounting, setIsMounted };
};

export default useDelayedUnmount;
