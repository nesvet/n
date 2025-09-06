export function omit<O extends object, K extends keyof O>(object: O, keys: K[]): Omit<O, K> {
	const result = { ...object };
	
	for (const key of keys)
		delete result[key];
	
	return result;
}
