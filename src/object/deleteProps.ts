
export function deleteProps<O extends object, K extends readonly (keyof O)[]>(object: O, keys: K) {
	if (object) {
		for (const key of keys)
			delete object[key];
		
		return object as Omit<O, K[number]>;
	}
	
	return null;
}
