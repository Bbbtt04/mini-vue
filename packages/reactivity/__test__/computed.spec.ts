import { describe, expect, test, vi } from "vitest";
import { reactive } from "../src/reactivity";
import { computed } from "../src/computed";

describe('computed', () => {
  test('happy path', () => {
    const a = reactive({
      foo: 1
    });

    const getter = computed(() => {
      return a.foo;
    })
    expect(getter.value).toBe(1);

    a.foo = 2;
    expect(getter.value).toBe(2);
  })

  test("should compute lazily", () => {
    const value = reactive({
      foo: 1,
    });
    const getter = vi.fn(() => {
      return value.foo;
    });
    const cValue = computed(getter);

    // lazy
    expect(getter).not.toHaveBeenCalled();

    expect(cValue.value).toBe(1);
    expect(getter).toHaveBeenCalledTimes(1);

    // should not compute again
    cValue.value;
    expect(getter).toHaveBeenCalledTimes(1);

    // should not compute until needed
    value.foo = 2;
    expect(getter).toHaveBeenCalledTimes(1);

    // now it should compute
    expect(cValue.value).toBe(2);
    expect(getter).toHaveBeenCalledTimes(2);

    // should not compute again
    cValue.value;
    expect(getter).toHaveBeenCalledTimes(2);
  });
})
