export function enumerate(items: string[], and = "и") {
	items = items.filter(Boolean);
	
	return (
		items.length > 1 ?
			[
				items.slice(0, -1).join(", "),
				items.at(-1)
			].join(` ${and} `) :
			items.length ?
				items[0] :
				""
	);
}
