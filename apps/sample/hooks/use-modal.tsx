import {
  useModal as useMainModal,
  ModalTemplate,
} from 'widgetarian/hooks/use-modal';

import { Portal, Modal } from 'widgetarian';

export const useModal = () => {
  return useMainModal({ template: WidgetarianModalTemplate });
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const WidgetarianModalTemplate: ModalTemplate<any, any> = ({
  status,
  children,
}) => {
  return (
    <Modal portal="modal-root" shown={status.shown}>
      {children}
    </Modal>
  );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const DaisyModalTemplate: ModalTemplate<any, any> = ({
  status,
  action,
  children,
}) => {
  const shownClass = status.shown ? 'modal-open' : '';
  const modalClass = `modal modal-bottom sm:modal-middle ${shownClass}`;
  return (
    <Portal id="modal-root">
      <div className={modalClass} onClick={() => action.hide()}>
        <div className="modal-box" onClick={(e) => e.stopPropagation()}>
          {children}
        </div>
      </div>
    </Portal>
  );
};

export default useModal;
