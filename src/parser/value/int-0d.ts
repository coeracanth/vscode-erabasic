import * as E from "../error";
import Value from "./index";

export default class Int0DValue implements Value<bigint> {
	public type = <const>"number";
	public name: string;
	public value: bigint;

	public static normalizeIndex(name: string, index: number[]): number[] {
		if (index.length === 0) {
			return [];
		} else if (index.length === 1 && index[0] === 0) {
			return [];
		} else {
			throw E.invalidIndex("0D", name, index);
		}
	}

	public constructor(name: string) {
		this.name = name;
		this.value = 0n;
	}
}
