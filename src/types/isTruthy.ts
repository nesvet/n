import { Falsy } from "./Falsy.js";


export function isTruthy<T>(value: Falsy | T): value is T {
	return !!value;
}

export { isTruthy as isTruly, isTruthy as isTruely };
