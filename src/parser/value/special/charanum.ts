import type {default as Value} from "../index";

export default class CharaNumValue implements Value<never> {
	public type = <const>"number";
	public name = <const>"CHARANUM";
	public value!: never;

	public constructor() {
		// Do nothing
	}
}
