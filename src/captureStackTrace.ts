declare global {
	interface ErrorConstructor {
		captureStackTrace(targetObject: object, constructorOpt?: Function): void;// eslint-disable-line @typescript-eslint/no-unsafe-function-type
	}
}


export function captureStackTrace(depth = 1, indent = 4) {
	
	const indentString = " ".repeat(indent);
	
	const object = {} as { stack: string };
	
	Error.captureStackTrace(object, captureStackTrace);
	
	const stackTrace =
		object.stack
			.replace(/^Error\W+/m, "")
			.replaceAll(/^\s+/gm, "")
			.split("\n")
			.slice(depth)
			.join(`\n${indentString}`);
	
	return `${indentString}${stackTrace}`;
}
