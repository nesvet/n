export function isEmpty(object: object): object is object {
	// eslint-disable-next-line guard-for-in, no-unreachable-loop
	for (const _ in object)
		return false;
	
	return true;
}
