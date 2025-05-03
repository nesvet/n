/* eslint-disable @typescript-eslint/no-explicit-any */

type Value<T> = PromiseLike<T> | T;
type Resolve<T> = (value: Value<T>) => void;
type Reject = (reason?: any) => void;

type Options = {
	signal?: AbortSignal;
	timeout?: number;
};

const nativesMap = new WeakMap<StatefulPromise<any>, { resolve: Resolve<any>; reject: Reject }>();


export class StatefulPromise<T> extends Promise<T> {
	constructor(
		executor?: (resolve: Resolve<T>, reject: Reject) => void,
		options?: Options
	) {
		let nativeResolve: Resolve<T>;
		let nativeReject: Reject;
		
		super((resolve, reject) => {
			nativeResolve = resolve;
			nativeReject = reject;
			
		});
		
		nativesMap.set(this, { resolve: nativeResolve!, reject: nativeReject! });
		
		if (options?.signal)
			if (options.signal.aborted)
				this.reject(new DOMException("Aborted", "AbortError"));
			else {
				const abortListener = () => this.reject(new DOMException("Aborted", "AbortError"));
				
				options.signal.addEventListener("abort", abortListener);
				
				this.finally(() => options.signal?.removeEventListener("abort", abortListener));
			}
		
		if (typeof options?.timeout === "number" && Number.isFinite(options.timeout)) {
			const timeout = setTimeout(() => this.reject(new DOMException("Timeout exceeded", "TimeoutError")), options.timeout);
			
			this.finally(() => clearTimeout(timeout));
		}
		
		executor?.(this.resolve, this.reject);
		
	}
	
	isPending = true;
	isFulfilled = false;
	isRejected = false;
	
	state: "fulfilled" | "pending" | "rejected" = "pending";
	
	result?: T | unknown;
	
	readonly resolve = (value: Value<T>) => {
		
		if (this.isPending) {
			this.isPending = false;
			this.isFulfilled = true;
			this.state = "fulfilled";
			this.result = value;
			
			const native = nativesMap.get(this);
			
			if (native) {
				native.resolve.call(this, value);
				nativesMap.delete(this);
			}
		}
		
	};
	
	readonly reject = (reason?: any) => {
		
		if (this.isPending) {
			this.isPending = false;
			this.isRejected = true;
			this.state = "rejected";
			this.result = reason;
			
			const native = nativesMap.get(this);
			
			if (native) {
				native.reject.call(this, reason);
				nativesMap.delete(this);
			}
		}
		
	};
	
	
	static resolved<U>(value: U): StatefulPromise<U> {
		return new StatefulPromise<U>(resolve => resolve(value));
	}
	
	static rejected(reason: unknown): StatefulPromise<never> {
		return new StatefulPromise((_, reject) => reject(reason));
	}
	
}
