export function reAdd<S extends Set<I>, I>(set: S, item: I) {
	set.delete(item);
	set.add(item);
	
	return set;
}
