import * as assert from "../assert";
import type {default as Value} from "./index";

export default class StrChar1DValue implements Value<never> {
	public type = <const>"string";
	public name: string;
	public value!: never;
	public size: number;

	public constructor(name: string, size?: number[]) {
		const realSize = size ?? [100];
		assert.cond(realSize.length === 1, `${name} is not a ${realSize.length}D variable`);

		this.name = name;
		this.size = realSize[0];
	}
}
