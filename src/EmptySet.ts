export class EmptySet extends Set {
	// eslint-disable-next-line no-useless-constructor
	constructor() {
		super();
		
	}
	
	add() {
		return this;
	}
	
}
