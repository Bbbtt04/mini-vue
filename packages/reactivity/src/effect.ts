import { extend } from "../../shared";
import { createDep } from "./dep";

let activeEffect;
const targetMap = new WeakMap();

class ReactiveEffect {
    private _fn: any;
    deps = [];
    active = true;
    onStop?: () => void;

    constructor(fn: any, public scheduler?) {
        this._fn = fn;
    }

    run() {
        activeEffect = this;
        return this._fn();
    }

    stop() {
        if (this.active) {
            cleanupEffect(this);

            if (this.onStop) {
                this.onStop();
            }

            this.active = false;
        }
    }
}

function cleanupEffect(effect) {
    effect.deps.forEach((dep) => {
        dep.delete(effect);
    })

    effect.deps.length = 0;
}

export function effect(fn, options: EffectOptions = {}) {
    const _effect = new ReactiveEffect(fn, options.scheduler);
    extend(_effect, options);

    _effect.run();

    const runnner: any = _effect.run.bind(_effect);
    runnner.effect = _effect;

    return runnner;
}

export function track(target, key) {
    let depsMap = targetMap.get(target);
    if (!depsMap) {
        targetMap.set(target, depsMap = new Map());
    }

    let dep = depsMap.get(key);
    if (!dep) {
        depsMap.set(key, dep = createDep());
    }

    if (!activeEffect) return;

    dep.add(activeEffect);
    activeEffect.deps.push(dep);
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

export function stop(runner: any) {
    runner.effect.stop();
}
