import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useToast } from '@/hooks/useToast';

describe('useToast Hook', () => {
  it('should show success toast', () => {
    const { result } = renderHook(() => useToast());

    act(() => {
      result.current.success('Test message');
    });

    expect(result.current.toasts).toHaveLength(1);
    expect(result.current.toasts[0].type).toBe('success');
    expect(result.current.toasts[0].message).toBe('Test message');
  });

  it('should show error toast', () => {
    const { result } = renderHook(() => useToast());

    act(() => {
      result.current.error('Error message');
    });

    expect(result.current.toasts).toHaveLength(1);
    expect(result.current.toasts[0].type).toBe('error');
  });

  it('should remove toast', () => {
    const { result } = renderHook(() => useToast());

    act(() => {
      result.current.success('Message');
    });

    const toastId = result.current.toasts[0].id;

    act(() => {
      result.current.remove(toastId);
    });

    expect(result.current.toasts).toHaveLength(0);
  });
});
