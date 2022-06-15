/* eslint-disable import/prefer-default-export */

/**
 * Returns a floating-point, pseudo-random number between min (inclusive) and max (exclusive)
 */
export function getRandomNumber(min: number, max: number): number {
    return Math.random() * (max - min) + min;
}
