export declare const target: symbol;
export declare const status: symbol;

export declare interface Thenable<T = any> extends PromiseLike<T> {
    then<R1 = T, R2 = never>(
        onfulfilled?: (value: T) => R1 | PromiseLike<R1> | void,
        onrejected?: (reason: any) => R2 | PromiseLike<R2> | void
    ): PromiseLike<R1 | R2>;
}

export declare abstract class ThenableGenerator<T = any> { }

export declare interface ThenableGenerator<T = any> extends Thenable<T>, Iterator<T> {
    next(value?: T): IteratorResult<T>;
    return(value?: T): IteratorResult<T>;
    throw(err?: any): never;
    [Symbol.iterator](): this;
}

export declare interface ThenableAsyncGenerator<T = any> extends Thenable<T>, AsyncIterator<T> {
    next(value?: T): Promise<IteratorResult<T>>;
    return(value?: T): Promise<IteratorResult<T>>;
    throw(err?: any): Promise<never>;
    [Symbol.asyncIterator](): this;
}

export declare namespace ThenableGenerator {
    function create<T = any>(
        fn: (...args: any[]) => AsyncIterable<T> | Promise<T>
    ): (...args: any[]) => ThenableAsyncGenerator<T>;

    function create<T = any>(
        fn: (...args: any[]) => T | Iterable<T>
    ): (...args: any[]) => ThenableGenerator<T>;
}

export default ThenableGenerator;