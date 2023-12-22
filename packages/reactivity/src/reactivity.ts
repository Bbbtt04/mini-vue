import { mutableHandlers, readonlyHandlers } from "./baseHandlers";

export const reactiveMap = new WeakMap();

export function reactive(target) {
    return createReactiveObject(target, reactiveMap, mutableHandlers);
}

export function readonly(target) {
    return createReactiveObject(target, reactiveMap, readonlyHandlers);
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
