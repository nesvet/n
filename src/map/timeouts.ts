// eslint-disable-next-line @typescript-eslint/no-explicit-any
const timeoutsMapMap: Map<Map<any, any>, Map<any, number>> = new Map();

export function cleanup<K, V>(map: Map<K, V>, key: K) {
	map.delete(key);
	
	const timeoutsMap = timeoutsMapMap.get(map);
	if (timeoutsMap) {
		
		const timeout = timeoutsMap.get(key);
		if (timeout) {
			clearTimeout(timeout);
			timeoutsMap.delete(key);
		}
		
		if (!timeoutsMap.size)
			timeoutsMapMap.delete(map);
	}
	
}

export function setup<K, V>(map: Map<K, V>, key: K, ms: number) {
	const timeout = setTimeout(() => cleanup(map, key), ms);
	
	timeoutsMapMap.get(map)?.set(key, timeout) ??
	timeoutsMapMap.set(map, new Map([ [ key, timeout ] ]));
	
}
