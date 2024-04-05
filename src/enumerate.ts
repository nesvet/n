export function enumerate(items: string[], and = "и") {
	items = items.filter(Boolean);
	
	return (
		items.length > 1 ?
			[
				items.slice(0, items.length - 1).join(", "),
				items.at(-1)
			].join(` ${and} `) :// eslint-disable-line no-irregular-whitespace
			items.length ?
				items[0] :
				""
	);
}
