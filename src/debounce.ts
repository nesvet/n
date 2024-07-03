import { noop } from "./noop.js";


type Callback<Result> = (...args: unknown[]) => Result;
type FunctionOrBoolean = (() => unknown) | boolean;
type Options = { leading?: FunctionOrBoolean; maxWait?: number; trailing?: FunctionOrBoolean };
type NumberOrUndefined = number | undefined;

type DebouncedFunction<Result> = {
	(this: unknown, ..._args: unknown[]): Promise<Result>;
};

export type Debounced<Result> = {
	callback: Callback<Result>;
	promise: {
		isResolved: boolean;
	} & Promise<unknown>;
	resolve: (value: Result) => void;
	run(): Promise<Result>;
	clear(shouldRun?: boolean): Promise<void>;
} & DebouncedFunction<Result>;


export function debounce<Result>(callback: Callback<Result>, limit = 0, options: Options = {}) {
	let { leading = false, trailing = true } = options;
	const { maxWait = Infinity } = options;
	
	let timeout: NumberOrUndefined;
	let maxWaitTimeout: NumberOrUndefined;
	let end: NumberOrUndefined;
	let context: unknown;
	let args: unknown[];
	let initial: FunctionOrBoolean;
	let final: FunctionOrBoolean;
	let result: Result;
	
	const expired = async () => {
		
		const n = Date.now();
		
		if (n >= end!) {
			timeout = undefined;
			end = undefined;
			clearTimeout(maxWaitTimeout);
			if (typeof final == "function")
				await final();
			debounced.resolve(result);
			debounced.promise.isResolved = true;
			initial = leading;
		} else {
			clearTimeout(timeout);
			timeout = setTimeout(expired, end! - n);
		}
		
	};
	
	const maxWaitExpired = Number.isFinite(maxWait) ? () => {
		
		if (final === run)
			final = false;
		run();
		maxWaitTimeout = setTimeout(maxWaitExpired as TimerHandler, maxWait);
		
	} : null;
	
	async function run() {
		return (result = await callback.apply(context, args));
	}
	
	if (leading && typeof leading == "boolean")
		leading = run;
	initial = leading;
	
	if (trailing && typeof trailing == "boolean")
		trailing = run;
	final = trailing;
	
	const debounced: Debounced<Result> = Object.assign(function (..._args) {
		args = _args;
		context = this;// eslint-disable-line no-invalid-this
		
		end = Date.now() + limit;
		final = trailing;
		
		if (debounced.promise.isResolved)
			debounced.promise = Object.assign(new Promise(resolve => {
				debounced.resolve = resolve;
				
				if (typeof initial == "function") {
					initial();
					initial = false;
					if (final === run)
						final = false;
				}
				
				if (!timeout) {
					timeout = setTimeout(expired, limit);
					if (maxWaitExpired)
						maxWaitTimeout = setTimeout(maxWaitExpired, maxWait);
				}
				
			}), {
				isResolved: false
			});
		
		return debounced.promise;
	} as DebouncedFunction<Result>, {
		callback,
		promise: Object.assign(Promise.resolve(), {
			isResolved: true
		}),
		resolve: noop,
		run,
		clear: async (shouldRun?: boolean) => {
			
			clearTimeout(timeout);
			timeout = undefined;
			
			clearTimeout(maxWaitTimeout);
			
			debounced.promise.isResolved = true;
			debounced.resolve(shouldRun ? await run() : result);
			
		}
	});
	
	return debounced;
}


debounce.noop = Object.assign(() => { /**/ }, {
	callback: noop,
	promise: Object.assign(Promise.resolve(), {
		isResolved: true
	}),
	resolve: noop,
	run: noop,
	clear: noop
}) as unknown as Debounced<void>;


export function throttle<Result>(callback: Callback<Result>, limit?: number, options?: Options) {
	return debounce(callback, limit, {
		maxWait: limit,
		leading: true,
		trailing: true,
		...options
	});
}
