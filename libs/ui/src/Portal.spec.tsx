import { render } from '@testing-library/react';

import { Portal } from './Portal';

describe('Widgetarian', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <Portal>
        <div></div>
      </Portal>
    );
    expect(baseElement).toBeTruthy();
  });
});
