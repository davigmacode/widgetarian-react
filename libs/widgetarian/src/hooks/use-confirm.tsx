import {
  FC,
  ReactNode,
  createContext,
  useContext,
} from 'react'

import {
  useDisclosure,
  DisclosureReturn,
  DisclosureStatus
} from './use-disclosure'

import { Portal } from '../ui/Portal'

interface ConfirmPayload {
  title?: string
  message?: string
}

type ConfirmState = DisclosureReturn<ConfirmPayload, boolean|null>

const ConfirmContext = createContext<ConfirmState>({
  status: new DisclosureStatus('hidden'),
  show: async () => Promise.resolve(null),
  hide: () => false,
  toggle: () => false,
  action: {
    show: async () => Promise.resolve(null),
    hide: () => false,
    toggle: () => false,
  },
  payload: null,
})

export const useConfirm = () => {
  return useContext(ConfirmContext)
}

export type ConfirmTemplate = FC<ConfirmState>

export interface ConfirmProp {
  children?: ReactNode | undefined
  template?: ConfirmTemplate
}

export const ConfirmProvider: FC<ConfirmProp> = ({
  children,
  template
}) => {
  const disclosure = useDisclosure<ConfirmPayload, boolean|null>()
  const Template = template || DefaultConfirmTemplate

  return <ConfirmContext.Provider value={disclosure}>
    {children}
    <Template {...disclosure}/>
  </ConfirmContext.Provider>
}

export const DefaultConfirmTemplate: ConfirmTemplate = ({
  status,
  hide,
  payload
}) => {
  return (
    <Portal id="confirm-root">
      <div style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        width: '50%',
        maxWidth: '630px',
        minWidth: '320px',
        height: 'auto',
        zIndex: 2000,
        visibility: status.shown ? 'visible' : 'hidden',
        backfaceVisibility: 'hidden',
        transform: 'translateX(-50%) translateY(-50%)',
      }}>
        <h3>{payload?.title}</h3>
        <p>{payload?.message}</p>
        <div>
          <button onClick={(e) => hide(null, e)}>Cancel</button>
          <button onClick={(e) => hide(false, e)}>No</button>
          <button onClick={(e) => hide(true, e)}>Yes!</button>
        </div>
      </div>
    </Portal>
  )
}

export default useConfirm