import { random } from "./random.js";


export function randomItem<Item>(array: Item[]) {
	return array[random(0, array.length - 1)];
}
