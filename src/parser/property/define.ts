import type Expr from "../statement/expr";

export default class Define {
	public name: string;
	public expr?: Expr
	public readonly documentation?:string;

	public constructor(name: Define["name"], expr?: Define["expr"]) {
		this.name = name;
		this.expr = expr;
	}
}
