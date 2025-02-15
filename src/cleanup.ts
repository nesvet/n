// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function cleanup<T extends Record<string, any>>(object: T): T {
	for (const key in object)
		if (object[key] === undefined)
			delete object[key];
	
	return object;
}
