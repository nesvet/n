export function roundTo(number: number, digits: number) {
	const factor = 10 ** digits;
	const epsilon = digits >= 0 ? Number.EPSILON : 0;
	
	return Math.round((number + epsilon) * factor) / factor;
}
