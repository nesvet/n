export function getAll<K, V>(map: Map<K, V>, keys: K[], onlyExisting?: false): (undefined | V)[];
export function getAll<K, V>(map: Map<K, V>, keys: K[], onlyExisting: true): V[];
export function getAll<K, V>(map: Map<K, V>, keys: K[], onlyExisting = false) {
	if (onlyExisting)
		keys = keys.filter(key => map.has(key));
	
	return keys.map(key => map.get(key));
}
