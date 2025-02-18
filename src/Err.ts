// eslint-disable-next-line unicorn/prevent-abbreviations, unicorn/custom-error-definition
export class Err extends Error {
	constructor(message: string, payload?: object);
	constructor(message: string, tag: string | null, payload?: object);
	constructor(message: string, tag: object | string | null = null, payload?: object) {
		super(message);
		
		if (tag && typeof tag == "object") {
			payload = tag;
			tag = null;
		}
		
		this.tag = tag;
		
		if (payload)
			Object.assign(this, payload);
		
	}
	
	name = "Err-or";// eslint-disable-line unicorn/custom-error-definition
	
	tag: null | string;
	
}
