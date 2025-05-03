export type Project<T, Shape> =
	Shape extends undefined
		? T
		: T extends object
			? {
				[K in keyof Shape & keyof T]:
				Shape[K] extends object
					? Project<T[K], Shape[K]>
					: T[K]
			}
			: T;
