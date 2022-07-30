import {
  FC,
  useState,
  useEffect,
  ReactNode,
} from 'react'

import {
  createPortal
} from 'react-dom'

export interface PortalProp {
  id?: string
  children: ReactNode
}

export const Portal: FC<PortalProp> = ({
  id = 'portal-default',
  children
}) => {
  const [target, setTarget] = useState<HTMLElement|null>(null)

  useEffect(() => {
    setTarget(document.getElementById(id) || createEl(id))

    return () => {
      if (target && target.innerHTML === "") {
        target.remove()
      }
    }
  }, [id, target])

  return target && createPortal(children, target)
}

const createEl = (id: string): HTMLDivElement => {
  const el = document.createElement("div")
  el.setAttribute("id", id)
  document.body.appendChild(el)

  return el
}

export default Portal