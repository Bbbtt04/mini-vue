import { ReactiveEffect, triggerEffects } from "./effect";

class ComputedRefImpl {
  private _effectFn: any;
  private _dirty;
  private _value;

  constructor(getter) {
    this._dirty = true;
    this._effectFn = new ReactiveEffect(getter, () => {
      if (this._dirty) return;

      this._dirty = true;
    });
  }

  get value() {
    if (this._dirty) {
      this._dirty = false;
      this._value = this._effectFn.run();
    }

    return this._value;
  }
}


export function computed(getter) {
  return new ComputedRefImpl(getter)
}
