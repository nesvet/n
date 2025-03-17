export type WaitUntilOptions = {
	/** Maximum time to wait in milliseconds (0 for no timeout) */
	timeout?: number;
	
	/** Polling interval in milliseconds */
	interval?: number;
	
	/** Whether to throw an error on timeout */
	throwOnTimeout?: boolean;
	
	/** Custom timeout message */
	timeoutMessage?: string;
	
	/** Callback function called on each interval with elapsed time in ms */
	onInterval?: (elapsedMs: number) => void;
	
	/** Callback function called on timeout */
	onTimeout?: () => void;
	
	/** Callback function called on success */
	onSuccess?: () => void;
	
	/** Whether to check condition immediately before first wait */
	immediateFirstCheck?: boolean;
};

/**
 * Waits until a condition function returns true
 * @param condition Function that returns true when the waiting should end
 * @param options Configuration options
 * @returns Promise resolving to true when condition is met, or false on timeout (if throwOnTimeout is false)
 */
export function waitFor(
	condition: () => Promise<boolean> | boolean,
	options: WaitUntilOptions = {}
): Promise<boolean> {
	
	const {
		timeout = 5000,
		interval = 100,
		throwOnTimeout = true,
		timeoutMessage = "Operation timed out",
		onInterval,
		onTimeout,
		onSuccess,
		immediateFirstCheck = true
	} = options;
	
	return new Promise<boolean>((resolve, reject) => {
		
		const startTime = Date.now();
		let timeoutId: number | null = null;
		let isResolved = false;
		let isCheckInProgress = false;
		
		const cleanup = () => {
			
			if (timeoutId)
				clearTimeout(timeoutId);
			
			isResolved = true;
			
		};
		
		const handleSuccess = () => {
			
			if (isResolved)
				return;
			
			cleanup();
			
			onSuccess?.();
			
			resolve(true);
			
		};
		
		const handleTimeout = () => {
			
			if (isResolved)
				return;
			
			cleanup();
			
			onTimeout?.();
			
			if (throwOnTimeout)
				reject(new Error(timeoutMessage));
			else
				resolve(false);
			
		};
		
		const checkCondition = async () => {
			
			if (isCheckInProgress || isResolved)
				return;
			
			isCheckInProgress = true;
			
			try {
				if (await condition())
					handleSuccess();
				else if (!isResolved) {
					onInterval?.(Date.now() - startTime);
					
					setTimeout(checkCondition, interval);
				}
			} catch (error) {
				if (!isResolved) {
					cleanup();
					
					reject(error);
				}
			} finally {
				isCheckInProgress = false;// eslint-disable-line require-atomic-updates
			}
		};
		
		if (timeout > 0)
			timeoutId = setTimeout(handleTimeout, timeout);
		
		if (immediateFirstCheck)
			queueMicrotask(checkCondition);
		else
			setTimeout(checkCondition, interval);
		
	});
}
