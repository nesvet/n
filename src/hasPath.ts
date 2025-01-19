import { getPath } from "./getPath.js";


export function hasPath(object: Record<string, unknown>, path: string) {
	return Boolean(object && path) && getPath(object, path) !== undefined;
}
