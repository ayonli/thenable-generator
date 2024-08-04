export declare const source: unique symbol;
export declare const status: unique symbol;
export declare const result: unique symbol;
export interface Catchable<T> {
    catch?<R = never>(onrejected?: (reason: any) => R | PromiseLike<R>): Promise<T | R>;
}
export interface ThenableGeneratorLike<T = unknown, TReturn = any, TNext = unknown> extends PromiseLike<T>, Catchable<T>, Partial<Generator<T, TReturn, TNext>> {
}
export interface ThenableAsyncGeneratorLike<T = unknown, TReturn = any, TNext = unknown> extends PromiseLike<T>, Catchable<T>, Partial<AsyncGenerator<T, TReturn, TNext>> {
}
export type ThenableGeneratorFunction<T = unknown, TReturn = any, TNext = unknown, TArgs extends any[] = any[]> = (...args: TArgs) => ThenableGenerator<T, TReturn, TNext>;
export type ThenableAsyncGeneratorFunction<T = unknown, TReturn = any, TNext = unknown, TArgs extends any[] = any[]> = (...args: TArgs) => ThenableAsyncGenerator<T, TReturn, TNext>;
export interface ThenableGeneratorFunctionConstructor<T = unknown, TReturn = any, TNext = unknown> {
    (fn: Function): ThenableGeneratorFunction<T, TReturn, TNext> | ThenableAsyncGeneratorFunction<T, TReturn, TNext>;
    new (fn: Function): ThenableGeneratorFunction<T, TReturn, TNext> | ThenableAsyncGeneratorFunction<T, TReturn, TNext>;
    /**
     * @deprecated
     */
    create<T = unknown, TReturn = any, TNext = unknown, TArgs extends any[] = any[]>(fn: (...args: TArgs) => AsyncGenerator<T, TReturn, TNext> | AsyncIterable<T> | Promise<T>): ThenableAsyncGeneratorFunction<T, TReturn, TNext, TArgs>;
    /**
     * @deprecated
     */
    create<T = unknown, TReturn = any, TNext = unknown, TArgs extends any[] = any[]>(fn: (...args: TArgs) => Generator<T, TReturn, TNext> | Iterable<T> | T): ThenableGeneratorFunction<T, TReturn, TNext, TArgs>;
}
export declare class Thenable<T = any> implements PromiseLike<T>, Catchable<T> {
    protected [source]: any;
    protected [status]: "suspended" | "closed" | "erred";
    protected [result]: any;
    constructor(_source: any);
    then<R1 = T, R2 = never>(onfulfilled?: ((value: T) => R1 | PromiseLike<R1>) | undefined | null, onrejected?: ((reason: any) => R2 | PromiseLike<R2>) | undefined | null): PromiseLike<R1 | R2>;
    catch<R = never>(onrejected?: (reason: any) => R | PromiseLike<R>): Promise<T | R>;
}
export declare class ThenableGenerator<T = unknown, TReturn = any, TNext = unknown> extends Thenable<T> implements ThenableGeneratorLike<T, TReturn, TNext> {
    next(...args: [] | [TNext]): IteratorResult<T>;
    return(value?: TReturn): IteratorResult<T>;
    throw(err?: any): IteratorResult<T, TReturn> | never;
    [Symbol.iterator](): this;
}
export declare class ThenableAsyncGenerator<T = unknown, TReturn = any, TNext = unknown> extends Thenable<T> implements ThenableAsyncGeneratorLike<T, TReturn, TNext> {
    next(...args: [] | [TNext]): Promise<IteratorResult<T, TReturn>>;
    return(value?: TReturn | PromiseLike<TReturn>): Promise<IteratorResult<T, TReturn>>;
    throw(err?: any): Promise<IteratorResult<T, TReturn> | never>;
    [Symbol.asyncIterator](): this;
}
export declare const ThenableGeneratorFunction: ThenableGeneratorFunctionConstructor;
/**
 * Creates a generator that implements the `PromiseLike` interface so that it can
 * be awaited in async contexts.
 */
export declare function create<T = unknown, TReturn = any, TNext = unknown, TArgs extends any[] = any[]>(fn: (...args: TArgs) => AsyncGenerator<T, TReturn, TNext> | AsyncIterable<T> | Promise<T>): ThenableAsyncGeneratorFunction<T, TReturn, TNext, TArgs>;
export declare function create<T = unknown, TReturn = any, TNext = unknown, TArgs extends any[] = any[]>(fn: (...args: TArgs) => Generator<T, TReturn, TNext> | Iterable<T> | T): ThenableGeneratorFunction<T, TReturn, TNext, TArgs>;
export default create;
