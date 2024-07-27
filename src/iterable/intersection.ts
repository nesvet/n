export function intersection<I>(firstIterable: I[] | Set<I>, ...otherIterables: (I[] | Set<I>)[]): I[] {
	
	const intersectionArray = [];
	
	mainLoop: for (const item of firstIterable) {
		for (const otherIterable of otherIterables)
			if (otherIterable instanceof Set ? !otherIterable.has(item) : !otherIterable.includes(item))
				continue mainLoop;
		intersectionArray.push(item);
	}
	
	return intersectionArray;
}
