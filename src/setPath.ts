export function setPath<
	T extends Record<string, unknown>,
	K extends Extract<keyof T, string>,
	V
>(object: T, path: K, value: V): null | V {
	if (object && path) {
		if (path.includes(".")) {
			const keys = path.split(".");
			let subObject: any = object;// eslint-disable-line @typescript-eslint/no-explicit-any
			
			for (let i = 0; i < keys.length - 1; i++) {
				const key = keys[i];
				const subObjectValue = subObject[key];
				
				subObject =
					(subObjectValue && typeof subObjectValue == "object") ?
						subObjectValue :
						(subObject[key] = {});
			}
			
			return (subObject[keys.at(-1)!] = value);
		}
		
		return (object[path] = value as T[K]) as V;
	}
	
	return null;
}
