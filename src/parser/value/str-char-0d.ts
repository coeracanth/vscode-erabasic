import type {default as Value} from "./index";

export default class StrChar0DValue implements Value<never> {
	public type = <const>"string";
	public name: string;
	public value!: never;

	public constructor(name: string) {
		this.name = name;
	}
}
