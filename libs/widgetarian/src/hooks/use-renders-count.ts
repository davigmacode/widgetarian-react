import { useRef } from 'react';

export const useRendersCount = (): number => {
  return ++useRef(0).current;
}

export default useRendersCount