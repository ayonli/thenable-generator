# Thenable Generator

**Create generators implemented the `PromiseLike` interface so that they can**
**be awaited in async contexts.**

This module is meant to pack any function to a `ThenableGeneratorFunction`, so 
that it can be used in both async functions and for (await)...of... loops. 
Depends on the statement, the generator returns/yields different values.

## Example

```typescript
import create from "thenable-generator";

// Or in Deno
import create from "https://deno.land/x/thenable_generator/index.ts";
// Or
import create from "https://github.com/ayonli/thenable-generator/raw/master/index.ts";

var normalFn = create(() => {
    return "Hello, World!";
});

var asyncFn = create(async () => {
    return "Hello, World!";
});

var genFn = create(function* () {
    yield "Hello";
    yield "World";
    return "Hello, World!";
});

var asyncGenFn = create(async function* () {
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
    let iter = genFn();
    for (let item of iter) {
        console.log(item);
    }

    console.log(await iter); // Hello, World!

    // Hello
    // World
    let asyncIter = asyncGenFn();
    for await (let item of asyncIter) {
        console.log(item);
    }

    console.log(await asyncIter); // Hello, World!
})();
```

## Tip

After the iterator has been traveled in a for (await)...of... loop, using `await`
can reach the returning value of the generator, however, if await is called 
before the for (await)...of... loop, that will cause the generator to close 
early and the for block will never be executed.

For full API, please checkout [the source file](./index.ts).
