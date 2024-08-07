import { cleanup } from "./timeouts.js";


export function getWithTimeout<K, V>(map: Map<K, V>, key: K) {
	const value = map.get(key);
	
	cleanup(map, key);
	
	return value;
}
