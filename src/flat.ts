import { isEmpty } from "./isEmpty.js";
import { isPlain } from "./isPlain.js";


export function flat<T extends Record<string, unknown>>(object: T, strict = true, prefix?: string): T {
	const entries = Object.entries(object);
	
	for (let i = 0; i < entries.length; i++) {
		const [ key, value ] = entries[i];
		if (value && typeof value == "object" && isPlain(value, strict) && !isEmpty(value)) {
			entries.splice(i, 1);
			let j = i--;
			for (const subkey in value)// eslint-disable-line guard-for-in
				entries.splice(j++, 0, [ `${key}.${subkey}`, value[subkey as keyof typeof value] ]);
		}
	}
	
	if (prefix) {
		prefix += ".";
		
		return Object.fromEntries(entries.map(([ key, value ]) => [ prefix + key, value ])) as T;
	}
	
	return Object.fromEntries(entries) as T;
}
