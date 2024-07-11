export function setWithTimeout(map: Map<unknown, [ value: unknown, timeout: number ]>, key: unknown, value: unknown, ms: number) {
	return map.set(key, [ value, setTimeout(() => map.delete(key), ms) ]);
}
