type WhenOptions = {
	interval?: number,
	timeout?: number | null,
	context?: unknown
};

export function when(check: (() => unknown), callback: ((result: unknown) => unknown) | WhenOptions | undefined, options: WhenOptions = {}) {
	if (typeof callback == "object") {
		options = callback;
		callback = undefined;
	}
	
	const {
		interval = 1,
		timeout = null,
		context
	} = options;
	
	let checkResolve: (result: unknown) => void;
	let checkInterval: number;
	let rejectionTimeout: number;
	
	async function checkFunc() {
		
		const result = await check();
		
		if (result) {
			checkResolve(result);
			
			return true;
		}
		
	}
	
	return new Promise((resolve, reject) => {
		checkResolve = resolve;
		
		checkFunc().then(isPassed => {
			if (!isPassed) {
				checkInterval = setInterval(checkFunc, interval);
				
				if (timeout)
					rejectionTimeout = setTimeout(reject, timeout);
			}
			
		});
		
	}).then(result => {
		
		clearInterval(checkInterval);
		clearTimeout(rejectionTimeout);
		
		callback?.call(context, result);
		
		return result;
	}, () => {
		
		clearInterval(checkInterval);
		
		return Promise.reject(new Error("timeout"));
	});
}
