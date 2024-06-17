const labelMaxLength = 64;

const bold = [ "\x1B[1m", "\x1B[22m" ];
const underline = [ "\x1B[2m", "\x1B[24m" ];
const overline = [ "\x1B[53m", "\x1B[55m" ];
const dim = [ "\x1B[2m", "\x1B[22m" ];


export function benchmark(action: () => unknown, options: { l?: string; t?: number; i?: number } = {}) {
	let { l: label } = options;
	const {
		t: times = 10,
		i: iterations = 1000000
	} = options;
	
	if (!label) {
		label = action.toString().replaceAll(/(^(async\s*)?(function\s*)?\([^)]*\)\s*(=>(\s*await)?)?\s*{?\s*|\n+|;?\s*}?$)/g, "").replaceAll(/(\s+)/g, " ");
		if (label.length > labelMaxLength)
			label = `${label.slice(0, Math.max(0, labelMaxLength))}…`;
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
