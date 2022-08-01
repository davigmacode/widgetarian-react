import { useCallback, useState, ChangeEvent } from 'react'

type CheckboxHookValue = string[] | undefined

type CheckboxHookOnChange = (e: ChangeEvent<HTMLInputElement>) => void

type CheckboxHookBind = (value?: string | undefined) => {
  type: 'checkbox'
  value: string | undefined
  checked: boolean
  onChange: CheckboxHookOnChange
}

interface CheckboxHookAction {
  set: React.Dispatch<React.SetStateAction<CheckboxHookValue>>
  reset: () => void
}

type CheckboxHook = (initial?: CheckboxHookValue) => [
  CheckboxHookValue,
  CheckboxHookBind,
  CheckboxHookAction
]

export const useCheckbox: CheckboxHook = (initial) => {
  const [value, set] = useState(initial)

  const reset = useCallback(() => set(initial), [set, initial])

  const onChange: CheckboxHookOnChange = useCallback((e) => {
    set((value) => {
      const uniqueValue = new Set(value)
      if (e.target.checked) {
        uniqueValue.add(e.target.value)
      } else {
        uniqueValue.delete(e.target.value)
      }
      return Array.from(uniqueValue)
    })
  }, [set])

  const bind: CheckboxHookBind = useCallback((v) => ({
    type: 'checkbox',
    checked: !!v && !!value && value.includes(v),
    value: v,
    onChange
  }), [value, onChange])

  return [
    value,
    bind,
    { set, reset }
  ]
}

export default useCheckbox