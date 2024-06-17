// eslint-disable-next-line unicorn/prevent-abbreviations, unicorn/custom-error-definition
export class Err extends Error {
	constructor(message: string, tag: null | string = null, payload?: object) {
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
