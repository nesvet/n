export function isPlain(object: object, strict = true) {
	return (
		object &&
		typeof object == "object" &&
		(!strict || object.constructor === Object) &&
		Object.prototype.toString.call(object) === "[object Object]"
	);
}
