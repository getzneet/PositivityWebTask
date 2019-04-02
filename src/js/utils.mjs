/**
 * Shuffles array in place.
 * @param a items An array containing the items.
 */
function shuffle(a) {
    let j, x;
    for (let i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
}

// simple range function
function range(start, stop, step) {
    var a = [start], b = start;
    while (b < stop) {
        a.push(b += step || 1);
    }
    return a;
}

/**
 * Asserts a condition
 * @param condition
 * @param message
 */
function assert(condition, message) {
    if (!condition) {
        message = message || "Assertion failed";
        if (typeof Error !== "undefined") {
            throw new Error(message);
        }
        throw message; // Fallback
    }
}

/* ------------------------------------------------------------------------------------- */
const sum = arr => arr.reduce((a,b) => a + b, 0);

export {sum, assert, range, shuffle};

