export function empty<O extends object>(object: O) {
	// eslint-disable-next-line guard-for-in
	for (const key in object)
		delete object[key as keyof O];
	
	return object;
}
