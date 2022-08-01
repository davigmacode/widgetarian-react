import { FC, ReactNode } from 'react'
import { Portal } from '../ui/Portal'
import {
  useDisclosure,
  DisclosureReturn
} from './use-disclosure'

export interface ModalProp<P=unknown, R=unknown> {
  render?: ModalRender<P, R>
  children?: ReactNode | ModalRender<P, R> | undefined
  template?: ModalTemplate<P, R>
}

export type ModalState<P=unknown, R=unknown> = DisclosureReturn<P, R>

export interface ModalTemplateProp<P=unknown, R=unknown> extends ModalState<P, R> {
  children?: ReactNode
}

export type ModalRender<P=unknown, R=unknown> = FC<ModalState<P, R>>

export type ModalTemplate<P=unknown, R=unknown> = FC<ModalTemplateProp<P, R>>

interface ModalHookOption<P=unknown, R=unknown> {
  template?: ModalTemplate<P, R>
}

interface ModalHookResult<P=unknown, R=unknown> extends ModalState<P, R> {
  Modal: FC<ModalProp<P, R>>
}

export const useModal = <P=unknown, R=unknown>({
  template: defaultTemplate
}: ModalHookOption<P, R> = {}): ModalHookResult<P, R> => {
  const disclosure = useDisclosure<P, R>()

  const Modal: FC<ModalProp<P, R>> = ({ children, template, render }) => {
    const Template = template || defaultTemplate || DefaultModalTemplate
    const content = render
      ? render(disclosure)
      : typeof children === 'function'
        ? children(disclosure)
        : children
    return (
      <Template {...disclosure}>
        {content}
      </Template>
    )
  }

  return { Modal, ...disclosure }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const DefaultModalTemplate: ModalTemplate<any, any> = ({
  status,
  payload,
  children
}) => {
  return (
    <Portal id="modal-root">
      <div style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        width: '50%',
        maxWidth: payload?.maxWidth || '630px',
        minWidth: payload?.minWidth || '320px',
        height: 'auto',
        zIndex: payload?.zIndex || 2000,
        visibility: status.shown ? 'visible' : 'hidden',
        backfaceVisibility: 'hidden',
        transform: 'translateX(-50%) translateY(-50%)',
      }}>{children}</div>
    </Portal>
  )
}

export default useModal