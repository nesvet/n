export function indent(string: string, indentation: string = "\t", times: number = 1): string {
	if (!string)
		return string;
	
	const prefix = indentation.repeat(times);
	
	return string.split("\n").map(line => `${prefix}${line}`).join("\n");
}
