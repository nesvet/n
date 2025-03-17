/* eslint-disable @typescript-eslint/no-explicit-any */


export function deleteProps(object: null | undefined, keys: any): null;
export function deleteProps<O extends object, K extends readonly (keyof O | number | string | symbol)[]>(object: O, keys: K): Omit<O, K[number]>;
export function deleteProps<O extends object, K extends readonly (keyof O | number | string | symbol)[]>(object: O, keys: K) {
	if (object) {
		for (const key of keys)
			delete object[key as keyof O];
		
		return object as Omit<O, K[number]>;
	}
	
	return null;
}
