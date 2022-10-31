import * as assert from "../assert";
import * as E from "../error";
import type {default as Value, Leaf} from "./index";

export default class Int3DValue implements Value<bigint[][][]> {
	public type = <const>"number";
	public name: string;
	public value: bigint[][][];

	public static normalizeIndex(name: string, index: number[]): number[] {
		if (index.length === 0) {
			return [0, 0, 0];
		} else if (index.length === 1) {
			return [index[0], 0, 0];
		} else if (index.length === 2) {
			return [index[0], index[1], 0];
		} else if (index.length === 3) {
			return index;
		} else if (index.length === 4 && index[3] === 0) {
			return index.slice(0, -1);
		} else {
			throw E.invalidIndex("3D", name, index);
		}
	}

	public constructor(name: string, size?: number[]) {
		const realSize = size ?? [100, 100, 100];
		assert.cond(realSize.length === 3, `${name} is not a ${realSize.length}D variable`);

		this.name = name;
		this.value = new Array(realSize[0]).fill(0).map(
			() => new Array(realSize[1]).fill(0).map(
				() => new Array<bigint>(realSize[2]).fill(0n),
			),
		);
	}
}
