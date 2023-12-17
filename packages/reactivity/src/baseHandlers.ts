import { isObject } from "../../shared/src";
import { reactive } from "./reactivity";
import { track, trigger } from "./effect";

const get = createGetter();
const set = createSetter();

function createGetter(isReadonly = false, shallow = false) {
    return function get(target, key, receiver) {
        const res = Reflect.get(target, key, receiver); // TODO learn Reflect

        track(target, key);

        return res;
    }
}

function createSetter() {
    return function set(target, key, value, receiver) {
        const result = Reflect.set(target, key, value, receiver);

        trigger(target, key);

        return result;
    }
}

export const mutableHandlers = {
    get,
    set
}
