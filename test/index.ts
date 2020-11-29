import "source-map-support/register";
import create, {
    ThenableGenerator,
    ThenableAsyncGenerator,
    ThenableGeneratorFunction,
} from "..";
import * as assert from "assert";
import * as check from "check-iterable";

describe("Create ThenableGeneratorFunction by a GeneratorFunction", () => {
    var gen = create(function* (...args: string[]) {
        yield "Hello";
        yield "World";
        return args.length ? args.join(" ") : "Hello, World!";
    });

    it("should create a ThenableGeneratorFunction entry as expected", () => {
        assert.ok(gen instanceof Function);
        assert.ok(gen instanceof ThenableGeneratorFunction);
        assert.ok(gen() instanceof ThenableGenerator);
        assert.ok(check.isGenerator(gen()));
    });

    it("should await the result as expected", async () => {
        assert.strictEqual(await gen(), "Hello, World!");
    });

    it("should pass arguments as expected", async () => {
        assert.strictEqual(await gen("Hello", "World"), "Hello World");
    });

    it("should yield values and be traveled in a for...of... loop as expected", async () => {
        let values = [];
        let iter = gen();

        for (let item of iter) {
            values.push(item);
        }

        assert.deepStrictEqual(values, ["Hello", "World"]);
        assert.strictEqual(await iter, "Hello, World!");
    });

    it("should implement next() method as suggested", () => {
        let iterator = gen();
        let items: IteratorResult<string>[] = [];
        let item: IteratorResult<string>;

        // Passing value to the next() method should have no effect.
        while (item = iterator.next("Hello")) {
            items.push(item);

            if (item.done) {
                break;
            }
        }

        assert.deepStrictEqual(items, <IteratorResult<string>[]>[
            { value: "Hello", done: false },
            { value: "World", done: false },
            { value: "Hello, World!", done: true }
        ]);
    });

    it("should implement return() method as suggested", () => {
        let iterator = gen();
        let result = iterator.return("Hello");

        assert.deepStrictEqual(result, { value: "Hello", done: true });
        assert.deepStrictEqual(iterator.next(), { value: void 0, done: true });
    });

    it("should implement throw() method as suggested", () => {
        let iterator = gen();
        let err: Error;

        try {
            iterator.throw(new Error("Error thrown"));
        } catch (e) {
            err = e;
        }

        assert.ok(err instanceof Error);
        assert.strictEqual(err.message, "Error thrown");
        assert.deepStrictEqual(iterator.next(), { value: void 0, done: true });
    });
});

describe("Create ThenableGeneratorFunction by a AsyncGeneratorFunction", () => {
    var gen = create(async function* (...args: string[]) {
        yield "Hello";
        yield "World";
        return args.length ? args.join(" ") : "Hello, World!";
    });

    it("should create a ThenableGeneratorFunction entry as expected", () => {
        assert.ok(gen instanceof Function);
        assert.ok(gen instanceof ThenableGeneratorFunction);
        assert.ok(gen() instanceof ThenableAsyncGenerator);
        assert.ok(check.isAsyncGenerator(gen()));
    });

    it("should await the result as expected", async () => {
        assert.strictEqual(await gen(), "Hello, World!");
    });

    it("should pass arguments as expected", async () => {
        assert.strictEqual(await gen("Hello", "World"), "Hello World");
    });

    it("should yield values and be traveled in a for await...of... loop as expected", async () => {
        let values = [];
        let iter = gen();

        for await (let item of iter) {
            values.push(item);
        }

        assert.deepStrictEqual(values, ["Hello", "World"]);
        assert.strictEqual(await iter, "Hello, World!");
    });

    it("should implement next() method as suggested", async () => {
        let iterator = gen();
        let items: IteratorResult<string>[] = [];
        let item: Promise<IteratorResult<string>>;

        // Passing value to the next() method should have no effect.
        while (item = iterator.next(<any>"Hello")) {
            assert.ok(item instanceof Promise);

            let res = await item;
            items.push(res);

            if (res.done) {
                break;
            }
        }

        assert.deepStrictEqual(items, <IteratorResult<string>[]>[
            { value: "Hello", done: false },
            { value: "World", done: false },
            { value: "Hello, World!", done: true }
        ]);
    });

    it("should implement return() method as suggested", async () => {
        let iterator = gen();
        let result = iterator.return("Hello");

        assert.ok(result instanceof Promise);
        assert.deepStrictEqual(await result, { value: "Hello", done: true });
        assert.deepStrictEqual(await iterator.next(), { value: void 0, done: true });
    });

    it("should implement throw() method as suggested", async () => {
        let iterator = gen();
        let err: Error;

        try {
            await iterator.throw(new Error("Error thrown"));
        } catch (e) {
            err = e;
        }

        assert.ok(err instanceof Error);
        assert.strictEqual(err.message, "Error thrown");
        assert.deepStrictEqual(await iterator.next(), { value: void 0, done: true });
    });
});

describe("Create ThenableGeneratorFunction by an AsyncFunction", () => {
    var gen = create(async (...args: any[]) => {
        return args.length ? args.join(" ") : "Hello, World!";
    });

    it("should create a ThenableGeneratorFunction entry as expected", () => {
        assert.ok(gen instanceof Function);
        assert.ok(gen instanceof ThenableGeneratorFunction);
        assert.ok(gen() instanceof ThenableAsyncGenerator);
        assert.ok(check.isAsyncGenerator(gen()));
    });

    it("should await the result as expected", async () => {
        assert.strictEqual(await gen(), "Hello, World!");
    });

    it("should pass arguments as expected", async () => {
        assert.strictEqual(await gen("Hello", "World"), "Hello World");
    });

    it("should not yield values in a for...of... loop as expected", async () => {
        let values = [];
        let iter = gen();

        for await (let item of iter) {
            values.push(item);
        }

        assert.deepStrictEqual(values, []);
        assert.strictEqual(await iter, "Hello, World!");
    });

    it("should implement next() method as suggested", async () => {
        let iterator = gen();
        let items: IteratorResult<string>[] = [];
        let item: Promise<IteratorResult<string>>;

        // Passing value to the next() method should have no effect.
        while (item = iterator.next("Hello")) {
            assert.ok(item instanceof Promise);

            let result = await item;
            items.push(result);

            if (result.done) {
                break;
            }
        }

        assert.deepStrictEqual(items, <IteratorResult<string>[]>[
            { value: "Hello, World!", done: true },
        ]);
    });

    it("should implement return() method as suggested", async () => {
        let iterator = gen();
        let result = await iterator.return("Hello");

        assert.deepStrictEqual(result, { value: "Hello", done: true });
        assert.deepStrictEqual(await iterator.next(), { value: void 0, done: true });
    });

    it("should implement throw() method as suggested", async () => {
        let iterator = gen();
        let err: Error;

        try {
            await iterator.throw(new Error("Error thrown"));
        } catch (e) {
            err = e;
        }

        assert.ok(err instanceof Error);
        assert.strictEqual(err.message, "Error thrown");
        assert.deepStrictEqual(await iterator.next(), { value: void 0, done: true });
    });
});

describe("Create ThenableGeneratorFunction by a Function", () => {
    var gen = create((...args: any[]) => {
        return args.length ? args.join(" ") : "Hello, World!";
    });

    it("should create a ThenableGeneratorFunction entry as expected", () => {
        assert.ok(gen instanceof Function);
        assert.ok(gen instanceof ThenableGeneratorFunction);
        assert.ok(gen() instanceof ThenableGenerator);
        assert.ok(check.isGenerator(gen()));
    });

    it("should await the result as expected", async () => {
        assert.strictEqual(await gen(), "Hello, World!");
    });

    it("should pass arguments as expected", async () => {
        assert.strictEqual(await gen("Hello", "World"), "Hello World");
    });

    it("should yield values and be traveled in a for...of... loop as expected", async () => {
        let values = [];
        let iter = gen();

        for (let item of iter) {
            values.push(item);
        }

        assert.deepStrictEqual(values, []);
        assert.strictEqual(await iter, "Hello, World!");
    });

    it("should implement next() method as suggested", () => {
        let iterator = gen();
        let items: IteratorResult<string>[] = [];
        let item: IteratorResult<string>;

        // Passing value to the next() method should have no effect.
        while (item = iterator.next("Hello")) {
            items.push(item);

            if (item.done) {
                break;
            }
        }

        assert.deepStrictEqual(items, <IteratorResult<string>[]>[
            { value: "Hello, World!", done: true }
        ]);
    });

    it("should implement return() method as suggested", () => {
        let iterator = gen();
        let result = iterator.return("Hello");

        assert.deepStrictEqual(result, { value: "Hello", done: true });
        assert.deepStrictEqual(iterator.next(), { value: void 0, done: true });
    });

    it("should implement throw() method as suggested", () => {
        let iterator = gen();
        let err: Error;

        try {
            iterator.throw(new Error("Error thrown"));
        } catch (e) {
            err = e;
        }

        assert.ok(err instanceof Error);
        assert.strictEqual(err.message, "Error thrown");
        assert.deepStrictEqual(iterator.next(), { value: void 0, done: true });
    });

    it("should throw and catch error as expected", async () => {
        let gen = create((erred) => {

            if (erred)
                throw new Error("Error thrown");

            return "Hello, World!";
        });

        let err: Error;

        try {
            await gen(true);
        } catch (e) {
            err = e;
        }

        assert.ok(err instanceof Error);
        assert.strictEqual(err.message, "Error thrown");

        let iterator = gen(true);
        let err2: Error;
        let looped = false;

        try {
            for (let item of iterator) {
                looped = !!item;
            }
        } catch (e) {
            err2 = e;
        }

        assert.ok(!looped);
        assert.ok(err2 instanceof Error);
        assert.strictEqual(err2.message, "Error thrown");
        assert.deepStrictEqual(iterator.next(), { value: void 0, done: true });

        let err3: Error = await gen(true).catch(err => err);
        assert.ok(err3 instanceof Error);
        assert.strictEqual(err3.message, "Error thrown");
    });
});
