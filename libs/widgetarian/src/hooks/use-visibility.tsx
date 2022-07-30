import { useState, useCallback, SyntheticEvent } from 'react';

export type VisibilityResolver<P = unknown> = (
  value?: P | PromiseLike<P | undefined>
) => void;
export type VisibilityShow<P = unknown, R = unknown> = (
  payload?: P,
  event?: SyntheticEvent
) => Promise<R | undefined>;
export type VisibilityHide<R = unknown> = (
  value?: R,
  event?: SyntheticEvent
) => void;
export type VisibilityToggle = (event?: SyntheticEvent) => void;
export type VisibilityStatusValue = 'shown' | 'hidden';
export type VisibilityPayload<P = unknown> = P | null | undefined;

export class VisibilityStatus {
  public value: VisibilityStatusValue;
  public shown: boolean;
  public hidden: boolean;

  constructor(value: VisibilityStatusValue = 'hidden') {
    this.value = value;
    this.shown = value === 'shown';
    this.hidden = value === 'hidden';
  }
}

export interface VisibilityAction<P = unknown, R = unknown> {
  show: VisibilityShow<P, R>;
  hide: VisibilityHide<R>;
  toggle: VisibilityToggle;
}

interface VisibilityData<P = unknown, R = unknown> {
  status: VisibilityStatus;
  resolver?: VisibilityResolver<R>;
  event?: SyntheticEvent;
  payload?: VisibilityPayload<P>;
}

export interface VisibilityReturn<P = unknown, R = unknown> {
  status: VisibilityStatus;
  show: VisibilityShow<P, R>;
  hide: VisibilityHide<R>;
  toggle: VisibilityToggle;
  action: VisibilityAction<P, R>;
  payload: VisibilityPayload<P>;
}

export const useVisibility = <P = unknown, R = unknown>(
  statusValue: VisibilityStatusValue = 'hidden'
): VisibilityReturn<P, R> => {
  const [data, setData] = useState<VisibilityData<P, R>>({
    status: new VisibilityStatus(statusValue),
  });

  const show: VisibilityShow<P, R> = useCallback(async (payload?, event?) => {
    return new Promise<R | undefined>((resolve) => {
      setData({
        status: new VisibilityStatus('shown'),
        resolver: resolve,
        event,
        payload,
      });
    });
  }, []);

  const hide: VisibilityHide<R> = useCallback(
    (value?, event?) => {
      data.resolver && data.resolver(value);
      setData({
        status: new VisibilityStatus('hidden'),
        event,
      });
    },
    [data]
  );

  const toggle: VisibilityToggle = useCallback((event?) => {
    setData((data) => ({
      status: new VisibilityStatus(
        data.status.value === 'shown' ? 'hidden' : 'shown'
      ),
      event,
    }));
  }, []);

  const status = data.status;
  const action = { show, hide, toggle };
  const payload = data.payload;

  return {
    status,
    show,
    hide,
    toggle,
    action,
    payload,
  };
};

export default useVisibility;
