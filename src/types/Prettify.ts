export type Prettify<T> = {
	[K in keyof T]: T[K];
} & {};

export type PrettifyDeep<T> = {
	[K in keyof T]: T[K];
} extends infer U ? { [K in keyof U]: U[K] } : never;
