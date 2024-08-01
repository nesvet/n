export function includesAny<I>(iterable: I[] | Set<I>, items: I[] | Set<I>) {
	return (
		(items instanceof Set ? [ ...items ] : items)
			.some(
				iterable instanceof Set ?
					item => iterable.has(item) :
					item => iterable.includes(item)
			)
	);
}
