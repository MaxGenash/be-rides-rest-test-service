/**
 * Returns a floating-point, pseudo-random number between min (inclusive) and max (exclusive)
 */
function getRandomNumber(min, max) {
    return Math.random() * (max - min) + min;
}

module.exports = {
    getRandomNumber,
};
