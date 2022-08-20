import { useInput } from 'widgetarian/hooks/use-input';
import { useRadio } from 'widgetarian/hooks/use-radio';
import { useCheckbox } from 'widgetarian/hooks/use-checkbox';

export const Page = () => {
  const [value, bind] = useInput();
  const [rv, rb] = useRadio();
  const [cv, cb] = useCheckbox(['dewey']);

  return (
    <div>
      <input {...bind} />
      <textarea {...bind} />
      <select {...bind}>
        <option value="">Select One …</option>
        <option value="chocolate">Chocolate</option>
        <option value="sardine">Sardine</option>
        <option value="vanilla">Vanilla</option>
      </select>
      <fieldset>
        <legend>Select a maintenance drone:</legend>
        <div>
          <input {...rb('huey')} />
          <label>Huey</label>
        </div>
        <div>
          <input {...rb('dewey')} />
          <label>Dewey</label>
        </div>
        <div>
          <input {...rb('louie')} />
          <label>Louie</label>
        </div>
      </fieldset>
      <fieldset>
        <legend>Select a maintenance drone:</legend>
        <div>
          <input {...cb('huey')} />
          <label>Huey</label>
        </div>
        <div>
          <input {...cb('dewey')} />
          <label>Dewey</label>
        </div>
        <div>
          <input {...cb('louie')} />
          <label>Louie</label>
        </div>
      </fieldset>
      <div>{value}</div>
      <div>{rv}</div>
      <div>{JSON.stringify(cv)}</div>
    </div>
  );
};

export default Page;
