import {
  FC,
  createContext,
  useContext,
  useState,
  useCallback,
  PropsWithChildren,
  ReactNode
} from 'react';

export type ChoiceValue = string | number | boolean | undefined

type ChoiceSetter = (value: ChoiceValue) => void

interface ChoiceContextProp {
  value?: ChoiceValue
  select: ChoiceSetter
}

const ChoiceContext = createContext<ChoiceContextProp>({
  select: () => console.log('choice not initialized')
});

export const useChoice = () => {
  return useContext(ChoiceContext);
}

interface ChoiceProps {
  name?: string
  initValue?: ChoiceValue
}

export const Choice: FC<ChoiceProps & PropsWithChildren> = ({ children, initValue, name }) => {
  const choiceGroup = useChoiceGroup()
  const [selected, select] = useState<ChoiceValue>(initValue || choiceGroup.get(name));

  const choose = (value: ChoiceValue) => {
    select(value)
    if (name) choiceGroup.set(name, value)
  }

  return <ChoiceContext.Provider
    value={{ value: selected, select: choose }}>
    {children}
  </ChoiceContext.Provider>
}

/* --------------------------------------------- */

export interface ChoiceGroupValue {
  [key: string]: ChoiceValue
}

type ChoiceGroupSetter = (group: string, value: ChoiceValue) => void

type ChoiceGroupGetter = (name?: string) => ChoiceValue

interface ChoiceGroupContextProp {
  value: ChoiceGroupValue,
  get: ChoiceGroupGetter,
  set: ChoiceGroupSetter
}

const ChoiceGroupContext = createContext<ChoiceGroupContextProp>({
  value: {},
  get: (_) => undefined,
  set: (_, __) => console.log('choice group not initialized')
});

export const useChoiceGroup = () => {
  return useContext(ChoiceGroupContext);
}

interface ChoiceGroupProps {
  initValue?: ChoiceGroupValue
}

export const ChoiceGroup: FC<ChoiceGroupProps & PropsWithChildren> = ({ children, initValue = {} }) => {
  const [group, setGroup] = useState<ChoiceGroupValue>(initValue);

  const setter = (name: string, value: ChoiceValue) => {
    setGroup({ ...group, [name]: value })
  }

  const getter = (name?: string) => name ? group[name] : name

  return <ChoiceGroupContext.Provider
    value={{ value: group, set: setter, get: getter }}>
    {children}
  </ChoiceGroupContext.Provider>
}

/* --------------------------------------------- */

export interface ChoiceOptionRender {
  title?: string
  value: ChoiceValue
  checked: boolean
  select: () => void
  meta: unknown
}

interface ChoiceOptionProps {
  title?: string
  value: ChoiceValue
  render?: FC<ChoiceOptionRender>
  children?: ReactNode | FC<ChoiceOptionRender> | undefined
  meta?: unknown
}

export const ChoiceOption: FC<ChoiceOptionProps> = ({
  title,
  value,
  render,
  children,
  meta
}) => {
  const { value: chosen, select } = useChoice()
  const choose = useCallback(() => select(value), [select, value])
  const renderData = { title: title, value, checked: value === chosen, select: choose, meta }
  return <div>
    {
      render
        ? render(renderData)
        : typeof children === 'function'
          ? children(renderData)
          : children
    }
  </div>
}