import type Expr from "../statement/expr";

/**
 * ユーザー定義変数
 */
export default class Dim {
	public name: string;
	public type: "number" | "string";
	public prefix: Set<string>;
	public size: Expr[];
	public value?: Expr[];
	public readonly documentation?:string;

	public constructor(
		name: string,
		type: Dim["type"],
		prefix: string[],
		size: Expr[],
		value?: Expr[],
	) {
		this.name = name;
		this.type = type;
		this.size = size;
		this.prefix = new Set();
		this.value = value;

		for (const p of prefix) {
			this.prefix.add(p.toUpperCase());
		}
	}

	public isDynamic(): boolean {
		return this.prefix.has("DYNAMIC");
	}

	public isGlobal(): boolean {
		return this.prefix.has("GLOBAL");
	}

	public isSave(): boolean {
		return this.prefix.has("SAVEDATA");
	}

	public isChar(): boolean {
		return this.prefix.has("CHARADATA");
	}

}
