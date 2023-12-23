import { describe, expect, test } from "vitest";
import { ref } from "../src/ref";
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
})
