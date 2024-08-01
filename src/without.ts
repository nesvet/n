export function without<I>(array: I[], arrayToExclude: I[]): I[] {
	return array.filter(item => !arrayToExclude.includes(item));
}
