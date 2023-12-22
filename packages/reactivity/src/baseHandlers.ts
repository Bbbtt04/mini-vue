import { isObject } from "../../shared";
import { track, trigger } from "./effect";
import { ReactiveFlags, reactive, readonly } from "./reactivity";

const get = createGetter();
const set = createSetter();

const readonlyGetter = createGetter(true);
const readonlySetter = createSetter(true);

function createGetter(isReadonly = false, shallow = false) {
    return function get(target, key, receiver) {
        if (key === ReactiveFlags.IS_REACTIVE) {
            return !isReadonly;
        } else if (key === ReactiveFlags.IS_READONLY) {
            return isReadonly;
        }

        const res = Reflect.get(target, key, receiver); // TODO learn Reflect

        if (!isReadonly) {
            track(target, key);
        }

        if (isObject(res)) {
            return isReadonly ? readonly(res) : reactive(res);
        }

        return res;
    }
}

function createSetter(isReadonly = false) {
    return function set(target, key, value, receiver) {
        const result = Reflect.set(target, key, value, receiver);

        if (!isReadonly) {
            trigger(target, key);
        }

        if (isReadonly) {
            console.warn(`key:${key} is readonly!!`);
        }

        return result;
    }
}

export const mutableHandlers = {
    get,
    set
}

export const readonlyHandlers = {
    get: readonlyGetter,
    set: readonlySetter
}
