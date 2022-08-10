import { useCallback, ChangeEvent } from 'react'
import { useSet } from './use-set'

type CheckboxHookValue = string[] | undefined

type CheckboxHookOnChange = (e: ChangeEvent<HTMLInputElement>) => void

type CheckboxHookBind = (value?: string | undefined) => {
  type: 'checkbox'
  value: string | undefined
  checked: boolean
  onChange: CheckboxHookOnChange
}

interface CheckboxHookAction {
  has: (key: string) => boolean
  set: (key: string, isAdd: boolean) => void
  toggle: (key: string) => void
  reset: (value?: string[] | undefined) => void
}

type CheckboxHook = (initial?: CheckboxHookValue) => [
  CheckboxHookValue,
  CheckboxHookBind,
  CheckboxHookAction
]

export const useCheckbox: CheckboxHook = (initial) => {
  const [value, { has, reset, set, toggle }] = useSet(new Set(initial))

  const onChange: CheckboxHookOnChange = useCallback((e) => {
    const target = e.target
    set(target.value, target.checked)
  }, [set])

  const bind: CheckboxHookBind = useCallback((v) => ({
    type: 'checkbox',
    checked: !!v && has(v),
    value: v,
    onChange
  }), [onChange, has])

  const utils: CheckboxHookAction = {
    reset: useCallback((v) => reset(v && new Set(v)), [reset]),
    toggle, set, has
  }

  return [
    [...value],
    bind,
    utils
  ]
}

export default useCheckbox