import { createDep } from "./dep";

let activeEffect;
const targetMap = new WeakMap();

class ReactiveEffect {
    private _fn: any;

    constructor(fn: any, public scheduler?) {
        this._fn = fn;
    }

    run() {
        activeEffect = this;
        return this._fn();
    }
}

export function effect(fn, options: EffectOptions = {}) {
    const _effect = new ReactiveEffect(fn, options.scheduler);

    _effect.run();

    return _effect.run.bind(_effect);
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
        if (effect.scheduler) {
            effect.scheduler();
        } else {
            effect.run();
        }
    }
}
