import { useCallback, useState } from 'react';
import {
  MultiChoice,
  MultiChoiceRender,
} from 'widgetarian-react-ui';
import { createCss } from 'widgetarian-react-utils';

const choiceStyle = (checked: boolean) =>
  createCss({
    padding: '5px 7px',
    borderWidth: '2px',
    borderColor: checked ? 'red' : 'black',
    color: checked ? 'red' : 'black',
    transition: 'all .3s ease',
    cursor: 'pointer',
  });

const Choice: MultiChoiceRender = ({ value, select, checked }) => {
  return (
    <div className={choiceStyle(checked)} onClick={() => select(!checked)}>
      {value}
    </div>
  );
};

export const Page = () => {
  const [choiceValue, setChoice] = useState(['flutter']);
  const onChange = useCallback((v) => setChoice(v), [setChoice]);

  return (
    <>
      <div className="flex mt-40 align-center justify-center space-x-3">
        <MultiChoice value={choiceValue} onChange={onChange}>
          <MultiChoice.Option value="flutter" />
          <MultiChoice.Option value="react" />
          <MultiChoice.Option value="vue" />
        </MultiChoice>
      </div>
      <div className="flex mt-10 align-center justify-center space-x-3">
        <MultiChoice value={choiceValue} onChange={onChange} render={Choice}>
          <MultiChoice.Option value="flutter" />
          <MultiChoice.Option value="react" />
          <MultiChoice.Option value="vue" />
        </MultiChoice>
      </div>
      <div className="flex mt-10 align-center justify-center space-x-3">
        {JSON.stringify(choiceValue)}
      </div>
    </>
  );
};

export default Page;
