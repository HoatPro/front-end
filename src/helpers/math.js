export const customRoundUp = function (n) { // round up to next integer number if decial greater or equal 0.3
    let a = ~~n;
    let decimal = n - a;
    return (decimal >= 0.3 ? a + 1 : a);
};
