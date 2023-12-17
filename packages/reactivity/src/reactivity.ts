import { mutableHandlers } from "./baseHandlers";

export const reactiveMap = new WeakMap();

export function reactive(target) {
    return createReactiveObject(target, reactiveMap, mutableHandlers);
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
