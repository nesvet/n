export function uid(prefix: string | undefined = "", postfix: string | undefined = "") {
	return `${prefix}${Date.now().toString(36)}${Math.round(Math.random() * Number.MAX_SAFE_INTEGER).toString(36)}${postfix}`;
}
