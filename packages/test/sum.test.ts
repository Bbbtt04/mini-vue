import {expect, test} from "vitest";
import {sum} from "./sum";

test('test vitest is normal work', () => {
    expect(sum(1,2)).toBe(3);
})
