/* eslint-disable react/jsx-no-useless-fragment */
import { FC, Children, ReactNode, ReactElement, isValidElement } from 'react';

export interface PropsWithSlot {
  slot: string;
}

interface SlotProps {
  name: string;
  children?: ReactNode;
}

export const Slot: FC<SlotProps> = ({ children }) => <>{children}</>;

export const useNamedSlots = (children: ReactNode, names: string[]) => {
  return Children.toArray(children).reduce((acc, child) => {
    const name = isValidElement(child)
      ? child.type === Slot && names.includes(child.props.name)
        ? child.props.name
        : child.props.slot !== undefined
        ? child.props.slot
        : 'rest'
      : 'rest';
    return { ...acc, [name]: acc[name] ? [...acc[name], child] : [child] };
  }, {} as { [key: string]: Array<ReactElement> });
};

export const useSlots = (
  children: ReactNode,
  names: string[]
): Array<ReactElement>[] => {
  const slots = useNamedSlots(children, names);
  const namedSlots = names.map((name) => slots[name]);
  const restSlots = slots['rest'];
  return [...namedSlots, restSlots];
};

export default useSlots;
