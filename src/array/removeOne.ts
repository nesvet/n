export function removeOne<Item>(array: Item[], item: Item): boolean {
	const i = array.indexOf(item);
	if (i > -1) {
		array.splice(i, 1);
		
		return true;
	}
	
	return false;
}
