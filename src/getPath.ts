export function getPath(object: Record<string, unknown>, path: string): unknown {
	if (path) {
		if (path.includes(".")) {
			let subObject: any = object;// eslint-disable-line @typescript-eslint/no-explicit-any
			
			for (const key of path.split(".")) {
				subObject = subObject?.[key];
				
				if (subObject === undefined)
					break;
			}
			
			return subObject;
		}
		
		return object[path];
	}
	
	return object;
}
