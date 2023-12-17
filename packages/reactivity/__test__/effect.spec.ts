import { describe, expect, test } from "vitest";
import { reactive } from "../src/reactivity";
import { effect } from "../src/effect";

describe('effect', () => {
  test('happy path', () => {
    const user = reactive({
      age: 18,
    })

    let nextAge;
    effect(() => {
      nextAge = user.age;
    })

    expect(nextAge).toBe(18);
    user.age++;
    expect(nextAge).toBe(19);
  })
})
