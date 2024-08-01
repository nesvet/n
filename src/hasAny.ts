export function hasAny<K, V>(mapOrSet: Map<K, V> | Set<K>, items: K[] | Set<K>) {
	for (const item of items)
		if (mapOrSet.has(item))
			return true;
	
	return false;
}
