import * as assert from "../assert";
import type {default as Value} from "./index";

export default class Str1DValue implements Value<string[]> {
	public type = <const>"string";
	public name: string;
	public value: string[];

	public constructor(name: string, size?: number[]) {
		const realSize = size ?? [100];
		assert.cond(realSize.length === 1, `${name} is not a ${realSize.length}D variable`);

		this.name = name;
		this.value = new Array<string>(realSize[0]).fill("");
	}
}
