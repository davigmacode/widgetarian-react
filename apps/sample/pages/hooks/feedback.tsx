import { useFeedback } from 'widgetarian/hooks/use-feedback';

export const Page = () => {
  const [ref, state] = useFeedback<HTMLDivElement>();

  return (
    <div>
      <div ref={ref}>feedback</div>
      {/* <input ref={ref}/> */}
      <div>{JSON.stringify(state)}</div>
    </div>
  );
};

export default Page;
