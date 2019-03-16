export declare const source: unique symbol;
export declare const status: unique symbol;

export declare abstract class Thenable<T = any> implements PromiseLike<T> {
    protected [source]: any;
    protected [status]: "suspended" | "closed" | "errored";

    then<R1 = T, R2 = never>(
        onfulfilled?: (value: T) => R1 | PromiseLike<R1> | void,
        onrejected?: (reason: any) => R2 | PromiseLike<R2> | void
    ): PromiseLike<R1 | R2>;
}

export declare class ThenableGenerator<T = any> extends Thenable<T> implements IterableIterator<T> {
    next(value?: T): IteratorResult<T>;
    return(value?: T): IteratorResult<T>;
    throw(err?: any): never;
    [Symbol.iterator](): this;
}

export declare class ThenableAsyncGenerator<T = any> extends Thenable<T> implements AsyncIterableIterator<T> {
    next(value?: T): Promise<IteratorResult<T>>;
    return(value?: T): Promise<IteratorResult<T>>;
    throw(err?: any): Promise<never>;
    [Symbol.asyncIterator](): this;
}

export declare abstract class ThenableGeneratorFunction extends Function { }

export declare type iThenableGeneratorFunction<T> = ThenableGeneratorFunction & ((...args: any[]) => ThenableGenerator<T>);

export declare type iThenableAsyncGeneratorFunction<T> = ThenableGeneratorFunction & ((...args: any[]) => ThenableAsyncGenerator<T>);

export declare namespace ThenableGeneratorFunction {
    function create<T = any>(
        fn: (...args: any[]) => AsyncIterable<T> | Promise<T>
    ): iThenableAsyncGeneratorFunction<T>;

    function create<T = any>(
        fn: (...args: any[]) => T | Iterable<T>
    ): iThenableGeneratorFunction<T>;
}

export declare function create<T = any>(
    fn: (...args: any[]) => AsyncIterable<T> | Promise<T>
): iThenableAsyncGeneratorFunction<T>;

export declare function create<T = any>(
    fn: (...args: any[]) => T | Iterable<T>
): iThenableGeneratorFunction<T>;

export default create;