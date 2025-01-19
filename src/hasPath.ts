import { getPath } from "./getPath.js";


export function hasPath<
	T extends Record<string, unknown>,
	K extends Extract<keyof T, string>
>(object: T, path: K) {
	return Boolean(object && path) && getPath(object, path) !== undefined;
}
