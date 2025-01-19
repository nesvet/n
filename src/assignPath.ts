import { setPath } from "./setPath.js";


export function assignPath<T extends Record<string, unknown>>(target: T, ...sources: T[]): T {
	for (const source of sources)
		for (const path in source)
			if (Object.hasOwn(source, path))
				setPath(target, path, source[path]);
	
	return target;
}
