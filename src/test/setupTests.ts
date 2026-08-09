import '@testing-library/jest-dom';
import 'whatwg-fetch';

import { afterEach, beforeEach, jest } from '@jest/globals';
import { cleanup } from '@testing-library/react';
import { TextDecoder, TextEncoder } from 'node:util';

import { fetchMock } from '@/test/mocks/fetchMock';

Object.defineProperty(globalThis, 'TextEncoder', {
  configurable: true,
  value: TextEncoder,
  writable: true,
});

Object.defineProperty(globalThis, 'TextDecoder', {
  configurable: true,
  value: TextDecoder,
  writable: true,
});

Object.defineProperty(globalThis, 'fetch', {
  configurable: true,
  value: fetchMock,
  writable: true,
});

Object.defineProperty(globalThis, 'scrollTo', {
  configurable: true,
  value: jest.fn(),
  writable: true,
});

Object.defineProperty(globalThis, 'matchMedia', {
  configurable: true,
  value: jest.fn<(query: string) => MediaQueryList>().mockImplementation(
    (query) =>
      ({
        addEventListener: jest.fn(),
        addListener: jest.fn(),
        dispatchEvent: jest.fn(() => false),
        matches: false,
        media: query,
        onchange: null,
        removeEventListener: jest.fn(),
        removeListener: jest.fn(),
      }) as MediaQueryList,
  ),
  writable: true,
});

beforeEach(() => {
  fetchMock.mockReset();
  globalThis.localStorage.clear();
});

afterEach(() => {
  cleanup();
});
