import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useForm } from '@/hooks/useForm';

describe('useForm Hook', () => {
  it('should initialize with default values', () => {
    const initialValues = { name: '', email: '' };
    const { result } = renderHook(() => useForm(initialValues));

    expect(result.current.values).toEqual(initialValues);
    expect(result.current.errors).toEqual({});
    expect(result.current.touched).toEqual({});
  });

  it('should update values on change', () => {
    const initialValues = { name: '', email: '' };
    const { result } = renderHook(() => useForm(initialValues));

    const event = {
      target: { name: 'name', value: 'John' },
    } as any;

    act(() => {
      result.current.handleChange(event);
    });

    expect(result.current.values.name).toBe('John');
  });

  it('should mark field as touched', () => {
    const initialValues = { name: '', email: '' };
    const { result } = renderHook(() => useForm(initialValues));

    const event = {
      target: { name: 'name' },
    } as any;

    act(() => {
      result.current.handleBlur(event);
    });

    expect(result.current.touched.name).toBe(true);
  });

  it('should reset form', () => {
    const initialValues = { name: '', email: '' };
    const { result } = renderHook(() => useForm(initialValues));

    act(() => {
      result.current.setFieldValue('name', 'John');
    });

    expect(result.current.values.name).toBe('John');

    act(() => {
      result.current.reset();
    });

    expect(result.current.values).toEqual(initialValues);
  });
});
