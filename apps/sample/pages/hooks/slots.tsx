import { FC, PropsWithChildren } from 'react';
import { useSlots, Slot, PropsWithSlot } from 'widgetarian/hooks/use-slots';

const Card: FC<PropsWithChildren> = ({ children }) => {
  const [Header, Body, Rest] = useSlots(children, ['header', 'body']);

  return (
    <>
      {Body}
      {Header}
      {typeof Rest}
    </>
  );
};

const CardTitle: FC<PropsWithChildren & PropsWithSlot> = ({ children }) => (
  <div>Title</div>
);

export const Page = () => {
  return (
    <div>
      <Card>
        <Slot name="header">
          <div>Header</div>
          <div>Header</div>
        </Slot>
        <Slot name="body">Body</Slot>
        {/* <div>rest</div> */}
        <CardTitle slot="header" />
      </Card>
    </div>
  );
};

export default Page;
