/** @deprecated */
export function deepClone(object: object) {
	return JSON.parse(JSON.stringify(object));// eslint-disable-line unicorn/prefer-structured-clone
}
