export function areArraysEqual<T>(array1: T[], array2: T[]): boolean {
	if (array1.length !== array2.length)
		return false;
	
	for (let i = array1.length; i--;)
		if (array1[i] !== array2[i])
			return false;
	
	return true;
}
