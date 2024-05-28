export class Err extends Error {
	constructor(message: string, tag: string | null = null, payload: object) {
		super(message);
		
		if (tag && typeof tag == "object") {
			payload = tag;
			tag = null;
		}
		
		this.tag = tag;
		
		if (payload)
			Object.assign(this, payload);
		
	}
	
	tag: string | null;
	
}
