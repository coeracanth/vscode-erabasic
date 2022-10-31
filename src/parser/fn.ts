import type Property from "./property";
import Order from "./property/order";
import Variable from "./statement/expr/variable";
import Thunk from "./thunk";

export default class Fn {
	public static START_OF_FN = "@@START";

	public name: string;
	public arg: Array<[Variable, Variable | string | bigint | null]>;
	public property: Property[];
	public thunk: Thunk;
	public readonly documentation?: string;

	public constructor(name: string, arg: Fn["arg"], property: Property[], thunk: Thunk, doc?:string) {
		this.name = name;
		this.arg = arg;
		this.thunk = thunk;
		this.property = property;
		this.documentation = doc;

		this.thunk.labelMap.set(Fn.START_OF_FN, 0);
	}

	public isFirst(): boolean {
		return this.property.some((p) => p instanceof Order && p.order === "PRI");
	}

	public isLast(): boolean {
		return this.property.some((p) => p instanceof Order && p.order === "LATER");
	}
}
