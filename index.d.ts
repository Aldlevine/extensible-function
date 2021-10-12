declare module 'extensible-function' {
    export default class ExtensibleFunction<
        F extends (...args: never[]) => unknown,
    > extends Function {
        constructor(fn: (...args: Parameters<F>) => ReturnType<F>)
    }
    export default interface ExtensibleFunction<F extends (...args: never[]) => unknown> {
        (...args: Parameters<F>): ReturnType<F>
    }
}
