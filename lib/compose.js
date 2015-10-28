
'use strict';

module.exports = compose;

function compose (list) {
    return async function (...args) {
        var i = list.length;
        var next = args[args.length-1] = Promise.resolve();
        var current;

        while (i--) {
            current = wrap(list[i], ...args);
            next = args[args.length-1] = current;
        }

        await next();
    };
}

function wrap (fn, ...args) {
    return async function () {
        await fn(...args);
    };
}
