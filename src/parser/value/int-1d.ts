import * as assert from "../assert";
import * as E from "../error";
import type {default as Value, Leaf} from "./index";

export default class Int1DValue implements Value<bigint[]> {
	public type = <const>"number";
	public name: string;
	public value: bigint[];

	public static normalizeIndex(name: string, index: number[]): number[] {
		if (index.length === 0) {
			return [0];
		} else if (index.length === 1) {
			return index;
		} else if (index.length === 2 && index[1] === 0) {
			return index.slice(0, -1);
		} else {
			throw E.invalidIndex("1D", name, index);
		}
	}

	public constructor(name: string, size?: number[]) {
		const realSize = size ?? [1000];
		assert.cond(realSize.length === 1, `${name} is not a ${realSize.length}D variable`);

		this.name = name;
		this.value = new Array<bigint>(realSize[0]).fill(0n);
	}

}
