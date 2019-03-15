"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

if (!Symbol.asyncIterator) {
    Symbol.asyncIterator = Symbol("Symbol.asyncIterator");
}

const target = exports.target = Symbol("ThenableGenerator.target");
const status = exports.status = Symbol("ThenableGenerator.status");

class ThenableGenerator {
    constructor(target) {
        this[exports.target] = target;
        this[status] = "suspended";
    }

    /**
     * @param {(value: any) => any} onfulfilled 
     * @param {(reason: any) => void} onfulfilled 
     * @returns {Promise<any>}
     */
    then(onfulfilled, onrejected) {
        let res;

        if (!this[target] || this[status] === "closed") {
            res = Promise.resolve();
        } else if (this[target].then) {
            res = this[target];
        } else if (this[target].next) {
            res = processIterator(this[target]);
        } else {
            res = Promise.resolve(this[target]);
        }

        this[status] === "closed";

        return res.then(onfulfilled, onrejected);
    }

    /**
     * @returns {IteratorResult<any>}
     */
    next(value) {
        let res;

        if (!this[target] || this[status] === "closed") {
            res = { value: void 0, done: true };
        } else if (this[target].next) {
            res = this[target].next(value);
        } else if (this[target].then) {
            res = this[target].then(value => ({ value, done: true }));
        } else {
            res = { value: this[target], done: true };
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

        if (this[target] && this[target].return) {
            return this[target].return(value);
        } else if (this[target] && this[target].then) {
            return this[target].then(() => ({ value, done: true }));
        } else {
            return { value, done: true };
        }
    }

    /**
     * @returns {never | Promise<never>}
     */
    throw(err) {
        this[status] = "closed";

        if (this[target] && this[target].throw) {
            return this[target].throw(err);
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

/**
 * @param {Function} fn
 */
ThenableGenerator.create = function create(fn) {
    return function () {
        return new ThenableGenerator(fn.apply(void 0, Array.from(arguments)));
    };
};

exports.default = exports.ThenableGenerator = ThenableGenerator;