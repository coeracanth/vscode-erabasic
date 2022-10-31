import type Expr from "../expr";
import type {EraGenerator} from "../index";

async function runGenerator<T>(gen: EraGenerator<T>): Promise<T> {
	while (true) {
		const value = await gen.next();
		if (value.done === true) {
			return value.value;
		}
	}
}

export default class InlineCall implements Expr {
	public name: string;
	public arg: Expr[];

	public constructor(name: string, arg: Expr[]) {
		this.name = name.toUpperCase();
		this.arg = arg;
	}

}
