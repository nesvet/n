/* eslint-disable @typescript-eslint/no-explicit-any */


export function getAll<V>(map: Map<any, V>, keys: any[], onlyExisting: true): V[];
export function getAll<V>(map: Map<any, V>, keys: any[], onlyExisting?: false): (V | undefined)[];
export function getAll<V>(map: Map<any, V>, keys: any[], onlyExisting = false) {
	
	const items = [];
	
	if (onlyExisting)
		for (const key of keys) {
			const item = map.get(key);
			if (item !== undefined)
				items.push(item);
		}
	else
		for (const key of keys)
			items.push(map.get(key));
	
	return items;
}
