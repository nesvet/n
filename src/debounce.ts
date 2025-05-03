import { noop } from "./noop.js";
import { StatefulPromise } from "./StatefulPromise.js";


type Callback = (...args: any[]) => unknown;// eslint-disable-line @typescript-eslint/no-explicit-any
type FunctionOrBoolean = (() => unknown) | boolean;
type Options = { leading?: FunctionOrBoolean; maxWait?: number; trailing?: FunctionOrBoolean };

type DebouncedFunction<C extends Callback> = {
	(this: ThisParameterType<C>, ...args: Parameters<C>): Promise<Awaited<ReturnType<C>>>;
};

export type Debounced<C extends Callback, R extends ReturnType<C>> = DebouncedFunction<C> & {
	callback: C;
	promise: StatefulPromise<R>;
	resolve: (value: R) => void;
	reject: (reason?: unknown) => void;
	run(): Promise<R>;
	clear(shouldRun?: boolean): Promise<void>;
};


export function debounce<C extends Callback, R extends ReturnType<C>>(callback: C, limit = 0, options: Options = {}) {
	let { leading = false, trailing = true } = options;
	const { maxWait = Infinity } = options;
	
	let timeout: ReturnType<typeof setTimeout> | undefined;
	let maxWaitTimeout: ReturnType<typeof setTimeout> | undefined;
	let end: number | undefined;
	let context: ThisParameterType<C>;
	let args: unknown[];
	let initial: FunctionOrBoolean;
	let final: FunctionOrBoolean;
	let result: R;
	
	const expired = async () => {
		
		const n = Date.now();
		
		if (n >= end!) {
			timeout = undefined;
			end = undefined;
			
			clearTimeout(maxWaitTimeout);
			maxWaitTimeout = undefined;
			
			if (typeof final == "function")
				await final();
			
			debounced.resolve(result);
			
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
		try {
			result = await callback.apply(context, args) as R;
			
			return result;
		} catch (error) {
			debounced.reject(error);
			
			throw error;
		}
	}
	
	if (leading && typeof leading == "boolean")
		leading = run;
	initial = leading;
	
	if (trailing && typeof trailing == "boolean")
		trailing = run;
	final = trailing;
	
	const debounced: Debounced<C, R> = Object.assign(function (..._args) {
		args = _args;
		context = this;// eslint-disable-line no-invalid-this
		
		end = Date.now() + limit;
		final = trailing;
		
		if (!debounced.promise.isPending)
			debounced.promise = new StatefulPromise<R>((resolve, reject) => {
				debounced.resolve = resolve;
				debounced.reject = reject;
				
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
				
			});
		
		return debounced.promise;
	} as DebouncedFunction<C>, {
		callback,
		promise: StatefulPromise.resolved(undefined as unknown as R),
		resolve: noop,
		reject: noop,
		run,
		clear: async (shouldRun?: boolean) => {
			
			clearTimeout(timeout);
			timeout = undefined;
			
			clearTimeout(maxWaitTimeout);
			maxWaitTimeout = undefined;
			
			debounced.resolve(shouldRun ? await run() : result);
			
		}
	});
	
	return debounced;
}


debounce.noop = Object.assign(() => { /**/ }, {
	callback: noop,
	promise: StatefulPromise.resolved(undefined), // eslint-disable-line unicorn/no-useless-undefined
	resolve: noop,
	reject: noop,
	run: noop,
	clear: noop
}) as Debounced<() => void, void>;


export function throttle(callback: Callback, limit?: number, options?: Options) {
	return debounce(callback, limit, {
		maxWait: limit,
		leading: true,
		trailing: true,
		...options
	});
}
