export function _ids<T extends { _id: string }>(iterable: Set<T> | T[]): string[] {
	if (iterable instanceof Set) {
		const ids = [];
		
		for (const object of iterable)
			ids.push(object._id);
		
		return ids;
	}
	
	return iterable.map(object => object._id);
}
