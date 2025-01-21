export function add<T>(array: T[], ...items: T[]): number {
	
	let added = 0;
	
	for (const item of items)
		if (!array.includes(item)) {
			array.push(item);
			added++;
		}
	
	return added;
}
