/* eslint-disable unicorn/prevent-abbreviations, unicorn/custom-error-definition */


type Payload = Record<string, unknown>;

type PayloadWithMessage = Payload & {
	message: string;
};


export class Err extends Error {
	constructor(payload: PayloadWithMessage);
	constructor(message: string, payload?: Payload);
	constructor(message: string, tag: string | null, payload?: Payload);
	constructor(message: PayloadWithMessage | string, tag: Payload | string | null = null, payload?: Payload) {
		if (typeof message == "object") {
			payload = message;
			message = payload.message as string;
			delete payload.message;
			tag = null;
		} else if (tag && typeof tag == "object") {
			payload = tag;
			tag = null;
		}
		
		super(message);
		
		this.tag = tag;
		
		if (payload)
			Object.assign(this, payload);
		
	}
	
	name = "Err-or";
	
	tag: string | null;
	
}
