import {
  FC,
  createContext,
  useContext,
  useCallback,
  useMemo,
  useEffect,
  ReactNode,
  ChangeEvent
} from 'react';

import { useSet, Actions } from '../hooks/use-set'

export type MultiChoiceValue = string | number | undefined

interface MultiChoiceContextValue extends Actions<MultiChoiceValue> {
  value?: MultiChoiceValue[]
  render?: MultiChoiceRender
}

const MultiChoiceContext = createContext<MultiChoiceContextValue|null>(null);

export const useMultiChoice = () => {
  const context = useContext(MultiChoiceContext)
  if (context === null) {
    throw new Error("useMultiChoice was used outside of its Provider");
  }
  return context;
}

interface MultiChoiceProps {
  children?: ReactNode
  render?: MultiChoiceRender
  value?: MultiChoiceValue[]
  onChange?: (value: MultiChoiceValue[]) => void
}

interface MultiChoiceComponent extends FC<MultiChoiceProps> {
  Option: typeof MultiChoiceOption
}

export const MultiChoice: MultiChoiceComponent = ({
  children,
  render,
  value,
  onChange
}) => {
  const [choiceValue, { set, ...choiceActions} ] = useSet<MultiChoiceValue>(new Set(value));

  useEffect(() => {
    const valueFromProp = new Set(value)
    valueFromProp.size !== choiceValue.size && set(new Set(value));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, set]);

  useEffect(() => {
    onChange && onChange([...choiceValue]);
  }, [onChange, choiceValue]);

  return <MultiChoiceContext.Provider
    value={{ ...choiceActions, set, render, value: [...choiceValue] }}>
      {children}
  </MultiChoiceContext.Provider>
}

interface MultiChoiceOptionRenderProps {
  label?: string
  value: MultiChoiceValue
  checked: boolean
  select: (active?: boolean) => void
}

export type MultiChoiceRender = FC<MultiChoiceOptionRenderProps>

interface MultiChoiceOptionProps {
  label?: string
  value: MultiChoiceValue
  render?: MultiChoiceRender
}

const MultiChoiceOption: FC<MultiChoiceOptionProps> = ({
  label,
  value,
  render
}) => {
  const { render: groupRender, has, toggle } = useMultiChoice()
  const select = useCallback((active = true) => { toggle(value, active) }, [toggle, value])
  const Render = useMemo(() => render || groupRender || MultiChoiceOptionDefault, [render, groupRender])
  return Render({ label, value, select, checked: has(value) })
}

const MultiChoiceOptionDefault: MultiChoiceRender = ({
  label,
  value,
  checked,
  select
}) => {
  const onChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    select(e.target.checked)
  }, [select]);

  return <label>
    <input
      type="checkbox"
      checked={checked}
      value={value?.toString()}
      onChange={onChange}
    /> {label||value}
  </label>
}

MultiChoice.Option = MultiChoiceOption

export default MultiChoice