import type {default as Value} from "../index";

export default class LineCountValue implements Value<never> {
	public type = <const>"number";
	public name = <const>"LINECOUNT";
	public value!: never;

	public constructor() {
		// Do nothing
	}
}
