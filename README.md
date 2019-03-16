# ThenableGenerator

**Create generators implemented the `PromiseLike` interface so that they can**
**be awaited in async contexts.**

This module is meat to pack any function to a `ThenableGenerator`, so that it 
can be used in both async functions and for (await)...of... loops. Depends on
the statement, the generator returns/yields different values.

## Example

```typescript
import ThenableGenerator from "thenable-generator";

var normalFn = ThenableGenerator.create(() => {
    return "Hello, World!";
});

var asyncFn = ThenableGenerator.create(async () => {
    return "Hello, World!";
});

var genFn = ThenableGenerator.create(function* () {
    yield "Hello";
    yield "World";
    return "Hello, World!";
});

var asyncGenFn = ThenableGenerator.create(async function* () {
    yield "Hello";
    yield "World";
    return "Hello, World!";
});

(async () => {
    // Hello, World
    console.log(await normalFn());
    console.log(await asyncFn());
    console.log(await genFn());
    console.log(await asyncGenFn());

    // Hello
    // World
    for (let item of genFn()) {
        console.log(item);
    }

    // Hello
    // World
    for await (let item of asyncGenFn()) {
        console.log(item);
    }
})();
```

For full API, please checkout [Declarations](./index.d.ts).