export function median(numbers: number[], isAlreadySorted?: boolean) {
	if (numbers.length === 0)
		throw new Error("Array must not be empty");
	
	const sorted = isAlreadySorted ? numbers : numbers.toSorted((a, b) => a - b);
	const middle = Math.floor(sorted.length / 2);
	
	return (sorted.length % 2) ? sorted[middle] : ((sorted[middle - 1] + sorted[middle]) / 2);
}
