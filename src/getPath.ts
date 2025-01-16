import { Host, SubHost } from "./types.js";


export function getPath(object: Host, path: string): unknown {
	return path ?
		~path.indexOf(".") ?
			path.split(".").reduce((subObject: SubHost, key: string) => (subObject as Host)?.[key], object) :
			object[path] :
		object;
}
