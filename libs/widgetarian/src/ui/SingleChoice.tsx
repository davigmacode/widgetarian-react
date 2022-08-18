import {
  FC,
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useMemo,
  ReactNode,
  ChangeEvent
} from 'react';

export type SingleChoiceValue = string | number | boolean | undefined

type SingleChoiceSetter = (value: SingleChoiceValue) => void

interface SingleChoiceContextValue {
  value?: SingleChoiceValue
  render?: SingleChoiceRender
  select: SingleChoiceSetter
  reset: () => void
}

const SingleChoiceContext = createContext<SingleChoiceContextValue|null>(null);

export const useSingleChoice = () => {
  const context = useContext(SingleChoiceContext)
  if (context === null) {
    throw new Error("useSingleChoice was used outside of its Provider");
  }
  return context;
}

interface SingleChoiceProps {
  children?: ReactNode
  render?: SingleChoiceRender
  value?: SingleChoiceValue
  onChange?: (value: SingleChoiceValue) => void
}

interface SingleChoiceComponent extends FC<SingleChoiceProps> {
  Option: typeof SingleChoiceOption
}

export const SingleChoice: SingleChoiceComponent = ({
  children,
  render,
  value,
  onChange
}) => {
  const [choiceValue, setChoice] = useState<SingleChoiceValue>(value);

  useEffect(() => {
    setChoice(value);
  }, [value]);

  useEffect(() => {
    onChange && onChange(choiceValue);
  }, [onChange, choiceValue]);

  const select = useCallback((val: SingleChoiceValue) => {
    setChoice(val)
  }, []);

  const reset = useCallback(() => {
    setChoice(value)
  }, [value]);

  return <SingleChoiceContext.Provider
    value={{ value: choiceValue, select, reset, render }}>
    {children}
  </SingleChoiceContext.Provider>
}

interface SingleChoiceOptionRenderProps {
  label?: string
  value: SingleChoiceValue
  checked: boolean
  select: () => void
}

export type SingleChoiceRender = FC<SingleChoiceOptionRenderProps>

interface SingleChoiceOptionProps {
  label?: string
  value: SingleChoiceValue
  render?: SingleChoiceRender
}

const SingleChoiceOption: FC<SingleChoiceOptionProps> = ({
  label,
  value,
  render
}) => {
  const { value: chosen, select: choose, render: groupRender } = useSingleChoice()
  const select = useCallback(() => { choose(value) }, [choose, value])
  const Render = useMemo(() => render || groupRender || SingleChoiceOptionDefault, [render, groupRender])
  return Render({ label, value, select, checked: value === chosen })
}

const SingleChoiceOptionDefault: SingleChoiceRender = ({
  label,
  value,
  checked,
  select
}) => {
  const onChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    e.target.checked && select()
  }, [select]);

  return <label>
    <input type="radio" checked={checked} value={value?.toString()} onChange={onChange}/> {label||value}
  </label>
}

SingleChoice.Option = SingleChoiceOption

export default SingleChoice