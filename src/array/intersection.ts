export function intersection<I>(firstArray: I[], ...otherArrays: I[][]): I[] {
	
	const intersectionArray = [];
	
	mainLoop: for (const item of firstArray) {
		for (const otherArray of otherArrays)
			if (!otherArray.includes(item))
				continue mainLoop;
		intersectionArray.push(item);
	}
	
	return intersectionArray;
}
