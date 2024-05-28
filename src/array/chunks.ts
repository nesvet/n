export function chunks<I>(array: I[], size: number) {
	return Array(Math.ceil(array.length / size)).fill(undefined).map((_, i) => array.slice(i * size, (i + 1) * size));
}
