import { Falsy } from "./Falsy";


export type Truthy<T> = T extends Falsy ? never : T;

export { Truthy as Truely };
