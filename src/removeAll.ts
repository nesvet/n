export function removeAll<Item>(array: Item[], items: Item[]): number {
	
	let i,
		removed = 0;
	
	for (const item of items)
		while ((i = array.indexOf(item)) > -1) {
			array.splice(i, 1);
			removed++;
		}
	
	return removed;
}
