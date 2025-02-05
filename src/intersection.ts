export function intersection<I>(...iterables: (I[] | Set<I>)[]): I[] {
	
	const intersectionArray = [];
	
	if (iterables.length) {
		const [ firstIterable, ...otherIterables ] = iterables;
		
		mainLoop: for (const item of firstIterable) {
			for (const otherIterable of otherIterables)
				if (otherIterable instanceof Set ? !otherIterable.has(item) : !otherIterable.includes(item))
					continue mainLoop;
			intersectionArray.push(item);
		}
	}
	
	return intersectionArray;
}
