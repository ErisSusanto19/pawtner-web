import { renderHook, act } from '@testing-library/react';
import { useDebounce } from './useDebounce';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

describe('useDebounce', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should return the initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('initial', 500));
    expect(result.current).toBe('initial');
  });

  it('should not update the value before the delay', () => {
    const { result, rerender } = renderHook(({ value, delay }) => useDebounce(value, delay), {
      initialProps: { value: 'first', delay: 500 }
    });

    expect(result.current).toBe('first');

    rerender({ value: 'second', delay: 500 });

    expect(result.current).toBe('first');

    act(() => {
      vi.advanceTimersByTime(499);
    });

    expect(result.current).toBe('first');
  });

  it('should update the value after the delay', () => {
    const { result, rerender } = renderHook(({ value, delay }) => useDebounce(value, delay), {
      initialProps: { value: 'first', delay: 500 }
    });

    rerender({ value: 'second', delay: 500 });

    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(result.current).toBe('second');
  });

  it('should reset the timer if the value changes again', () => {
    const { result, rerender } = renderHook(({ value, delay }) => useDebounce(value, delay), {
      initialProps: { value: 'first', delay: 500 }
    });

    rerender({ value: 'second', delay: 500 });

    act(() => {
      vi.advanceTimersByTime(200);
    });

    rerender({ value: 'third', delay: 500 });
    expect(result.current).toBe('first'); // Should still be the original debounced value

    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(result.current).toBe('third');
  });
});
