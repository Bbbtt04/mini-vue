import { describe, expect, test } from "vitest";
import { isReactive, reactive } from "../src/reactivity";

describe('reactive', () => {
    test('happy path', () => {
        const original = { foo: 1 };
        const observed = reactive(original);

        expect(observed).not.toBe(original);
        expect(observed.foo).toBe(1);
    })

    test('nested reactives', () => {
        const original = {
            nested: {
                foo: 1,
            },
            array: [{ bar: 2 }],
        };
        const observed = reactive(original);
        expect(isReactive(observed.nested)).toBe(true);
        expect(isReactive(observed.array)).toBe(true);
        expect(isReactive(observed.array[0])).toBe(true);
    })
})
