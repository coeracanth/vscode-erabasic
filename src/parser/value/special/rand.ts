import type {default as Value} from "../index";

export default class RandValue implements Value<never> {
	public type = <const>"number";
	public name = <const>"RAND";
	public value!: never;

	public constructor() {
		// Do nothing
	}
}
