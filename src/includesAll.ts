export function includesAll<I>(iterable: I[] | Set<I>, items: I[] | Set<I>) {
	return (
		(items instanceof Set ? [ ...items ] : items)
			.every(
				iterable instanceof Set ?
					item => iterable.has(item) :
					item => iterable.includes(item)
			)
	);
}
