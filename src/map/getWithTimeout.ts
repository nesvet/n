export function getWithTimeout(map: Map<unknown, [ value: unknown, timeout: number ]>, key: unknown) {
	const [ value, timeout ] = map.get(key) || [];
	clearTimeout(timeout);
	map.delete(key);
	
	return value;
}
