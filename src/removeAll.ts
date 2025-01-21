export function removeAll<T>(array: T[], items: T[]): number {
	
	let i,
		removed = 0;
	
	for (const item of items)
		while ((i = array.indexOf(item)) > -1) {
			array.splice(i, 1);
			removed++;
		}
	
	return removed;
}
