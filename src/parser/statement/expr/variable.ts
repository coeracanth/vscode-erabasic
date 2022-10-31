import type Expr from "./index";

export default class Variable implements Expr {
	public name: string;
	public index: Expr[];
	public scope?: string;

	public constructor(name: string, index: Expr[], scope?: string) {
		this.name = name.toUpperCase();
		this.index = index;
		this.scope = scope;
	}

}
