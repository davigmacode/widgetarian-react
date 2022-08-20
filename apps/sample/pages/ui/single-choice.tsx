import { useCallback, useState } from 'react';
import { SingleChoice, SingleChoiceRender } from 'widgetarian/ui';
import { createCss } from 'widgetarian/utils';

const choiceStyle = (checked: boolean) =>
  createCss({
    padding: '5px 7px',
    borderWidth: '2px',
    borderColor: checked ? 'red' : 'black',
    color: checked ? 'red' : 'black',
    transition: 'all .3s ease',
    cursor: 'pointer',
  });

const Choice: SingleChoiceRender = ({ value, select, checked }) => {
  return (
    <div className={choiceStyle(checked)} onClick={select}>
      {value}
    </div>
  );
};

export const Page = () => {
  const [choiceValue, setChoice] = useState('flutter');
  const onChange = useCallback((v) => setChoice(v), [setChoice]);

  return (
    <>
      <div className="flex mt-40 align-center justify-center space-x-3">
        <SingleChoice value={choiceValue} onChange={onChange}>
          <SingleChoice.Option value="flutter" />
          <SingleChoice.Option value="react" />
          <SingleChoice.Option value="vue" />
        </SingleChoice>
      </div>
      <div className="flex mt-10 align-center justify-center space-x-3">
        <SingleChoice value={choiceValue} onChange={onChange} render={Choice}>
          <SingleChoice.Option value="flutter" />
          <SingleChoice.Option value="react" />
          <SingleChoice.Option value="vue" />
        </SingleChoice>
      </div>
      <div className="flex mt-10 align-center justify-center space-x-3">
        {choiceValue}
      </div>
    </>
  );
};

export default Page;
