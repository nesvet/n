export function unflat<T extends Record<string, unknown>>(flattenedObject: T): T {
	
	const object = {} as T;
	
	for (const key in flattenedObject)
		if (Object.hasOwn(flattenedObject, key)) {
			const value = flattenedObject[key];
			
			if (key.includes(".")) {
				let subobject: any = object;// eslint-disable-line @typescript-eslint/no-explicit-any
				const subkeys = key.split(".");
				const valueKey = subkeys.pop() as string;
				
				for (const subkey of subkeys)
					subobject = (subobject[subkey] ??= {});
				
				subobject[valueKey] = value;
			} else
				object[key] = value;
		}
	
	return object;
}
