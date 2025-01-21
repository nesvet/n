import { flat } from "./flat.js";
import { unflat } from "./unflat.js";


export function deepMerge(...args: (boolean | Record<string, unknown>)[]) {
	const strict = Boolean(typeof args.at(-1) == "boolean" ? args.pop() : true);
	const target = args.shift() as Record<string, unknown>;
	
	return unflat(
		Object.assign(
			flat(target, strict),
			...(args as Record<string, unknown>[]).map(object => flat(object, strict))
		)
	);
}
