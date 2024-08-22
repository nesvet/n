/* eslint-disable @typescript-eslint/no-explicit-any */

type Value<T> = PromiseLike<T> | T;
type Resolve<T> = (this: StatefulPromise<T>, value: Value<T>) => void;
type Reject<T> = (this: StatefulPromise<T>, reason?: any) => void;

const nativesMap = new WeakMap<StatefulPromise<any>, { resolve: Resolve<any>; reject: Reject<any> }>();


export class StatefulPromise<T> extends Promise<T> {
	constructor(executor?: (resolve: Resolve<T>, reject: Reject<T>) => void) {
		
		let nativeResolve: Resolve<T>;
		let nativeReject: Reject<T>;
		
		super((resolve, reject) => {
			nativeResolve = resolve;
			nativeReject = reject;
			
		});
		
		nativesMap.set(this, { resolve: nativeResolve!, reject: nativeReject! });
		
		executor?.(this.resolve.bind(this), this.reject.bind(this));
		
	}
	
	isPending = true;
	isFulfilled = false;
	isRejected = false;
	
	state: "fulfilled" | "pending" | "rejected" = "pending";
	
	result?: any;
	
	resolve(value: Value<T>) {
		
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
		
	}
	
	reject(reason?: any) {
		
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
		
	}
	
}
