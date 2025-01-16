import { Host } from "./types.js";


export function deletePath(object: Host, path: string) {
	if (path) {
		const pathArray = path.split(".");
		const penultIndex = pathArray.length - 2;
		if (penultIndex >= 0) {
			let host = object;
			
			for (let i = 0, subPath; i <= penultIndex; i++) {
				subPath = pathArray[i];
				host = host[subPath] as Host;
				if (!host || !(typeof host == "object" || typeof host == "function"))
					return false;
			}
			
			return delete host[pathArray[penultIndex + 1]];
		}
		
		return delete object[path];
	}
	
	return null;
}
