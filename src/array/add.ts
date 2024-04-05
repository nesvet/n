export function add<Item>(array: Item[], ...items: Item[]): number {
	
	let added = 0;
	
	for (const item of items)
		if (!array.includes(item)) {
			array.push(item);
			added++;
		}
	
	return added;
}
