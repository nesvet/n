import { noop } from "./noop";


type FunctionOrBoolean = boolean | (() => unknown);
type NumberOrUndefined = number | undefined;
type DebounceOptions = { leading?: FunctionOrBoolean, maxWait?: number, trailing?: FunctionOrBoolean };

export function debounce(callback: () => unknown, limit = 0, options: DebounceOptions = {}) {
	let { leading = false, maxWait = Infinity, trailing = true } = options;
	
	let timeout: NumberOrUndefined;
	let maxWaitTimeout: NumberOrUndefined;
	let end: NumberOrUndefined;
	let context: unknown;
	let args: [];
	let initial: FunctionOrBoolean;
	let final: FunctionOrBoolean;
	let result: unknown;
	
	const expired = async () => {
		
		const n = Date.now();
		
		if (n >= (end as number)) {
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
			timeout = setTimeout(expired, (end as number) - n);
		}
		
	};
	
	const maxWaitExpired = isFinite(maxWait) ? () => {
		
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
	
	const debounced = Object.assign(function (this: unknown, ..._args: []): Promise<unknown> {
		args = _args;
		context = this;// eslint-disable-line no-invalid-this, @typescript-eslint/no-this-alias
		
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
	}, {
		callback,
		promise: Object.assign(Promise.resolve() as Promise<unknown>, {
			isResolved: true
		}),
		resolve: noop as (value: unknown) => void,
		run,
		clear: async (shouldRun: boolean) => {
			
			clearTimeout(timeout);
			timeout = undefined;
			
			clearTimeout(maxWaitTimeout);
			
			debounced.promise.isResolved = true;
			debounced.resolve(shouldRun ? await run() : result);
			
		}
	});
	
	return debounced;
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
debounce.noop = Object.assign(() => {}, {
	callback: noop,
	promise: Object.assign(Promise.resolve(), {
		isResolved: true
	}),
	resolve: noop,
	run: noop,
	clear: noop
});


export function throttle(callback: () => unknown, limit?: number, options?: DebounceOptions) {
	return debounce(callback, limit, {
		maxWait: limit,
		leading: true,
		trailing: true,
		...options
	});
}


export default debounce;
