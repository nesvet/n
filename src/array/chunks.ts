export function chunks<I>(array: I[], size: number) {
	return Array.from({ length: Math.ceil(array.length / size) }).fill(null).map((_, i) => array.slice(i * size, (i + 1) * size));
}
