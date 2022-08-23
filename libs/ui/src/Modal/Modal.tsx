import { createCss } from 'widgetarian-react-utils';
import { Portal } from '../Portal';

import type { FC, PropsWithChildren, ReactNode } from 'react';
import type { CSSAttribute } from 'widgetarian-react-utils';

export const MODAL_EFFECTS = [
  'scale-up',
  'slide-in',
  'rotate-in',
  'super-scaled',
  'sticky-up',
  'sticky-bottom',
  'flip-x',
  'flip-y',
  'newspaper',
  'fall',
  'sign',
] as const;

export const MODAL_POSITIONS = [
  'top-left',
  'top',
  'top-right',
  'left',
  'center',
  'right',
  'bottom-left',
  'bottom',
  'bottom-right',
] as const;

export type ModalEffect = typeof MODAL_EFFECTS[number];

export type ModalPosition = typeof MODAL_POSITIONS[number];

export type ModalElementRender<T> = (shown: boolean) => T;

interface ModalProp extends PropsWithChildren {
  portal?: string;
  shown?: boolean;
  effect?: ModalEffect;
  className?: string;
  styles?: CSSAttribute | ModalElementRender<CSSAttribute>;
  position?: ModalPosition;
  overlay?: ReactNode | ModalElementRender<ReactNode>;
}

const is3dEffect = (effect?: string) =>
  effect && ['fall', 'sign', 'flip-x', 'flip-y', 'rotate-in'].includes(effect);

const getPos = (position: ModalPosition = 'center') => {
  const normalized =
    position === 'top'
      ? 'top-center'
      : position === 'bottom'
      ? 'bottom-center'
      : position === 'left'
      ? 'center-left'
      : position === 'right'
      ? 'center-right'
      : position === 'center'
      ? 'center-center'
      : position;
  const pos = normalized.split('-');
  return {
    alignItems: getPosValue(pos[0]),
    justifyContent: getPosValue(pos[1]),
  };
};

const getPosValue = (pos: string) => {
  if (['top', 'left'].indexOf(pos) !== -1) return 'flex-start';
  if (['bottom', 'right'].indexOf(pos) !== -1) return 'flex-end';
  return pos;
};

const modalStyle = ({ shown, effect, position }: ModalProp) => {
  return createCss({
    position: 'fixed',
    display: 'flex',
    zIndex: 2000,
    inset: 0,
    visibility: shown ? 'visible' : 'hidden',
    overflow: 'hidden',
    backfaceVisibility: 'hidden',
    ...getPos(position),
    ...(effect === 'sticky-up' && {
      alignItems: 'flex-start',
    }),
    ...(effect === 'sticky-bottom' && {
      alignItems: 'flex-end',
    }),
    ...(is3dEffect(effect) && {
      perspective: '1300px',
    }),
  });
};

const modalContentStyle = ({ shown, effect, styles = {} }: ModalProp) =>
  createCss({
    position: 'relative',
    opacity: shown ? 1 : 0,
    width: '50%',
    maxWidth: '630px',
    minWidth: '320px',
    transition: 'all 0.3s',
    ...(effect === 'scale-up' && {
      transform: `scale(${shown ? 1 : 0.7})`,
    }),
    ...(effect === 'slide-in' && {
      transform: `translateY(${shown ? 0 : '20%'})`,
    }),
    ...(effect === 'newspaper' && {
      transform: `scale(${shown ? 1 : 0}) rotate(${shown ? '0deg' : '360deg'})`,
    }),
    ...(effect === 'super-scaled' && {
      transform: `scale(${shown ? 1 : 2})`,
    }),
    ...(effect === 'sticky-up' && {
      transform: `translateY(${shown ? 0 : '-200%'})`,
      ...(shown && {
        borderTopLeftRadius: '0 !important',
        borderTopRightRadius: '0 !important',
      }),
    }),
    ...(effect === 'sticky-bottom' && {
      transform: `translateY(${shown ? 0 : '200%'})`,
      ...(shown && {
        borderBottomLeftRadius: '0 !important',
        borderBottomRightRadius: '0 !important',
      }),
    }),
    ...(is3dEffect(effect) && {
      transformStyle: 'preserve-3d',
    }),
    ...(effect === 'fall' && {
      transform: `translateZ(${shown ? '0px' : '600px'}) rotateX(${
        shown ? '0deg' : '60deg'
      })`,
    }),
    ...(effect === 'rotate-in' && {
      transform: `translateY(${shown ? '0%' : '100%'}) rotateX(${
        shown ? '0deg' : '90deg'
      })`,
    }),
    ...(effect === 'sign' && {
      transform: `rotateX(${shown ? '0deg' : '-60deg'})`,
      transformOrigin: '50% 0',
    }),
    ...(effect === 'flip-x' && {
      transform: `rotateY(${shown ? '0deg' : '-70deg'})`,
    }),
    ...(effect === 'flip-y' && {
      transform: `rotateX(${shown ? '0deg' : '-70deg'})`,
    }),
    ...(typeof styles === 'function' ? styles(!!shown) : styles),
  });

interface ModalComponent extends FC<ModalProp> {
  Overlay: FC<PropsWithChildren>;
}

export const Modal: ModalComponent = ({
  children,
  className,
  shown = false,
  portal = 'dialog-root',
  position = 'center',
  effect,
  overlay,
}) => {
  const modalContentClass = [modalContentStyle({ shown, effect }), className]
    .join(' ')
    .trim();
  return (
    <Portal id={portal}>
      <div className={modalStyle({ shown, effect, position })}>
        <div className={modalContentClass}>{children}</div>
      </div>
      {typeof overlay === 'function' ? overlay(shown) : overlay}
    </Portal>
  );
};

// eslint-disable-next-line react/jsx-no-useless-fragment
Modal.Overlay = ({ children }) => <>{children}</>;

export default Modal;
