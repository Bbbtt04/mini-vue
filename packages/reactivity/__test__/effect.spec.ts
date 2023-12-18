import { describe, expect, test, vi } from "vitest";
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

  test('effect change && clean up', () => {
    const data = { ok: true, text: 'Hello world' };
    const obj = reactive(data);

    let innerHtml;
    effect(() => {
      innerHtml = obj.ok ? obj.text : 'not';
    })

    obj.ok = false;
    expect(innerHtml).toBe('not');
  })

  test('effect return runner', () => {
    let foo = 10;

    const runner = effect(() => {
      foo++;
      return "foo";
    })

    expect(foo).toBe(11);
    const r = runner();
    expect(foo).toBe(12);
    expect(r).toBe('foo');
  })

  test('scheduler', () => {
    let dummy;
    let run: any;
    const scheduler = vi.fn(() => {
      run = runner;
    });
    const obj = reactive({ foo: 1 });
    const runner = effect(
      () => {
        dummy = obj.foo;
      },
      { scheduler }
    );
    expect(scheduler).not.toHaveBeenCalled();
    expect(dummy).toBe(1);
    // should be called on first trigger
    obj.foo++;
    expect(scheduler).toHaveBeenCalledTimes(1);
    // should not run yet
    expect(dummy).toBe(1);
    // manually run
    run();
    // should have run
    expect(dummy).toBe(2);
  })
})