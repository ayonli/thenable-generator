"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
require("source-map-support/register");
const __1 = require("..");
const assert = require("assert");
describe("Create ThenableGeneratorFunction by a GeneratorFunction", () => {
    var gen = __1.default(function* (...args) {
        yield "Hello";
        yield "World";
        return args.length ? args.join(" ") : "Hello, World!";
    });
    it("should create a ThenableGeneratorFunction entry as expected", () => {
        assert.ok(gen instanceof Function);
        assert.ok(gen instanceof __1.ThenableGeneratorFunction);
        assert.ok(gen() instanceof __1.ThenableGenerator);
    });
    it("should await the result as expected", () => tslib_1.__awaiter(this, void 0, void 0, function* () {
        assert.strictEqual(yield gen(), "Hello, World!");
    }));
    it("should pass arguments as expected", () => tslib_1.__awaiter(this, void 0, void 0, function* () {
        assert.strictEqual(yield gen("Hello", "World"), "Hello World");
    }));
    it("should yield values and be traveled in a for...of... loop as expected", () => {
        let values = [];
        for (let item of gen()) {
            values.push(item);
        }
        assert.deepStrictEqual(values, ["Hello", "World"]);
    });
    it("should implement next() method as suggested", () => {
        let iterator = gen();
        let items = [];
        let item;
        while (item = iterator.next("Hello")) {
            items.push(item);
            if (item.done) {
                break;
            }
        }
        assert.deepStrictEqual(items, [
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
        let err;
        try {
            iterator.throw(new Error("Error thrown"));
        }
        catch (e) {
            err = e;
        }
        assert.ok(err instanceof Error);
        assert.strictEqual(err.message, "Error thrown");
        assert.deepStrictEqual(iterator.next(), { value: void 0, done: true });
    });
});
describe("Create ThenableGeneratorFunction by a AsyncGeneratorFunction", () => {
    var gen = __1.default(function (...args) {
        return tslib_1.__asyncGenerator(this, arguments, function* () {
            yield yield tslib_1.__await("Hello");
            yield yield tslib_1.__await("World");
            return yield tslib_1.__await(args.length ? args.join(" ") : "Hello, World!");
        });
    });
    it("should create a ThenableGeneratorFunction entry as expected", () => {
        assert.ok(gen instanceof Function);
        assert.ok(gen instanceof __1.ThenableGeneratorFunction);
        assert.ok(gen() instanceof __1.ThenableAsyncGenerator);
    });
    it("should await the result as expected", () => tslib_1.__awaiter(this, void 0, void 0, function* () {
        assert.strictEqual(yield gen(), "Hello, World!");
    }));
    it("should pass arguments as expected", () => tslib_1.__awaiter(this, void 0, void 0, function* () {
        assert.strictEqual(yield gen("Hello", "World"), "Hello World");
    }));
    it("should yield values and be traveled in a for await...of... loop as expected", () => tslib_1.__awaiter(this, void 0, void 0, function* () {
        var e_1, _a;
        let values = [];
        try {
            for (var _b = tslib_1.__asyncValues(gen()), _c; _c = yield _b.next(), !_c.done;) {
                let item = _c.value;
                values.push(item);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) yield _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
        assert.deepStrictEqual(values, ["Hello", "World"]);
    }));
    it("should implement next() method as suggested", () => tslib_1.__awaiter(this, void 0, void 0, function* () {
        let iterator = gen();
        let items = [];
        let item;
        while (item = iterator.next("Hello")) {
            assert.ok(item instanceof Promise);
            let res = yield item;
            items.push(res);
            if (res.done) {
                break;
            }
        }
        assert.deepStrictEqual(items, [
            { value: "Hello", done: false },
            { value: "World", done: false },
            { value: "Hello, World!", done: true }
        ]);
    }));
    it("should implement return() method as suggested", () => tslib_1.__awaiter(this, void 0, void 0, function* () {
        let iterator = gen();
        let result = iterator.return("Hello");
        assert.ok(result instanceof Promise);
        assert.deepStrictEqual(yield result, { value: "Hello", done: true });
        assert.deepStrictEqual(yield iterator.next(), { value: void 0, done: true });
    }));
    it("should implement throw() method as suggested", () => tslib_1.__awaiter(this, void 0, void 0, function* () {
        let iterator = gen();
        let err;
        try {
            yield iterator.throw(new Error("Error thrown"));
        }
        catch (e) {
            err = e;
        }
        assert.ok(err instanceof Error);
        assert.strictEqual(err.message, "Error thrown");
        assert.deepStrictEqual(yield iterator.next(), { value: void 0, done: true });
    }));
});
describe("Create ThenableGeneratorFunction by an AsyncFunction", () => {
    var gen = __1.default((...args) => tslib_1.__awaiter(this, void 0, void 0, function* () {
        return args.length ? args.join(" ") : "Hello, World!";
    }));
    it("should create a ThenableGeneratorFunction entry as expected", () => {
        assert.ok(gen instanceof Function);
        assert.ok(gen instanceof __1.ThenableGeneratorFunction);
        assert.ok(gen() instanceof __1.ThenableAsyncGenerator);
    });
    it("should await the result as expected", () => tslib_1.__awaiter(this, void 0, void 0, function* () {
        assert.strictEqual(yield gen(), "Hello, World!");
    }));
    it("should pass arguments as expected", () => tslib_1.__awaiter(this, void 0, void 0, function* () {
        assert.strictEqual(yield gen("Hello", "World"), "Hello World");
    }));
    it("should not yield values in a for...of... loop as expected", () => tslib_1.__awaiter(this, void 0, void 0, function* () {
        var e_2, _a;
        let values = [];
        try {
            for (var _b = tslib_1.__asyncValues(gen()), _c; _c = yield _b.next(), !_c.done;) {
                let item = _c.value;
                values.push(item);
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) yield _a.call(_b);
            }
            finally { if (e_2) throw e_2.error; }
        }
        assert.deepStrictEqual(values, []);
    }));
    it("should implement next() method as suggested", () => tslib_1.__awaiter(this, void 0, void 0, function* () {
        let iterator = gen();
        let items = [];
        let item;
        while (item = iterator.next("Hello")) {
            assert.ok(item instanceof Promise);
            let result = yield item;
            items.push(result);
            if (result.done) {
                break;
            }
        }
        assert.deepStrictEqual(items, [
            { value: "Hello, World!", done: true },
        ]);
    }));
    it("should implement return() method as suggested", () => tslib_1.__awaiter(this, void 0, void 0, function* () {
        let iterator = gen();
        let result = yield iterator.return("Hello");
        assert.deepStrictEqual(result, { value: "Hello", done: true });
        assert.deepStrictEqual(yield iterator.next(), { value: void 0, done: true });
    }));
    it("should implement throw() method as suggested", () => tslib_1.__awaiter(this, void 0, void 0, function* () {
        let iterator = gen();
        let err;
        try {
            yield iterator.throw(new Error("Error thrown"));
        }
        catch (e) {
            err = e;
        }
        assert.ok(err instanceof Error);
        assert.strictEqual(err.message, "Error thrown");
        assert.deepStrictEqual(yield iterator.next(), { value: void 0, done: true });
    }));
});
describe("Create ThenableGeneratorFunction by a Function", () => {
    var gen = __1.default((...args) => {
        return args.length ? args.join(" ") : "Hello, World!";
    });
    it("should create a ThenableGeneratorFunction entry as expected", () => {
        assert.ok(gen instanceof Function);
        assert.ok(gen instanceof __1.ThenableGeneratorFunction);
        assert.ok(gen() instanceof __1.ThenableGenerator);
    });
    it("should await the result as expected", () => tslib_1.__awaiter(this, void 0, void 0, function* () {
        assert.strictEqual(yield gen(), "Hello, World!");
    }));
    it("should pass arguments as expected", () => tslib_1.__awaiter(this, void 0, void 0, function* () {
        assert.strictEqual(yield gen("Hello", "World"), "Hello World");
    }));
    it("should yield values and be traveled in a for...of... loop as expected", () => {
        let values = [];
        for (let item of gen()) {
            values.push(item);
        }
        assert.deepStrictEqual(values, []);
    });
    it("should implement next() method as suggested", () => {
        let iterator = gen();
        let items = [];
        let item;
        while (item = iterator.next("Hello")) {
            items.push(item);
            if (item.done) {
                break;
            }
        }
        assert.deepStrictEqual(items, [
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
        let err;
        try {
            iterator.throw(new Error("Error thrown"));
        }
        catch (e) {
            err = e;
        }
        assert.ok(err instanceof Error);
        assert.strictEqual(err.message, "Error thrown");
        assert.deepStrictEqual(iterator.next(), { value: void 0, done: true });
    });
    it("should throw and catch error as expected", () => tslib_1.__awaiter(this, void 0, void 0, function* () {
        let gen = __1.default((errored) => {
            if (errored)
                throw new Error("Error thrown");
            return "Hello, World!";
        });
        let err;
        try {
            yield gen(true);
        }
        catch (e) {
            err = e;
        }
        assert.ok(err instanceof Error);
        assert.strictEqual(err.message, "Error thrown");
        let iterator = gen(true);
        let err2;
        let looped = false;
        try {
            for (let item of iterator) {
                looped = !!item;
            }
        }
        catch (e) {
            err2 = e;
        }
        assert.ok(!looped);
        assert.ok(err2 instanceof Error);
        assert.strictEqual(err2.message, "Error thrown");
        assert.deepStrictEqual(iterator.next(), { value: void 0, done: true });
    }));
});
//# sourceMappingURL=index.js.map