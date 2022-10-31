import type {default as Value} from "./index";

export default class Str0DValue implements Value<string> {
	public type = <const>"string";
	public name: string;
	public value: string;

	public constructor(name: string) {
		this.name = name;
		this.value = "";
	}
}
