export function extract<O extends object, K extends keyof O>(object: O, keys: K[]) {
	
	const extraction: Partial<Pick<O, K>> = {};
	
	for (const key of keys)
		if (key in object) {
			extraction[key] = object[key];
			delete object[key];
		}
	
	return extraction as Pick<O, K>;
}
