export function sort<I>(set: Set<I>, compareFn?: ((a: I, b: I) => number)) {
	for (const item of [ ...set ].sort(compareFn)) {
		set.delete(item);
		set.add(item);
	}
	
	return set;
}
