import { useState, useCallback, SyntheticEvent } from 'react';

export type DisclosureResolver<P = unknown> = (
  value?: P | PromiseLike<P | undefined>
) => void;
export type DisclosureShow<P = unknown, R = unknown> = (
  payload?: P,
  event?: SyntheticEvent
) => Promise<R | undefined>;
export type DisclosureHide<R = unknown> = (
  value?: R,
  event?: SyntheticEvent
) => void;
export type DisclosureToggle = (event?: SyntheticEvent) => void;
export type DisclosureStatusValue = 'shown' | 'hidden';
export type DisclosurePayload<P = unknown> = P | null | undefined;

export class DisclosureStatus {
  public value: DisclosureStatusValue;
  public shown: boolean;
  public hidden: boolean;

  constructor(value: DisclosureStatusValue = 'hidden') {
    this.value = value;
    this.shown = value === 'shown';
    this.hidden = value === 'hidden';
  }
}

export interface DisclosureAction<P = unknown, R = unknown> {
  show: DisclosureShow<P, R>;
  hide: DisclosureHide<R>;
  toggle: DisclosureToggle;
}

interface DisclosureData<P = unknown, R = unknown> {
  status: DisclosureStatus;
  resolver?: DisclosureResolver<R>;
  event?: SyntheticEvent;
  payload?: DisclosurePayload<P>;
}

export interface DisclosureReturn<P = unknown, R = unknown> {
  status: DisclosureStatus;
  show: DisclosureShow<P, R>;
  hide: DisclosureHide<R>;
  toggle: DisclosureToggle;
  action: DisclosureAction<P, R>;
  payload: DisclosurePayload<P>;
}

export const useDisclosure = <P = unknown, R = unknown>(
  statusValue: DisclosureStatusValue = 'hidden'
): DisclosureReturn<P, R> => {
  const [data, setData] = useState<DisclosureData<P, R>>({
    status: new DisclosureStatus(statusValue),
  });

  const show: DisclosureShow<P, R> = useCallback(async (payload?, event?) => {
    return new Promise<R | undefined>((resolve) => {
      setData({
        status: new DisclosureStatus('shown'),
        resolver: resolve,
        event,
        payload,
      });
    });
  }, []);

  const hide: DisclosureHide<R> = useCallback((value?, event?) => {
    setData((data) => {
      data.resolver && data.resolver(value);
      return {
        ...data,
        status: new DisclosureStatus('hidden'),
        event,
      };
    });
  }, []);

  const toggle: DisclosureToggle = useCallback((event?) => {
    setData((data) => ({
      ...data,
      status: new DisclosureStatus(
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

export default useDisclosure;
