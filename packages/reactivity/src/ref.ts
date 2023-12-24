import { isObject } from "../../shared";
import { isTracking, trackEffects, triggerEffects } from "./effect";
import { reactive } from "./reactivity";

export class RefImpl {
  private _value: any;
  private _rawValue: any;
  public dep;
  public __v_isRef: boolean = true;

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

export function isRef(ref) {
  return !!ref["__v_isRef"];
}

export function unRef(ref) {
  return isRef(ref) ? ref.value : ref;
}

export function proxyRefs(objectWithRefs) {
  return new Proxy(objectWithRefs, {
    get(target, key, receiver) {
      // 如果里面是一个 ref 类型的话，那么就返回 .value
      // 如果不是的话，那么直接返回value 就可以了
      return unRef(Reflect.get(target, key, receiver));
    },
    set(target, key, value, receiver) {
      const oldValue = target[key];
      if (isRef(oldValue) && !isRef(value)) {
        return (target[key].value = value);
      } else {
        return Reflect.set(target, key, value, receiver);
      }
    },
  })
}

function createRef(value) {
  const refImpl = new RefImpl(value);

  return refImpl;
}

function convert(value) {
  return isObject(value) ? reactive(value) : value;
}
