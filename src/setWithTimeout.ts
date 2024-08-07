import { setup } from "./timeouts.js";


export function setWithTimeout<K, V>(map: Map<K, V>, key: K, value: V, ms: number) {
	setup(map, key, ms);
	
	return map.set(key, value);
}
