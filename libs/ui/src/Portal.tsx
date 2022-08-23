import { FC, useState, useEffect, ReactNode } from 'react';

import { createPortal } from 'react-dom';

export interface PortalProp {
  id?: string;
  children: ReactNode;
}

export const Portal: FC<PortalProp> = ({ id = 'portal-default', children }) => {
  const [target, setTarget] = useState<HTMLElement | null>(null);

  useEffect(() => {
    let element = document.getElementById(id);
    let systemCreated = false;
    // if element is not found with wrapperId or wrapperId is not provided,
    // create and append to body
    if (!element) {
      systemCreated = true;
      element = createEl(id);
    }
    setTarget(element);

    return () => {
      // delete the programmatically created element
      if (
        systemCreated &&
        element &&
        element.innerHTML === '' &&
        element.parentNode
      ) {
        element.parentNode.removeChild(element);
      }
    };
  }, [id]);

  return target && createPortal(children, target);
};

const createEl = (id: string): HTMLDivElement => {
  const el = document.createElement('div');
  el.setAttribute('id', id);
  document.body.appendChild(el);

  return el;
};

export default Portal;
