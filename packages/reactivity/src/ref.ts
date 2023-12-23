import { isObject } from "../../shared";
import { isTracking, trackEffects, triggerEffects } from "./effect";
import { reactive } from "./reactivity";

export class RefImpl {
  private _value: any;
  private _rawValue: any;
  public dep;

  constructor(value) {
    this._rawValue = value;
    this._value = convert(value);
    this.dep = new Set();
  }

  get value() {
    if (isTracking()) {
      trackEffects(this.dep);
    }
    return this._value;
  }

  set value(newValue) {
    // 相同的值不做任何处理
    if (Object.is(newValue, this._rawValue)) return;

    this._value = convert(newValue);
    triggerEffects(this.dep);
  }
}

export function ref(value) {
  return createRef(value);
}

function createRef(value) {
  const refImpl = new RefImpl(value);

  return refImpl;
}

function convert(value) {
  return isObject(value) ? reactive(value) : value;
}
