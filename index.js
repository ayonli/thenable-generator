"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

if (!Symbol.asyncIterator) {
    Symbol.asyncIterator = Symbol("Symbol.asyncIterator");
}

const source = exports.source = Symbol("GeneratorSource");
const status = exports.status = Symbol("GeneratorStatus");
const result = exports.result = Symbol("GeneratorResult");

class Thenable {
    constructor(source) {
        this[exports.source] = source;
        this[status] = "suspended";
        this[result] = void 0;
    }

    /**
     * @param {(value: any) => any} onfulfilled 
     * @param {(reason: any) => void} onfulfilled 
     */
    then(onfulfilled, onrejected) {
        /** @type {Promise<any>} */
        let res;

        if (this[source] === undefined || this[status] === "closed") {
            res = Promise.resolve(this[result]);
        } else if (this[status] === "errored") {
            res = Promise.reject(this[source]);
        } else if (typeof this[source].then === "function") {
            res = Promise.resolve(this[source]);
        } else if (typeof this[source].next === "function") {
            res = processIterator(this[source]);
        } else {
            res = Promise.resolve(this[source]);
        }

        this[status] = "closed";

        return res.then(value => {
            return (this[result] = value);
        }).then(onfulfilled, onrejected);
    }
}

class ThenableGenerator extends Thenable {
    next(value) {
        /** @type {IteratorResult<any>} */
        let res;

        if (this[source] === undefined || this[status] === "closed") {
            res = { value: void 0, done: true };
        } else if (this[status] === "errored") {
            return this.throw(this[source]);
        } else if (typeof this[source].next === "function") {
            res = this[source].next(value);
        } else {
            res = { value: this[source], done: true };
        }

        if (res.done === true) {
            this[status] = "closed";
            this[result] = res.value;
        }

        return res;
    }

    /**
     * @returns {IteratorResult<any>}
     */
    return(value) {
        this[status] = "closed";

        if (this[source] && typeof this[source].return === "function") {
            return this[source].return(value);
        } else {
            return { value, done: true };
        }
    }

    /**
     * @returns {never}
     */
    throw(err) {
        this[status] = "closed";

        if (this[source] && typeof this[source].throw === "function") {
            return this[source].throw(err);
        } else {
            throw err;
        }
    }

    [Symbol.iterator]() {
        return this;
    }
}

class ThenableAsyncGenerator extends Thenable {
    next(value) {
        /** @type {Promise<IteratorResult<any>>} */
        let res;

        if (this[source] === undefined || this[status] === "closed") {
            res = Promise.resolve({ value: void 0, done: true });
        } else if (typeof this[source].next === "function") {
            res = Promise.resolve(this[source].next(value));
        } else {
            res = Promise.resolve(this[source]).then(value => {
                return { value, done: true };
            });
        }

        return res.then(res => {
            if (res.done === true) {
                this[status] = "closed";
                this[result] = res.value;
            }

            return res;
        });
    }

    /**
     * @returns {Promise<IteratorResult<any>>}
     */
    return(value) {
        this[status] = "closed";
        this[result] = value;

        if (this[source] && typeof this[source].return === "function") {
            return Promise.resolve(this[source].return(value));
        } else {
            return Promise.resolve({ value, done: true });
        }
    }

    /**
     * @returns {Promise<never>}
     */
    throw(err) {
        this[status] = "closed";

        if (this[source] && typeof this[source].throw === "function") {
            return Promise.resolve(this[source].throw(err));
        } else {
            return Promise.reject(err);
        }
    }

    [Symbol.asyncIterator]() {
        return this;
    }
}

/**
 * @param {Iterator<any> | AsyncIterator<any>} iterator 
 */
function processIterator(iterator) {
    return new Promise((resolve, reject) => {
        function fulfilled(value) {
            try { step(iterator.next(value)); } catch (e) { reject(e); }
        }

        function rejected(value) {
            try { step(iterator.throw(value)); } catch (e) { reject(e); }
        }

        function step(item) {
            Promise.resolve(item).then(result => {
                result.done ? resolve(result.value) : new Promise(resolve => {
                    resolve(result.value);
                }).then(fulfilled, rejected);
            });
        }

        step(iterator.next());
    });
}

/**
 * @param {Function} fn 
 */
function ThenableGeneratorFunction(fn) {
    let self;

    if (this instanceof ThenableGeneratorFunction) {
        self = this;
    } else {
        self = new ThenableGeneratorFunction();
    }

    function anonymous(...args) {
        try {
            let source = fn.apply(this, args);

            if (typeof source.then === "function" ||
                typeof source[Symbol.asyncIterator] === "function") {
                return new ThenableAsyncGenerator(source);
            } else {
                return new ThenableGenerator(source);
            }
        } catch (err) {
            return Object.assign(new ThenableGenerator(err), {
                [status]: "errored"
            });
        }
    }

    // HACK, let the returning function be an instance of
    // ThenableGeneratorFunction.
    anonymous.prototype = ThenableGeneratorFunction;
    anonymous.__proto__ = self;

    return anonymous;
}

Object.setPrototypeOf(ThenableGeneratorFunction, Function);
Object.setPrototypeOf(ThenableGeneratorFunction.prototype, Function.prototype);

/**
 * @param {Function} fn
 */
function create(fn) {
    return new ThenableGeneratorFunction(fn);
}

ThenableGeneratorFunction.create = create;

exports.Thenable = Thenable;
exports.ThenableGenerator = ThenableGenerator;
exports.ThenableAsyncGenerator = ThenableAsyncGenerator;
exports.ThenableGeneratorFunction = ThenableGeneratorFunction;
exports.default = exports.create = create;