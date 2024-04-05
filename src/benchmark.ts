const labelMaxLength = 64;

const bold = [ "\x1b[1m", "\x1b[22m" ];
const underline = [ "\x1b[2m", "\x1b[24m" ];
const overline = [ "\x1b[53m", "\x1b[55m" ];
const dim = [ "\x1b[2m", "\x1b[22m" ];


export function benchmark(action: () => unknown, options: { l?: string, t?: number, i?: number } = {}) {
	let {
		l: label,
		t: times = 10,
		i: iterations = 1000000
	} = options;
	
	if (!label) {
		label = action.toString().replace(/(^(async\s*)?(function\s*)?\([^)]*\)\s*(=>(\s*await)?)?\s*{?\s*|\n+|;?\s*}?$)/g, "").replace(/(\s+)/g, " ");
		if (label.length > labelMaxLength)
			label = `${label.substring(0, labelMaxLength)}…`;
		label = dim[0] + label + dim[1];
	}
	
	let total = 0;
	
	console.log(`${dim[0]}${overline[0]}🎬 ${iterations} iterations × ${times} times${overline[1]}${dim[1]}`);
	
	for (let t = 0; t < times; t++) {
		const start = performance.now();
		
		let value;
		for (let i = 0; i < iterations; i++)
			value = action();
		
		const timeTotal = performance.now() - start;
		
		console.log(`🏎  ${label} ${t + 1}: ${timeTotal}${value ? ` ${value}` : ""}`);
		
		total += timeTotal;
	}
	
	console.log(`${underline[0]}🏁 ${label} total: ${bold[0]}${total}${bold[1]}${underline[1]}`);
	
}
