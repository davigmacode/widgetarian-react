import { FC, ReactNode, createContext, useContext, useMemo } from 'react';

import { useDisclosure, DisclosureReturn } from 'widgetarian-react-hooks/use-disclosure';

import { Portal } from '../Portal';

interface ConfirmPayload {
  title?: ReactNode;
  message?: ReactNode;
}

type ConfirmState = DisclosureReturn<ConfirmPayload, boolean | null>;

const ConfirmContext = createContext<ConfirmState | null>(null);

export const useConfirm = () => {
  const context = useContext(ConfirmContext);

  if (context === null) {
    throw new Error('useConfirm was used outside of its Provider');
  }

  return context;
};

export type ConfirmTemplate = FC<ConfirmState>;

export interface ConfirmProviderProp {
  children?: ReactNode | undefined;
  template?: ConfirmTemplate;
}

export const ConfirmProvider: FC<ConfirmProviderProp> = ({
  children,
  template,
}) => {
  const disclosure = useDisclosure<ConfirmPayload, boolean | null>();
  const Template = useMemo(
    () => template || DefaultConfirmTemplate,
    [template]
  );

  return (
    <ConfirmContext.Provider value={disclosure}>
      {children}
      <Template {...disclosure} />
    </ConfirmContext.Provider>
  );
};

export const DefaultConfirmTemplate: ConfirmTemplate = ({
  status,
  hide,
  payload,
}) => {
  return (
    <Portal id="modal-root">
      <div
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          width: '50%',
          maxWidth: '630px',
          minWidth: '320px',
          height: 'auto',
          zIndex: 2000,
          visibility: status.shown ? 'visible' : 'hidden',
          opacity: status.shown ? 1 : 0,
          backfaceVisibility: 'hidden',
          transform: 'translateX(-50%) translateY(-50%)',
          transition: 'all ease 0.3s',
        }}
      >
        {payload?.title}
        {payload?.message}
        <div>
          <button onClick={(e) => hide(null, e)}>Cancel</button>
          <button onClick={(e) => hide(false, e)}>No</button>
          <button onClick={(e) => hide(true, e)}>Yes!</button>
        </div>
      </div>
    </Portal>
  );
};

export default useConfirm;
