export function toStringWithSign(n: number) {
	return n ? n < 0 ? `−${-n}` : `+${n}` : n === 0 ? "0" : "";
}
