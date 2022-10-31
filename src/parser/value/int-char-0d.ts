import type {default as Value} from "./index";

export default class IntChar0DValue implements Value<never> {
	public type = <const>"number";
	public name: string;
	public value!: never;

	public constructor(name: string) {
		this.name = name;
	}
}
