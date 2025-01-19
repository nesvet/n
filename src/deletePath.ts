export function deletePath(object: Record<string, unknown>, path: string): boolean {
	if (object && path) {
		if (path.includes(".")) {
			const keys = path.split(".");
			let subObject: any = object; // eslint-disable-line @typescript-eslint/no-explicit-any
			
			for (let i = 0; i < keys.length - 1; i++) {
				const key = keys[i];
				const subObjectValue = subObject[key];
				
				if (subObjectValue && typeof subObjectValue === "object")
					subObject = subObjectValue;
				else
					return false;
			}
			
			const lastKey = keys.at(-1)!;
			
			return lastKey in subObject && delete subObject[lastKey];
		}
		
		return path in object && delete object[path];
	}
	
	return false;
}
