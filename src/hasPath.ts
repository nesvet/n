import { getPath } from "./getPath.js";
import { Host } from "./types.js";


export function hasPath(object: Host, path: string) {
	return Boolean(object && path) && getPath(object, path) !== undefined;
}
