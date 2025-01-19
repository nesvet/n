export function getPath<
	T extends Record<string, unknown>,
	K extends Extract<keyof T, string>
>(object: T, path: K): unknown {
	if (path) {
		if (path.includes(".")) {
			let subObject = object;
			
			for (const key of path.split(".")) {
				subObject = (subObject as T)?.[key as K] as T;
				
				if (subObject === undefined)
					break;
			}
			
			return subObject;
		}
		
		return object[path];
	}
	
	return object;
}
