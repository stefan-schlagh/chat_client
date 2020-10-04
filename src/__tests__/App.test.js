import React from 'react';
import { render,getNodeText } from '@testing-library/react';
import App from '../App';
import LocalStorageMock from '../test/localStorageMock';

test('test chat app', async () => {

  global.console = {
    warn: jest.fn(),
    log: jest.fn()
  }

  const { container,getByText }  = render(<App />);

  expect(localStorage.length).toBe(0);

  jest.runAllTimers();

});
