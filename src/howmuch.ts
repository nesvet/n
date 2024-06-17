export function howmuch(number: [] | number, one: string, two: string, five: boolean | string, shouldPrintNumber = true) {
	if (Array.isArray(number))
		number = number.length;
	
	if (typeof five != "string") {
		shouldPrintNumber = five ?? true;
		five = two;
	}
	
	
	return (shouldPrintNumber ? `${number} ` : "") + howmuch.raw(number, one, two, five);
}

howmuch.raw = (number: number, one: string, two: string, five = two) => {
	number = Math.abs(number);
	const u = number % 10;
	const d = number % 100;
	
	return (
		(u === 1 && d !== 11) ?
			one :
			((u >= 2 && u <= 4) && !(d >= 12 && d <= 15)) ?
				two :
				five
	);
};
