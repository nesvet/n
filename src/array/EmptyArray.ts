export class EmptyArray extends Array {
	constructor() {
		super();
		
		Object.freeze(this);
		
	}
	
	push() {
		return 0;
	}
	
	unshift() {
		return 0;
	}
	
	splice() {
		return [];
	}
	
}
