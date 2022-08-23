// import { useDisclosure } from 'widgetarian/hooks'
// import { Modal, ModalEffect, MODAL_EFFECTS, Overlay } from 'widgetarian/ui'
// import { useInput } from 'widgetarian/hooks/use-input'
import { useModal } from 'widgetarian-react-ui';

export const Page = () => {
  const { Modal, show, hide } = useModal();
  // const { status, show, hide } = useDisclosure()
  // const [value, bind] = useInput()

  return (
    <div>
      <button className="btn btn-primary" onClick={() => show()}>
        show modal
      </button>
      <Modal>
        <h3 className="font-bold text-lg">
          Congratulations random Internet user!
        </h3>
        <p className="py-4">
          Youve been selected for a chance to get one year of subscription to
          use Wikipedia for free!
        </p>
        <div className="modal-action">
          <button className="btn" onClick={() => hide()}>
            Yay!
          </button>
        </div>
      </Modal>
      {/* <select {...bind}>
        <option>Fade In (default)</option>
        {MODAL_EFFECTS.map((v) => <option key={v} value={v}>{v}</option>)}
      </select>
      <Modal shown={status.shown} effect={value as ModalEffect} className="bg-white p-3 rounded-lg" overlay={<Overlay shown={status.shown}/>}>
        <h3 className="font-bold text-lg">Congratulations random Internet user!</h3>
        <p className="py-4">Youve been selected for a chance to get one year of subscription to use Wikipedia for free!</p>
        <div className="modal-action">
          <button className="btn" onClick={() => hide()}>Yay!</button>
        </div>
      </Modal> */}
    </div>
  );
};

export default Page;
