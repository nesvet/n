export function deepClone(object: object) {
	return JSON.parse(JSON.stringify(object));
}
