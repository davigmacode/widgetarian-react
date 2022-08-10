import { FC } from 'react'
import { css } from 'goober'

export interface OverlayProp {
  shown?: boolean
  onClick?: () => void
}

const overlayStyle = ({ shown }: OverlayProp) => css({
  position: 'fixed',
  width: '100%',
  height: '100%',
  top: 0,
  left: 0,
  zIndex: 1000,
  opacity: shown ? 1 : 0,
  visibility: shown ? 'visible' : 'hidden',
  background: 'rgba(0,0,0,0.3)',
  transition: 'all 0.3s',
})

export const Overlay: FC<OverlayProp> = ({
  shown = false,
  onClick
}) => <div onClick={onClick} className={overlayStyle({ shown })}></div>

export default Overlay