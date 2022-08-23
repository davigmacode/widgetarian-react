import { FC, ReactNode, useCallback, useMemo } from 'react';
import { Modal } from './Modal';
import { Overlay } from '../Overlay';
import { useDisclosure, DisclosureReturn } from 'widgetarian-react-hooks/use-disclosure';

export interface ModalProp<P = unknown, R = unknown> {
  render?: ModalRender<P, R>;
  children?: ReactNode | ModalRender<P, R> | undefined;
}

export type ModalState<P = unknown, R = unknown> = DisclosureReturn<P, R>;

export interface ModalTemplateProp<P = unknown, R = unknown>
  extends ModalState<P, R> {
  children?: ReactNode;
}

export type ModalRender<P = unknown, R = unknown> = FC<ModalState<P, R>>;

export type ModalTemplate<P = unknown, R = unknown> = FC<
  ModalTemplateProp<P, R>
>;

interface ModalHookOption<P = unknown, R = unknown> {
  template?: ModalTemplate<P, R>;
}

interface ModalHookResult<P = unknown, R = unknown> extends ModalState<P, R> {
  Modal: FC<ModalProp<P, R>>;
}

export const useModal = <P = unknown, R = unknown>({
  template,
}: ModalHookOption<P, R> = {}): ModalHookResult<P, R> => {
  const disclosure = useDisclosure<P, R>();
  const Template = useMemo(() => template || DefaultModalTemplate, [template]);

  const Modal: FC<ModalProp<P, R>> = useCallback(
    ({ children, render }) => {
      const content = render
        ? render(disclosure)
        : typeof children === 'function'
        ? children(disclosure)
        : children;
      return Template({ ...disclosure, children: content });
    },
    [disclosure, Template]
  );

  return { Modal, ...disclosure };
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const DefaultModalTemplate: ModalTemplate<any, any> = ({
  status,
  hide,
  children,
}) => {
  const overlay = useCallback(
    (shown: boolean) => {
      return <Overlay shown={shown} onClick={() => hide()} />;
    },
    [hide]
  );

  return (
    <Modal
      shown={status.shown}
      overlay={overlay}
      effect="flip-y"
      portal="modal-root"
    >
      {children}
    </Modal>
  );
};

export default useModal;
