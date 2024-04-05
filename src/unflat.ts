type TheObject = Record<string, unknown>;


export function unflat(flattenedObject: TheObject): TheObject {
	
	const object: TheObject = {};
	
	for (const key in flattenedObject)
		if (Object.hasOwn(flattenedObject, key)) {
			const value = flattenedObject[key];
			
			if (key.includes(".")) {
				let subobject = object;
				const subkeys = key.split(".");
				const valueKey = subkeys.pop() as string;
				
				for (const subkey of subkeys)
					subobject = subobject[subkey] as TheObject ?? (subobject[subkey] = {});
				
				subobject[valueKey] = value;
			} else
				object[key] = value;
		}
	
	return object;
}
