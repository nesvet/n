export function pick<O extends object, K extends keyof O>(object: O, keys: K[]) {
	
	const picked: Partial<Pick<O, K>> = {};
	
	for (const key of keys)
		if (key in object)
			picked[key] = object[key];
	
	return picked as Pick<O, K>;
}
