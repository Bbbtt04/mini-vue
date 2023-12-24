import { describe, expect, test } from "vitest";
import { isRef, ref, unRef } from "../src/ref";
import { effect } from "../src/effect";

describe('ref', () => {
  test('happy path', () => {
    const a = ref(1);
    expect(a.value).toBe(1);

    let dummy;
    effect(() => {
      dummy = a.value;
    })
    expect(dummy).toBe(1);
    a.value = 3;
    expect(a.value).toBe(3);
    expect(dummy).toBe(3);
  })

  test("should make nested properties reactive", () => {
    const a = ref({
      count: 1,
    });
    let dummy;
    effect(() => {
      dummy = a.value.count;
    });
    expect(dummy).toBe(1);
    a.value.count = 2;
    expect(dummy).toBe(2);
  });

  test('isRef', () => {
    const a = ref(1);
    expect(isRef(a)).toBe(true);
    expect(isRef(1)).toBe(false);
  });

  test('unRef', () => {
    const a = ref(1);
    expect(unRef(a)).toBe(1);
    expect(unRef(1)).toBe(1);
  })
})
