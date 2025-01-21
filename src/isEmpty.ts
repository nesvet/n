export function isEmpty(object: object) {
	for (const _ in object)// eslint-disable-line guard-for-in, no-unreachable-loop
		return false;
	
	return true;
}
