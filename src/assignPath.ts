import { setPath } from "./setPath.js";
import { Host } from "./types.js";


export function assignPath(target: Host, ...sources: Host[]): Host {
	for (const source of sources)
		for (const path in source)
			if (Object.hasOwn(source, path))
				setPath(target, path, source[path]);
	
	return target;
}
