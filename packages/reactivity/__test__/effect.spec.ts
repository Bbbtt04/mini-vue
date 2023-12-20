import { describe, expect, test, vi } from "vitest";
import { reactive } from "../src/reactivity";
import { effect, stop } from "../src/effect";

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


  test('stop', () => {
    let dummy;
    const obj = reactive({ foo: 1 });
    const runner = effect(() => {
      dummy = obj.foo;
    })
    obj.foo = 2;
    expect(dummy).toBe(2);
    stop(runner);
    obj.foo = 3;
    expect(dummy).toBe(2);

    runner();
    expect(dummy).toBe(3);
  })

  test('events：onStop', () => {
    const onStop = vi.fn();
    const runner = effect(() => { }, {
      onStop,
    });

    stop(runner);
    expect(onStop).toHaveBeenCalled();
  })
})
