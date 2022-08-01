import { FC, PropsWithChildren } from 'react'
import { Portal } from './Portal'
import styles from './Modal.module.css'

interface ModalProp extends PropsWithChildren {
  portal?: string
  shown?: boolean
}

export const Modal: FC<ModalProp> = ({
  children,
  portal = 'dialog-root',
  shown = false
}) => {
  const modalClass = [
    styles['md-modal'],
    styles['md-effect-3'],
    shown && styles['md-show']
  ]

  return (
    <Portal id={portal}>
      <div className={modalClass.join(' ')} >
        <div className={styles['md-content']}>
          {children}
        </div>
      </div>
      <div className={styles['md-overlay']}></div>
    </Portal>
  )
}

export default Modal