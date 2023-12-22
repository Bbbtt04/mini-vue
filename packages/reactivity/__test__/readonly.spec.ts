import { describe, expect, test, vi } from "vitest";
import { readonly } from "../src/reactivity";

describe('readonly', () => {
  test('happy path', () => {
    const original = { foo: 1 };
    const wrapper = readonly(original);
    expect(wrapper).not.toBe(original);
    expect(wrapper.foo).toBe(1);
  })

  test('warn then call set', () => {
    console.warn = vi.fn();

    const user = readonly({age: 20});
    user.age = 21;

    expect(console.warn).toBeCalled();
  })
})
