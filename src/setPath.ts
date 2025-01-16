import { Host, SubHost } from "./types.js";


export function setPath(object: Host, path: string, value: unknown): unknown {
	if (path) {
		const pathArray = path.split(".");
		const penultIndex = pathArray.length - 2;
		if (penultIndex >= 0) {
			let host = object;
			
			for (let i = 0, subHost: SubHost, subPath: string; i <= penultIndex; i++) {
				subPath = pathArray[i];
				subHost = host[subPath];
				if (!subHost || !(typeof subHost == "object" || typeof subHost == "function"))
					subHost =
						host[subPath] =
							{};
				host = subHost as Host;
			}
			
			host[pathArray[penultIndex + 1]] = value;
		} else
			object[path] = value;
		
		return value;
	}
	
	return null;
}
