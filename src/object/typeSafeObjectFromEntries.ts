export function typeSafeObjectFromEntries<const T extends ReadonlyArray<readonly [PropertyKey, unknown]>>(entries: T) {
	return Object.fromEntries(entries) as { [K in T[number] as K[0]]: K[1] };
}
