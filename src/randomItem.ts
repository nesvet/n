import { random } from "./random.js";


export function randomItem<T>(array: T[]) {
	return array[random(0, array.length - 1)];
}
