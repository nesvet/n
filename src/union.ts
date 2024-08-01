export function union<I>(...iterables: I[][]): I[] {
	return [ ...new Set(iterables.flat()) ];
}
