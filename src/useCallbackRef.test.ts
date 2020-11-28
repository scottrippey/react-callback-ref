import { renderHook } from '@testing-library/react-hooks';
import { useCallbackRef } from './useCallbackRef';

describe('useCallbackRef', () => {
  it('is a function', () => {
    expect(typeof useCallbackRef).toBe('function')
  });
})
