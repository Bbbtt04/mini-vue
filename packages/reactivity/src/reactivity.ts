import { mutableHandlers, readonlyHandlers } from "./baseHandlers";

export const reactiveMap = new WeakMap();

export const enum ReactiveFlags {
    IS_REACTIVE = "__v_isReactive",
    IS_READONLY = "__v_isReadonly",
    RAW = "__v_raw",
}

export function reactive(target) {
    return createReactiveObject(target, reactiveMap, mutableHandlers);
}

export function readonly(target) {
    return createReactiveObject(target, reactiveMap, readonlyHandlers);
}

export function isReadonly(value) {
    return !!value[ReactiveFlags.IS_READONLY];
}

export function isReactive(value) {
    return !!value[ReactiveFlags.IS_REACTIVE];
}

function createReactiveObject(target, proxyMap, baseHandlers) {
    const existingProxy = proxyMap.get(target);
    if (existingProxy) {
        return existingProxy;
    }

    const proxy = new Proxy(target, baseHandlers);

    proxyMap.set(target, proxy);

    return proxy;
}
