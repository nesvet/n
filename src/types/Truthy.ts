import { Falsy } from "./Falsy.js";


export type Truthy<T> = T extends Falsy ? never : T;

export { Truthy as Truely };
