import { FC } from 'react';
import {
  useConfirm,
  ConfirmProvider,
} from 'widgetarian-react-ui';

export const Page = () => {
  return (
    <ConfirmProvider>
      <ConfirmDemo />
    </ConfirmProvider>
  );
};

const ConfirmDemo: FC = () => {
  const { show } = useConfirm();

  const showConfirm = async () => {
    const result = await show({
      title: <h3>Styling the active item</h3>,
      message: (
        <p>
          This is a headless component so there are no styles included by
          default. Instead, the components expose useful information via render
          props that you can use to apply the styles you like to apply yourself.
        </p>
      ),
    });
    console.log(result);
  };

  return (
    <button className="btn btn-primary" onClick={() => showConfirm()}>
      show confirm
    </button>
  );
};

export default Page;
