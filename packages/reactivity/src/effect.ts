import { createDep } from "./dep";

let activeEffect;
const targetMap = new WeakMap();

class ReactiveEffect {
    private _fn: any;

    constructor(fn: any) {
        this._fn = fn;
    }

    run() {
        activeEffect = this;
        this._fn();
    }
}

export function effect(fn) {
    const _effect = new ReactiveEffect(fn);

    _effect.run();
}

export function track(target, key) {
    let depsMap = targetMap.get(target);
    if (!depsMap) {
        targetMap.set(target, depsMap = new Map());
    }

    let deps = depsMap.get(key);
    if (!deps) {
        depsMap.set(key, deps = createDep());
    }

    deps.add(activeEffect);
}

export function trigger(target, key) {
    const depsMap = targetMap.get(target);

    if (!depsMap) return;

    const dep = depsMap.get(key);

    for (const effect of dep) {
        effect.run();
    }
}
