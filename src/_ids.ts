type ObjectWithId = { _id: string };

export function _ids(iterable: ObjectWithId[] | Set<ObjectWithId>): string[] {
	if (iterable instanceof Set) {
		const ids = [];
		for (const object of iterable)
			ids.push(object._id);
		
		return ids;
	}
	
	return iterable.map(object => object._id);
}
