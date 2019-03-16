"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

if (!Symbol.asyncIterator) {
    Symbol.asyncIterator = Symbol("Symbol.asyncIterator");
}

const source = exports.source = Symbol("ThenableGenerator.source");
const status = exports.status = Symbol("ThenableGenerator.status");
const GeneratorFunction = (function* () { }).constructor;

class ThenableIterator {
    constructor(source) {
        this[exports.source] = source;
        this[status] = "suspended";
    }

    /**
     * @param {(value: any) => any} onfulfilled 
     * @param {(reason: any) => void} onfulfilled 
     * @returns {Promise<any>}
     */
    then(onfulfilled, onrejected) {
        let res;

        if (!this[source] || this[status] === "closed") {
            res = Promise.resolve();
        } else if (this[status] === "errored") {
            res = Promise.reject(this[source]);
        } else if (typeof this[source].then === "function") {
            res = this[source];
        } else if (typeof this[source].next === "function") {
            res = processIterator(this[source]);
        } else {
            res = Promise.resolve(this[source]);
        }

        this[status] === "closed";

        return res.then(onfulfilled, onrejected);
    }

    /**
     * @returns {IteratorResult<any>}
     */
    next(value) {
        let res;

        if (!this[source] || this[status] === "closed") {
            res = { value: void 0, done: true };
        } else if (this[status] === "errored") {
            return this.throw(this[source]);
        } else if (typeof this[source].next === "function") {
            res = this[source].next(value);
        } else if (typeof this[source].then === "function") {
            res = this[source].then(value => ({ value, done: true }));
        } else {
            res = { value: this[source], done: true };
        }

        if (res.done === true) {
            this[status] === "closed";
        }

        return res;
    }

    /**
     * @returns {IteratorResult<any> | Promise<IteratorResult<any>>}
     */
    return(value) {
        this[status] = "closed";

        if (this[source] && typeof this[source].return === "function") {
            return this[source].return(value);
        } else if (this[source] && typeof this[source].then === "function") {
            return this[source].then(() => ({ value, done: true }));
        } else {
            return { value, done: true };
        }
    }

    /**
     * @returns {never | Promise<never>}
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

    [Symbol.asyncIterator]() {
        return this[Symbol.iterator]();
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

function ThenableGenerator() {
    let self;

    if (this instanceof ThenableGenerator) {
        self = this;
    } else {
        self = new ThenableGenerator();
    }

    let args = Array.from(arguments);
    let fn = typeof args[0] === "function"
        ? args[0]
        : GeneratorFunction.apply(void 0, args);

    function anonymous() {
        try {
            return new ThenableIterator(fn.apply(void 0, Array.from(arguments)));
        } catch (err) {
            return Object.assign(new ThenableIterator(err), {
                [status]: "errored"
            });
        }
    };

    // HACK, let the returning function be an instance of the ThenableGenerator.
    anonymous.prototype = ThenableGenerator;
    anonymous.__proto__ = self;

    return anonymous;
}

ThenableGenerator.create = function create() {
    return ThenableGenerator.apply(void 0, Array.from(arguments));
};

exports.ThenableIterator = ThenableIterator;
exports.default = exports.ThenableGenerator = ThenableGenerator;