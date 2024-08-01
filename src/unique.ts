export function unique<Item>(array: Item[]): Item[] {
	return [ ...new Set(array) ];
}
