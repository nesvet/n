import { isEmpty } from "./isEmpty.js";
import { isPlain } from "./isPlain.js";


type TheObject = Record<string, unknown>;


export function flat(object: TheObject, strict = true, prefix?: string): TheObject {
	const entries = Object.entries(object);
	
	for (let i = 0; i < entries.length; i++) {
		const [ key, value ] = entries[i];
		if (value && typeof value == "object" && isPlain(value as TheObject, strict) && !isEmpty(value as TheObject)) {
			entries.splice(i, 1);
			let j = i--;
			// eslint-disable-next-line guard-for-in
			for (const subkey in value)
				entries.splice(j++, 0, [ `${key}.${subkey}`, (value as TheObject)[subkey] ]);
		}
	}
	
	if (prefix) {
		prefix += ".";
		
		return Object.fromEntries(entries.map(([ key, value ]) => [ prefix + key, value ]));
	}
	
	return Object.fromEntries(entries);
}
